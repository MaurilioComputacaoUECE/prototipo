// Preenche os selects
const selectCurso = document.getElementById('select-curso');
const selectVersao = document.getElementById('select-versao');

cursos.forEach(c => {
  const opt = document.createElement('option');
  opt.value = c.id;
  opt.textContent = c.nome;
  selectCurso.appendChild(opt);
});

versoes.forEach(v => {
  const opt = document.createElement('option');
  opt.value = v;
  opt.textContent = v;
  selectVersao.appendChild(opt);
});

// Recupera escolha anterior (se houver)
const cursoSalvo = localStorage.getItem('aluno_curso');
const versaoSalva = localStorage.getItem('aluno_versao');
if (cursoSalvo) selectCurso.value = cursoSalvo;
if (versaoSalva) selectVersao.value = versaoSalva;

// Botão confirmar
document.getElementById('btn-confirmar').addEventListener('click', () => {
  const curso = selectCurso.value;
  const versao = selectVersao.value;

  if (!curso || !versao) {
    alert('Selecione o curso e a versão.');
    return;
  }

  localStorage.setItem('aluno_curso', curso);
  localStorage.setItem('aluno_versao', versao);

  window.location.href = 'aluno/fluxograma.html';
});