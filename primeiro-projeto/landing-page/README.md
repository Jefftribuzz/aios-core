# Landing Page - Scaffold

Este diretório contém um scaffold simples para a landing page do projeto.

Como usar

- Abra `index.html` em um navegador para visualizar localmente.
- Para deploy rápido, hospede no Netlify, Vercel ou GitHub Pages (diretório raiz). Exemplo de passo rápido com `gh-pages` ou Netlify.

Próximos passos recomendados

- Substituir conteúdo estático por componentes/SSG (Next.js, Astro, ou outro SSG leve)
- Implementar endpoint serverless para integração com Mailchimp/HubSpot
- Adicionar testes visuais e pipeline de CI/CD

Contato

- Squad: `squads/landing-page.md`

## Atualização: redesign e otimizações

Implementei um redesign otimizado focado em copy, performance mobile-first e acessibilidade.

- Branch sugerida: `feat/landing-redesign` (crie a branch a partir de `main` e faça push para abrir PR)
- Principais mudanças:
	- Copy ajustada: headline, subheadline, bullets e CTA mais diretos
	- Critical CSS inline e stylesheet carregado com `preload` para reduzir FCP
	- Formulário com feedback inline (status) e placeholder para integração serverless
	- Metatags básicas e Open Graph adicionados

Como pré-visualizar localmente:

```bash
# abra o arquivo localmente
xdg-open primeiro-projeto/landing-page/index.html

# ou sirva com um server simples (Python)
python3 -m http.server --directory primeiro-projeto/landing-page 8000
# abrir http://localhost:8000
```

Deploy/CI: o workflow já criado (`.github/workflows/deploy-landing-page.yml`) fará deploy automático se os Secrets estiverem configurados.

Se quiser, crio a branch `feat/landing-redesign` aqui e abro PR com checklist e resultados do Lighthouse.
