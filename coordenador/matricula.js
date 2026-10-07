// ============================================================
// TROCA DE ABAS (Ofertas / Registro)
// ============================================================

document.querySelectorAll('.aba').forEach(aba => {
  aba.addEventListener('click', () => {
    document.querySelectorAll('.aba').forEach(a => a.classList.remove('ativa'));
    document.querySelectorAll('.aba-content').forEach(c => c.classList.remove('ativa'));
    aba.classList.add('ativa');
    const conteudo = document.getElementById('aba-' + aba.dataset.aba);
    if (conteudo) conteudo.classList.add('ativa');
  });
});

// ============================================================
// CATÁLOGO DE DISCIPLINAS (cadastradas na tela Disciplinas)
// ============================================================

const catalogoDisciplinas = carregarCatalogoCoord();
const mapaDisciplinas = {};
catalogoDisciplinas.forEach(d => { mapaDisciplinas[d.id] = d.nome; });

const selectDisciplina = document.getElementById('input-disciplina');
const selectTurma = document.getElementById('input-turma');
const nomeAoLado = document.getElementById('nome-disciplina-lado');

if (catalogoDisciplinas.length === 0) {
  const opt = document.createElement('option');
  opt.disabled = true;
  opt.textContent = '— Nenhuma disciplina cadastrada —';
  selectDisciplina.appendChild(opt);
} else {
  catalogoDisciplinas.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = `${d.id} — ${d.nome}`;
    selectDisciplina.appendChild(opt);
  });
}

// ID da turma é derivado da disciplina (CC115-A, CC115-B, ...)
// e o nome da disciplina aparece ao lado para identificação
function sincronizarTurma() {
  const disciplinaId = selectDisciplina.value;
  selectTurma.innerHTML = '';

  if (!disciplinaId) {
    selectTurma.innerHTML = '<option value="">—</option>';
    nomeAoLado.textContent = '';
    return;
  }

  ['A', 'B', 'C', 'D', 'E', 'F'].forEach(letra => {
    const opt = document.createElement('option');
    opt.value = `${disciplinaId}-${letra}`;
    opt.textContent = `${disciplinaId}-${letra}`;
    selectTurma.appendChild(opt);
  });

  nomeAoLado.textContent = mapaDisciplinas[disciplinaId] || '';
}

selectDisciplina.addEventListener('change', sincronizarTurma);
sincronizarTurma();

// ============================================================
// PRÓXIMO PERÍODO DE MATRÍCULA
// ============================================================

const inputPeriodo = document.getElementById('input-periodo');
const inputPeriodoInicio = document.getElementById('input-periodo-inicio');
const inputPeriodoFim = document.getElementById('input-periodo-fim');
const statusPeriodo = document.getElementById('status-periodo');

function atualizarStatusPeriodo() {
  statusPeriodo.textContent = `Próximo período: ${periodoMatricula.periodo} · matrícula de ${periodoMatricula.inicio} até ${periodoMatricula.fim}`;
}

inputPeriodo.value = periodoMatricula.periodo;
inputPeriodoInicio.value = periodoMatricula.inicio || '';
inputPeriodoFim.value = periodoMatricula.fim;
atualizarStatusPeriodo();

document.getElementById('btn-periodo').addEventListener('click', () => {
  const periodo = inputPeriodo.value.trim();
  const inicio = inputPeriodoInicio.value.trim();
  const fim = inputPeriodoFim.value.trim();

  if (!periodo || !inicio || !fim) {
    alert('Preencha o período, o início e o fim da matrícula.');
    return;
  }

  salvarProximoPeriodo({ periodo, inicio, fim });
  atualizarStatusPeriodo();
});

// ============================================================
// OFERTAS
// ============================================================

const listaOfertas = document.getElementById('lista-ofertas');
const previewOfferta = document.getElementById('preview-offerta');

// Começa com as ofertas fake do protótipo (dados.js)
let ofertasRegistradas = [];

if (typeof ofertas !== 'undefined') {
  ofertasRegistradas = ofertas.map(o => {
    const partes = (o.horario || '').split('/');
    return {
      turmaId: o.turmaId,
      disciplinaId: o.disciplinaId,
      disciplinaNome: mapaDisciplinas[o.disciplinaId] || o.disciplinaId,
      dias: partes[2] ? partes[2].toUpperCase() : '—',
      horario: partes[0] ? partes[0].toUpperCase() : '—',
      turno: partes[1] ? partes[1].toUpperCase() : '—'
    };
  });
}

function renderizarOfertas() {
  if (ofertasRegistradas.length === 0) {
    listaOfertas.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; color:#94a3b8;">Nenhuma oferta registrada ainda.</td>
      </tr>
    `;
    return;
  }

  listaOfertas.innerHTML = '';
  ofertasRegistradas.forEach((o, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <span style="font-family:monospace; font-weight:600; color:#1e40af;">${o.turmaId}</span>
        <span style="display:block; font-size:12px; color:#64748b;">${o.disciplinaNome || ''}</span>
      </td>
      <td>${o.dias}</td>
      <td>${o.horario}</td>
      <td>${o.turno}</td>
      <td><span class="badge-ofertada" style="display:inline-block; padding:3px 8px; border-radius:999px; font-size:12px; font-weight:600;">Ofertada</span></td>
    `;

    const btnRemover = document.createElement('button');
    btnRemover.textContent = '🗑️';
    btnRemover.title = 'Remover oferta (protótipo)';
    btnRemover.style.cssText = 'margin-left:8px; padding:4px 8px; border:1px solid #fecaca; background:#fef2f2; color:#b91c1c; border-radius:6px; cursor:pointer; font-size:12px;';
    btnRemover.addEventListener('click', () => {
      ofertasRegistradas.splice(i, 1);
      renderizarOfertas();
    });
    tr.children[4].appendChild(btnRemover);

    listaOfertas.appendChild(tr);
  });
}

// ============================================================
// SALVAR NOVA OFERTA
// ============================================================

document.getElementById('btn-salvar').addEventListener('click', () => {
  const disciplinaId = selectDisciplina.value;
  const turma = selectTurma.value;
  const dias = document.getElementById('input-dias').value;
  const horario = document.getElementById('input-horario').value;
  const turno = document.getElementById('input-turno').value;

  if (!disciplinaId) {
    alert('Selecione a disciplina da oferta.');
    return;
  }

  if (!turma) {
    alert('Selecione o ID da turma.');
    return;
  }

  const disciplinaNome = mapaDisciplinas[disciplinaId] || disciplinaId;

  ofertasRegistradas.unshift({
    turmaId: turma,
    disciplinaId,
    disciplinaNome,
    dias,
    horario,
    turno
  });

  renderizarOfertas();
  previewOfferta.textContent = `${turma} · ${disciplinaNome} · ${dias} · ${horario} · ${turno}`;
});

// ============================================================
// INICIALIZAÇÃO
// ============================================================

renderizarOfertas();
