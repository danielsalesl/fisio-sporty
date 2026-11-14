# Auditoria mobile — Fisio Sporty

Data: 2026-11-14 · Versão auditada: `main` @ `2c10cbc` (a mesma servida em produção na Vercel).

## Como foi feita

- **Stack:** site estático puro. `index.html` (página única), `css/style.css` (82 linhas, CSS
  minificado à mão), `js/script.js` (17 linhas, sem dependências). Sem framework, sem build,
  sem CMS: todo o conteúdo está escrito direto no `index.html`. Deploy: Vercel servindo a
  raiz do repositório, sem `vercel.json`.
- **Navegação:** Chromium headless (Playwright) em 375×812, 414×896, 320×640 e 1280×800, com
  emulação de toque. O host `fisio-sporty.vercel.app` é bloqueado pela rede deste ambiente,
  então a auditoria rodou sobre o mesmo commit servido localmente (`http-server`). Por isso
  TTFB e compressão do servidor não refletem a Vercel.
- **Lighthouse 12 mobile** (throttling simulado, Moto G Power / 4G lento).

## Números iniciais

| Métrica | Valor |
|---|---|
| Performance / Acessibilidade / Boas práticas / SEO | 99 / 100 / 96 / 100 |
| LCP | 2,0 s (elemento: 1ª foto do carrossel do hero) |
| FCP | 1,5 s |
| CLS | 0 |
| TBT (proxy de INP em laboratório) | 0 ms |
| Peso total | 448 KiB, 22 requisições |
| Maior imagem | `carrossel-4-sala-de-atendimento…jpg`, 55 KiB (JPEG) |
| Imagens do carrossel baixadas no carregamento | 6 de 6 (~240 KiB), mesmo com `loading="lazy"` |
| CSS que bloqueia renderização | Google Fonts CSS + `style.css` (economia estimada de 850 ms) |
| Altura da página em 375px | 8.917 px (~11 telas) |
| Erro de console | `favicon.ico` 404 |
| Headings | 1 `h1`, `h2` por seção e `h3` nos cards (ordem correta) |
| Formulário | não existe (todo contato é por WhatsApp) |
| Alvos de toque < 44px (375px) | 8 botões “Agendar com…” (38px), link do Instagram (19px), logo (42px) |
| Scroll horizontal ≥ 320px | não há |

Na nota alta do Lighthouse não entram os problemas que mais custam conversão, porque são de
conteúdo e estrutura. Eles estão abaixo, em ordem de impacto.

## Problemas, por impacto na conversão

### P1. Os CTAs dependem de JavaScript para funcionar — `index.html` (todos os `[data-wa]`), `js/script.js`
Os 20 links de agendamento têm `href="#"`. O link `wa.me` só é montado pelo `script.js`.
Em conexão instável, se o JS demorar ou falhar, o paciente toca em “Agendar” e a página só
volta ao topo. É o único caminho de conversão do site.

### P2. Não há como chegar à clínica — seção `#local`, link “Localização” do `<nav>`
O menu promete “Localização”, mas a seção `#local` traz só “Atendemos em Pesqueira-PE” e
outro botão de WhatsApp. Faltam endereço, mapa, horário, estacionamento e acessibilidade.
Quem vem do Google com a intenção “fisioterapia perto de mim” sai sem resposta.
(O endereço e os horários **não existem no site atual**: viram TODO de conteúdo.)

### P3. Três CTAs iguais na primeira dobra, e a barra fixa cobre o hero — header `.btn.sm`, `.hero .btn.lg`, `.bar`
Em 375×812 aparecem juntos “Agendar avaliação” (header), “Agendar pelo WhatsApp” (hero) e
“Agendar avaliação pelo WhatsApp” (barra fixa). A barra cobre os chips do hero
(“Fisioterapia para toda a família” fica cortado). Isso dilui a hierarquia e ocupa ~140px
de uma tela já apertada.

### P4. Página longa demais antes da decisão: a equipe ocupa ~45% da rolagem — `.team` / `.card`
São 8 cards empilhados, cada um com foto de 140px e uma lista vertical de especialidades
(até 6 itens com borda tracejada). Em 375px a seção passa de 4.000px. O FAQ e a
localização, que respondem as objeções finais, simplesmente não existem.

### P5. Ordem das seções não segue a decisão do paciente — `index.html`
Hoje: Hero → números → tratamentos → como funciona → lista de serviços → domiciliar →
equipe → CTA. A prova social (números, estrutura) vem antes de o paciente saber se a
clínica trata o caso dele. As fotos da estrutura, que são prova real, ficam escondidas
atrás de um texto escuro no carrossel do hero.

### P6. Carrossel automático no hero: peso, movimento e LCP — `.car`, `js/script.js`
- As 6 fotos são baixadas logo no carregamento (todas ficam empilhadas na viewport, então
  `loading="lazy"` não tem efeito): ~240 KiB de JPEG, mais da metade do peso da página.
- A imagem de LCP não tem `fetchpriority="high"` nem `width`/`height`. Todas são JPEG.
- A foto troca a cada 3 s com zoom infinito e não há como pausar (WCAG 2.2.2). Em toda
  tela o texto passa sobre uma foto diferente, sempre coberta por um degradê de 88–96%.

### P7. Rodapé e dados da clínica — `<footer>`
O rodapé tem uma linha de texto. Não traz telefone, Instagram nem link de WhatsApp. O
telefone (87) 99802-7603 só aparece dentro de um botão no fim da página.

### P8. Alvos de toque pequenos — `.btn.sm`, `.cta .ig a`, `.br`
São os botões “Agendar com Dr(a). …” (38px de altura), o link do Instagram (19px de altura,
texto inline) e a logo do header (42px). No desktop, os links do `nav` têm 24px.

### P9. SEO local fraco — `<head>`
Não há `canonical`, OpenGraph (o compartilhamento no WhatsApp/Instagram sai sem imagem),
dados estruturados `MedicalBusiness`/`Physiotherapy` nem favicon (404 no console, Boas
práticas 96).

### P10. Fontes bloqueando renderização — `<head>`
O CSS do Google Fonts carrega sem `preconnect` e bloqueia a renderização (2 origens extras).
O `.ghost` pede Sora 600, peso que não é carregado, e o navegador o sintetiza.

### P11. Detalhes visuais e de legibilidade
- `.br span` (“Fisio Sporty”) quebra em duas linhas em 375px.
- O `path` do ícone do WhatsApp no hero tem números malformados (`4.700-4.200`,
  `1.100-1.500`…). O desenho funciona por acaso.
- Textos de apoio com 13–14,5px (`.cr`, `.card li`, `.chips li`, `.trust span`). O corpo
  é fixo em 16px, sem tipografia fluida.
- Animações de hover (`translateY`) ignoram `prefers-reduced-motion`. Só o carrossel
  respeita a preferência.
- Não há navegação no mobile: o `nav` some abaixo de 820px e nada o substitui.

## O que já está bom (manter)

- A mensagem do WhatsApp já vai pré-preenchida e contextual em cada card de tratamento.
  É o melhor ativo de conversão do site.
- Os cards “Como podemos ajudar você?” já são título + uma linha, no formato escaneável certo.
- Identidade visual: azul-marinho, ciano e dourado, com Sora e Inter. O contraste atual passa AA.
- Hierarquia de headings correta, `lang="pt-BR"`, `viewport-fit=cover` e safe-area na barra.
