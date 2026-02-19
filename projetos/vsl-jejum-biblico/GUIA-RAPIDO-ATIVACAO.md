# 🚀 GUIA RÁPIDO: Como Ativar Squad VSL Jejum Bíblico

**Este arquivo mostra como começar a trabalhar imediatamente com o squad já montado.**

---

## ⚡ Início Rápido (5 minutos)

### 1️⃣ Ver Estrutura Completa
```bash
# Ver todos os arquivos do projeto
ls -la /workspaces/aios-core/projetos/vsl-jejum-biblico/

# Ver configuração do squad
cat /workspaces/aios-core/squads/vsl-jejum-biblico.md

# Ver story formal
cat /workspaces/aios-core/docs/stories/active/story-vsl-jejum-biblico-copy.md
```

---

### 2️⃣ Ativar Squad no AIOS

**Como @po (Product Owner):**

```bash
@po *manage-squad vsl-jejum-biblico
```

**Isso vai:**
- ✅ Carregar definição do squad
- ✅ Mostrar membros atribuídos
- ✅ Exibir backlog detalhado
- ✅ Ativar comandos do squad

---

### 3️⃣ Atribuir Agentes à Story

**Como @po para iniciar story formal:**

```bash
@po *create-story "VSL Jejum Bíblico: Copy 20 Minutos"
# Ou atribuir diretamente à @ux-design-expert para kickoff
```

**Como @ux-design-expert para começar copy:**

```bash
@ux-design-expert *task "Revisar copy universal DRAFT"
# Ou
@ux-design-expert *task "Refinar estrutura copy + timing"
```

**Como @analyst para pesquisa:**

```bash
@analyst *task "Coletar depoimentos reais (Marina, João, Conceição)"
# Ou
@analyst *task "Validar análise de competidores"
```

---

### 4️⃣ Estrutura de Trabalho Recomendada

**SEMANA 1: Research & Validação**

```bash
# Fase 1: Pesquisa de Base
@analyst *task "Análise de Competidores VSL - Validação"
@architect *task "Validar USP diferenciador + timing narrativa"
@po *task "Aprovar personas e hooks segmentados"

# Checkpoint: @po aprova personas antes da copy
@po *review personas-segmentacao.md
```

**SEMANA 2: Copy Principal**

```bash
# Fase 2: Desenvolvimento
@ux-design-expert *task "Refinar copy universal (draft → v1.0)"
@ux-design-expert *task "Gravar primeiras 5 minutos (teste pacing)"
@architect *task "Validar gatilhos psicológicos integrados"

# Checkpoint: Aprovação de estrutura antes de continuar
@po *review vsl-copy-universal-draft.md
```

**SEMANA 3: Refinamento & Adaptações**

```bash
# Fase 3: Segmentação
@ux-design-expert *task "Criar 3 variações por persona"
  - vsl-copy-wellness-espiritualidade.md
  - vsl-copy-despertando-espiritual.md
  - vsl-copy-catolicos-retorno.md

@qa *task "QA Copy - Validar tone, gramática, timing"
```

**SEMANA 4: Production Ready**

```bash
# Fase 4: Finalização
@qa *task "QA Final - Aprovação para produção"
@ux-design-expert *task "Criar video script com anotações"
@po *task "Handoff para equipe de produção vídeo"
```

---

## 📁 Navegação de Arquivos

### **Arquivos Principais**

| Arquivo | Propósito | Dono | Status |
|---------|-----------|------|--------|
| **README.md** | Overview do projeto | @po | ✅ |
| **OVERVIEW-EXECUTIVO.md** | Resumo executivo completo | @po | ✅ |
| **squads/vsl-jejum-biblico.md** | Definição formal do squad | @po | ✅ |
| **docs/stories/active/story-vsl-jejum-biblico-copy.md** | Story AIOS com backlog | @po | ✅ |

### **Research & Análise**

| Arquivo | Propósito | Dono | Status |
|---------|-----------|------|--------|
| **research/analise-competidores-vsl.md** | 5-7 concorrentes analisados | @analyst | ✅ |
| **research/personas-segmentacao.md** | 3 personas ultra-detalhadas | @analyst | ✅ |
| **research/analise-usp-diferenciadores.md** | Validação de diferenciadores | @analyst | 📋 Próxima |

### **Copy Development**

| Arquivo | Propósito | Dono | Status |
|---------|-----------|------|--------|
| **copy/vsl-copy-universal-draft.md** | Copy 20 min (esboço v0.1) | @ux-design-expert | 📝 Refinando |
| **copy/vsl-copy-wellness-espiritualidade.md** | Variação para Marina | @ux-design-expert | 📋 Próxima |
| **copy/vsl-copy-despertando-espiritual.md** | Variação para João | @ux-design-expert | 📋 Próxima |
| **copy/vsl-copy-catolicos-retorno.md** | Variação para Conceição | @ux-design-expert | 📋 Próxima |
| **copy/vsl-script-producao.md** | Script com anotações técnicas | @ux-design-expert | 📋 Próxima |

---

## 🎯 Checkpoints de Aprovação

**Antes de prosseguir para próxima fase, obter aprovação de:**

### **Checkpoint 1: Personas & Research** ✅
```
Quem aprova: @po
O quê: Personas OK? Diferenciadores validados? Competidores mapeados?
Como: Revisar personas-segmentacao.md + analise-competidores-vsl.md
Bloqueador: Não prosseguir na copy sem personas validadas
```

### **Checkpoint 2: Copy Universal v1.0** 🟡
```
Quem aprova: @po, @architect
O quê: Hook trabalha? Problema é claro? Solução tangível? Timing 20 min?
Como: Revisar vsl-copy-universal-draft.md + testar leitura
Bloqueador: Não adaptar para personas sem copy universal pronta
```

### **Checkpoint 3: Variações por Persona** 📋
```
Quem aprova: @po, @ux-design-expert
O quê: 3 variações resonam com respectivos públicos?
Como: Testar Marina entende? João entende? Conceição entende?
Bloqueador: Não ir para QA sem adaptações aprovadas
```

### **Checkpoint 4: QA Copy** 📋
```
Quem aprova: @qa
O quê: Zero erros gramaticais? Tone consistente? Timing exato?
Como: Revisar contra checklist QA
Bloqueador: Não liberar para vídeo sem QA OK
```

---

## 💬 Comandos de Agentes (AIOS)

### **Comandos @po**
```bash
@po *manage-squad vsl-jejum-biblico
@po *create-story "VSL Jejum Bíblico: Copy 20 Minutos"
@po *review personas-segmentacao.md
@po *review vsl-copy-universal-draft.md
@po *close-story VSL-JB-1 (quando completo)
```

### **Comandos @ux-design-expert**
```bash
@ux-design-expert *task "Refinar copy universal"
@ux-design-expert *task "Adaptar para pessoa Marina"
@ux-design-expert *task "Adaptar para persona João"
@ux-design-expert *task "Adaptar para persona Conceição"
@ux-design-expert *task "Criar video script"
```

### **Comandos @analyst**
```bash
@analyst *task "Análise de Competidores VSL"
@analyst *task "Coletar depoimentos reais"
@analyst *task "Validar USP diferenciadores"
```

### **Comandos @architect**
```bash
@architect *task "Validar narrativa persuasiva"
@architect *task "Validar gatilhos psicológicos"
```

### **Comandos @qa**
```bash
@qa *task "QA Copy - Review completo"
@qa *task "Validar timing 20 minutos"
@qa *task "Aprovar para produção"
```

---

## 📊 Métricas & Validação Rápida

### **Timing Check (Quick)**
```bash
# Contar aproximadamente quantas palavras têm a copy
wc -w /workspaces/aios-core/projetos/vsl-jejum-biblico/copy/vsl-copy-universal-draft.md

# Regra de ouro: ~400-500 palavras = 2.5-3.5 min quando lido
# Para 20 min: ~3500-4500 palavras total

# Teste real: Ler em voz alta e cronometrar
```

### **USP Check (Quick)**
Buscar na copy quantas vezes aparecem:
```bash
grep -i "cristã\|científica\|comunidade\|cura espiritual" \
  /workspaces/aios-core/projetos/vsl-jejum-biblico/copy/vsl-copy-universal-draft.md

# Deve aparecer 5+x espalhadas ao longo da copy
```

### **Tone Check (Quick)**
```bash
# Buscar linguagem de autoridade + compaixão
grep -i "você\|nós\|entendo\|sabe\|verdade" \
  /workspaces/aios-core/projetos/vsl-jejum-biblico/copy/vsl-copy-universal-draft.md

# Deve ter equilíbrio entre autoridade ("verdade") e empatia ("entendo")
```

---

## 🎬 Próximas Fases (Pós-Copy)

Quando copy estiver pronta (✅ aprovada por @po, @architect, @qa):

### **Fase 5: Produção de Vídeo**
```bash
@po *create-story "Produção VSL Jejum Bíblico - Gravação & Edição"
# Atribuir a diretor/produtor de vídeo
```

### **Fase 6: Testes & Lançamento**
```bash
@po *create-story "Teste A/B & Lançamento VSL Jejum Bíblico"
# Testes de conversão, ajustes finais
```

---

## 🆘 Troubleshooting Rápido

**"Como revisar a copy draft atual?"**
```bash
cat /workspaces/aios-core/projetos/vsl-jejum-biblico/copy/vsl-copy-universal-draft.md
# Ler seção por seção, validar contre checklist
```

**"Como propor mudanças na copy?"**
```bash
# Opção 1: Editar direto no arquivo (se acesso)
# Opção 2: Criar comentário em PR/issue
# Opção 3: Messagem @ux-design-expert com sugestões
```

**"Preciso acessar as personas para referência?"**
```bash
cat /workspaces/aios-core/projetos/vsl-jejum-biblico/research/personas-segmentacao.md
# Buscar Marina (Wellness), João (Despertando), Conceição (Católicos)
```

**"Como saber o timing de cada seção?"**
```bash
cat /workspaces/aios-core/projetos/vsl-jejum-biblico/copy/vsl-copy-universal-draft.md \
  | grep -A 5 "^### ⏱️"

# Vai mostrar cada timing com sugestões de pacing
```

---

## 📞 Comunicação Squad (Recomendado)

**Canal Slack:** `#squad-vsl-jejum-biblico` (criar se não existente)

**Standup Diário (15 min):**
- 09:00 — O que fiz ontem?
- 09:05 — O que vou fazer hoje?
- 09:10 — Blockers / ajuda necesária?

**Reviews Semanais:**
- Sexta 15:00 — Show & tell do progresso
- Aprovação de checkpoints

**Escalação:**
- Bloqueador crítico? → @po
- Dúvida de tone/copy? → @ux-design-expert
- Dúvida de mercado? → @analyst

---

## ✅ Checklist de Ativação Final

- [ ] Squad @po viu/aprovó estrutura
- [ ] @ux-design-expert tem acesso a copy-universal-draft.md
- [ ] @analyst tem research completa
- [ ] @architect validou narrativa início
- [ ] @qa entende checklist de validação
- [ ] Canal Slack #squad-vsl-jejum-biblico criado
- [ ] Daily standup agendado
- [ ] Checkpoint 1 (Personas) agendado

---

**Guia Criado:** 18 de fevereiro de 2026  
**Status:** 🟢 Squad Pronto para Iniciar Trabalho  
**Próxima Ação:** @po ativa squad + @ux-design-expert inicia copy

