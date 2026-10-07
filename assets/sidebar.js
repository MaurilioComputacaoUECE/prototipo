function montarSidebar(ativo) {
  const menu = [
    { id: 'fluxograma', nome: 'Fluxograma',           href: 'fluxograma.html' },
    { id: 'matricula',  nome: 'Matrícula',             href: 'matricula.html' },
  ];

  const links = menu.map(item => `
    <a href="${item.href}" class="${item.id === ativo ? 'ativo' : ''}">
      ${item.nome}
    </a>
  `).join('');

  const cursoId = localStorage.getItem('aluno_curso');
  const versao = localStorage.getItem('aluno_versao');
  const curso = (typeof cursos !== 'undefined' && cursoId)
    ? cursos.find(c => c.id === cursoId)
    : null;

  const nomeCurso = curso ? curso.nome : 'Curso não definido';
  const nomeVersao = versao || '';

  return `
    <aside class="sidebar">
      <h1>Planejamento Acadêmico</h1>
      <div style="padding: 0 20px 16px 20px; font-size: 12px; color: #94a3b8; border-bottom: 1px solid #334155; margin-bottom: 16px;">
        <p style="margin: 0;">João</p>
        <p style="margin: 4px 0 0 0; color: #cbd5e1;">${nomeCurso}</p>
        <p style="margin: 2px 0 0 0;">${nomeVersao}</p>
        <a href="#" id="link-trocar-curso" style="color: #60a5fa; font-size: 11px; text-decoration: none; margin-top: 6px; display: inline-block;">
          Trocar curso
        </a>
      </div>
      ${links}
      <a href="../index.html" style="margin-top: 40px; color: #94a3b8; display: block; padding: 12px 20px; font-size: 14px; text-decoration: none;">
        Sair
      </a>
    </aside>
  `;
}

function montarLayout(ativo, conteudo) {
  return `
    <div class="layout">
      ${montarSidebar(ativo)}
      <main class="conteudo">
        ${conteudo}
      </main>
    </div>
    <div id="modal-trocar-curso" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 100; padding: 16px;">
      <div style="background: white; border-radius: 12px; padding: 28px; max-width: 420px; width: 100%; box-shadow: 0 20px 50px rgba(0,0,0,0.2);">
        <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #1e293b;">
          Trocar de curso?
        </h2>
        <p style="margin: 0 0 24px 0; color: #64748b; font-size: 14px; line-height: 1.5;">
          Seu planejamento atual continuará salvo. Você poderá voltar e retomá-lo depois.
        </p>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button id="btn-cancelar-troca"
                  style="padding: 10px 20px; background: white; color: #475569; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer;">
            Cancelar
          </button>
          <button id="btn-confirmar-troca"
                  style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">
            Trocar curso
          </button>
        </div>
      </div>
    </div>
  `;
}

// Configura o modal quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  const link = document.getElementById('link-trocar-curso');
  const modal = document.getElementById('modal-trocar-curso');
  const btnCancelar = document.getElementById('btn-cancelar-troca');
  const btnConfirmar = document.getElementById('btn-confirmar-troca');

  if (!link || !modal) return;

  link.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
  });

  btnCancelar.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', (e) => {
    if (e.target.id === 'modal-trocar-curso') {
      modal.style.display = 'none';
    }
  });

  btnConfirmar.addEventListener('click', () => {
    window.location.href = '../escolher-curso.html';
  });
});