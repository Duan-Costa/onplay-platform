# ONPLAY — Rádio, músicas e clipes

Plataforma ONPLAY construída com Next.js (App Router), React e TypeScript. Esta versão continua o projeto v9 existente e acrescenta rádios reais selecionáveis e clipes oficiais incorporados.

## Recursos desta versão

- Player de rádio ao vivo com controle de volume.
- Seletor de emissoras: KEXP e quatro mixes da Radio Paradise (Main, Rock, Mellow e World/Etc).
- Seleção editorial com 10 músicas, busca e favoritos.
- Clipes oficiais incorporados pelo YouTube e reproduzidos no player fixo ao selecionar músicas disponíveis.
- Busca na seleção musical e favoritos salvos no navegador.
- Botão de contato pelo WhatsApp e pedidos de música encaminhados ao número configurado.
- Interface responsiva para celular e computador.

## Rodar no VS Code

1. Instale o Node.js LTS (Node 22 é compatível).
2. Extraia o ZIP e abra a pasta do projeto no VS Code.
3. Abra **Terminal → Novo Terminal**.
4. Execute:

```bash
npm install
npm run dev
```

5. Acesse `http://localhost:3000` no navegador.

Para validar a compilação de produção:

```bash
npm run build
```

## Organização

- `app/page.tsx` — página principal, seleção de rádios, música e clipes.
- `app/globals.css` — identidade visual e estilos responsivos.
- `app/layout.tsx` — layout global e metadados.
- `app/api/now-playing/route.ts` — endpoint preparado para futura integração de metadados.
- `components/RadioPlayer.tsx` — player fixo da rádio e dos clipes, com controles de reprodução e volume.
- `components/NowPlaying.tsx` — mostra a estação selecionada.
- `components/Logo.tsx` — marca ONPLAY.
- `components/Visualizer.tsx` — visualizador gráfico decorativo; ainda não analisa o áudio real.
- `REFERENCIAS.md` — links oficiais dos streams e videoclipes.

## Limitações atuais

- A seção de músicas é uma **seleção editorial**, não um Top 10 real de reproduções. Músicas com clipe associado tocam pelo player incorporado do YouTube; para as demais, é aberta uma busca no YouTube.
- O nome da estação aparece no player. Ainda não exibimos automaticamente o título/artista que estão tocando em cada rádio; isso exige integrar os metadados específicos de cada emissora.
- Favoritos ficam salvos apenas no navegador atual.
- O contato e os pedidos pelo WhatsApp usam `NEXT_PUBLIC_ONPLAY_WHATSAPP` no `.env.local`, no formato internacional com DDI e somente números.
- Antes de monetizar ou promover publicamente, confirme as condições de uso dos streams, dos vídeos incorporados e as obrigações de licenciamento aplicáveis.

## Configuração opcional

Copie `.env.example` para `.env.local` se quiser configurar o WhatsApp. As rádios estão definidas em `app/page.tsx`, na lista `stations`. Para adicionar outra, use uma URL de stream publicada pela própria emissora e guarde a página oficial em `site`. A seleção musical editorial também fica nesse arquivo, na lista `songs`.
