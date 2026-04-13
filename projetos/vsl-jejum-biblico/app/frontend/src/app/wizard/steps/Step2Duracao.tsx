import React from 'react';
import { Card, CardHeader, CardBody } from '@/components';
import { Duration } from '@/types';

interface Step2Props {
  value: Duration;
  onChange: (duration: Duration) => void;
}

const durations: { value: Duration; label: string; icon: string; expectations: string[] }[] = [
  {
    value: 3,
    label: '3 Dias',
    icon: '⚡',
    expectations: ['Teste rápido', '~1h de dedicação', 'Ideal para iniciantes'],
  },
  {
    value: 7,
    label: '7 Dias',
    icon: '📖',
    expectations: ['Uma semana', '~2h de dedicação', 'Mais aprofundado'],
  },
  {
    value: 21,
    label: '21 Dias',
    icon: '🔥',
    expectations: ['Transformação real', '~3h de dedicação', 'Mudança de hábitos'],
  },
  {
    value: 40,
    label: '40 Dias',
    icon: '✨',
    expectations: ['Bíblico & profundo', '~4h de dedicação', 'Consagração completa'],
  },
];

export const Step2Duracao: React.FC<Step2Props> = ({ value, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl font-bold mb-2">Quantos dias de jejum?</h3>
        <p className="text-gray-600">
          Escolha a duração que melhor se adequa ao seu tempo e compromisso
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {durations.map((dur) => (
          <Card
            key={dur.value}
            isSelected={value === dur.value}
            onClick={() => onChange(dur.value)}
            className="cursor-pointer"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-3xl mb-1">{dur.icon}</div>
                  <CardHeader className="text-lg">{dur.label}</CardHeader>
                </div>
              </div>
              <CardBody className="text-xs space-y-1">
                {dur.expectations.map((exp, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{exp}</span>
                  </div>
                ))}
              </CardBody>
            </div>
          </Card>
        ))}
      </div>

      <div className="p-3 bg-primary bg-opacity-10 border-l-4 border-primary rounded">
        <p className="text-sm font-semibold text-primary">
          ✓ Duração selecionada: <strong>{value} dias</strong> ({(value * 2.5).toFixed(0)}h total)
        </p>
      </div>
    </div>
  );
};
