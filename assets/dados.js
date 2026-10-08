// ============================================================
// CURSOS E VERSÕES
// ============================================================

const cursos = [
  { id: 'cc',  nome: 'Ciência da Computação' },
  { id: 'es',  nome: 'Engenharia de Software' }
];

const versoes = ['2025.1', '2026.1'];

// ============================================================
// DISCIPLINAS — fluxo real (matriz curricular)
// ============================================================

const disciplinas = [
  // 01º semestre
  { id: 'CC117', nome: 'Cálculo Diferencial e Integral I',   periodo: 1, tipo: 'obrigatoria', pre: [],                 estado: 'futura' },
  { id: 'CC118', nome: 'Geometria Analítica',                periodo: 1, tipo: 'obrigatoria', pre: [],                 estado: 'futura' },
  { id: 'CC116', nome: 'Matemática Discreta',                periodo: 1, tipo: 'obrigatoria', pre: [],                 estado: 'futura' },
  { id: 'CC119', nome: 'Organização de Computadores',        periodo: 1, tipo: 'obrigatoria', pre: [],                 estado: 'futura' },
  { id: 'CC115', nome: 'Programação e Algoritmos',           periodo: 1, tipo: 'obrigatoria', pre: [],                 estado: 'futura' },

  // 02º semestre
  { id: 'CC123', nome: 'Álgebra Linear para Computação',     periodo: 2, tipo: 'obrigatoria', pre: ['CC118'],          estado: 'futura' },
  { id: 'CC121', nome: 'Arquitetura de Computadores',        periodo: 2, tipo: 'obrigatoria', pre: ['CC119'],          estado: 'futura' },
  { id: 'CC122', nome: 'Cálculo Diferencial e Integral II',  periodo: 2, tipo: 'obrigatoria', pre: ['CC117'],          estado: 'futura' },
  { id: 'CC124', nome: 'Física para Computação',             periodo: 2, tipo: 'obrigatoria', pre: ['CC117'],          estado: 'futura' },
  { id: 'CC125', nome: 'Lógica para Computação',             periodo: 2, tipo: 'obrigatoria', pre: ['CC116'],          estado: 'futura' },
  { id: 'CC120', nome: 'Programação Orientada a Objeto',     periodo: 2, tipo: 'obrigatoria', pre: ['CC115'],          estado: 'futura' },

  // 03º semestre
  { id: 'CC128', nome: 'Cálculo Diferencial e Integral III', periodo: 3, tipo: 'obrigatoria', pre: ['CC122'],          estado: 'futura' },
  { id: 'CC129', nome: 'Computação Gráfica',                 periodo: 3, tipo: 'obrigatoria', pre: ['CC123'],          estado: 'futura' },
  { id: 'CC126', nome: 'Estrutura de Dados',                 periodo: 3, tipo: 'obrigatoria', pre: ['CC120'],          estado: 'futura' },
  { id: 'CC130', nome: 'Probabilidade e Estatística',        periodo: 3, tipo: 'obrigatoria', pre: ['CC122'],          estado: 'futura' },
  { id: 'CC127', nome: 'Sistemas Operacionais',              periodo: 3, tipo: 'obrigatoria', pre: ['CC121'],          estado: 'futura' },
  { id: 'CC131', nome: 'Teoria dos Autômatos e Ling. Formais', periodo: 3, tipo: 'obrigatoria', pre: ['CC125'],        estado: 'futura' },

  // 04º semestre
  { id: 'CC134', nome: 'Avaliação de Desempenho',            periodo: 4, tipo: 'obrigatoria', pre: ['CC130'],          estado: 'futura' },
  { id: 'CC137', nome: 'Banco de Dados',                     periodo: 4, tipo: 'obrigatoria', pre: ['CC120'],          estado: 'futura' },
  { id: 'CC135', nome: 'Cálculo Numérico',                   periodo: 4, tipo: 'obrigatoria', pre: ['CC128'],          estado: 'futura' },
  { id: 'CC132', nome: 'Engenharia de Software',             periodo: 4, tipo: 'obrigatoria', pre: ['CC120'],          estado: 'futura' },
  { id: 'CC136', nome: 'Teoria da Computabilidade',          periodo: 4, tipo: 'obrigatoria', pre: ['CC131'],          estado: 'futura' },
  { id: 'CC133', nome: 'Teoria dos Grafos',                  periodo: 4, tipo: 'obrigatoria', pre: ['CC126'],          estado: 'futura' },

  // 05º semestre
  { id: 'CC141', nome: 'Análise e Projeto de Software',      periodo: 5, tipo: 'obrigatoria', pre: ['CC132'],          estado: 'futura' },
  { id: 'CC154', nome: 'Extensão I',                         periodo: 5, tipo: 'obrigatoria', pre: [],                 estado: 'futura' },
  { id: 'CC140', nome: 'Inteligência Computacional',         periodo: 5, tipo: 'obrigatoria', pre: ['CC131'],          estado: 'futura' },
  { id: 'CC138', nome: 'Programação Concorrente e Paralela', periodo: 5, tipo: 'obrigatoria', pre: ['CC127'],          estado: 'futura' },
  { id: 'CC142', nome: 'Projeto e Análise de Algoritmos',    periodo: 5, tipo: 'obrigatoria', pre: ['CC133'],          estado: 'futura' },
  { id: 'CC139', nome: 'Redes de Computadores',              periodo: 5, tipo: 'obrigatoria', pre: ['CC134'],          estado: 'futura' },

  // 06º semestre
  { id: 'CC147', nome: 'Compiladores',                       periodo: 6, tipo: 'obrigatoria', pre: ['CC136'],          estado: 'futura' },
  { id: 'CC155', nome: 'Extensão II',                        periodo: 6, tipo: 'obrigatoria', pre: [],                 estado: 'futura' },
  { id: 'CC145', nome: 'Interação Humano Computador',        periodo: 6, tipo: 'obrigatoria', pre: ['CC132'],          estado: 'futura' },
  { id: 'CC144', nome: 'Processamento de Imagens',           periodo: 6, tipo: 'obrigatoria', pre: ['CC123'],          estado: 'futura' },
  { id: 'CC143', nome: 'Programação Matemática',             periodo: 6, tipo: 'obrigatoria', pre: ['CC135'],          estado: 'futura' },
  { id: 'CC146', nome: 'Sistemas Distribuídos',              periodo: 6, tipo: 'obrigatoria', pre: ['CC139'],          estado: 'futura' },

  // 07º semestre
  { id: 'CC150', nome: 'Administração e Empreend. p/ Computação', periodo: 7, tipo: 'obrigatoria', pre: [],            estado: 'futura' },
  { id: 'CC149', nome: 'Ciência de Dados',                   periodo: 7, tipo: 'obrigatoria', pre: ['CC140'],          estado: 'futura' },
  { id: 'CC152', nome: 'Estágio',                            periodo: 7, tipo: 'obrigatoria', pre: [],                 estado: 'futura' },
  { id: 'CC156', nome: 'Extensão III',                       periodo: 7, tipo: 'obrigatoria', pre: [],                 estado: 'futura' },
  { id: 'CC148', nome: 'Informática na Sociedade e Ética',   periodo: 7, tipo: 'obrigatoria', pre: [],                 estado: 'futura' },
  { id: 'CC151', nome: 'Pesquisa em Computação',             periodo: 7, tipo: 'obrigatoria', pre: ['CC142'],          estado: 'futura' },

  // 08º semestre
  { id: 'CC157', nome: 'Extensão IV',                        periodo: 8, tipo: 'obrigatoria', pre: [],                 estado: 'futura' },
  { id: 'CC203', nome: 'Extensão V',                         periodo: 8, tipo: 'obrigatoria', pre: [],                 estado: 'futura' },
  { id: 'CC153', nome: 'Projeto Final',                      periodo: 8, tipo: 'obrigatoria', pre: ['CC151'],          estado: 'futura' },

  // Optativas
  { id: 'CL179', nome: 'Atividades Acadêmicas Cient. e Culturais', periodo: 99, tipo: 'optativa', pre: [],           estado: 'futura' },
  { id: 'CL832', nome: 'Atividades Específicas de Extensão',       periodo: 99, tipo: 'optativa', pre: [],           estado: 'futura' },
  { id: 'CC159', nome: 'Gerência de Projetos',                     periodo: 99, tipo: 'optativa', pre: ['CC141'],    estado: 'futura' },
  { id: 'CT983', nome: 'Padrões de Software',                      periodo: 99, tipo: 'optativa', pre: ['CT904'],    estado: 'futura' },
  { id: 'CT976', nome: 'Programação Inteira e Combinatória',       periodo: 99, tipo: 'optativa', pre: ['CT911'],    estado: 'futura' },
  { id: 'CC083', nome: 'Qualidade de Software',                    periodo: 99, tipo: 'optativa', pre: ['CT904'],    estado: 'futura' },
  { id: 'CC109', nome: 'Redes Neurais Artificiais',                periodo: 99, tipo: 'optativa', pre: ['CC091'],    estado: 'futura' },
  { id: 'CC158', nome: 'Segurança em Redes',                       periodo: 99, tipo: 'optativa', pre: ['CC139'],    estado: 'futura' },
  { id: 'CC202', nome: 'Tóp. Especiais Intelig. Computacional',    periodo: 99, tipo: 'optativa', pre: ['CC140'],    estado: 'futura' },
  { id: 'CC200', nome: 'Tópicos Especiais em Prog. Matemática',    periodo: 99, tipo: 'optativa', pre: ['CC143'],    estado: 'futura' },
  { id: 'CC201', nome: 'Tópicos Especiais em Programação',         periodo: 99, tipo: 'optativa', pre: ['CC132'],    estado: 'futura' },
  { id: 'CC111', nome: 'Tópicos Especiais Eng. de Software',       periodo: 99, tipo: 'optativa', pre: ['CC132'],    estado: 'futura' },
];

// ============================================================
// OFERTAS
// ============================================================

const ofertas = [
  { turmaId: 'CC115-A', disciplinaId: 'CC115', turma: 'A', horario: 'AB/MANHÃ/SEG-QUA', sala: '302', vagas: 40 },
  { turmaId: 'CC117-A', disciplinaId: 'CC117', turma: 'A', horario: 'CD/TARDE/TER-QUI', sala: '205', vagas: 35 },
  { turmaId: 'CC120-A', disciplinaId: 'CC120', turma: 'A', horario: 'CD/TARDE/TER-QUI', sala: '401', vagas: 30 },
  { turmaId: 'CC126-A', disciplinaId: 'CC126', turma: 'A', horario: 'EF/NOITE/SEG-QUA', sala: '108', vagas: 45 },
  { turmaId: 'CC137-A', disciplinaId: 'CC137', turma: 'A', horario: 'ABCD/TARDE/SEX',     sala: 'Lab 3', vagas: 20 },
  { turmaId: 'CC132-A', disciplinaId: 'CC132', turma: 'A', horario: 'AB/NOITE/TER-QUI', sala: '501', vagas: 25 },
];

// ============================================================
// PERÍODO DE MATRÍCULA
// ============================================================

const periodoMatricula = {
  aberto: true,
  periodo: '2026.2',
  inicio: '10/02/2026',
  fim: '15/02/2026'
};

// ============================================================
// PRÓXIMO PERÍODO DE MATRÍCULA (definido pelo coordenador)
// ============================================================

const CHAVE_PERIODO_MATRICULA = 'coord_proximo_periodo';

function carregarProximoPeriodo() {
  const salvo = localStorage.getItem(CHAVE_PERIODO_MATRICULA);
  if (salvo) {
    try {
      const p = JSON.parse(salvo);
      if (p && p.periodo && p.fim) {
        // Compatível com valores salvos antes de existirem "inicio"/"aberto"
        return {
          periodo: p.periodo,
          inicio: p.inicio || periodoMatricula.inicio,
          fim: p.fim,
          aberto: p.aberto !== false
        };
      }
    } catch (e) {}
  }
  return {
    periodo: periodoMatricula.periodo,
    inicio: periodoMatricula.inicio,
    fim: periodoMatricula.fim,
    aberto: periodoMatricula.aberto
  };
}

function salvarProximoPeriodo(p) {
  localStorage.setItem(CHAVE_PERIODO_MATRICULA, JSON.stringify(p));
  periodoMatricula.periodo = p.periodo;
  periodoMatricula.inicio = p.inicio || '';
  periodoMatricula.fim = p.fim;
  periodoMatricula.aberto = p.aberto !== false;
}

// Aplica o valor definido pelo coordenador (tela do aluno passa a usá-lo)
(function () {
  const p = carregarProximoPeriodo();
  periodoMatricula.periodo = p.periodo;
  periodoMatricula.inicio = p.inicio || '';
  periodoMatricula.fim = p.fim;
  periodoMatricula.aberto = p.aberto !== false;
})();

// ============================================================
// CATÁLOGO DO COORDENADOR (disciplinas + pré-requisitos)
// Compartilhado entre disciplina.html e matricula.html
// ============================================================

const CHAVE_CATALOGO_COORD = 'coord_catalogo_disciplinas';

function carregarCatalogoCoord() {
  const salvo = localStorage.getItem(CHAVE_CATALOGO_COORD);
  if (salvo) {
    try {
      const lista = JSON.parse(salvo);
      if (Array.isArray(lista) && lista.length) return lista;
    } catch (e) {}
  }
  return disciplinas.map(d => ({ id: d.id, nome: d.nome, pre: (d.pre || []).slice() }));
}

function salvarCatalogoCoord(lista) {
  localStorage.setItem(CHAVE_CATALOGO_COORD, JSON.stringify(lista));
}

// ============================================================
// TURMAS SELECIONADAS
// ============================================================

const turmasSelecionadas = new Set();

const turmasSalvas = localStorage.getItem('turmas_selecionadas');
if (turmasSalvas) {
  try {
    JSON.parse(turmasSalvas).forEach(t => turmasSelecionadas.add(t));
  } catch (e) {}
}

function salvarTurmasSelecionadas() {
  localStorage.setItem('turmas_selecionadas', JSON.stringify([...turmasSelecionadas]));
}

// ============================================================
// PERSISTÊNCIA DE ESTADO
// ============================================================

const estadoSalvo = localStorage.getItem('disciplinas_estado');
if (estadoSalvo) {
  try {
    const mapa = JSON.parse(estadoSalvo);
    disciplinas.forEach(d => {
      if (mapa[d.id]) d.estado = mapa[d.id];
    });
  } catch (e) {}
}

function salvarEstado() {
  const mapa = {};
  disciplinas.forEach(d => { mapa[d.id] = d.estado; });
  localStorage.setItem('disciplinas_estado', JSON.stringify(mapa));
}

function resetarEstado() {
  localStorage.removeItem('disciplinas_estado');
  localStorage.removeItem('turmas_selecionadas');
  location.reload();
}

// ============================================================
// CICLO E RÓTULOS
// ============================================================

const CICLO = ['futura', 'em-andamento', 'concluida'];

const ROTULOS = {
  'futura': 'Futura',
  'em-andamento': 'Em andamento',
  'concluida': 'Concluída'
};