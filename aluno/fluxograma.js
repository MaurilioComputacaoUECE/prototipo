// ============================================================
// CÁLCULO DA CADEIA CRÍTICA
// (profundidade e cadeias críticas agora vivem em assets/grafo.js,
//  compartilhadas com a tela de matrícula)
// ============================================================

// ============================================================
// RENDER
// ============================================================

function renderizarFluxograma() {
  const container = document.getElementById('fluxograma');
  if (!container) return;
  container.innerHTML = '';

  const obrigatorias = disciplinas.filter(d => d.tipo !== 'optativa');
  const optativas    = disciplinas.filter(d => d.tipo === 'optativa');

  const periodos = [...new Set(obrigatorias.map(d => d.periodo))]
    .sort((a, b) => a - b);

  // Colunas de semestre
  periodos.forEach(periodo => {
    const coluna = document.createElement('div');
    coluna.className = 'coluna';
    coluna.innerHTML = `<h2>${periodo}º Semestre</h2>`;

    obrigatorias
      .filter(d => d.periodo === periodo)
      .forEach(d => coluna.appendChild(criarCardDisciplina(d)));

    container.appendChild(coluna);
  });

  // Coluna de optativas (se houver)
  if (optativas.length > 0) {
    const colunaOpt = document.createElement('div');
    colunaOpt.className = 'coluna coluna-optativas';
    colunaOpt.innerHTML = `<h2>Optativas</h2>`;

    optativas.forEach(d => colunaOpt.appendChild(criarCardDisciplina(d)));

    container.appendChild(colunaOpt);
  }

  atualizarIndicadores();
}

// Extrai a criação do card pra reutilizar
function criarCardDisciplina(d) {
  const card = document.createElement('div');
  card.className = `disciplina ${d.estado} ${d.tipo === 'optativa' ? 'optativa' : ''}`;
  card.innerHTML = `
    <p class="codigo">${d.id}</p>
    <p class="nome">${d.nome}</p>
    <p class="estado">${ROTULOS[d.estado]}</p>
  `;
  card.addEventListener('click', () => alternarEstado(d.id));
  return card;
}

function alternarEstado(id) {
  const d = disciplinas.find(x => x.id === id);
  if (!d) return;
  const idx = CICLO.indexOf(d.estado);
  d.estado = CICLO[(idx + 1) % CICLO.length];
  salvarEstado();
  renderizarFluxograma();
  renderizarGrafo('grafo-caminhos', window._filtroGrafoAtual || 'obrigatorias');
}

function atualizarIndicadores() {
  const total = disciplinas.length;
  const concluidas = disciplinas.filter(d => d.estado === 'concluida').length;
  const optConcluidas = disciplinas.filter(d => d.tipo === 'optativa' && d.estado === 'concluida').length;

  document.getElementById('progresso').textContent = Math.round((concluidas / total) * 100);
  document.getElementById('optativas-concluidas').textContent = optConcluidas;

  const { semestres, cadeias } = encontrarCadeiasCriticas(disciplinas);
  document.getElementById('semestres-min').textContent = semestres;

  // Guarda todos os caminhos com a maior profundidade (aba Crítica)
  window._cadeiaAtual = { semestres, cadeia: cadeias[0] || [] };
  window._cadeiasCriticas = cadeias;
}

// ============================================================
// MODAL
// ============================================================

function configurarModal() {
  const btn = document.getElementById('btn-cadeia');
  const modal = document.getElementById('modal-cadeia');
  const fechar = document.getElementById('fechar-modal');
  if (!btn || !modal || !fechar) return;

  btn.addEventListener('click', () => {
    const { semestres, cadeia } = window._cadeiaAtual;
    const container = document.getElementById('conteudo-cadeia');
    container.innerHTML = '';

    if (cadeia.length === 0) {
      container.innerHTML = `<p style="color: #15803d; font-style: italic;">Parabéns! Você concluiu todas as disciplinas.</p>`;
    } else {
      cadeia.forEach((d, i) => {
        const item = document.createElement('span');
        item.style.cssText = 'display:inline-block; padding:6px 12px; border-radius:8px; background:#dbeafe; color:#1e40af; font-size:13px; margin:2px;';
        item.textContent = d.nome;
        container.appendChild(item);
        if (i < cadeia.length - 1) {
          const seta = document.createElement('span');
          seta.style.cssText = 'color:#94a3b8; margin:0 4px;';
          seta.textContent = '→';
          container.appendChild(seta);
        }
      });
    }

    document.getElementById('semestres-modal').textContent = semestres;
    modal.style.display = 'flex';
  });

  fechar.addEventListener('click', () => { modal.style.display = 'none'; });
  modal.addEventListener('click', (e) => {
    if (e.target.id === 'modal-cadeia') modal.style.display = 'none';
  });
}
    function configurarAbasGrafo() {
      const abas = document.querySelectorAll('.aba-grafo');
      const hint = document.getElementById('hint-grafo');
      if (!abas.length) return;

      const textos = {
        obrigatorias: 'Mostrando apenas as obrigatórias que faltam da grade.',
        tudo:         'Mostrando todas as disciplinas restantes, incluindo optativas (borda tracejada amarela).'
      };

      function textoCritica() {
        const { semestres, cadeias } = encontrarCadeiasCriticas(disciplinas);
        if (cadeias.length > 1) {
          return `Maior profundidade da grade: ${semestres} semestre(s) — ${cadeias.length} disciplinas empatadas, exibindo todos os caminhos.`;
        }
        return `Este é o caminho mais longo de pré-requisitos — ${semestres} semestre(s) ainda faltam até a formatura.`;
      }

      abas.forEach(btn => {
        btn.addEventListener('click', () => {
          abas.forEach(b => b.classList.remove('ativa'));
          btn.classList.add('ativa');
          window._filtroGrafoAtual = btn.dataset.filtro;
          renderizarGrafo('grafo-caminhos', btn.dataset.filtro);
          if (hint) {
            hint.textContent = btn.dataset.filtro === 'critica'
              ? textoCritica()
              : (textos[btn.dataset.filtro] || '');
          }
        });
      });
    }

  
  