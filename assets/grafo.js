// ============================================================
// GRAFO COMPARTILHADO — com filtros (obrigatorias / critica / tudo)
// ============================================================

let _networkAtual = null;

// ============================================================
// PROFUNDIDADE / CADEIAS CRÍTICAS
// (compartilhado entre fluxograma e matrícula)
// ============================================================

function calcularProfundidades(disciplinas) {
  const prof = {};
  const visitando = {};

  function calc(id) {
    if (prof[id] !== undefined) return prof[id];
    if (visitando[id]) return 1;
    visitando[id] = true;

    const d = disciplinas.find(x => x.id === id);
    if (!d) { visitando[id] = false; return 1; }

    if (d.estado === 'concluida' || d.estado === 'em-andamento') {
      prof[id] = 0;
      visitando[id] = false;
      return 0;
    }

    let maxPre = 0;
    d.pre.forEach(p => { maxPre = Math.max(maxPre, calc(p)); });
    prof[id] = 1 + maxPre;
    visitando[id] = false;
    return prof[id];
  }

  disciplinas.forEach(d => calc(d.id));
  return prof;
}

// Retorna TODOS os caminhos com a maior profundidade
// (empatados — pode ser mais de um)
function encontrarCadeiasCriticas(disciplinas) {
  const prof = calcularProfundidades(disciplinas);

  let maxProf = 0;
  disciplinas.forEach(d => {
    if (d.estado === 'futura' && prof[d.id] > maxProf) maxProf = prof[d.id];
  });

  if (maxProf === 0) return { semestres: 0, cadeias: [] };

  function reconstruir(alvo) {
    const cadeia = [];
    function walk(id) {
      const d = disciplinas.find(x => x.id === id);
      if (!d) return;
      if (d.estado === 'concluida' || d.estado === 'em-andamento') return;

      let melhorPre = null, melhorProf = -1;
      d.pre.forEach(p => {
        if (prof[p] > melhorProf) { melhorProf = prof[p]; melhorPre = p; }
      });

      if (melhorPre) walk(melhorPre);
      cadeia.push(d);
    }
    walk(alvo.id);
    return cadeia;
  }

  const cadeias = disciplinas
    .filter(d => d.estado === 'futura' && prof[d.id] === maxProf)
    .map(reconstruir);

  return { semestres: maxProf, cadeias };
}

// Nível de cada disciplina → grafo disposto em ordem de profundidade
function calcularNiveis(visiveis) {
  const mapa = {};
  visiveis.forEach(d => { mapa[d.id] = d; });

  const niveis = {};
  const visitando = {};

  function calcular(id) {
    if (niveis[id] !== undefined) return niveis[id];
    if (visitando[id]) return 0;
    visitando[id] = true;

    const d = mapa[id];
    if (!d) { visitando[id] = false; return 0; }

    let maxPre = -1;
    (d.pre || []).forEach(p => {
      if (mapa[p]) maxPre = Math.max(maxPre, calcular(p));
    });

    niveis[id] = maxPre + 1;
    visitando[id] = false;
    return niveis[id];
  }

  visiveis.forEach(d => calcular(d.id));
  return niveis;
}

function renderizarGrafo(containerId, filtro = 'obrigatorias') {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (typeof vis === 'undefined') return;

  // --- 1. Seleciona as disciplinas visíveis ---
  let visiveis = [];
  let idsCriticos = new Set();

  if (filtro === 'critica') {
    // Todas as disciplinas com a MAIOR profundidade (pode haver mais de um caminho)
    const { cadeias } = encontrarCadeiasCriticas(disciplinas);

    visiveis = [];
    cadeias.forEach(cadeia => {
      cadeia.forEach(d => {
        idsCriticos.add(d.id);
        if (!visiveis.find(x => x.id === d.id)) visiveis.push(d);
      });
    });

    // Inclui pré-reqs concluídos que aparecem nos caminhos
    const extras = [];
    visiveis.slice().forEach(d => {
      d.pre.forEach(pre => {
        if (idsCriticos.has(pre)) return;
        const dPre = disciplinas.find(x => x.id === pre);
        if (dPre && dPre.estado === 'concluida') extras.push(dPre);
      });
    });
    extras.forEach(d => {
      if (!visiveis.find(x => x.id === d.id)) visiveis.push(d);
    });

  } else if (filtro === 'matricula') {
    // Prévia da matrícula: o que foi selecionado + o que essa escolha libera
    const idsSemeados = new Set();
    ofertas.forEach(o => {
      if (turmasSelecionadas.has(o.turmaId)) idsSemeados.add(o.disciplinaId);
    });

    const filhosMap = {};
    disciplinas.forEach(d => { filhosMap[d.id] = []; });
    disciplinas.forEach(d => {
      (d.pre || []).forEach(p => { if (filhosMap[p]) filhosMap[p].push(d.id); });
    });

    const incluidos = new Set(idsSemeados);
    const fila = [...idsSemeados];
    while (fila.length) {
      const id = fila.shift();
      (filhosMap[id] || []).forEach(f => {
        if (!incluidos.has(f)) { incluidos.add(f); fila.push(f); }
      });
    }

    visiveis = disciplinas.filter(d => incluidos.has(d.id));

  } else if (filtro === 'obrigatorias') {
    visiveis = disciplinas.filter(d => d.tipo !== 'optativa' && d.estado !== 'concluida');
    // inclui pré-reqs concluídos que ligam essas disciplinas
    const extras = [];
    visiveis.forEach(d => {
      d.pre.forEach(pre => {
        const dPre = disciplinas.find(x => x.id === pre);
        if (dPre && dPre.estado === 'concluida') {
          if (!visiveis.find(x => x.id === pre) && !extras.find(x => x.id === pre)) {
            extras.push(dPre);
          }
        }
      });
    });
    visiveis = visiveis.concat(extras);

  } else {
    // tudo
    visiveis = disciplinas.filter(d => d.estado !== 'concluida');
    const extras = [];
    visiveis.forEach(d => {
      d.pre.forEach(pre => {
        const dPre = disciplinas.find(x => x.id === pre);
        if (dPre && dPre.estado === 'concluida') {
          if (!visiveis.find(x => x.id === pre) && !extras.find(x => x.id === pre)) {
            extras.push(dPre);
          }
        }
      });
    });
    visiveis = visiveis.concat(extras);
  }

  const idsVisiveis = new Set(visiveis.map(d => d.id));

  // Nível de cada nó → colunas em ordem de profundidade (esquerda → direita)
  const niveis = calcularNiveis(visiveis);

  // --- 2. Monta nós ---
  // Ordem vertical em cada coluna (LR): MAIOR profundidade primeiro (em cima).
  // Ramo com menor profundidade "cede" a posição e desce conforme se avança.
  const ordemOriginal = new Map();
  disciplinas.forEach((d, i) => ordemOriginal.set(d.id, i));

  // Filhos visíveis (quem depende de mim) e altura = maior cadeia a partir do nó
  const filhos = {};
  visiveis.forEach(d => { filhos[d.id] = []; });
  visiveis.forEach(d => {
    (d.pre || []).forEach(pre => {
      if (filhos[pre]) filhos[pre].push(d.id);
    });
  });

  const altura = {};
  const visitandoAlt = {};
  function calcularAltura(id) {
    if (altura[id] !== undefined) return altura[id];
    if (visitandoAlt[id]) return 1;
    visitandoAlt[id] = true;
    let maxFilhos = 0;
    (filhos[id] || []).forEach(f => { maxFilhos = Math.max(maxFilhos, calcularAltura(f)); });
    altura[id] = 1 + maxFilhos;
    visitandoAlt[id] = false;
    return altura[id];
  }
  visiveis.forEach(d => calcularAltura(d.id));

  const ordenados = visiveis.slice().sort((a, b) => {
    if (niveis[a.id] !== niveis[b.id]) return niveis[a.id] - niveis[b.id];

    // Maior profundidade total primeiro (nível + cadeia restante até o fim)
    const totalA = niveis[a.id] + altura[a.id];
    const totalB = niveis[b.id] + altura[b.id];
    if (totalB !== totalA) return totalB - totalA;
    if (altura[b.id] !== altura[a.id]) return altura[b.id] - altura[a.id];

    const difPeriodo = (a.periodo || 99) - (b.periodo || 99);
    if (difPeriodo !== 0) return difPeriodo;
    return (ordemOriginal.get(a.id) || 0) - (ordemOriginal.get(b.id) || 0);
  });

  const nodes = [];
  ordenados.forEach(d => {
    const emAndamento = d.estado === 'em-andamento';
    const concluida   = d.estado === 'concluida';
    const optativa    = d.tipo === 'optativa';
    const critica     = idsCriticos.has(d.id);

    let bg, borda, cor, largura;
    if (critica) {
      bg = '#fee2e2'; borda = '#dc2626'; cor = '#991b1b'; largura = 3;
    } else if (concluida) {
      bg = '#dcfce7'; borda = '#22c55e'; cor = '#15803d'; largura = 2;
    } else if (emAndamento) {
      bg = '#dbeafe'; borda = '#3b82f6'; cor = '#1e40af'; largura = 3;
    } else if (optativa) {
      bg = '#fef3c7'; borda = '#f59e0b'; cor = '#92400e'; largura = 2;
    } else {
      bg = '#f1f5f9'; borda = '#cbd5e1'; cor = '#334155'; largura = 2;
    }

    const sufixo = concluida ? '\n(✓)' : '';
    nodes.push({
      id: d.id,
      level: niveis[d.id],
      label: d.nome + sufixo,
      shape: 'box',
      color: { background: bg, border: borda },
      font: { size: 12, color: cor },
      borderWidth: largura,
      borderDashes: concluida ? [5, 5] : false,
      widthConstraint: { minimum: 130, maximum: 190 },
      heightConstraint: { minimum: 44 }
    });
  });

  // --- 3. Monta arestas ---
  const edges = [];
  const vistos = new Set();
  visiveis.forEach(d => {
    d.pre.forEach(pre => {
      if (!idsVisiveis.has(pre)) return;
      const key = pre + '→' + d.id;
      if (vistos.has(key)) return;
      vistos.add(key);

      const preConcluido = (disciplinas.find(x => x.id === pre) || {}).estado === 'concluida';
      const critica = idsCriticos.has(d.id) && idsCriticos.has(pre);

      edges.push({
        from: pre,
        to: d.id,
        arrows: 'to',
        dashes: preConcluido,
        color: { color: critica ? '#dc2626' : (preConcluido ? '#22c55e' : '#94a3b8') },
        width: critica ? 3 : 2
      });
    });
  });

  // --- 4. Render ---
  const data = {
    nodes: new vis.DataSet(nodes),
    edges: new vis.DataSet(edges)
  };

  // Ajuste de espaçamento conforme o filtro
  const levelSep = filtro === 'critica' ? 240 : 200;
  const nodeSpc  = filtro === 'critica' ? 140 : 110;

  const options = {
    layout: {
      hierarchical: {
        enabled: true,
        direction: 'LR',
        sortMethod: 'directed',
        levelSeparation: levelSep,
        nodeSpacing: nodeSpc,
        treeSpacing: 160
      }
    },
    physics: false,
    interaction: {
      hover: true,
      zoomView: true,
      dragView: true,
      dragNodes: false
    },
    edges: { smooth: { type: 'cubicBezier' } }
  };

  container.innerHTML = '';
  _networkAtual = new vis.Network(container, data, options);
    _networkAtual.once('afterDrawing', () => {
        enquadrarPorLargura(container, _networkAtual);
      });
    }

    function enquadrarPorLargura(container, network) {
      const posicoes = network.getPositions();
      const ids = Object.keys(posicoes);
      if (ids.length === 0) return;

      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      ids.forEach(id => {
        const p = posicoes[id];
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });

      const margemEsq = 30;
      const margemTopo = 30;

      const larguraGrafo = (maxX - minX) + 200;
      const larguraContainer = container.clientWidth;
      const alturaContainer = container.clientHeight;

      // Escala: cabe na largura, nunca passa de 100%
      const escalaX = larguraContainer / larguraGrafo;
      const escala  = Math.min(escalaX, 1.0);

      // Alinha a borda esquerda do grafo com a borda esquerda do container (+ margem)
      const centroX = minX - (margemEsq / escala) + (larguraContainer / escala) / 2;

      // Alinha o topo do grafo com o topo do container (+ margem)
      const centroY = minY - (margemTopo / escala) + (alturaContainer / escala) / 2;

      network.moveTo({
        scale: escala,
        position: { x: centroX, y: centroY },
        animation: false
      });
    }