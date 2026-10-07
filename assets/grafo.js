// ============================================================
// GRAFO COMPARTILHADO — com filtros (obrigatorias / critica / tudo)
// ============================================================

let _networkAtual = null;

function renderizarGrafo(containerId, filtro = 'obrigatorias') {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (typeof vis === 'undefined') return;

  // --- 1. Seleciona as disciplinas visíveis ---
  let visiveis = [];
  let idsCriticos = new Set();

  if (filtro === 'critica') {
    // Usa a cadeia crítica já calculada no fluxograma.js
    const cadeia = (window._cadeiaAtual && window._cadeiaAtual.cadeia) || [];
    visiveis = cadeia.slice();
    visiveis.forEach(d => idsCriticos.add(d.id));

    // Inclui pré-reqs concluídos que aparecem no caminho
    const extras = [];
    cadeia.forEach(d => {
      d.pre.forEach(pre => {
        if (idsCriticos.has(pre)) return;
        const dPre = disciplinas.find(x => x.id === pre);
        if (dPre && dPre.estado === 'concluida') extras.push(dPre);
      });
    });
    extras.forEach(d => {
      if (!visiveis.find(x => x.id === d.id)) visiveis.push(d);
    });

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

  // --- 2. Monta nós ---
  const nodes = [];
  visiveis.forEach(d => {
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