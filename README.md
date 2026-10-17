# A Noite Vermelha — VTT

Protótipo web do RPG **A Noite Vermelha**.

## O que abre no deploy

Este repositório agora possui páginas HTML estáticas reais na raiz:

- `/` → `index.html` — entrada do jogo
- `/game.html` ou `/play` → mesa
- `/gm.html` ou `/gm` → direção narrativa do Mestre

O protótipo funciona sem backend: plot points, pistas e registro da sessão são salvos em `localStorage` no navegador. Isso elimina a dependência de FastAPI/Jinja para abrir a interface no deploy.

## Testar localmente

```bash
python -m http.server 8080
```

Abra `http://localhost:8080`.

## Vercel

Importe este diretório como projeto e faça deploy. O `vercel.json` força `/`, `/play`, `/table` e `/gm` para as páginas HTML correspondentes.

## Estrutura narrativa

- Plot points **fixos** não podem ser perdidos.
- Plot points **móveis** podem ser concluídos, ignorados ou perdidos definitivamente.
- O painel do Mestre controla a progressão sem expor a estrutura aos jogadores.

## Backend legado

A pasta `app/` contém a base FastAPI anterior e pode ser reutilizada quando o protótipo for conectado a um banco e multiplayer real. A interface atual não depende dela para funcionar.
