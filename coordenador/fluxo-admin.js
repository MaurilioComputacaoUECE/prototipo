// ============================================================
// ESTADO DO FLUXO EM EDIÇÃO
// ============================================================

let fluxoEmEdicao = null;

// Estrutura fake pro protótipo — depois vira o que vem do banco
const fluxosFake = {
  'cc-2025.1': {
    id: 'cc-2025.1',
    curso: 'Ciência da Computação',
    versao: '2025.1',
    optativasNecessarias: 4,
    grade: [
      { id: 'CC117', nome: 'Cálculo Diferencial e Integral I', periodo: 1, tipo: 'obrigatoria', pre: [] },
      { id: 'CC118', nome: 'Geometria Analítica',              periodo: 1, tipo: 'obrigatoria', pre: [] },
      { id: 'CC116', nome: 'Matemática Discreta',              periodo: 1, tipo: 'obrigatoria', pre: [] },
      { id: 'CC119', nome: 'Organização de Computadores',      periodo: 1, tipo: 'obrigatoria', pre: [] },
      { id: 'CC115', nome: 'Programação e Algoritmos',         periodo: 1, tipo: 'obrigatoria', pre: [] },

      { id: 'CC123', nome: 'Álgebra Linear para Computação',   periodo: 2, tipo: 'obrigatoria', pre: ['CC118'] },
      { id: 'CC121', nome: 'Arquitetura de Computadores',      periodo: 2, tipo: 'obrigatoria', pre: ['CC119'] },
      { id: 'CC122', nome: 'Cálculo Diferencial e Integral II',periodo: 2, tipo: 'obrigatoria', pre: ['CC117'] },
      { id: 'CC124', nome: 'Física para Computação',           periodo: 2, tipo: 'obrigatoria', pre: ['CC117'] },
      { id: 'CC125', nome: 'Lógica para Computação',           periodo: 2, tipo: 'obrigatoria', pre: ['CC116'] },
      { id: 'CC120', nome: 'Programação Orientada a Objeto',   periodo: 2, tipo: 'obrigatoria', pre: ['CC115'] },

      { id: 'CC128', nome: 'Cálculo Diferencial e Integral III', periodo: 3, tipo: 'obrigatoria', pre: ['CC122'] },
      { id: 'CC129', nome: 'Computação Gráfica',                periodo: 3, tipo: 'obrigatoria', pre: ['CC123'] },
      { id: 'CC126', nome: 'Estrutura de Dados',                periodo: 3, tipo: 'obrigatoria', pre: ['CC120'] },
      { id: 'CC130', nome: 'Probabilidade e Estatística',       periodo: 3, tipo: 'obrigatoria', pre: ['CC122'] },
      { id: 'CC127', nome: 'Sistemas Operacionais',             periodo: 3, tipo: 'obrigatoria', pre: ['CC121'] },
      { id: 'CC131', nome: 'Teoria dos Autômatos e Ling. Formais', periodo: 3, tipo: 'obrigatoria', pre: ['CC125'] },

      { id: 'CC134', nome: 'Avaliação de Desempenho',            periodo: 4, tipo: 'obrigatoria', pre: ['CC130'] },
      { id: 'CC137', nome: 'Banco de Dados',                     periodo: 4, tipo: 'obrigatoria', pre: ['CC120'] },
      { id: 'CC135', nome: 'Cálculo Numérico',                   periodo: 4, tipo: 'obrigatoria', pre: ['CC128'] },
      { id: 'CC132', nome: 'Engenharia de Software',             periodo: 4, tipo: 'obrigatoria', pre: ['CC120'] },
      { id: 'CC136', nome: 'Teoria da Computabilidade',          periodo: 4, tipo: 'obrigatoria', pre: ['CC131'] },
      { id: 'CC133', nome: 'Teoria dos Grafos',                  periodo: 4, tipo: 'obrigatoria', pre: ['CC126'] },

      { id: 'CC141', nome: 'Análise e Projeto de Software',      periodo: 5, tipo: 'obrigatoria', pre: ['CC132'] },
      { id: 'CC140', nome: 'Inteligência Computacional',         periodo: 5, tipo: 'obrigatoria', pre: ['CC131'] },
      { id: 'CC138', nome: 'Programação Concorrente e Paralela', periodo: 5, tipo: 'obrigatoria', pre: ['CC127'] },
      { id: 'CC142', nome: 'Projeto e Análise de Algoritmos',    periodo: 5, tipo: 'obrigatoria', pre: ['CC133'] },
      { id: 'CC139', nome: 'Redes de Computadores',              periodo: 5, tipo: 'obrigatoria', pre: ['CC134'] },

      { id: 'CC147', nome: 'Compiladores',                       periodo: 6, tipo: 'obrigatoria', pre: ['CC136'] },
      { id: 'CC145', nome: 'Interação Humano Computador',        periodo: 6, tipo: 'obrigatoria', pre: ['CC132'] },
      { id: 'CC143', nome: 'Programação Matemática',             periodo: 6, tipo: 'obrigatoria', pre: ['CC135'] },
      { id: 'CC146', nome: 'Sistemas Distribuídos',              periodo: 6, tipo: 'obrigatoria', pre: ['CC139'] },

      { id: 'CC149', nome: 'Ciência de Dados',                   periodo: 7, tipo: 'obrigatoria', pre: ['CC140'] },
      { id: 'CC151', nome: 'Pesquisa em Computação',             periodo: 7, tipo: 'obrigatoria', pre: ['CC142'] },

      { id: 'CC153', nome: 'Projeto Final',                      periodo: 8, tipo: 'obrigatoria', pre: ['CC151'] },

      // Optativas (no fluxo, mas marcadas como optativas)
      { id: 'CC159', nome: 'Gerência de Projetos',               periodo: 5, tipo: 'optativa', pre: ['CC141'] },
      { id: 'CC158', nome: 'Segurança em Redes',                 periodo: 6, tipo: 'optativa', pre: ['CC139'] },
      { id: 'CC109', nome: 'Redes Neurais Artificiais',          periodo: 6, tipo: 'optativa', pre: [] },
    ]
  },
  'cc-2026.1': {
    id: 'cc-2026.1',
    curso: 'Ciência da Computação',
    versao: '2026.1',
    optativasNecessarias: 4,
    grade: []
  },
  'es-2025.1': {
    id: 'es-2025.1',
    curso: 'Engenharia de Software',
    versao: '2025.1',
    optativasNecessarias: 3,
    grade: []
  }
};

// Catálogo mestre (todas as disciplinas disponíveis pra adicionar)
const catalogoFake = [
  { id: 'CC117', nome: 'Cálculo Diferencial e Integral I' },
  { id: 'CC118', nome: 'Geometria Analítica' },
  { id: 'CC116', nome: 'Matemática Discreta' },
  { id: 'CC119', nome: 'Organização de Computadores' },
  { id: 'CC115', nome: 'Programação e Algoritmos' },
  { id: 'CC123', nome: 'Álgebra Linear para Computação' },
  { id: 'CC121', nome: 'Arquitetura de Computadores' },
  { id: 'CC122', nome: 'Cálculo Diferencial e Integral II' },
  { id: 'CC124', nome: 'Física para Computação' },
  { id: 'CC125', nome: 'Lógica para Computação' },
  { id: 'CC120', nome: 'Programação Orientada a Objeto' },
  { id: 'CC128', nome: 'Cálculo Diferencial e Integral III' },
  { id: 'CC129', nome: 'Computação Gráfica' },
  { id: 'CC126', nome: 'Estrutura de Dados' },
  { id: 'CC130', nome: 'Probabilidade e Estatística' },
  { id: 'CC127', nome: 'Sistemas Operacionais' },
  { id: 'CC131', nome: 'Teoria dos Autômatos e Ling. Formais' },
  { id: 'CC134', nome: 'Avaliação de Desempenho' },
  { id: 'CC137', nome: 'Banco de Dados' },
  { id: 'CC135', nome: 'Cálculo Numérico' },
  { id: 'CC132', nome: 'Engenharia de Software' },
  { id: 'CC136', nome: 'Teoria da Computabilidade' },
  { id: 'CC133', nome: 'Teoria dos Grafos' },
  { id: 'CC141', nome: 'Análise e Projeto de Software' },
  { id: 'CC140', nome: 'Inteligência Computacional' },
  { id: 'CC138', nome: 'Programação Concorrente e Paralela' },
  { id: 'CC142', nome: 'Projeto e Análise de Algoritmos' },
  { id: 'CC139', nome: 'Redes de Computadores' },
  { id: 'CC147', nome: 'Compiladores' },
  { id: 'CC145', nome: 'Interação Humano Computador' },
  { id: 'CC143', nome: 'Programação Matemática' },
  { id: 'CC146', nome: 'Sistemas Distribuídos' },
  { id: 'CC149', nome: 'Ciência de Dados' },
  { id: 'CC151', nome: 'Pesquisa em Computação' },
  { id: 'CC153', nome: 'Projeto Final' },
  { id: 'CC159', nome: 'Gerência de Projetos' },
  { id: 'CC158', nome: 'Segurança em Redes' },
  { id: 'CC109', nome: 'Redes Neurais Artificiais' },
  { id: 'CC154', nome: 'Extensão I' },
  { id: 'CC155', nome: 'Extensão II' },
  { id: 'CC156', nome: 'Extensão III' },
  { id: 'CC157', nome: 'Extensão IV' },
  { id: 'CC203', nome: 'Extensão V' },
  { id: 'CC152', nome: 'Estágio' },
  { id: 'CC150', nome: 'Administração e Empreend. p/ Computação' },
  { id: 'CC148', nome: 'Informática na Sociedade e Ética' },
  { id: 'CC144', nome: 'Processamento de Imagens' },
];

// ============================================================
// INICIALIZAÇÃO
// ============================================================

function inicializarFluxoAdmin() {
  const select = document.getElementById('select-fluxo');
  const inputOpt = document.getElementById('input-optativas');
  const busca = document.getElementById('busca-catalogo');

  // Carrega fluxo inicial
  trocarFluxo(select.value);

  // Trocar fluxo no select
  select.addEventListener('change', () => trocarFluxo(select.value));

  // Alterar optativas
  inputOpt.addEventListener('input', () => {
    if (fluxoEmEdicao) fluxoEmEdicao.optativasNecessarias = parseInt(inputOpt.value) || 0;
  });

  // Busca no catálogo
  busca.addEventListener('input', () => renderizarCatalogo(busca.value));

  // Salvar
  document.getElementById('btn-salvar').addEventListener('click', () => {
    alert('Fluxo salvo (protótipo — nada é persistido).');
  });

  // Prévia do grafo
  setTimeout(() => renderizarPreview(), 200);
}

function trocarFluxo(id) {
  fluxoEmEdicao = JSON.parse(JSON.stringify(fluxosFake[id] || { grade: [] }));
  document.getElementById('input-optativas').value = fluxoEmEdicao.optativasNecessarias || 0;

  renderizarGrade();
  renderizarCatalogo('');
  atualizarContadores();
  renderizarPreview();
}

// ============================================================
// GRADE (semestres com cards)
// ============================================================

function renderizarGrade() {
  const container = document.getElementById('grade');
  if (!container) return;
  container.innerHTML = '';

  const periodos = [...new Set(fluxoEmEdicao.grade.map(d => d.periodo))].sort((a, b) => a - b);
  if (periodos.length === 0) periodos.push(1);

  periodos.forEach(periodo => {
    const coluna = document.createElement('div');
    coluna.className = 'coluna';
    coluna.innerHTML = `<h2>${periodo}º Semestre</h2>`;

    fluxoEmEdicao.grade
      .filter(d => d.periodo === periodo)
      .forEach(d => coluna.appendChild(criarCardAdmin(d)));

    const btnAdd = document.createElement('button');
    btnAdd.textContent = '+ Adicionar';
    btnAdd.style.cssText = 'width:100%; padding:8px; margin-top:4px; border:1px dashed #cbd5e1; background:white; color:#64748b; border-radius:8px; cursor:pointer; font-size:12px;';
    btnAdd.addEventListener('click', () => alert(`(Protótipo) Adicionar disciplina ao ${periodo}º semestre — use o catálogo à direita.`));
    coluna.appendChild(btnAdd);

    container.appendChild(coluna);
  });
}

function criarCardAdmin(d) {
  const card = document.createElement('div');
  card.className = 'disciplina ' + (d.tipo === 'optativa' ? 'optativa' : '');
  card.style.cssText = 'background:white; border-color:#cbd5e1; color:#334155;';

  card.innerHTML = `
    <p class="codigo">${d.id}</p>
    <p class="nome">${d.nome}</p>
    <div style="display:flex; gap:6px; margin-top:8px;">
      <select class="select-tipo" style="flex:1; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px; font-size:11px; background:white;">
        <option value="obrigatoria" ${d.tipo === 'obrigatoria' ? 'selected' : ''}>Obrigatória</option>
        <option value="optativa" ${d.tipo === 'optativa' ? 'selected' : ''}>Optativa</option>
      </select>
      <button class="btn-remover" style="padding:4px 8px; border:1px solid #fecaca; background:#fef2f2; color:#b91c1c; border-radius:4px; cursor:pointer; font-size:11px;">🗑️</button>
    </div>
  `;

  card.querySelector('.select-tipo').addEventListener('change', (e) => {
    d.tipo = e.target.value;
    renderizarGrade();
    renderizarCatalogo(document.getElementById('busca-catalogo').value);
    atualizarContadores();
    renderizarPreview();
  });

  card.querySelector('.btn-remover').addEventListener('click', () => {
    fluxoEmEdicao.grade = fluxoEmEdicao.grade.filter(x => x.id !== d.id);
    renderizarGrade();
    renderizarCatalogo(document.getElementById('busca-catalogo').value);
    atualizarContadores();
    renderizarPreview();
  });

  return card;
}

// ============================================================
// CATÁLOGO LATERAL
// ============================================================

function renderizarCatalogo(filtro = '') {
  const container = document.getElementById('lista-catalogo');
  if (!container) return;

  const termo = filtro.toLowerCase().trim();
  const usados = new Set(fluxoEmEdicao.grade.map(d => d.id));

  const lista = catalogoFake.filter(d =>
    !termo ||
    d.id.toLowerCase().includes(termo) ||
    d.nome.toLowerCase().includes(termo)
  );

  if (lista.length === 0) {
    container.innerHTML = `<p style="font-size:12px; color:#94a3b8; text-align:center;">Nenhuma disciplina encontrada.</p>`;
    return;
  }

  container.innerHTML = '';
  lista.forEach(d => {
    const jaUsado = usados.has(d.id);
    const item = document.createElement('div');
    item.style.cssText = `
      padding:8px 10px; margin-bottom:6px; border-radius:6px; font-size:12px;
      cursor:${jaUsado ? 'default' : 'pointer'};
      background:${jaUsado ? '#f1f5f9' : 'white'};
      border:1px solid ${jaUsado ? '#e2e8f0' : '#cbd5e1'};
      color:${jaUsado ? '#94a3b8' : '#334155'};
      display:flex; justify-content:space-between; align-items:center; gap:6px;
    `;
    item.innerHTML = `
      <div>
        <div style="font-weight:600;">${d.id}</div>
        <div style="font-size:11px; opacity:0.8;">${d.nome}</div>
      </div>
      <span>${jaUsado ? '✓' : '+'}</span>
    `;

    if (!jaUsado) {
      item.addEventListener('mouseenter', () => item.style.background = '#eff6ff');
      item.addEventListener('mouseleave', () => item.style.background = 'white');
      item.addEventListener('click', () => adicionarAoFluxo(d));
    }

    container.appendChild(item);
  });
}

function adicionarAoFluxo(d) {
  const semestreInput = prompt(`Em qual semestre adicionar "${d.nome}"?`, '1');
  const periodo = parseInt(semestreInput);
  if (!periodo || periodo < 1 || periodo > 10) return;

  fluxoEmEdicao.grade.push({
    id: d.id,
    nome: d.nome,
    periodo,
    tipo: 'obrigatoria',
    pre: []
  });

  renderizarGrade();
  renderizarCatalogo(document.getElementById('busca-catalogo').value);
  atualizarContadores();
  renderizarPreview();
}

// ============================================================
// CONTADORES
// ============================================================

function atualizarContadores() {
  const total = fluxoEmEdicao.grade.length;
  const obrig = fluxoEmEdicao.grade.filter(d => d.tipo === 'obrigatoria').length;
  const opt = fluxoEmEdicao.grade.filter(d => d.tipo === 'optativa').length;

  document.getElementById('contador-disciplinas').textContent = total;
  document.getElementById('contador-tipos').textContent = `${obrig} / ${opt}`;
}

// ============================================================
// PRÉVIA (grafo)
// ============================================================

function renderizarPreview() {
  const container = document.getElementById('grafo-preview');
  if (!container || typeof vis === 'undefined') return;

  const grade = fluxoEmEdicao.grade;
  const idsNaGrade = new Set(grade.map(d => d.id));

  const nodes = grade.map(d => ({
    id: d.id,
    label: d.nome,
    shape: 'box',
    color: {
      background: d.tipo === 'optativa' ? '#fef3c7' : '#f1f5f9',
      border:     d.tipo === 'optativa' ? '#f59e0b' : '#cbd5e1'
    },
    font: { size: 11, color: '#334155' },
    borderWidth: 2,
    borderDashes: d.tipo === 'optativa' ? [5, 5] : false,
    widthConstraint: { minimum: 120, maximum: 180 },
    heightConstraint: { minimum: 40 }
  }));

  const edges = [];
  grade.forEach(d => {
    (d.pre || []).forEach(pre => {
      if (idsNaGrade.has(pre)) {
        edges.push({ from: pre, to: d.id, arrows: 'to', color: { color: '#94a3b8' }, width: 2 });
      }
    });
  });

  const data = {
    nodes: new vis.DataSet(nodes),
    edges: new vis.DataSet(edges)
  };

  const options = {
    layout: {
      hierarchical: {
        enabled: true,
        direction: 'LR',
        sortMethod: 'directed',
        levelSeparation: 180,
        nodeSpacing: 100,
        treeSpacing: 140
      }
    },
    physics: false,
    interaction: { hover: true, zoomView: true, dragView: true, dragNodes: false },
    edges: { smooth: { type: 'cubicBezier' } }
  };

  container.innerHTML = '';
  const network = new vis.Network(container, data, options);
  network.once('afterDrawing', () => {
    // Enquadra por largura
    const posicoes = network.getPositions();
    const ids = Object.keys(posicoes);
    if (ids.length === 0) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    ids.forEach(id => {
      const p = posicoes[id];
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });

    const larguraGrafo = (maxX - minX) + 200;
    const escala = Math.min(container.clientWidth / larguraGrafo, 1.0);
    const centroX = minX - (30 / escala) + (container.clientWidth / escala) / 2;
    const centroY = (minY + maxY) / 2;

    network.moveTo({ scale: escala, position: { x: centroX, y: centroY }, animation: false });
  });
}