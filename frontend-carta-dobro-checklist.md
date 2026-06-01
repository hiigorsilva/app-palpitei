# Checklist Frontend - Carta Dobro de Pontos

Use este checklist no projeto frontend para alinhar a aplicacao com as alteracoes feitas na API sobre `carta_dobro_pontos` e `usou_carta_dobro_pontos`.

## Types e Interfaces

- [ ] Atualizar a interface/type de `Game` para incluir:

```ts
usou_carta_dobro_pontos: boolean
```

- [ ] Conferir se a interface/type de `Bet` possui:

```ts
usou_carta_dobro_pontos: boolean
carta_dobro_pontos?: number
```

- [ ] Atualizar a interface/type do historico de cartas do usuario para incluir:

```ts
usou_carta_dobro_pontos: boolean
```

Exemplo:

```ts
type CartaHistorico = {
  gameId: string
  team_a: string
  team_b: string
  data_hora: string
  palpite: 'A' | 'B' | 'EMPATE'
  usou_carta_dobro_pontos: boolean
  acertou: boolean
  pontos: number
}
```

## Requests de Apostas

- [ ] Na criacao de aposta, enviar `usar_carta_dobro_pontos` no body:

```ts
await api.post(`/users/${userId}/games/${gameId}/bets`, {
  palpite,
  usar_carta_dobro_pontos: usarCartaDobroPontos,
})
```

- [ ] Na edicao de aposta, enviar `usar_carta_dobro_pontos` quando o usuario alterar o uso da carta:

```ts
await api.put(`/bets/${betId}/users/${userId}`, {
  palpite,
  usar_carta_dobro_pontos: usarCartaDobroPontos,
})
```

- [ ] Se o usuario alterar apenas o palpite e nao alterar a carta, pode omitir `usar_carta_dobro_pontos` no request de edicao.

## Estado do Usuario

- [ ] Apos criar ou editar uma aposta, atualizar o saldo local de `carta_dobro_pontos` usando o retorno da API.

Exemplo:

```ts
setUser(prev => ({
  ...prev,
  carta_dobro_pontos: bet.carta_dobro_pontos ?? prev.carta_dobro_pontos,
}))
```

- [ ] Se o frontend usa cache/query library, invalidar ou atualizar as queries relacionadas a:
  - usuario atual
  - listagem de jogos
  - apostas do usuario
  - historico de cartas

## Tela de Jogos

- [ ] Usar `game.has_palpite` para indicar que o usuario ja apostou no jogo.

- [ ] Usar `game.usou_carta_dobro_pontos` para indicar que a aposta daquele usuario naquele jogo usou carta dobro.

Exemplo:

```ts
if (game.usou_carta_dobro_pontos) {
  // mostrar badge, icone ou indicador de carta dobro usada
}
```

- [ ] Garantir que as chamadas de listagem/busca de jogos continuem enviando `userId`, pois `usou_carta_dobro_pontos` e `has_palpite` dependem do usuario.

## Controle de Uso da Carta

- [ ] Desabilitar a opcao de usar carta dobro quando o usuario nao tiver cartas disponiveis.

```ts
const canUseDoubleCard = user.carta_dobro_pontos > 0
```

- [ ] Permitir remover a carta de uma aposta existente mesmo se o saldo atual for `0`, pois remover devolve uma carta.

- [ ] Ao editar uma aposta que ja usou carta dobro, iniciar o estado do formulario com:

```ts
usarCartaDobroPontos = bet.usou_carta_dobro_pontos
```

## Tratamento de Erros

- [ ] Tratar o erro da API quando o usuario tentar usar carta sem saldo:

```txt
Voce nao possui cartas de dobro de pontos disponiveis.
```

- [ ] Exibir uma mensagem clara para o usuario e manter o estado visual sincronizado com o retorno da API.

## Pontos de Conferencia Manual

- [ ] Criar aposta sem carta nao altera `carta_dobro_pontos`.
- [ ] Criar aposta com carta reduz `carta_dobro_pontos` em `1`.
- [ ] Editar aposta de sem carta para com carta reduz `carta_dobro_pontos` em `1`.
- [ ] Editar aposta de com carta para sem carta aumenta `carta_dobro_pontos` em `1`.
- [ ] Editar apenas o palpite mantem o estado da carta.
- [ ] Usuario com `carta_dobro_pontos = 0` nao consegue ativar carta em nova aposta.
- [ ] Listagem de jogos mostra corretamente quando `usou_carta_dobro_pontos = true`.
- [ ] Historico de cartas lista apenas apostas com carta e retorna `usou_carta_dobro_pontos = true`.
