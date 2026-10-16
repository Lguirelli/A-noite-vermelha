# A Noite Vermelha — VTT Skeleton

Esqueleto de VTT web para a campanha **A Noite Vermelha**.

A arquitetura foi inspirada no projeto open-source SimpleVTT (MIT), mas este repositório é um esqueleto novo e reduzido, focado nas mecânicas específicas da campanha.

## O que já está preparado

- FastAPI
- SQLAlchemy
- PostgreSQL no Docker / SQLite em desenvolvimento local
- Sessão simples de usuário para prototipação
- Campanhas e membros
- Personagens
- Cenas/mapas
- Tokens e movimentação
- WebSocket por campanha
- Eventos privados por jogador
- Camadas de percepção sobrenatural
- Segredos/revelações com destinatários específicos
- Estrutura de front-end sem framework (HTML + CSS + JS)
- Docker Compose
- Teste de smoke

## Conceito de percepção

Cada personagem pode possuir uma `perception_mask`. Uma cena e seus elementos podem definir uma `visibility_mask`.

Exemplos:

- `mundane`: qualquer humano vê.
- `cursed`: apenas personagens marcados por maldição.
- `witness`: manifestações ligadas a Vilar / testemunhas.
- `otherworld`: fenômenos sobrenaturais amplos.

Isso permite que Turak veja apenas a versão mundana de uma cena enquanto Octávio, Damião ou Baltazar recebem elementos adicionais — ou o contrário, quando a maldição impede os demais de atravessar/interagir com algo comum.

## Rodando com Docker

```bash
cp .env.example .env
docker compose up --build
```

Acesse: http://localhost:8013

## Rodando localmente

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8013
```

Sem `DATABASE_URL`, o projeto usa SQLite em `./anoitevermelha.db`.

## Primeiras extensões recomendadas

1. autenticação real + convites;
2. upload de mapas e tokens;
3. canvas com zoom/grid/fog of war;
4. ficha completa dos quatro personagens;
5. painel exclusivo do Mestre;
6. sistema de rolagem e log;
7. iniciativa/combate;
8. handouts, pistas e diário;
9. persistência de revelações por sessão;
10. áudio/ambiente.

## Estrutura

```text
app/
  main.py                 # boot da aplicação
  config.py               # variáveis de ambiente
  database.py             # SQLAlchemy
  models.py               # entidades centrais
  schemas.py              # payloads da API
  dependencies.py         # usuário/campanha atual
  services/
    visibility.py         # regras de percepção
    websocket.py          # broadcast e mensagens privadas
  routes/
    campaigns.py
    characters.py
    scenes.py
    tokens.py
    secrets.py
    websocket.py
  templates/
    index.html
    tabletop.html
  static/
    css/app.css
    js/tabletop.js
```

## Referência e licença

O desenho arquitetural toma como referência o SimpleVTT de Matthew Kolakowski, distribuído sob licença MIT. Nenhuma parte substancial do código-fonte do SimpleVTT foi copiada neste esqueleto.

Veja `NOTICE.md`.
