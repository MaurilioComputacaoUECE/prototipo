// ============================================================
// GRAFO COMPARTILHADO — visão única (sem abas/filtros)
// Caminho crítico sempre destacado em vermelho (N5)
// ============================================================

let _networkAtual = null;

// ============================================================
// N2 — LIMITES DE ZOOM
// O vis-network atual não aceita zoomMin/zoomMax nas options
// (eram opções do vis.js antigo). Aplicamos um clamp no evento 'zoom'.
// ============================================================
function limitarZoom(network, min, max) {
  network.on('zoom', () => {
    const escala = network.getScale();
    if (escala < min || escala > max) {
      network.moveTo({ scale: Math.min(Math.max(escala, min), max), animation: false });
    }
  });
}

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
// (optativas, periodo 99, recebem nivelOptativas — encaixe visual p/ a coluna
//  logo após o último semestre)
function calcularNiveis(visiveis, nivelOptativas = 99) {
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

    niveis[id] = (d.periodo === 99 ? nivelOptativas : (d.periodo || 0));
    visitando[id] = false;
    return niveis[id];
  }

  visiveis.forEach(d => calcular(d.id));
  return niveis;
}

function preTitle(d){ var ps=d.pre||[]; if(!ps.length) return "Sem pre-requisitos"; return "Pre-requisitos: " + ps.map(function(c){ var p=disciplinas.find(function(x){return x.id===c}); return p ? (c + " - " + p.nome) : c; }).join("; ");}

function renderizarGrafo(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (typeof vis === 'undefined') return;

  // --- 1. Seleção unificada (sem abas) ---
  // Mostra todas as disciplinas restantes (obrigatórias + optativas)
  // e inclui pré-requisitos concluídos como contexto visual.
  let visiveis = disciplinas.filter(d => d.estado !== 'concluida');
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

  const idsVisiveis = new Set(visiveis.map(d => d.id));

  // Caminho crítico: SEMPRE calculado e destacado em vermelho (N5)
  const { cadeias } = encontrarCadeiasCriticas(disciplinas);
  const idsCriticos = new Set();
  cadeias.forEach(cadeia => cadeia.forEach(d => idsCriticos.add(d.id)));

  // Nível de cada nó → colunas em ordem de semestre (esquerda → direita)
  // Optativas (periodo 99) encaixam logo após o último semestre visível
  let maxPeriodo = 0;
  visiveis.forEach(d => { if (d.periodo && d.periodo !== 99 && d.periodo > maxPeriodo) maxPeriodo = d.periodo; });
  const nivelOptativas = maxPeriodo + 1;
  const rotulosFaixa = {};
  for (let s = 1; s <= maxPeriodo; s++) rotulosFaixa[s] = s + 'º Semestre';
  if (visiveis.some(d => d.periodo === 99)) rotulosFaixa[nivelOptativas] = 'Optativas';

  const niveis = calcularNiveis(visiveis, nivelOptativas);

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

  // --- 2.1 Posicionamento (x/y explícitos) ---
  // Mesmo visual do layout automático (colunas por semestre, cadeias retas),
  // MAS com bifurcações expandindo em ramos distintos: cada subárvore ocupa
  // sua própria faixa de linhas — um ramo fica visivelmente abaixo do outro,
  // em vez de tudo alinhado numa única reta.
  const COL_W = 200;  // = antigo levelSeparation do vis
  const ROW_H = 110;  // = antigo nodeSpacing do vis

  // Pai primário de cada nó: o pré-requisito visível mais próximo (maior nível)
  const paiPrimario = {};
  const filhosPrimarios = {};
  visiveis.forEach(d => {
    let melhor = null, melhorNivel = -1;
    (d.pre || []).forEach(pre => {
      if (niveis[pre] === undefined) return; // pré-requisito não está visível
      if (niveis[pre] > melhorNivel) { melhorNivel = niveis[pre]; melhor = pre; }
    });
    paiPrimario[d.id] = melhor;
    if (melhor) {
      if (!filhosPrimarios[melhor]) filhosPrimarios[melhor] = [];
      filhosPrimarios[melhor].push(d.id);
    }
  });

  // Filhos de cada pai em ordem de semestre (e de cadastro)
  Object.keys(filhosPrimarios).forEach(p => {
    filhosPrimarios[p].sort((a, b) => {
      const da = visiveis.find(x => x.id === a);
      const db = visiveis.find(x => x.id === b);
      const pa = da.periodo || 99, pb = db.periodo || 99;
      if (pa !== pb) return pa - pb;
      return (ordemOriginal.get(a) || 0) - (ordemOriginal.get(b) || 0);
    });
  });

  // Aloca linhas em faixas contíguas por subárvore:
  // - bifurcação → cada ramo ocupa sua própria faixa, um abaixo do outro;
  // - pai alinhado ao primeiro filho → cadeias seguem retas na horizontal.
  const linhas = {};
  const alocados = {};
  let proximaLinha = 0;
  function alocarSubarvore(id) {
    if (alocados[id]) return;
    alocados[id] = true;
    const filhos = filhosPrimarios[id] || [];
    if (!filhos.length) {
      linhas[id] = proximaLinha++;
      return;
    }
    filhos.forEach(alocarSubarvore);
    linhas[id] = linhas[filhos[0]];
  }
  const raizes = visiveis
    .filter(d => !paiPrimario[d.id])
    .sort((a, b) => {
      const pa = a.periodo || 99, pb = b.periodo || 99;
      if (pa !== pb) return pa - pb;
      return (ordemOriginal.get(a.id) || 0) - (ordemOriginal.get(b.id) || 0);
    });
  raizes.forEach(d => alocarSubarvore(d.id));
  // Nós que não alcançaram nenhuma raiz (ciclos — defensivo): vão no fim
  visiveis.forEach(d => {
    if (linhas[d.id] === undefined) linhas[d.id] = proximaLinha++;
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
      x: (niveis[d.id] - 1) * COL_W, // coluna = semestre
      y: linhas[d.id] * ROW_H,       // faixa da subárvore
      label: d.nome + sufixo,
      title: preTitle(d),
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

  // Posições x/y explícitas (colunas por semestre + faixas por subárvore)
  const options = {
    physics: false,
    interaction: {
      hover: true,
      zoomView: true, zoomSpeed: 0.6,
      dragView: true,
      dragNodes: false
    },
    edges: { smooth: { type: 'cubicBezier' } }
  };

  container.innerHTML = '';
  _networkAtual = new vis.Network(container, data, options);
    // N2 — limites de zoom (o vis-network atual não aceita zoomMin/Max nas
    // options; aplicamos um clamp no evento 'zoom')
    limitarZoom(_networkAtual, 0.15, 2.0);
    // N3 — faixas de semestre no topo das colunas (layout puro)
    _networkAtual.on('beforeDrawing', ctx => {
      desenharFaixasSemestre(ctx, _networkAtual, niveis, rotulosFaixa);
    });
    _networkAtual.once('afterDrawing', () => {
        enquadrarPorLargura(container, _networkAtual);
      });
    }

    // ============================================================
    // N3 — FAIXAS DE SEMESTRE
    // Desenha colunas 1º, 2º, 3º... (e "Optativas") no topo do grafo.
    // Só desenho no canvas — não altera dados nem a estrutura do grafo.
    // ============================================================
    function desenharFaixasSemestre(ctx, network, niveis, rotulos) {
      if (!network || !niveis) return;
      const posicoes = network.getPositions();

      // Agrupa os nós por nível (semestre)
      const grupos = {};
      Object.keys(posicoes).forEach(id => {
        const nivel = niveis[id];
        if (nivel === undefined || nivel === null) return;
        if (!grupos[nivel]) grupos[nivel] = [];
        grupos[nivel].push(posicoes[id]);
      });

      const LARGURA_COLUNA = 210;   // ~largura máxima do nó (190) + folga
      const ALTURA_CABECALHO = 56;

      Object.keys(grupos)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach(nivel => {
          const pts = grupos[nivel];
          const centroX = pts.reduce((s, p) => s + p.x, 0) / pts.length;
          const topoY   = Math.min.apply(null, pts.map(p => p.y)) - 30;
          const baseY   = Math.max.apply(null, pts.map(p => p.y)) + 30;

          // Faixa de fundo sutil atrás da coluna
          ctx.fillStyle = 'rgba(148, 163, 184, 0.07)';
          ctx.fillRect(
            centroX - LARGURA_COLUNA / 2,
            topoY - ALTURA_CABECALHO,
            LARGURA_COLUNA,
            (baseY - topoY) + ALTURA_CABECALHO
          );

          // Rótulo no topo da faixa
          const rotulo = (rotulos && rotulos[nivel]) || ((nivel === 99 || nivel >= 90) ? 'Optativas' : nivel + 'º Semestre');
          ctx.fillStyle = '#64748b';
          ctx.font = '600 14px system-ui, Segoe UI, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(rotulo, centroX, topoY - ALTURA_CABECALHO / 2);
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
      const margemTopo = 90; // espaço para o rótulo das faixas de semestre (N3)

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