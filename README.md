# A Noite Vermelha — campanha HTML

Abra **index.html** para jogar. A raiz contém o jogo, sem instalação, API, CDN ou build. Os textos e estilos funcionam offline. Ative JavaScript. O botão de início abre o bar; nas visitas seguintes a mesma página retoma a cena salva.

## Jogar em mesa

O protótipo implementa a história completa do bar aos quatro desfechos. O ritmo de 4–6 horas é uma estimativa para interpretação em grupo, discussão e resolução de confrontos; clicar e ler sozinho é mais rápido. O painel do Mestre inclui orientação de ritmo. Os dados são ferramentas de apoio e não condicionam a progressão.

Use o caderno para rever apenas descobertas conhecidas. Nomes, grupo e fios de investigação se atualizam pelas escolhas. Anotações, ferimentos, pistas, estados narrativos e consequências são persistentes. O painel do Mestre é protegido contra abertura acidental, não por autenticação: este é um jogo local compartilhado, não um servidor multiplayer com segredos seguros.

## Salvar

A campanha usa `anv_campaign_v3` no localStorage. Use “Salvar / opções → Baixar salvamento” para fazer uma cópia JSON. A importação pede confirmação antes de substituir a sessão. Arquivos incompatíveis são rejeitados. Se o navegador bloquear o armazenamento ou houver dados inválidos, o aviso pede exportação; o jogo pode continuar na aba.

O arquivo local deve ser reaberto no mesmo navegador e caminho. Para compartilhar estado entre páginas de modo consistente, sirva esta pasta com `python -m http.server 8000` e abra http://localhost:8000. O deploy usa o mesmo armazenamento por origem. Mudar de domínio ou aparelho exige exportar/importar. Não há sincronização pela internet.

## Deploy estático

Publique **o conteúdo desta pasta**: index.html deve estar na raiz publicada. Na Vercel selecione framework “Other”, sem comando de build, e diretório de saída `.`. As rotas `/`, `/play` e `/game` apontam para o jogo; `/gm` aponta para a direção narrativa e `/table` para a mesa visual de apoio. Confira se configurações antigas do projeto hospedado não forçam um backend Python ou outra pasta de saída. Outros hosts estáticos podem abrir index.html diretamente, sem usar as rotas alternativas.

Este pacote remove do deploy os arquivos do backend antigo, a base de dados e instruções de inicialização do FastAPI, evitando detecção equivocada de aplicação/documentação. O mapa e os dados do protótipo anterior foram preservados em `mesa/`, com links locais corrigidos. Essa mesa é um apoio independente que conserva a chave antiga `anv_state_v2`; ela não atualiza a campanha nova. Um salvamento antigo não é interpretado como se o bar e os novos acontecimentos já tivessem ocorrido.

## Conteúdo e regras

Os 14 plot points fixos são completados por cenas obrigatórias. Os 14 móveis podem expirar sem bloquear o percurso. A morte do avô que conclui o pacto acontece explicitamente sobre a marca ativa de cobrança; uma morte comum não é tratada como fechamento automático. O caminho violento encontra o livro sem a explicação da família; registros posteriores permitem descobrir sua função. Pistas pessoais dependem de ações e não aparecem automaticamente na cela.

Os nomes Bento, Rosa, Joaquim e Inês, a data concreta e os documentos são detalhes acrescentados para tornar o briefing jogável. Os finais concretizam a decisão final indicada pelo briefing e não prometem uma solução sem custos. O material de referência sincronizado não foi alterado.

## Verificação

`node --test tests/story.test.cjs` verifica progressão, perdas, revelações, persistência e caminhos dos desfechos. O relatório de entrega descreve também a navegação real em navegador. Os arquivos de teste não são necessários para jogar.
