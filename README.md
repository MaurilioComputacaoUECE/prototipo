# Fluxograma Interativo para Planejamento Acadêmico

Protótipo navegável de um sistema que ajuda o aluno a entender **qual caminho
seguir no curso** (pré-requisitos, concluídas, em andamento, futuras) e o
coordenador a configurar fluxo, disciplinas e ofertas.

- **Repositório:** https://github.com/MaurilioComputacaoUECE/prototipo
- **Etapa 1 (entrevista):** RF01–RF15, RNF01–RNF04, US01–US12 — mantidos aqui
  como referência, sem alterações.
- **Etapa 2 (este documento):** modelagem MoLIC + protótipo de alta fidelidade.

## Índice

1. [Sobre](#1-sobre) · 2. [Demonstração](#2-demonstração) · 3. [Requisitos](#3-requisitos) ·
4. [MoLIC](#4-molic--modelagem-da-interação) · 5. [Telas](#5-telas-do-protótipo) ·
6. [Design](#6-design) · 7. [Limitações](#7-limitações) · 8. [Referências](#8-referências)

## 1. Sobre

### O problema

O aluno não consegue visualizar seu percurso: o que já cursou, o que está
cursando, o que falta e o que pode cursar a seguir (pré-requisitos e ofertas).

### Critério de sucesso

> "O sistema resolve o problema quando consegue comunicar ao aluno qual
> caminho seguir."

### Atores

| Ator | Descrição | Necessidades |
|------|-----------|--------------|
| 🎓 Aluno (João) | 21 anos, 5º período, web básico | Ver fluxo e estados; consultar prés e continuidades; ver ofertadas/horários; montar, simular, salvar e alterar o planejamento |
| 📋 Coordenadora (Ana) | 45 anos, web intermediária | Cadastrar fluxos e disciplinas; definir prés; configurar obrigatórias/optativas e qtd; informar ofertadas e horários |

## 2. Demonstração

```bash
# opção 1 — abrir direto
prototipo/index.html

# opção 2 — servidor local
npx serve prototipo
```

- **Aluno:** login com a matrícula `2024001234` → escolher curso + versão →
  Fluxograma → Matrícula → Simulador.
- **Coordenadora:** login com `ana@coordenador.edu` → Fluxo → Disciplinas →
  Ofertas do período.

> Protótipo estático (sem backend). Os dados ficam no `localStorage` do
> navegador. Requer internet para o grafo (CDN vis-network).

## 3. Requisitos


### Funcionais — Aluno

| ID | Requisito | Contemplado em |
|----|-----------|----------------|
| RF01 | Visualizar o fluxo curricular | Progresso (`aluno/fluxograma.html`) |
| RF02 | Identificar concluídas / em andamento / futuras | Cards por estado + % de progresso |
| RF03 | Consultar pré-requisitos | Cards + grafo + modal de cadeia crítica |
| RF04 | Ver o que pode cursar a partir dos prés cumpridos | Grafo (filtros) + Matrícula filtrada |
| RF05 | Ver ofertadas e horários na matrícula | `aluno/matricula.html` (+ estado fora do período) |
| RF06 | Selecionar disciplinas p/ o planejamento | Seleção de turmas na Matrícula |
| RF07 | Simular o percurso | `aluno/simulador.html` (independente do Progresso) |
| RF08 | Salvar o planejamento | Botão salvar (persiste no navegador) |
| RF09 | Alterar o planejamento salvo |  `aluno/simulador.html`  |

### Funcionais — Coordenador

| ID | Requisito | Contemplado em |
|----|-----------|----------------|
| RF10 | Cadastrar e configurar fluxos | `coordenador/fluxo.html` (curso + versão + grade) |
| RF11 | Cadastrar disciplinas no fluxo | Fluxo + `coordenador/disciplina.html` (catálogo) |
| RF12 | Definir pré-requisitos | Catálogo e grade |
| RF13 | Configurar obrigatórias e optativas | Tipo por disciplina |
| RF14 | Definir qtd de optativas | Campo na tela de fluxo |
| RF15 | Informar ofertadas e horários | `coordenador/matricula.html` (período + ofertas) |

### Não funcionais

| ID | Requisito | Como aparece |
|----|-----------|--------------|
| RNF01 | Clareza visual | Cores por estado, colunas por semestre, grafo |
| RNF02 | Desempenho adequado | Protótipo local, sem tempo fixado (a entrevista não definiu máximo) |
| RNF03 | Persistência | `localStorage` (progresso, turmas, simulação, catálogo, período) |
| RNF04 | Privacidade e acesso | Telas separadas por papel; controle total fica como evolução |

### User Stories (resumo)

Coordenador: US01 fluxo · US02 disciplinas · US03 obrig/opt · US04 ofertas.
Aluno: US05 fluxo · US06 progresso · US07 dependências · US08 optativas ·
US09 ofertadas · US10 montar/simular · US11 salvar · US12 alterar.
Critérios de aceitação e análise INVEST: documento da Etapa 1, sem alterações.

## 4. MoLIC — Modelagem da Interação

Conversa usuário ↔ sistema: turnos, falas `[u]`/`[s]`, decisões `<d>`,
quebras `{b}`. Diagramas textuais válidos para este projeto.

### 4.1 Convenções

| Símbolo | Significado |
|---------|-------------|
| `[u]` | Fala / ação do usuário |
| `[s]` | Fala / resposta do sistema |
| `<d>` | Ponto de decisão |
| `{b}` | Quebra de comunicação |
| `→` | Continuação |

### 4.2 Aluno — abertura e turno central

```
● Início
│
▼
[s] "Quem é você?" — tela de Login
[u] informa papel + credencial de demonstração
│
├─ {b1} credencial inválida → [s] pede novamente
├─ {b2} aluno sem curso/versão → [s] leva a Escolher curso ─┐
│                                                          │
▼                                                          ▼
[u] Escolhe curso + versão (US05) → [s] abre turno central ◄┘
│
▼
◆ TURNO CENTRAL — [s] oferece:
  (a) Ver meu fluxograma │ (b) Consultar disciplina
  (c) Ver ofertadas │ (d) Montar/editar planejamento │ Sair
```

`index.html` + `escolher-curso.html` + sidebar (Progresso / Matrícula /
Simulador).

### 4.3 Aluno — fluxograma e consulta

```
◆ (a) Ver meu fluxograma — US05, US06 (RF01, RF02)
[s] exibe grade por semestres + Optativas, com estados
    (concluída / em andamento / futura) — aluno/fluxograma.html
[u] clica numa disciplina → <d> estado atual?
    futura → em andamento → concluída → futura (ciclo)
[s] atualiza % progresso + optativas + cadeia crítica + grafo
{b3} marcar concluída com pré pendente → [s] alerta (previsto)
→ volta ao turno central

◆ (b) Consultar disciplina — US07, US08 (RF03, RF04, RF13, RF14)
[u] observa card / abre modal cadeia / filtra o grafo
[s] mostra pré-requisitos + status + continuidades
<d> é optativa? sim → [s] mostra grupo + qtd exigida
{b4} disciplina de outro fluxo → [s] orienta a trocar de curso/versão
→ volta ao turno central
```

No protótipo a consulta (b) acontece nos próprios cards (código, nome,
estado), no modal "Cadeia crítica / Semestres mínimos" e no grafo com
filtros Obrigatórias / Crítica / Tudo.

### 4.4 Aluno — ofertadas e planejamento

```
◆ (c) Ver ofertadas — US09 (RF05)
[u] abre Matrícula — aluno/matricula.html
<d> dentro do período? (flag do coordenador)
  sim → [s] lista ofertadas filtradas (só com prés cumpridos,
          + horários) → [u] pode ir para (d)
  não → [s] informa fora do período + previsão (sem horários antigos)
{b5} sem ofertas no período → [s] informa lista vazia

◆ (d) Montar / simular / salvar — US10, US11, US12 (RF06–RF09)
[u] seleciona turmas → [s] valida prés + mostra prévia em grafo
[u] adiciona / remove disciplinas (US12)
<d> quer salvar? sim → [s] persiste (RNF03); não → mantém em sessão
[u] abre Simulador → testa caminhos sem afetar o Progresso (RF07)
{b6} salvar sem login → [s] pede login (RNF04)
{b7} acessar planejamento alheio → [s] nega (RNF04)
→ volta ao turno central

◆ Fechamento
[u] Sair → [s] salva estado e encerra sessão → ◉
```

### 4.5 Coordenador

```
● Início
[s] pede identificação → [u] informa credencial
{c1} inválida → pede novamente
[s] carrega fluxos que gerencia → ◆ TURNO CENTRAL
{c2} tentar ver dado de aluno → nega (RNF04)

◆ (a) Gerenciar fluxos — US01 (RF10)
[u] cria/seleciona fluxo (curso + versão) → [u] associa disciplinas
→ [s] persiste e disponibiliza ao aluno — coordenador/fluxo.html
{c3} versão duplicada → [s] alerta

◆ (b) Gerenciar disciplinas — US02 (RF11, RF12)
[u] cadastra / reutiliza disciplina → [u] define prés no fluxo
→ [s] atualiza relações — coordenador/disciplina.html
{c4} ciclo A→B→A → [s] impede

◆ (c) Configurar optativas — US03 (RF13, RF14)
[u] marca obrigatória/optativa + qtd exigida (+ pré de optativa)
→ [s] persiste — campo na tela de fluxo
{c5} qtd maior que disponíveis → [s] alerta

◆ (d) Configurar ofertas — US04 (RF15)
[u] define período → [u] seleciona ofertadas + horários
→ [s] persiste e disponibiliza na matrícula — coordenador/matricula.html
{c6} choque de horário → [s] alerta

◆ Fechamento: [u] Sair → [s] encerra sessão → ◉
```

### 4.6 Quebras e rastreabilidade

| ID | Quebra | Base |
|----|--------|------|
| b1 | Credenciais inválidas (aluno) | RNF04 |
| b2 | Aluno sem curso/versão | US05 |
| b3 | Concluir sem pré-requisito | RF03 / RF04 |
| b4 | Disciplina de outro fluxo | RNF04 |
| b5 | Sem ofertas no período | RF05 |
| b6 | Salvar sem login | RNF03 / RNF04 |
| b7 | Planejamento de outro aluno | RNF04 |
| c1 | Credenciais inválidas (coordenador) | RNF04 |
| c2 | Coordenador em dado de aluno | RNF04 |
| c3 | Fluxo com versão duplicada | US01 |
| c4 | Ciclo de pré-requisito | US02 |
| c5 | Optativas além das disponíveis | US03 |
| c6 | Conflito de horário | US04 |

Rastreio: US01 → 4.5(a) · US02 → 4.5(b) · US03 → 4.5(c) · US04 → 4.5(d) ·
US05/US06 → 4.3(a) · US07/US08 → 4.3(b) · US09 → 4.4(c) · US10–US12 → 4.4(d).

## 5. Telas do protótipo

| Tela | Arquivo | Histórias | Descrição |
|------|---------|-----------|-----------|
| Login | `index.html` | RNF04 | Papel + credencial demo; redireciona |
| Escolher curso | `escolher-curso.html` | US05 | Curso + versão → fluxograma |
| Progresso | `aluno/fluxograma.html` | US05, US06 | Grade, estados, % , cadeia crítica, grafo |
| Matrícula | `aluno/matricula.html` | US09–US12 | Ofertadas, horários, seleção, prévia |
| Simulador | `aluno/simulador.html` | US07, US10 | Testa caminhos sem afetar o Progresso |
| Fluxo | `coordenador/fluxo.html` | US01–US03 | Grade, prés, tipos, optativas, prévia |
| Disciplinas | `coordenador/disciplina.html` | US02 | Catálogo com busca |
| Ofertas | `coordenador/matricula.html` | US04 | Período + ofertas + registro |

> Baixa → alta fidelidade: colunas por semestre, cards por estado, grafo
> hierárquico com zoom/arrasto e modais — para comunicar "qual caminho seguir".

## 6. Design

- **Layout:** sidebar escura (navegação + curso/versão) + conteúdo claro em
  cards; grade em colunas horizontais com rolagem.
- **Estados:** Futura cinza · Em andamento azul · Concluída verde; optativa
  com borda amarela; crítica em vermelho no grafo; clique alterna o estado.
- **Grafo:** hierárquico esquerda → direita por profundidade de pré-requisito;
  filtros Obrigatórias / Crítica / Tudo; zoom no scroll, arrasto p/ navegar.
- **Feedback:** salvar com confirmação; avisos em amarelo; vazios tracejados;
  modais (cadeia crítica, trocar curso, catálogo).
- **Exemplo:** João, Ana, CC em 8 semestres + optativas, 6 ofertas,
  período 2026.2.

## 7. Limitações

- Front-end estático, sem backend; persistência no `localStorage`
  (progresso, turmas, simulação, catálogo, período). Reset: limpar o
  armazenamento ou usar "Resetar" no simulador.
- Dados simulados: 2 cursos, 2 versões, grade de CC, optativas, 6 ofertas,
  período 2026.2. Internet necessária (CDN do grafo).
- Validação de credenciais, controle total de acesso (RNF04) e alertas de
  quebra: previstos no MoLIC, simplificados no protótipo — evolução futura.

## 8. Referências

- Repositório: https://github.com/MaurilioComputacaoUECE/prototipo
- Etapa 1 — entrevista: RF01–RF15, RNF01–RNF04, US01–US12 + INVEST.
- Protótipo: pasta `prototipo/` (`index.html` como entrada).
