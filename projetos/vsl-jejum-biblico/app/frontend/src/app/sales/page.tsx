'use client';

import React, { useState } from 'react';

export default function SalesPage() {
  const [showSticky, setShowSticky] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-gradient-to-r from-[#6B4E71] to-[#8B6B95] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="text-2xl font-bold tracking-tight">✨ Jejum Bíblico</div>
            <nav className="hidden md:flex gap-8 items-center">
              <button onClick={() => scrollToSection('about')} className="hover:opacity-80 transition">Sobre</button>
              <button onClick={() => scrollToSection('benefits')} className="hover:opacity-80 transition">Benefícios</button>
              <button onClick={() => scrollToSection('delivers')} className="hover:opacity-80 transition">Incluso</button>
              <button onClick={() => scrollToSection('pricing')} className="hover:opacity-80 transition">Preços</button>
              <button onClick={() => scrollToSection('testimonials')} className="hover:opacity-80 transition">Depoimentos</button>
              <button onClick={() => scrollToSection('final-cta')} className="bg-[#D4A574] text-[#6B4E71] px-6 py-2 rounded-full font-semibold hover:bg-[#E8B870] transition">
                Começar Agora
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-gradient-to-r from-[#6B4E71] to-[#8B6B95] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Transforme sua <span className="text-[#D4A574]">Espiritualidade</span>, Cure sua <span className="text-[#D4A574]">Alma</span>
              </h1>
              <p className="text-xl mb-8 opacity-95 leading-relaxed">
                Jejum Bíblico é a ponte entre espiritualidade cristã e ciência moderna. Aprenda técnicas de jejum baseadas em fundamentos bíblicos com suporte científico comprovado.
              </p>
              
              <div className="flex gap-4 mb-8 flex-wrap">
                <button onClick={() => scrollToSection('final-cta')} className="bg-[#D4A574] text-[#6B4E71] px-8 py-4 rounded-full font-bold hover:bg-[#E8B870] transition transform hover:scale-105">
                  Comece Sua Transformação
                </button>
                <button onClick={() => scrollToSection('testimonials')} className="bg-white text-[#6B4E71] px-8 py-4 rounded-full font-bold hover:opacity-90 transition">
                  Ver Resultados Reais
                </button>
              </div>

              <div className="flex gap-6 flex-wrap">
                <div className="flex gap-3 items-center">
                  <span className="text-2xl">🙏</span>
                  <div className="text-sm">Fundamentação Bíblica</div>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="text-2xl">🔬</span>
                  <div className="text-sm">Validado Cientificamente</div>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="text-2xl">👥</span>
                  <div className="text-sm">Comunidade Ativa</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="text-9xl">📖</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section id="about" className="py-20 bg-[#E8F0F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-[#1F2937] mb-4">O Problema que Você Enfrenta</h2>
            <p className="text-xl text-[#6B7280]">Você quer crescimento espiritual, mas não sabe por onde começar</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '😔', title: 'Desconexão Espiritual', desc: 'Sente-se distante de Deus, preso em rotinas vazias, sem sentido profundo na vida.' },
              { icon: '🌀', title: 'Sem Direção Prática', desc: 'Quer fazer jejum bíblico, mas não há guia claro, estruturado e personalizado.' },
              { icon: '🏜️', title: 'Isolamento na Jornada', desc: 'Falta comunidade de pessoas com os mesmos objetivos para apoiar e motivar você.' },
            ].map((problem, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition border-t-4 border-[#6B4E71]">
                <div className="text-4xl mb-4">{problem.icon}</div>
                <h3 className="text-xl font-bold text-[#6B4E71] mb-3">{problem.title}</h3>
                <p className="text-[#6B7280]">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="bg-[#E8F0F5] rounded-2xl p-8 w-full max-w-md h-96 flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">📈</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#6B4E71]">Transformação</div>
                  <div className="text-sm text-[#6B7280] mt-2">Dia 1 → Dia 7 → Cura</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-[#6B4E71] mb-6">A Solução Completa: Jejum Bíblico</h2>
              <p className="text-lg text-[#6B7280] mb-6 leading-relaxed">
                Criamos um sistema integrado que combina <strong>fundamentação bíblica profunda, validação científica moderna e comunidade acolhedora</strong> para sua transformação espiritual genuína.
              </p>

              <ul className="space-y-4">
                {[
                  'App IA Personalizado: Monta seu jejum conforme período, objetivos e condição física',
                  'Vídeo Aulas Estruturadas: Cada fase do jejum em aulas práticas e inspiradoras',
                  'Livro Digital Completo: "Jejum Bíblico: Fundamentos, Técnicas e Transformação Espiritual"',
                  'Comunidade de Apoio: Pessoas reais compartilhando experiences, desafios e vitórias',
                  'Suporte via WhatsApp: Orientação personalizada sempre que precisar',
                ].map((benefit, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-[#10B981] font-bold text-xl flex-shrink-0">✓</span>
                    <span className="text-[#1F2937]">{benefit}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-lg text-[#10B981] font-bold">
                ✓ Método Cristão + Científico = Resultados Duradouros
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section id="delivers" className="py-20 bg-gradient-to-r from-[#6B4E71] to-[#8B6B95] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Tudo o Que Você Recebe</h2>
            <p className="text-xl opacity-90">Um kit completo para sua transformação espiritual</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              { icon: '📱', title: 'App IA', desc: 'Personalize seu jejum em minutos' },
              { icon: '🎥', title: '36 Vídeo Aulas', desc: 'Estrutura pronta para cada dia' },
              { icon: '📚', title: 'Livro Digital', desc: 'Fundamentos + técnicas completas' },
              { icon: '👥', title: 'Comunidade', desc: 'Suporte e accountability 24/7' },
              { icon: '💬', title: 'Suporte WhatsApp', desc: 'Acesso direto a mentores' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center border border-white/20 hover:bg-white/20 transition rounded-lg">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm opacity-90">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transformation Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#6B4E71] mb-6">Sua Transformação Espiritual</h2>
              <p className="text-lg text-[#6B7280] mb-6 leading-relaxed">
                O jejum bíblico não é apenas restrição de alimentos. É uma jornada profunda de conexão com Deus, cura interior e transformação pessoal autêntica.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  { stage: 'Semana 1-2', result: 'Conexão Profunda com Deus e Clareza Mental' },
                  { stage: 'Semana 3-4', result: 'Cura Emocional e Libertação Espiritual' },
                  { stage: 'Semana 5-8', result: 'Renovação Interior e Transformação Permanente' },
                  { stage: 'Além', result: 'Comunidade Vitalícia e Suporte Contínuo' },
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-[#D4A574] font-bold flex-shrink-0">→</span>
                    <div>
                      <strong className="text-[#1F2937]">{item.stage}:</strong>
                      <span className="text-[#6B7280]"> {item.result}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="text-lg text-[#1F2937] leading-relaxed">
                Centenas de pessoas já vivenciaram <strong>paz interior profunda, libertação de vícios, cura de traumas espirituais e reconexão com sua fé</strong>. Você será o próximo.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="bg-[#E8F0F5] rounded-2xl p-8 w-full max-w-md h-96 flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">🌱</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#6B4E71]">Crescimento Espiritual</div>
                  <div className="text-sm text-[#6B7280] mt-4">De desespero a esperança restaurada</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-[#E8F0F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-[#1F2937] mb-4">Histórias de Transformação Real</h2>
            <p className="text-xl text-[#6B7280]">Pessoas como você já transformaram suas vidas</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                stars: 5, 
                text: 'Depois de 5 anos distante da minha fé, o Jejum Bíblico me reconectou com Deus de uma forma que nunca imaginei. Agora tenho paz interior genuína.',
                name: 'Marina Costa',
                role: 'Gerente de Projetos, SP'
              },
              { 
                stars: 5, 
                text: 'O app personalizado tornou tudo fácil. A comunidade me motivou nos dias difíceis. Sinto-me um homem novo, com propósito claro na vida.',
                name: 'Roberto Campos',
                role: 'Empresário, RJ'
              },
              { 
                stars: 5, 
                text: 'Não é apenas um programa. É uma jornada espiritual genuína. Curou meus traumas e me conectou com a vontade de Deus para minha vida.',
                name: 'Angela Ferreira',
                role: 'Professora, MG'
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="text-[#FBC02D] mb-3">{'⭐'.repeat(testimonial.stars)}</div>
                <p className="text-[#6B7280] mb-6 italic leading-relaxed">{testimonial.text}</p>
                <div className="flex gap-3 items-center pt-6 border-t">
                  <div className="w-12 h-12 bg-[#6B4E71] text-white rounded-full flex items-center justify-center font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1F2937]">{testimonial.name}</h4>
                    <p className="text-sm text-[#6B7280]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-[#1F2937] mb-4">Investimento na Sua Transformação</h2>
            <p className="text-xl text-[#6B7280]">Uma única vez, benefícios para a vida toda</p>
          </div>

          <div className="bg-gradient-to-r from-[#6B4E71] to-[#8B6B95] text-white rounded-2xl shadow-2xl p-12">
            <div className="text-center mb-8">
              <div className="text-[#D4A574] mb-3">Acesso Completo e Vitalício</div>
              <div className="text-6xl font-bold mb-3">R$ 297</div>
              <div className="text-xl opacity-90 mb-6">Invista uma única vez em sua transformação espiritual.<br/>Acesso vitalício a todas as atualizações futuras.</div>
              <div className="bg-[#D4A574] text-[#6B4E71] px-6 py-3 rounded-full font-bold text-lg inline-block mb-8">
                🎁 PROMOÇÃO INAUGURAL: R$ 197 (33% de desconto)
              </div>
            </div>

            <ul className="space-y-3 mb-12">
              {[
                'App IA Personalizado',
                '36 Vídeo Aulas Completas',
                'Livro Digital + Bônus',
                'Comunidade Exclusiva',
                'Suporte via WhatsApp',
                'Atualizações Gratuitas para Sempre',
                'Garantia 30 Dias ou Seu Dinheiro de Volta',
              ].map((feature, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-[#D4A574] font-bold">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button onClick={() => scrollToSection('final-cta')} className="w-full bg-[#D4A574] text-[#6B4E71] py-4 rounded-lg font-bold text-lg hover:bg-[#E8B870] transition">
              Começar Agora por R$ 197
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="final-cta" className="py-20 bg-gradient-to-r from-[#6B4E71] to-[#8B6B95] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold mb-6">Está Pronto para Transformar Sua Vida?</h2>
          <p className="text-xl opacity-95 mb-12 leading-relaxed">
            A jornada para cura espiritual e transformação pessoal genuína começa agora. Não deixe passar esta oportunidade de reconectar-se com Deus e encontrar paz interior profunda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button onClick={() => scrollToSection('pricing')} className="bg-[#D4A574] text-[#6B4E71] px-8 py-4 rounded-full font-bold hover:bg-[#E8B870] transition transform hover:scale-105">
              Quero Começar por R$ 197
            </button>
            <button onClick={() => scrollToSection('testimonials')} className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition">
              Ver Mais Histórias de Sucesso
            </button>
          </div>

          <p className="text-sm opacity-85">
            ✓ Garantia 100%: Se não ficar satisfeito em 30 dias, devolvemos seu dinheiro. Sem perguntas.
          </p>
        </div>
      </section>

      {/* Sticky Bar */}
      {showSticky && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#10B981] text-white shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <p className="font-bold">⏳ PROMOÇÃO ESPECIAL ENCERRA EM BREVE</p>
                <p className="text-sm opacity-90">De R$ 297 por R$ 197 (apenas hoje)</p>
              </div>
              <button onClick={() => scrollToSection('pricing')} className="bg-white text-[#10B981] px-6 py-2 rounded-full font-bold hover:opacity-90 transition">
                GARANTIR AGORA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#6B4E71] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-2">✨ Jejum Bíblico</h3>
              <p className="opacity-80 text-sm">Transformação Espiritual Genuína | Espiritualidade Cristã + Ciência Moderna</p>
            </div>
            <div></div>
            <div></div>
          </div>

          <div className="flex justify-center gap-8 mb-8 flex-wrap">
            <button onClick={() => scrollToSection('about')} className="hover:opacity-80 transition">Sobre</button>
            <button onClick={() => scrollToSection('benefits')} className="hover:opacity-80 transition">Benefícios</button>
            <button onClick={() => scrollToSection('delivers')} className="hover:opacity-80 transition">O Que Recebe</button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:opacity-80 transition">Depoimentos</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:opacity-80 transition">Preços</button>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-sm opacity-80">
            <p>© 2024 Jejum Bíblico. Todos os direitos reservados. | Desenvolvido com ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
