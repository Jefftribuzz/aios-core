import React from 'react';
import { Card, CardHeader, CardBody } from '@/components';
import { Objective } from '@/types';

interface Step1Props {
  value: Objective;
  onChange: (objective: Objective) => void;
}

const objectives: { value: Objective; label: string; icon: string; description: string }[] = [
  {
    value: 'cura',
    label: 'Cura',
    icon: '🩹',
    description: 'Para restauração física, emocional e espiritual',
  },
  {
    value: 'sabedoria',
    label: 'Sabedoria',
    icon: '🧠',
    description: 'Para discernimento e orientação divina',
  },
  {
    value: 'libertacao',
    label: 'Libertação',
    icon: '✨',
    description: 'Para romper com padrões e hábitos',
  },
  {
    value: 'dedicacao',
    label: 'Dedicação',
    icon: '🙏',
    description: 'Para consagração e propósito',
  },
];

export const Step1Objetivo: React.FC<Step1Props> = ({ value, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl font-bold mb-2">Qual é seu objetivo?</h3>
        <p className="text-gray-600">
          Escolha o propósito que melhor ressoa com seu coração
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {objectives.map((obj) => (
          <Card
            key={obj.value}
            isSelected={value === obj.value}
            onClick={() => onChange(obj.value)}
            className="cursor-pointer"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{obj.icon}</div>
              <CardHeader className="text-center mb-2">{obj.label}</CardHeader>
              <CardBody className="text-center text-xs md:text-sm">
                {obj.description}
              </CardBody>
            </div>
          </Card>
        ))}
      </div>

      {value && (
        <div className="p-3 bg-primary bg-opacity-10 border-l-4 border-primary rounded">
          <p className="text-sm font-semibold text-primary">
            ✓ Objetivo selecionado: <strong>{objectives.find(o => o.value === value)?.label}</strong>
          </p>
        </div>
      )}
    </div>
  );
};
