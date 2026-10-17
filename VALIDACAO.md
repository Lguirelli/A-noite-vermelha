# Validação da entrega

O fluxo testado foi: abrir a raiz → iniciar → escolher ações → atualizar estado e caderno → salvar → recarregar → concluir a campanha.

## Motor narrativo

13 testes aprovados, executados com `node --test tests/story.test.cjs`:

- Destinos de navegação existentes e IDs de ações únicos.
- Fazenda pacífica com avô vivo, pacto ativo e explicação do livro.
- Fazenda violenta com cobrança concluída, perda de contexto e progressão até o fim.
- Interrupção da violência para salvar o avô.
- Reações na cela condicionadas a ações, sem repetição de recompensa.
- Fixos não perdíveis; móveis perdidos não se tornam concluídos.
- Diário sem revelações antecipadas sobre Vilar e Baltazar.
- Todas as seis ordens da investigação dos três nomes.
- Quatro finais por ambas as abordagens da fazenda.
- Conhecimento pessoal sem regressão ao sair da cena.
- Persistência de escolhas, notas e perdas.
- Falha de armazenamento tratada e salvamentos incompatíveis rejeitados.
- 500 percursos variados concluídos, sem becos sem saída.

## Navegador real

Verificado em Chromium, em servidor estático local e via arquivo local:

- Raiz abre a interface do jogo, com botão de início.
- Caminhos completos pacífico e violento; todos os quatro finais.
- Ações de percepção da cela, pistas, caderno e notas.
- Recarregar mantém a cena e as anotações.
- Exportar, reiniciar com confirmação e importar restaura o estado.
- Painel do Mestre exige abertura deliberada antes dos spoilers.
- Mapa anterior e rolagem d20 permanecem utilizáveis.
- game.html redireciona à interface principal.
- Abertura offline por index.html e recuperação do progresso após recarga.
- Aviso visível e jogo funcional quando o armazenamento é bloqueado.
- Inspeção visual em 1440 px e 390 px, sem transbordamento horizontal.
- Nenhum erro JavaScript ou recurso HTTP malsucedido no percurso testado.

## Limites da verificação

Não houve publicação em hospedagem remota. A configuração estática e os destinos foram conferidos; ajustes antigos de um projeto de hospedagem existente podem precisar ser removidos conforme o README. Não foram testados todos os navegadores. O tempo de 4–6 horas é um plano de condução em mesa, não uma medição de sessão humana.
