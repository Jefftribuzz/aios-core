# 🚀 Vercel Deploy - Guia Passo-a-Passo

## Status Atual
✅ Vercel CLI instalado (v50.19.1)  
✅ Projeto Next.js pronto  
⏳ Aguardando autenticação

---

## Opção 1: Deploy via Web UI (MAIS FÁCIL) ⭐

### Passos:

1. **Acesse:** https://vercel.com/signup
2. **Escolha método de autenticação:**
   - GitHub (recomendado)
   - GitLab
   - Google
   - Email

3. **Conceda permissão ao repositório SynkraAI/aios-core**

4. **No dashboard Vercel:**
   - Clique em "Add New..." → "Project"
   - Selecione repositório `aios-core`
   - Configure:
     ```
     Framework: Next.js
     Root Directory: /projetos/vsl-jejum-biblico/app/frontend
     Build Command: npm run build
     Output Directory: .next
     ```

5. **Configure Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://api.jejumbiblico.com/api
   NEXT_PUBLIC_APP_NAME=Jejum Bíblico
   NEXT_PUBLIC_APP_DESCRIPTION=Transformação Espiritual Genuína
   ```

6. **Clique "Deploy"** 🎉

**Pronto! Sua página estará em produção em ~2-3 minutos**

---

## Opção 2: Deploy via CLI (Terminal)

### Passos:

```bash
# 1. Fazer login no Vercel
vercel login

# 2. Selecione: GitHub (ou seu provedor)
# 3. Autorize o acesso ao seu GitHub
# 4. Volta para o terminal

# 5. Deploy para produção
cd /workspaces/aios-core/projetos/vsl-jejum-biblico/app/frontend
vercel --prod

# 6. Responda as perguntas:
# - "Set up and deploy?" → yes
# - "Project name" → jejum-biblico-landing (ou seu nome)
# - "Framework" → Next.js ✔
# - "Root Directory" → ./ (atual)
# - "Build command" → npm run build ✔
# - "Output directory" → .next ✔
# - "Install dependencies" → yes

# 7. Aguarde o build (~3-5 minutos)
```

**Resultado:** URL em `https://seu-projeto.vercel.app` ✅

---

## 📊 Comparação das Opções

| Aspecto | Web UI | CLI |
|--------|-------|-----|
| Facilidade | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Tempo | 5 min | 3 min |
| Requer login? | Não | Sim |
| Automação | Máxima | Máxima |
| Recomendação | Para iniciantes | Para profissionais |

---

## 🎯 Próximos Passos Após Deploy

### 1. Configurar Domínio Customizado
```bash
vercel domains add jejumbiblico.com
# ou via dashboard Vercel
```

### 2. Criar alias de staging
```bash
vercel --prod --scope=seu-usuario
```

### 3. Ativar Analytics
- Dashboard Vercel → Settings → Analytics → Enable

### 4. Setup Webhooks (para CI/CD)
- Settings → Git → Deploy on Push ✓

### 5. Monitorar Performance
- Dashboard Vercel → Deployments
- Vercel Analytics Dashboard

---

## 🔗 Links Úteis

- **Vercel Dashboard:** https://vercel.com/dashboard
- **CLI Docs:** https://vercel.com/docs/cli
- **Next.js on Vercel:** https://nextjs.org/learn/deployment/vercel

---

## ✅ Checklist Pré-Deploy

- [x] Next.js configurado
- [x] Build local testado
- [x] Páginas criadas
- [x] Env vars configuradas
- [x] Vercel CLI instalado
- [ ] Fazer login no Vercel
- [ ] Conectar repositório GitHub
- [ ] Deploy para produção
- [ ] Testar URL em produção
- [ ] Configurar domínio customizado

---

## 🆘 Troubleshooting

### Problema: "Token is not valid"
```bash
# Solução:
vercel logout
vercel login
# Selecione seu método de autenticação preferido
```

### Problema: "Project not found"
```bash
# Solução: Verifique se está na pasta correta
cd /workspaces/aios-core/projetos/vsl-jejum-biblico/app/frontend
vercel --prod
```

### Problema: Build failure
```bash
# Solução: Teste o build localmente
npm install
npm run build
npm run lint
```

---

## 🎬 Quick Summary

**O que fazer AGORA:**

1. Acesse https://vercel.com/signup
2. Login com GitHub
3. Crie novo projeto
4. Selecione `aios-core` repository
5. Configure `/projetos/vsl-jejum-biblico/app/frontend`
6. Clique Deploy
7. **Aguarde 2-3 minutos** ✨
8. Receba URL da sua página em produção 🎉

**É só isso!**

---

**Sua página de vendas em produção em minutos! 🚀**
