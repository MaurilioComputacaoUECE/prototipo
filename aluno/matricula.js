// ============================================================
// ABA MATRÍCULA
// (N6: só lista informativa — turma, horário e sala; sem grafo)
// (N4: o toggle aberto/fechado saiu daqui e é só do coordenador)
// ============================================================

function renderizarMatricula() {
  const statusEl = document.getElementById('status-matricula');
  const conteudo = document.getElementById('conteudo-matricula');
  if (!conteudo) return;

  if (!periodoMatricula.aberto) {
    statusEl.innerHTML = '⚪ Período de matrícula fechado';
    conteudo.innerHTML = `
      <div class="vazio">
        <p style="font-size: 16px; margin: 0 0 8px 0;">Período de matrícula fechado.</p>
        <p style="margin: 0;">As ofertas estarão disponíveis quando o período abrir.</p>
      </div>
    `;
    return;
  }

  statusEl.innerHTML = `🟢 Matrícula ${periodoMatricula.periodo} aberta`;

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
            <p>Turma ${o.turma} · <span class="turma-horario">${o.horario}</span> · Sala ${o.sala || '—'}</p>
          </div>
        </label>
      `;
    });
  }

  // N6 — sem grafo aqui: a Matrícula é só a lista de turmas (informativa)
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