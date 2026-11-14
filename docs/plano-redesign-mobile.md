# Plano — redesign mobile-first

Cada item cita o problema da [auditoria](auditoria-mobile.md) que resolve (P1…P11).

## Ordem final da página (leitura mobile)

1. **Hero:** o que trata, para quem, onde, com um único CTA. Foto estática.
2. **CTA persistente:** barra inferior que só aparece depois que o CTA do hero sai da tela.
3. **Especialidades:** cards “Como podemos ajudar você?”, a lista completa de serviços e a
   faixa do atendimento domiciliar.
4. **Prova social:** números que já existem (desde 2023, 5 fisioterapeutas com CREFITO,
   4 áreas, todas as idades) e a galeria “Nossa estrutura” com as 6 fotos do antigo
   carrossel. Depoimentos e convênios: TODO, porque não existem no site.
5. **Equipe:** cards compactos com foto, nome, registro, especialidades e botão.
6. **Como funciona:** os 3 passos, com CTA.
7. **Como chegar:** cidade, mapa carregado só no clique, link “Abrir no Google Maps”.
   Endereço, horários e estacionamento ficam como TODO.
8. **FAQ:** acordeão com `<details>`, sem JS.
9. **Rodapé:** contato, WhatsApp, Instagram e dados da clínica.

## Ordem das mudanças (um commit por passo)

| # | Commit | Arquivos | Resolve |
|---|---|---|---|
| 1 | `docs:` auditoria e plano | `docs/*` | — |
| 2 | `perf:` WebP das imagens, favicon e ícones gerados a partir do logo | `img/*.webp`, `img/favicon-*.png`, `img/apple-touch-icon.png` | P6, P9 |
| 3 | `perf:` fontes self-hosted (Inter e Sora variáveis, só o subset latin), com `preload` | `fonts/*.woff2`, `css/style.css`, `index.html` | P10 |
| 4 | `fix:` links `wa.me` reais no HTML. O JS deixa de ser necessário para converter | `index.html`, `js/script.js` | P1 |
| 5 | `feat:` reestruturação da página na nova ordem, hero estático, galeria, equipe compacta, como chegar, FAQ, rodapé | `index.html`, `css/style.css`, `js/script.js` | P2–P5, P7 |
| 6 | `refactor:` CSS reescrito mobile-first (base para 320px, só `min-width`), `clamp()`, alvos ≥ 44px | `css/style.css` | P8, P11 |
| 7 | `feat:` SEO local: canonical, OpenGraph, JSON-LD `MedicalBusiness` + `Physiotherapist`, favicon | `index.html` | P9 |
| 8 | `perf:` cache longo para `img/` e `fonts/` | `vercel.json` | P6, P10 |

Os passos 5 e 6 podem acabar no mesmo commit se o HTML novo depender do CSS novo para não
quebrar no meio do caminho. Cada commit deixa o site funcional.

## O que muda em cada arquivo

### `index.html`
- `<head>`: remove o Google Fonts; `preload` das 2 fontes e da foto do hero; `canonical`,
  OpenGraph e Twitter card; JSON-LD; favicon e `theme-color`.
- **Header:** logo + nome sem quebra de linha. No mobile, um menu `<details>` (sem JS)
  com Tratamentos, Equipe, Como chegar e Dúvidas. O botão “Agendar” do header aparece
  só ≥ 760px. No mobile a barra fixa cumpre esse papel (P3).
- **Hero:** uma `<img>` WebP com `fetchpriority="high"`, `width`/`height` e `decoding`.
  H1, lead e eyebrow mantêm o texto atual. Um único CTA primário; “Ver tratamentos” vira
  link secundário discreto. Os chips saem do hero (“Desde 2023” e “Atendimento
  domiciliar” já reaparecem na prova social e nos serviços) e assim o hero cabe em
  375×812 sem rolagem.
- **Todos os CTAs:** `href="https://wa.me/5587998027603?text=…"` escrito no HTML, com
  `target="_blank" rel="noopener"`. Mensagens pré-preenchidas idênticas às atuais.
- **Seções novas:** `#estrutura` (galeria), `#local` (como chegar), `#duvidas` (FAQ).
  Os IDs atuais `#ajuda`, `#equipe`, `#local`, `#como` e `#servicos` são mantidos, para
  que links já compartilhados continuem funcionando.
- **Equipe:** mesmo conteúdo. A lista vertical vira uma linha de tags. Foto WebP com
  `loading="lazy"` e `width`/`height`.
- **Rodapé:** telefone, WhatsApp, Instagram, cidade, “Desde 2023”.

### `css/style.css`
Reescrito, mantendo as mesmas variáveis de cor (`--bg`, `--cy`, `--gold`…), as mesmas
famílias e o mesmo raio dos cards e botões. Muda a estrutura, não a identidade.
- Base para 320px; `@media (min-width: …)` apenas para cima.
- `clamp()` em corpo (16→17px), h1, h2 e espaçamentos de seção.
- `.btn` com `min-height: 48px`; links de texto com área de toque ≥ 44px.
- Galeria: `scroll-snap` horizontal no mobile, grid 3×2 no desktop.
- Barra fixa: `env(safe-area-inset-bottom)`, `padding-bottom` reservado no `body` para
  não cobrir o rodapé, e escondida (`translateY`) enquanto o hero está visível.
- `prefers-reduced-motion`: desliga transições, hover com deslocamento e `scroll-behavior`.
- `:focus-visible` mantido (dourado).

### `js/script.js`
Fica opcional (progressive enhancement), cerca de 30 linhas:
- `IntersectionObserver` que mostra a barra fixa quando o CTA do hero sai da tela. Sem
  JS, a barra fica sempre visível, o que é um fallback aceitável.
- Mapa: troca o botão “Carregar mapa” pelo `<iframe>` só no clique.
- Sai o carrossel (`setInterval`). Sai a montagem de links (ela vai para o HTML).

### Arquivos novos
- `fonts/inter-latin.woff2`, `fonts/sora-latin.woff2`: fontes variáveis com subset latin
  (cobre PT-BR), licença OFL.
- `img/*.webp`: gerados com `sharp` a partir dos JPEGs, qualidade 72–78. A ferramenta
  rodou fora do repositório e não é dependência do projeto. Os JPEGs originais ficam no
  repositório: o `og:image` usa JPEG, que todo crawler entende.
- `vercel.json`: só headers de cache.

## O que explicitamente NÃO muda
- Cores, logo, fontes (Sora + Inter), tom de voz, texto do H1, do lead e das descrições
  dos cards.
- Número de WhatsApp e todas as mensagens pré-preenchidas.
- Nomes, registros e especialidades da equipe.
- URL da página (`/`) e as âncoras existentes. Nenhuma rota muda, então não há redirect.
- Nenhum conteúdo inventado. Tudo o que falta vira `TODO:` em comentário HTML e, onde o
  paciente veria uma lacuna, o texto remete ao WhatsApp.

## Bibliotecas
Nenhuma biblioteca de runtime. O acordeão usa `<details>`, o menu mobile usa `<details>`,
a galeria usa `scroll-snap` e a barra usa `IntersectionObserver` nativo. As ferramentas
de verificação (Lighthouse, Playwright, html-validate, sharp) rodaram fora do repositório
e não entram no `package.json`, porque o projeto não tem um.

## Verificação antes do push
- `html-validate` no `index.html` e `eslint` no `js/script.js` (o projeto não tem build).
- Playwright em 320, 375, 414, 768 e 1280: sem scroll horizontal, hero sem rolagem em
  375×812, alvos ≥ 44px, barra só aparece depois do hero, mapa só carrega no clique,
  zero requisição ao Google Maps no carregamento.
- Lighthouse mobile com a mesma configuração da auditoria, comparando com o baseline.
