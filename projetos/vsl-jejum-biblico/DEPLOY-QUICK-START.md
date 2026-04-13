# 🚀 QUICK START DEPLOYMENT

Tudo está pronto para fazer deploy! Escolha sua opção:

## ⚡ 30 Segundos (Vercel Web UI)

```
1. Abra: https://vercel.com/new
2. Login com GitHub
3. Selecione: SynkraAI/aios-core
4. Configure:
   - Framework: Next.js
   - Root: projetos/vsl-jejum-biblico/app/frontend
5. Deploy!
```

URL ficará: `https://[seu-projeto].vercel.app`

---

## 🛠️ 2 Minutos (CLI)

### Frontend
```bash
cd projetos/vsl-jejum-biblico/app/frontend
npx vercel --prod
# Segue prompts, escolhe projeto, deploy!
```

### Backend
```bash
cd projetos/vsl-jejum-biblico/app/backend
# Via https://railway.app web UI:
# 1. New Project
# 2. Deploy from GitHub
# 3. Configure + Accept
```

---

## ✅ Verificar Deploy

```bash
# Frontend
curl https://jejum-biblico.vercel.app

# Backend  
curl https://jejum-biblico-api.railway.app/health

# Deve retornar: {"status":"ok"}
```

---

## 📚 Documentação Completa

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para:
- Setup detalhado
- Configuração de variáveis
- Monitoramento
- Troubleshooting

---

## 🎯 Próximas Pages

1. ✅ Frontend MVP completo
2. ✅ Backend MVP completo
3. ✅ Integração pronta
4. 🎯 Deploy (escolha acima)
5. 📊 Monitoramento
6. 🔄 Ci/CD (GitHub Actions)

---

**Pronto?** Comece pelo Vercel Web UI (mais fácil)!
