# Fluxograma Interativo para Planejamento Acadêmico — Etapa 2: MoLIC + Protótipo

> Documento da segunda etapa, construído a partir da Etapa 1 (entrevista:
> RF01–RF15, RNF01–RNF04, US01–US12). Os requisitos da Etapa 1 foram mantidos
> sem alteração. Este documento descreve a modelagem MoLIC e o protótipo de
> alta fidelidade que os contempla. Protótipo em `prototipo/`.

## 1. Objetivo principal do sistema

O problema central identificado é a dificuldade do aluno em entender o caminho
que deve seguir no curso, principalmente por causa dos pré-requisitos, das
disciplinas já concluídas, das disciplinas em andamento e das que ainda poderá
cursar. O sistema deve permitir que o aluno visualize e planeje seu percurso
acadêmico de forma clara.

Critério de sucesso fornecido pela cliente:
"O sistema resolve o problema quando consegue comunicar ao aluno qual caminho
seguir."

## 2. Atores

### Ator 1 — Aluno (principal usuário)
Necessidades: visualizar fluxo curricular; concluidas / em andamento /
a cursar; consultar pré-requisitos; ver o que pode cursar após cada disciplina;
ver ofertadas e horários na matrícula; selecionar disciplinas para planejar;
simular o caminho; salvar e alterar o planejamento.

### Ator 2 — Coordenador
Necessidades: cadastrar fluxos; cadastrar disciplinas; definir pré-requisitos
e relações; configurar obrigatórias/optativas e a quantidade de optativas;
informar ofertadas e horários no período de matrícula.

## 3. Requisitos funcionais (Etapa 1 — mantidos)

Aluno: RF01 ver fluxo; RF02 identificar estados; RF03 consultar
pré-requisitos; RF04 ver o que pode cursar a partir dos prés cumpridos;
RF05 ver ofertadas e horários na matrícula; RF06 selecionar disciplinas;
RF07 simular percurso; RF08 salvar; RF09 alterar planejamento salvo.

Coordenador: RF10 cadastrar/configurar fluxos; RF11 cadastrar disciplinas
no fluxo; RF12 definir pré-requisitos; RF13 configurar obrigatórias e
optativas; RF14 definir quantidade de optativas; RF15 informar ofertadas
e horários do período.

## 4. Requisitos não funcionais (Etapa 1 — mantidos)

RNF01 Clareza da apresentação (distinguir realizado / em andamento /
futuro / continuidades). RNF02 Desempenho adequado (sem tempo inventado —
a entrevistada não fixou máximo). RNF03 Persistência (salvos permanecem).
RNF04 Privacidade e controle de acesso (fluxograma/planejamento só do
próprio aluno; coordenador configura o fluxo, sem acesso ao individual).


## 5. User Stories (Etapa 1 — mantidas, resumo)

Coordenador: US01 cadastrar fluxo; US02 disciplinas e relações;
US03 obrigatórias/optativas; US04 ofertas e horários.
Aluno: US05 visualizar fluxo; US06 registrar progresso; US07 consultar
dependências e continuidade; US08 optativas; US09 ofertadas;
US10 montar e simular; US11 salvar; US12 alterar.
Critérios de aceitação e análise INVEST: conforme Etapa 1, sem alterações.

## 6. MoLIC — Modelagem da Interação

Conversa usuário-sistema: turnos, falas [u]/[s], decisões <d>, quebras {b}.
Diagrama do Aluno em `fluxograma.py` (gera `molic_aluno.png`).

### 6.1 Convenções
[u] usuário · [s] sistema · {b} quebra · <d> decisão · -> continuação.

### 6.2 Aluno — abertura
[s] pergunta quem é -> login. [u] informa credenciais. {b1} inválidas ->
pede de novo. {b2} sem fluxo -> procurar coordenação. OK -> turno central.

### 6.3 Aluno — turno central
[s] oferece: (a) ver fluxograma, (b) consultar disciplina,
(c) ver ofertadas, (d) montar/editar planejamento, sair.

### 6.4 (a) Ver fluxograma — US05, US06
[s] exibe fluxo (concluída/em andamento/futura). [u] clica. <d> concluída?
não -> marcar; sim -> desmarcar. {b3} marcar sem pré -> alerta. Recalcula,
volta ao turno. Protótipo: aluno/fluxograma.html — colunas por semestre +
Optativas, clique alterna estado, % progresso, modal cadeia crítica
(semestres mínimos) e grafo de pré-requisitos.

### 6.5 (b) Consultar disciplina — US07, US08
[u] seleciona; [s] mostra pré-requisitos, status, continuidade.
<d> optativa? sim -> grupo + quantidade. {b4} outro fluxo -> orienta.
Protótipo: cards (código/nome/estado) + modal de cadeia + grafo com
filtros (Obrigatórias/Crítica/Tudo), com optativas destacadas.

### 6.6 (c) Ver ofertas — US09
[u] escolhe ver ofertas. <d> dentro do período? sim -> [s] lista ofertas +
horários; não -> [s] informa fora do período (sem horários antigos).
{b5} sem ofertas -> informa. Protótipo: aluno/matricula.html — lista
filtrada por pré-requisitos cumpridos, horários, seleção de turmas,
prévia em grafo; fora do período mostra mensagem e previsão.

### 6.7 (d) Planejamento — US10, US11, US12
[u] entra no planejador; [s] exibe salvo/vazio. [u] seleciona;
[s] valida + mostra consequências. <d> salvar? sim -> persiste;
não -> mantém em memória. {b6} salvar sem login -> pede login.
{b7} planejamento alheio -> nega (RNF04).
Protótipo: seleção de turmas na Matrícula (persiste turmas + estados,
US10/US11) com adicionar/remover (US12), mais o Simulador
(aluno/simulador.html) para testar caminhos sem afetar o Progresso.

### 6.8 Fechamento
[u] sair; [s] salva estado e encerra sessão.

### 6.9 Coordenador — conversa
Abertura: [s] pede identificação; [u] informa; [s] carrega fluxos que
gerencia. {c1} inválidas. {c2} tentar ver dado de aluno -> nega (RNF04).
Turno: (a) fluxos US01, (b) disciplinas US02, (c) optativas US03,
(d) ofertas US04, sair.
(a) cria/edita fluxo (curso, versão), associa disciplinas, persiste,
disponibiliza ao aluno. {c3} versão duplicada -> alerta.
(b) cadastra, reutiliza entre fluxos, define prés no fluxo. {c4} ciclo
A->B->A -> impede. (c) marca obrig/opt, qtd exigida, pré de optativa.
{c5} qtd maior que disponíveis -> alerta. (d) seleciona ofertadas +
horários, persiste, disponibiliza na matrícula. {c6} choque -> alerta.
Protótipo: coordenador/fluxo.html (grade + optativas + prévia),
disciplina.html (catálogo), matricula.html (período + ofertas).

### 6.10 Quebras e rastreio US -> MoLIC
Tabela: b1 credenciais/RNF04; b2 sem fluxo; b3 concluir sem pré/RF03-RF04;
b4 outro fluxo/RNF04; b5 sem ofertas/RF05; b6 sem login/RNF03-RNF04;
b7 alheio/RNF04; c1 credenciais/RNF04; c2 dado de aluno/RNF04;
c3 duplicado/US01; c4 ciclo/US02; c5 opt/US03; c6 choque/US04.
Rastreio: US01 6.9(a); US02 6.9(b); US03 6.9(c); US04 6.9(d);
US05-US06 6.4; US07-US08 6.5; US09 6.6; US10-US12 6.7.

## 7. Protótipo de alta fidelidade

### 7.1 Telas
- Login (index.html, RNF04): seletor de papel Aluno/Coordenador com
  credencial de demonstração; redireciona (aluno novo -> escolher curso).
- Escolher curso (escolher-curso.html): curso + versão do fluxo; salva
  e leva ao fluxograma.
- Fluxograma do Aluno (aluno/fluxograma.html — US05, US06): colunas por
  semestre + Optativas; clique alterna estado; % progresso; optativas
  concluídas; botão de semestres mínimos abre o modal de cadeia crítica;
  grafo de pré-requisitos navegável.
- Consulta de disciplina (US07, US08): cards + modal de cadeia + grafo
  com filtros; mostra prés, status, continuidades, grupo e qtd de optativas.
- Disciplinas Ofertadas (aluno/matricula.html — US09): lista do período
  com horários; fora do período, mensagem sem horários antigos; seleção
  de turmas com prévia em grafo.
- Planejador (US10, US11, US12): seleção na Matrícula (persiste e permite
  adicionar/remover) + Simulador independente para testar sem afetar
  o Progresso; botão salvar com confirmação.
- Painel do Coordenador (US01–US04): fluxo.html (grade, prés, tipos,
  qtd de optativas, prévia), disciplina.html (catálogo com busca),
  matricula.html (período + ofertas + registro).

### 7.2 Comparação baixa -> alta fidelidade
Alta fidelidade adotou colunas por semestre + cards coloridos por estado
+ grafo hierárquico com zoom/arrasto + modais, para comunicar visualmente
"qual caminho seguir" (critério da cliente).

## 8. Design

Layout: sidebar escura fixa (navegação + curso/versão) + conteúdo claro
em cards; grade em colunas horizontais com rolagem.
Estados: Futura cinza, Em andamento azul, Concluída verde; optativa com
borda amarela tracejada; crítica em vermelho no grafo; clique alterna.
Grafo: vis-network, hierárquico esquerda->direita por profundidade de
pré-requisitos; filtros Obrigatórias/Crítica/Tudo com texto de ajuda;
zoom por scroll, arrasto para navegar.
Feedback: botões salvar com confirmação; avisos em banner amarelo;
estados vazios tracejados. Modais: cadeia crítica, trocar curso, catálogo.
Dados de exemplo: João, Ana, CC em 8 semestres + optativas, ofertas de
demonstração, período 2026.2.

## 9. Limitações do protótipo

Front-end estático sem backend: persistência em localStorage do navegador
(progresso, turmas, simulação, catálogo, período). Para recomeçar, limpar
o armazenamento do navegador ou usar Resetar no simulador.
Dados simulados: 2 cursos, 2 versões, grade de CC, optativas, 6 ofertas,
período 2026.2. Requer internet (CDN do grafo).
Funcionalidades previstas no MoLIC e tratadas de forma simplificada no
protótipo: validação de credenciais, controle de acesso por papel (RNF04),
alertas de quebra (b3/c3–c6) e compartilhamento total entre coordenador
e aluno — ficam como evolução para o sistema final.
Como rodar: abrir `prototipo/index.html` ou servir a pasta `prototipo/`.
