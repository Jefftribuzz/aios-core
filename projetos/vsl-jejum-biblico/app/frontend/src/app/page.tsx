'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Input, ToastContainer, useToast } from '@/components';
import { Layout } from '@/components/Layout';
import { authAPI } from '@/api';
import { useAuthStore } from '@/stores';

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: showError, toasts } = useToast();
  const { setUser, setToken } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await authAPI.login(email, password);
      } else {
        response = await authAPI.register(email, password);
      }

      setUser(response.user);
      setToken(response.token);
      success(`Bem-vindo, ${response.user.email}!`);

      // Redirect to wizard
      setTimeout(() => {
        window.location.href = '/wizard';
      }, 1500);
    } catch (err: any) {
      showError(err.message || 'Erro ao autenticar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout header={false}>
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-4">
            Escolha Jejum
          </h1>
          <p className="text-xl md:text-2xl text-secondary font-semibold mb-2">
            Jejum Bíblico Personalizado
          </p>
          <p className="text-gray-600 max-w-lg">
            Gere planos de jejum customizados com orações, meditações e refeições leves
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mb-12">
          <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-2 font-semibold transition-colors ${
                isLogin ? 'text-primary border-b-2 border-primary' : 'text-gray-400'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-2 font-semibold transition-colors ${
                !isLogin ? 'text-primary border-b-2 border-primary' : 'text-gray-400'
              }`}
            >
              Cadastro
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            <Input
              type="password"
              label="Senha"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              size="lg"
            >
              {isLogin ? 'Entrar' : 'Cadastrar'} e Começar
            </Button>
          </form>

          {/* Mock signup info */}
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
            <strong>MVP:</strong> Use dados fictícios (ex: test@example.com / password123)
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-4xl w-full grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="text-4xl mb-4">🙏</div>
            <h3 className="font-bold text-lg mb-2">Orações Personalizadas</h3>
            <p className="text-sm text-gray-600">
              Orações adaptadas ao seu objetivo: cura, sabedoria, libertação ou dedicação
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">🧘</div>
            <h3 className="font-bold text-lg mb-2">Meditações Guiadas</h3>
            <p className="text-sm text-gray-600">
              Meditações progressivas que aumentam em intensidade ao longo dos dias
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">🥗</div>
            <h3 className="font-bold text-lg mb-2">Refeições Leves</h3>
            <p className="text-sm text-gray-600">
              Sugestões de caldos e bebidas que respeitam seu período de jejum
            </p>
          </div>
        </div>

        {/* Duration Options Preview */}
        <div className="max-w-4xl w-full mb-12">
          <h2 className="font-serif text-3xl font-bold text-center mb-8">Como Funciona</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { days: 3, desc: 'Rápido', time: '~1h diária' },
              { days: 7, desc: 'Semana', time: '~2h diária' },
              { days: 21, desc: 'Espiritual', time: '~3h diária' },
              { days: 40, desc: 'Bíblico', time: '~4h diária' },
            ].map((option) => (
              <div
                key={option.days}
                className="bg-white rounded-lg p-4 text-center border-2 border-gray-200"
              >
                <div className="text-2xl font-bold text-primary mb-2">{option.days}</div>
                <div className="font-semibold text-sm mb-1">{option.desc}</div>
                <div className="text-xs text-gray-500">{option.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="max-w-4xl w-full text-center mb-12">
          <p className="text-gray-600 mb-4">
            <strong>✨ Comunit​ário:</strong> Junte-se a centenas fazendo jejum bíblico com propósito
          </p>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </Layout>
  );
}
