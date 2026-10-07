// ============================================================
// SIDEBAR COMPARTILHADA — ÁREA DO COORDENADOR
// Uso em cada tela:
//   <aside class="sidebar" data-coordenador-ativo="fluxo"></aside>
//   <script src="../assets/sidebar-coordenador.js"></script>
// ============================================================

function montarSidebarCoordenador(ativo) {
  const menu = [
    { id: 'fluxo',      nome: '📋 Fluxo curricular',    href: 'fluxo.html' },
    { id: 'disciplina', nome: '📚 Disciplinas',         href: 'disciplina.html' },
    { id: 'ofertas',    nome: '📅 Ofertas do período',  href: 'matricula.html' },
  ];

  const links = menu.map(item => `
    <a href="${item.href}" class="${item.id === ativo ? 'ativo' : ''}">${item.nome}</a>
  `).join('');

  return `
    <h1>Painel do Coordenador</h1>
    <div style="padding: 0 20px 16px 20px; font-size: 12px; color: #94a3b8; border-bottom: 1px solid #334155; margin-bottom: 16px;">
      <p style="margin: 0;">Ana</p>
      <p style="margin: 4px 0 0 0; color: #cbd5e1;">Ciência da Computação</p>
    </div>
    ${links}
    <a href="../index.html" style="margin-top: 40px; color: #94a3b8; display: block; padding: 12px 20px; font-size: 14px; text-decoration: none;">
      Sair
    </a>
  `;
}

// Renderiza automaticamente assim que o script for carregado
(function () {
  const aside = document.querySelector('aside[data-coordenador-ativo]');
  if (aside) {
    aside.innerHTML = montarSidebarCoordenador(aside.getAttribute('data-coordenador-ativo'));
  }
})();

