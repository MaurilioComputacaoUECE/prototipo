// ============================================================
// ABA MATRÍCULA
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
        <p style="margin: 0;">As ofertas estarão disponíveis em ${periodoMatricula.fim}.</p>
      </div>
    `;
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
    <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 14px; color: #92400e;">
      ⚠️ <strong>Atualize seu fluxograma com disciplinas concluídas</strong> antes de montar sua matrícula.
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
      <div id="grafo-matricula" style="height: calc(100vh - 200px); width: 100%; overflow: hidden; border: 1px dashed #cbd5e1; background: #fafafa;"></div>
    </div>
    <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
      <button id="btn-salvar" style="padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">Salvar matrícula</button>
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

  const btnSalvar = document.getElementById('btn-salvar');
  if (btnSalvar) {
    btnSalvar.addEventListener('click', () => {
      if (turmasSelecionadas.size === 0) {
        alert('Selecione ao menos uma disciplina para salvar.');
        return;
      }
      alert(`Matrícula salva com sucesso!\n\n${turmasSelecionadas.size} disciplina(s) selecionada(s).`);
    });
  }

  setTimeout(() => renderizarGrafo('grafo-matricula'), 100);
}