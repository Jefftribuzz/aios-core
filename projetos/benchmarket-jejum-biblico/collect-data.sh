#!/bin/bash

# Benchmarket Jejum Bíblico - Research Data Collection
# Script para coleta sistemática de dados do mercado

echo "=== 🔍 PESQUISA DE MERCADO: JEJUM BÍBLICO ===" 

# Criar arquivo de resultados
RESULTS_FILE="/workspaces/aios-core/projetos/benchmarket-jejum-biblico/01-raw-data.md"

cat > "$RESULTS_FILE" << 'EOF'
# Dados Brutos - Pesquisa de Mercado Jejum Bíblico

## Metodologia
- Data: 2026-02-18
- Plataforma primária: Hotmart, YouTube, Instagram, TikTok
- Palavras-chave: "jejum bíblico", "jejum espiritual", "desafio jejum"
- Mercado-alvo: Brasil

---

## BUSCA 1: Infoprodutos de Jejum Bíblico no Hotmart

### Estratégia de Busca
- Site: hotmart.com
- Keywords: "jejum bíblico", "jejum espiritual", "desafio jejum", "transformação espiritual"
- Esperado: Top products vendidos, preços, descrições

### Achados Iniciais (A pesquisar):
- [ ] Top 5 produtos mais vendidos
- [ ] Preço range
- [ ] Números de avaliações/vendas
- [ ] Criadores principais

---

## BUSCA 2: Influenciadores no YouTube

### Canais Identificados para Análise:
**Jejum Bíblico & Espiritual no YouTube**

1. **Jejum Bíblico / Fé e Transformação**
   - Buscar por: "jejum bíblico completo", "40 dias de jejum bíblico"
   - Tipo: Tutoriais, testimony, educação espiritual
   - Alcance estimado: Dezenas a centenas de mil subscribers

2. **Comunidades de Coaches Espirituais**
   - Buscar por: "coach espiritual", "mentoría bíblica", "vida espiritual"
   - Tipo: Lives, mentorias, testimonies
   - Volume de conteúdo: Alto (diário/semanal)

---

## BUSCA 3: Instagram e TikTok

### Hashtags para Análise:
- #jejumbiblico
- #jejumespiritual
- #desafiojejum
- #transformacaoespiritual
- #vidasaudavel
- #espiritualidade
- #coachespiritual

### Perfis a Mapear:
- Coaches de jejum/espiritualidade
- Comunidades de fé
- Influenciadores wellness + espérito

---

## BUSCA 4: Análise de Copy & Narrativa

### Headlines Esperadas:
- "Jejum que Transforma" 
- "Restauração Espiritual em 40 Dias"
- "Do Físico ao Espiritual"
- "Conexão Profunda com Deus"

### Gatilhos Psicológicos Esperados:
- Transformação espiritual
- Revelação/Unlock divino
- Comunidade de fé
- Resultados rápidos (40 dias, 21 dias)
- Testemunho de vida

---

## BUSCA 5: Preço e Modelos

### Faixa de Preço Esperada:
- Cursos básicos: R$ 97 - R$ 297
- Cursos intermediários: R$ 297 - R$ 797
- Programas completos: R$ 797 - R$ 2.000+
- Mastermind/mentoría: R$ 1.500 - R$ 5.000+

### Modelos de Monetização:
- One-shot (sem acesso recorrente)
- Payment plans (3-12x)
- Subscriptions/comunidades
- Upsells (complementos, mentoria)

---

## BUSCA 6: Entregáveis Típicos

### Tipos de Conteúdo:
- [ ] Videocursos (módulos)
- [ ] PDFs/E-books
- [ ] Áudios/Meditações
- [ ] Comunidade privada (grupo, Discord)
- [ ] Lives ao vivo
- [ ] Mentoria pessoal

### Estrutura Típica:
- Fase 1: Desintoxicação digital/mental
- Fase 2: Preparo espiritual
- Fase 3: Jejum ativo (prática)
- Fase 4: Integração/Ressurreição

---

## ANOTAÇÕES PARA PESQUISA PROFUNDA

### Perguntas Chave:
1. Quem são os 5-10 maiores vendedores deste nicho?
2. Qual é a faixa etária e perfil do público?
3. Qual a sazonalidade? (Quaresma = pico?)
4. Quais são as objections mais comuns?
5. Qual é o ticket médio?
6. Existe diferença entre público católico vs evangélico vs genérico?

### Temas Recorrentes em Análise:
- Transformação pessoal + espiritual
- Comunidade e suporte
- Tempo limitado ("40 dias")
- Resultados visíveis
- Autoridade religiosa/espiritual

---

*Status: 🔄 Dados iniciais estruturados, aguardando coleta*
EOF

echo "✅ Arquivo de dados criado: $RESULTS_FILE"

# Próximos passos
echo ""
echo "=== 📝 PRÓXIMOS PASSOS ===" 
echo "1. Pesquisar top produtos no hotmart.com"
echo "2. Coletar links de sales pages"
echo "3. Analisar YouTube channels sobre jejum"
echo "4. Mapear influenciadores no Instagram/TikTok"
echo "5. Extrair copies e narrativas"
echo "6. Documentar preços e modelos"
echo "7. Consolidar insights"
