# Narrative Engine

## Estados

Cada plot point pode estar em `locked`, `available`, `active`, `completed` ou `lost`.

## Fixos

Plot points `fixed` não podem entrar em `lost`. Eles representam viradas, verdades ou nós necessários para manter a campanha coerente. O modo como os jogadores chegam até eles pode mudar.

## Móveis

Plot points `mobile` podem mudar de local e contexto. Quando `can_be_lost=true`, o Mestre pode marcá-los como `lost`. Esse estado é terminal durante o fluxo normal: a pista, encontro ou oportunidade foi perdida.

Perder um móvel não deve ser mascarado reapresentando exatamente a mesma informação em outro local. As consequências podem reaparecer, mas não a oportunidade original.

## Pré-requisitos

Um plot point bloqueado é liberado quando todos os códigos em `prerequisites` estiverem com status `completed`. `lost` não conta como conclusão.
