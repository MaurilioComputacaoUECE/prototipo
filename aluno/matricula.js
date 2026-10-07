// ============================================================
// ABA MATRÍCULA
// ============================================================

// Filtro do grafo da prévia (igual ao fluxograma: obrigatórias / crítica / tudo)
let filtroGrafoMatricula = 'obrigatorias';

const TEXTOS_GRAFO_MATRICULA = {
  obrigatorias: 'Mostrando apenas as obrigatórias que faltam da grade.',
  critica:      'Mostrando as disciplinas com maior profundidade — o caminho (ou caminhos) que mais demora até a formatura.',
  tudo:         'Mostrando todas as disciplinas restantes, incluindo optativas (borda tracejada amarela).'
};

// ------------------------------------------------------------
// On/Off do período de matrícula (controle do protótipo, na tela
// do aluno) — alterna entre as duas páginas possíveis
// ------------------------------------------------------------
function botaoTogglePeriodo() {
  const fechado = !periodoMatricula.aberto;
  return `
    <div style="display:flex; justify-content:flex-end; margin-bottom:12px;">
      <button id="btn-toggle-periodo-aluno" type="button"
              style="padding:6px 14px; border-radius:999px; border:1px solid #cbd5e1; background:white; color:#475569; cursor:pointer; font-size:12px; font-weight:600;">
        ${fechado ? '🔓 Simular: período aberto' : '🔒 Simular: período fechado'}
      </button>
    </div>
  `;
}

function configurarTogglePeriodo() {
  const btn = document.getElementById('btn-toggle-periodo-aluno');
  if (!btn) return;
  btn.addEventListener('click', () => {
    salvarProximoPeriodo({
      periodo: periodoMatricula.periodo,
      inicio: periodoMatricula.inicio,
      fim: periodoMatricula.fim,
      aberto: !periodoMatricula.aberto
    });
    renderizarMatricula();
  });
}

function renderizarMatricula() {
  const statusEl = document.getElementById('status-matricula');
  const conteudo = document.getElementById('conteudo-matricula');
  if (!conteudo) return;

  if (!periodoMatricula.aberto) {
    statusEl.innerHTML = '⚪ Período de matrícula fechado';
    conteudo.innerHTML = `
      ${botaoTogglePeriodo()}
      <div class="vazio">
        <p style="font-size: 16px; margin: 0 0 8px 0;">Período de matrícula fechado.</p>
        <p style="margin: 0;">As ofertas estarão disponíveis em ${periodoMatricula.fim}.</p>
      </div>
    `;
    configurarTogglePeriodo();
    return;
  }

  statusEl.innerHTML = `🟢 Matrícula ${periodoMatricula.periodo} aberta até ${periodoMatricula.fim}`;

  const ofertasDisponiveis = ofertas.filter(o => {
    const d = disciplinas.find(x => x.id === o.disciplinaId);
    if (!d) return false;
    if (d.estado === 'concluida') return false;
    if (turmasSelecionadas.has(o.turmaId)) return true;
    if (d.estado === 'em-andamento') return true;
    return d.pre.every(p => {
      const pre = disciplinas.find(x => x.id === p);
      return pre && pre.estado === 'concluida';
    });
  });

  let html = `
    ${botaoTogglePeriodo()}
    <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 14px; color: #92400e;">
      ⚠️ <strong>Atualize seu progresso com disciplinas concluídas</strong> antes de montar sua matrícula.
    </div>
  `;

  if (ofertasDisponiveis.length === 0) {
    html += `
      <div class="vazio">
        <p style="font-size: 16px; margin: 0 0 8px 0;">Nenhuma disciplina disponível para matrícula no momento.</p>
      </div>
    `;
  } else {
    html += `
      <p style="color: #64748b; margin-bottom: 16px;">
        ${ofertasDisponiveis.length} disciplina(s) ofertada(s) que você pode cursar
      </p>
    `;

    ofertasDisponiveis.forEach(o => {
      const d = disciplinas.find(x => x.id === o.disciplinaId);
      const marcada = turmasSelecionadas.has(o.turmaId);
      html += `
        <label class="turma-card ${marcada ? 'selecionada' : ''}" data-turma="${o.turmaId}">
          <input type="checkbox" ${marcada ? 'checked' : ''}>
          <div class="turma-info">
            <h3>${d.id} · ${d.nome} ${d.tipo === 'optativa' ? '<span style="color:#f59e0b;">(optativa)</span>' : ''}</h3>
            <p>Turma ${o.turma} · <span class="turma-horario">${o.horario}</span></p>
          </div>
        </label>
      `;
    });
  }

  html += `
    <div style="margin-top: 24px;">
      <h2 style="font-size: 14px; text-transform: uppercase; color: #64748b; margin-bottom: 8px;">Prévia do percurso</h2>
      <p style="font-size: 12px; color: #94a3b8; margin-bottom: 12px;">O grafo mostra o que fica liberado após as disciplinas selecionadas.</p>

      <div style="display:flex; gap:8px; margin-bottom:8px;">
        <button class="aba-grafo ${filtroGrafoMatricula === 'obrigatorias' ? 'ativa' : ''}" data-filtro="obrigatorias">Obrigatórias</button>
        <button class="aba-grafo aba-critica ${filtroGrafoMatricula === 'critica' ? 'ativa' : ''}" data-filtro="critica">Crítica</button>
        <button class="aba-grafo ${filtroGrafoMatricula === 'tudo' ? 'ativa' : ''}" data-filtro="tudo">Tudo</button>
      </div>

      <p id="hint-grafo-matricula" style="font-size:13px; color:#475569; margin:0 0 8px 0; min-height:18px;">${TEXTOS_GRAFO_MATRICULA[filtroGrafoMatricula] || ''}</p>

      <p style="font-size: 12px; color: #64748b; margin: 0 0 10px 0;">
        💡 Role para dar zoom · Arraste para navegar
      </p>

      <div style="display:flex; gap:16px; align-items:center; font-size:12px; color:#475569; margin-bottom:10px; flex-wrap:wrap;">
        <span style="display:flex; align-items:center; gap:6px;">
          <span style="display:inline-block; width:12px; height:12px; border-radius:3px; background:#dbeafe !important; border:2px solid #3b82f6 !important;"></span>
          Em andamento
        </span>
        <span style="display:flex; align-items:center; gap:6px;">
          <span style="display:inline-block; width:12px; height:12px; border-radius:3px; background:#f1f5f9 !important; border:2px solid #cbd5e1 !important;"></span>
          Obrigatória
        </span>
        <span style="display:flex; align-items:center; gap:6px;">
          <span style="display:inline-block; width:12px; height:12px; border-radius:3px; background:#fef3c7 !important; border:2px solid #f59e0b !important;"></span>
          Optativa
        </span>
        <span style="display:flex; align-items:center; gap:6px;">
          <span style="display:inline-block; width:12px; height:12px; border-radius:3px; background:#dcfce7 !important; border:2px solid #22c55e !important; border-style:dashed !important;"></span>
          Concluída (pré-req)
        </span>
        <span style="display:flex; align-items:center; gap:6px;">
          <span style="display:inline-block; width:12px; height:12px; border-radius:3px; background:#fee2e2 !important; border:2px solid #dc2626 !important;"></span>
          Crítica
        </span>
      </div>

      <div id="grafo-matricula" style="height: calc(100vh - 200px); width: 100%; overflow: hidden; border: 1px dashed #cbd5e1; background: #fafafa;"></div>
    </div>
  `;

  conteudo.innerHTML = html;

  conteudo.querySelectorAll('.turma-card').forEach(card => {
    const input = card.querySelector('input');
    input.addEventListener('change', () => {
      const turmaId = card.dataset.turma;
      const oferta = ofertas.find(o => o.turmaId === turmaId);
      const d = disciplinas.find(x => x.id === oferta.disciplinaId);

      if (input.checked) {
        turmasSelecionadas.add(turmaId);
        d.estado = 'em-andamento';
      } else {
        turmasSelecionadas.delete(turmaId);
        d.estado = 'futura';
      }

      salvarEstado();
      salvarTurmasSelecionadas();
      renderizarMatricula();
    });
  });

  // Abas do grafo da prévia (mesmo padrão do fluxograma)
  conteudo.querySelectorAll('.aba-grafo').forEach(btn => {
    btn.addEventListener('click', () => {
      filtroGrafoMatricula = btn.dataset.filtro;
      conteudo.querySelectorAll('.aba-grafo').forEach(b => b.classList.toggle('ativa', b === btn));
      const hint = document.getElementById('hint-grafo-matricula');
      if (hint) hint.textContent = TEXTOS_GRAFO_MATRICULA[filtroGrafoMatricula] || '';
      renderizarGrafo('grafo-matricula', filtroGrafoMatricula);
    });
  });

  configurarTogglePeriodo();

  setTimeout(() => renderizarGrafo('grafo-matricula', filtroGrafoMatricula), 100);
}

// ============================================================
// SALVAR MATRÍCULA — botão 💾 no topo do cabeçalho
// (delegação no document: o botão fica no cabeçalho estático e
//  não deve ganhar um listener a cada re-renderização)
// ============================================================
document.addEventListener('click', (e) => {
  const btn = e.target.closest ? e.target.closest('#btn-salvar') : null;
  if (!btn) return;

  if (turmasSelecionadas.size === 0) {
    alert('Selecione ao menos uma disciplina para salvar.');
    return;
  }
  alert(`Matrícula salva com sucesso!\n\n${turmasSelecionadas.size} disciplina(s) selecionada(s).`);
});