# Guia de Implementacao Frontend: Como Pontuar no Bolao

## Objetivo

Criar uma area de ajuda no frontend para explicar ao participante como funciona a pontuacao do bolao e como ele pode aumentar sua pontuacao.

A ideia e que essa area funcione como um tutorial claro, acessivel pelo menu principal, explicando:

- como os palpites geram pontos;
- como funciona o bonus de participacao;
- quais sao os niveis existentes;
- quantos pontos cada nivel concede;
- quantos jogos apostados sao necessarios para atingir cada nivel;
- qual e o progresso atual do usuario;
- quais acoes praticas o usuario pode tomar para subir no ranking.

Essa tela/secao deve reduzir duvidas sobre a dinamica da brincadeira e incentivar o usuario a palpitar em mais jogos.

## Nome Sugerido no Menu

Adicionar uma entrada no menu principal com um nome direto e orientado a acao.

Opcao recomendada:

```text
Como pontuar
```

Outras opcoes aceitaveis:

```text
Dicas
Guia do bolao
Regras de pontuacao
```

A recomendacao e usar `Como pontuar`, porque deixa claro que a tela ajuda o participante a entender como ganhar mais pontos.

## Formato de Interface Recomendado

Preferir uma experiencia em formato de drawer lateral, modal amplo ou pagina dedicada.

Evitar um modal pequeno demais, porque o conteudo e educativo e possui varias informacoes importantes.

Recomendacao principal:

```text
Menu -> Como pontuar -> abre drawer ou tela de guia
```

Se o app ja usa modais grandes de ajuda, pode ser um modal. Se o app possui navegacao por rotas, uma pagina dedicada como `/como-pontuar` tambem funciona bem.

## Estrutura Recomendada da Tela

A tela deve ser dividida em blocos objetivos.

### 1. Seu progresso

Esse deve ser o primeiro bloco da experiencia, pois torna o guia personalizado para o usuario.

Mostrar:

- nivel atual do usuario;
- bonus atual concedido;
- quantidade de jogos apostados;
- total de jogos cadastrados;
- percentual atual de participacao;
- proximo nivel;
- quantos palpites faltam para o proximo nivel;
- quantos pontos o usuario vai ganhar ao atingir o proximo nivel.

Exemplo de conteudo:

```text
Seu progresso

Nivel atual: Iniciante
Bonus atual: +0 pontos

Voce apostou em 12 de 104 jogos.
Progresso: 11%

Faltam 4 palpites para chegar ao Bronze e ganhar +5 pontos.
```

Esse bloco deve ter uma barra de progresso visual ate o proximo nivel.

Exemplo:

```text
Iniciante [==========------] Bronze
12 de 16 jogos necessarios
```

### 2. Como ganhar pontos com palpites

Explicar que os pontos principais vem dos acertos nos jogos.

Regras atuais do backend:

- acerto de vencedor: 7 pontos;
- acerto de empate: 5 pontos;
- erro: 0 pontos;
- se o usuario usou carta de dobro de pontos, o valor do acerto e dobrado.

Texto sugerido:

```text
Voce ganha pontos quando acerta o resultado do jogo.

Acertou o vencedor: +7 pontos.
Acertou empate: +5 pontos.
Errou o palpite: 0 pontos.

Se usar uma carta de dobro de pontos em um palpite correto, os pontos daquele jogo sao dobrados.
```

Exemplos:

```text
Palpite: Time A vence
Resultado: Time A venceu
Pontuacao: +7 pontos
```

```text
Palpite: Empate
Resultado: Empate
Pontuacao: +5 pontos
```

```text
Palpite com carta de dobro: Time B vence
Resultado: Time B venceu
Pontuacao: +14 pontos
```

### 3. Bonus de participacao

Explicar com bastante clareza que o bonus de participacao nao depende de acertar palpites.

Ele depende de apostar em uma quantidade minima de jogos em relacao ao total de jogos cadastrados.

Texto sugerido:

```text
O bonus de participacao recompensa quem participa mais do bolao.

Ele nao depende de acertar os jogos. Para subir de nivel, voce precisa palpitar em mais partidas.

Quanto mais jogos voce palpitar, maior sera seu nivel de participacao e maior sera o bonus somado ao seu ranking.
```

### 4. Tabela de niveis

Mostrar todos os niveis existentes, com percentual minimo, jogos necessarios e bonus concedido.

Os niveis atuais do backend sao:

| Nivel | Percentual minimo | Bonus |
| --- | ---: | ---: |
| Bronze | 15% | +5 pontos |
| Prata | 30% | +10 pontos |
| Ouro | 50% | +20 pontos |
| Platina | 70% | +35 pontos |
| Diamante | 90% | +50 pontos |

O frontend deve calcular a coluna de jogos necessarios usando o total de jogos retornado pela API.

Formula:

```ts
const jogosNecessarios = Math.ceil(total_jogos * minimoPercentual / 100)
```

Exemplo com `total_jogos = 104`:

| Nivel | Percentual minimo | Jogos necessarios | Bonus |
| --- | ---: | ---: | ---: |
| Bronze | 15% | 16 jogos | +5 pontos |
| Prata | 30% | 32 jogos | +10 pontos |
| Ouro | 50% | 52 jogos | +20 pontos |
| Platina | 70% | 73 jogos | +35 pontos |
| Diamante | 90% | 94 jogos | +50 pontos |

Importante: usar `Math.ceil`, porque o usuario precisa atingir pelo menos o percentual minimo. Se o calculo der 15,6 jogos, o necessario real e 16 jogos.

### 5. Como o ranking e calculado

Explicar a composicao da pontuacao total.

Formula:

```text
pontos_total = pontos_apostas + pontos_bonus + pontos_campeao
```

Onde:

- `pontos_apostas`: pontos conquistados acertando palpites dos jogos;
- `pontos_bonus`: bonus de participacao por quantidade de jogos apostados;
- `pontos_campeao`: pontos por acertar o palpite de campeao, quando aplicavel.

Texto sugerido:

```text
Sua pontuacao total no ranking soma seus pontos por acertos, seu bonus de participacao e os pontos do palpite de campeao.
```

### 6. Dicas praticas para subir no ranking

Mostrar dicas curtas, em linguagem simples.

Sugestoes:

```text
Aposte em mais jogos para subir seu nivel de participacao.
```

```text
Voce nao precisa acertar para avancar no bonus de participacao. Basta registrar palpites em mais partidas.
```

```text
Use a carta de dobro em jogos em que voce esta mais confiante.
```

```text
Palpitar em todos os jogos aumenta suas chances de pontuar e tambem melhora seu bonus de participacao.
```

```text
Confira os jogos sem palpite para nao perder oportunidades de pontuar.
```

## Dados Necessarios da API

O frontend precisa dos dados de progresso do usuario e da lista de niveis de bonus.

### Progresso do usuario

Endpoint existente:

```http
GET /api/bonus/users/:userId
```

Campos relevantes:

```ts
type BonusProgresso = {
  userId: string
  name: string
  jogos_apostados: number
  total_jogos: number
  percentual: number
  nivel_atual: string
  bonus_concedido: number
  proximo_nivel: {
    nivel: string
    minimoPercentual: number
    bonusPontos: number
  } | null
}
```

### Lista de niveis

Endpoint existente:

```http
GET /api/bonus/niveis
```

Formato esperado:

```ts
type NivelBonus = {
  nivel: string
  minimoPercentual: number
  bonusPontos: number
}
```

Exemplo:

```json
[
  { "nivel": "BRONZE", "minimoPercentual": 15, "bonusPontos": 5 },
  { "nivel": "PRATA", "minimoPercentual": 30, "bonusPontos": 10 },
  { "nivel": "OURO", "minimoPercentual": 50, "bonusPontos": 20 },
  { "nivel": "PLATINA", "minimoPercentual": 70, "bonusPontos": 35 },
  { "nivel": "DIAMANTE", "minimoPercentual": 90, "bonusPontos": 50 }
]
```

## Calculos Frontend

### Jogos necessarios por nivel

```ts
function calcularJogosNecessarios(totalJogos: number, minimoPercentual: number) {
  return Math.ceil((totalJogos * minimoPercentual) / 100)
}
```

### Jogos faltantes para o proximo nivel

```ts
function calcularJogosFaltantes(
  jogosApostados: number,
  totalJogos: number,
  proximoNivel: { minimoPercentual: number } | null
) {
  if (!proximoNivel) return 0

  const jogosNecessarios = Math.ceil(
    (totalJogos * proximoNivel.minimoPercentual) / 100
  )

  return Math.max(jogosNecessarios - jogosApostados, 0)
}
```

### Progresso ate o proximo nivel

Para a barra de progresso ate o proximo nivel:

```ts
function calcularProgressoProximoNivel(
  jogosApostados: number,
  totalJogos: number,
  proximoNivel: { minimoPercentual: number } | null
) {
  if (!proximoNivel) return 100

  const jogosNecessarios = Math.ceil(
    (totalJogos * proximoNivel.minimoPercentual) / 100
  )

  if (jogosNecessarios <= 0) return 0

  return Math.min((jogosApostados / jogosNecessarios) * 100, 100)
}
```

## Estados Especiais

### Usuario sem apostas

Mostrar:

```text
Voce ainda nao fez palpites.
Comece apostando nos jogos disponiveis para iniciar seu progresso.
```

### Usuario no nivel maximo

Quando `proximo_nivel` for `null`, o usuario ja esta no maior nivel.

Mostrar:

```text
Voce chegou ao nivel maximo: Diamante.
Seu bonus de participacao atual e de +50 pontos.
```

Nesse caso, a barra pode aparecer completa.

### Total de jogos igual a zero

Caso `total_jogos` seja `0`, evitar divisao por zero e mostrar um estado neutro.

```text
Os jogos ainda nao foram cadastrados.
Quando os jogos estiverem disponiveis, voce podera acompanhar seu progresso aqui.
```

### Dados carregando

Mostrar skeleton ou estado de carregamento para:

- progresso do usuario;
- tabela de niveis;
- dicas.

### Erro ao carregar

Mostrar mensagem simples:

```text
Nao foi possivel carregar as dicas de pontuacao agora.
Tente novamente em instantes.
```

## Recomendacoes de UX

- Usar linguagem simples e direta.
- Evitar termos tecnicos como `pontos_bonus`, `bonus_concedido` ou `percentual` na interface final.
- Preferir textos como `Bonus de participacao`, `Jogos apostados`, `Faltam X palpites`.
- Destacar visualmente o proximo objetivo do usuario.
- Mostrar a lista de niveis como uma tabela, timeline ou lista de cards compactos.
- Indicar o nivel atual do usuario na lista de niveis.
- Indicar o proximo nivel com destaque.
- Incluir um atalho para os jogos sem palpite, se essa tela existir no frontend.

## Sugestao de Layout

Ordem recomendada:

1. Cabecalho:

```text
Como pontuar
Entenda como ganhar pontos, subir de nivel e melhorar sua posicao no ranking.
```

2. Card/bloco de progresso pessoal:

```text
Seu progresso
Nivel atual, bonus atual, barra de progresso e proximo nivel.
```

3. Bloco `Como os palpites pontuam`.

4. Bloco `Bonus de participacao`.

5. Tabela/lista `Niveis de bonus`.

6. Bloco `Como o ranking e calculado`.

7. Bloco `Dicas para ganhar mais pontos`.

8. Acao final:

```text
Ver jogos sem palpite
```

## Exemplo de Copy Final

```text
Como pontuar

Entenda como ganhar pontos, subir de nivel e melhorar sua posicao no ranking.

Seu progresso
Voce apostou em 12 de 104 jogos.
Nivel atual: Iniciante
Bonus atual: +0 pontos

Faltam 4 palpites para chegar ao Bronze e ganhar +5 pontos.

Como os palpites pontuam
Acertou o vencedor: +7 pontos.
Acertou empate: +5 pontos.
Errou: 0 pontos.
Usou carta de dobro em um acerto: os pontos daquele jogo dobram.

Bonus de participacao
O bonus de participacao recompensa quem palpita em mais jogos.
Ele nao depende de acertar. Para subir de nivel, basta registrar palpites em mais partidas.

Niveis de bonus
Bronze: 15% dos jogos, +5 pontos.
Prata: 30% dos jogos, +10 pontos.
Ouro: 50% dos jogos, +20 pontos.
Platina: 70% dos jogos, +35 pontos.
Diamante: 90% dos jogos, +50 pontos.

Ranking
Sua pontuacao total soma pontos de apostas, bonus de participacao e pontos do palpite de campeao.

Dicas
Aposte em mais jogos para subir seu nivel de participacao.
Use a carta de dobro nos jogos em que estiver mais confiante.
Confira os jogos sem palpite para nao perder oportunidades.
```

## Criterios de Aceite

A implementacao frontend deve atender aos seguintes pontos:

- Existe uma entrada acessivel no menu principal chamada `Como pontuar` ou equivalente.
- Ao acionar a entrada, o usuario visualiza um guia/tutorial de pontuacao.
- O guia mostra o progresso atual do usuario.
- O guia mostra nivel atual, bonus atual e proximo nivel.
- O guia informa quantos palpites faltam para o proximo nivel.
- O guia lista todos os niveis de bonus.
- Para cada nivel, o guia mostra percentual minimo, jogos necessarios e pontos concedidos.
- O calculo de jogos necessarios usa `Math.ceil(total_jogos * minimoPercentual / 100)`.
- O guia explica que o bonus de participacao nao depende de acerto.
- O guia explica os pontos por acerto de vencedor, empate e carta de dobro.
- O guia explica como o ranking total e composto.
- O guia possui estados de carregamento, erro, usuario sem apostas, usuario no nivel maximo e total de jogos igual a zero.
- A linguagem evita nomes internos do backend e usa termos amigaveis para o participante.

## Observacao Importante Sobre a Regra

No backend atual, `pontos_bonus` no ranking vem do `bonus_concedido` do modulo de bonus de participacao.

Esse bonus e calculado com base na quantidade de jogos distintos apostados pelo usuario dividida pelo total de jogos cadastrados.

Ele nao aumenta quando o usuario acerta um palpite. Acertos aumentam `pontos_apostas`.

Por isso, no frontend, sempre comunicar esse bonus como:

```text
Bonus de participacao
```

E nao como:

```text
Bonus por acerto
```
