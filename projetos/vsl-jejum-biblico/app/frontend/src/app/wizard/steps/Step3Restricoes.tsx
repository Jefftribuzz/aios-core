import React from 'react';

interface Step3Props {
  value: string[];
  onChange: (restrictions: string[]) => void;
}

const restrictionOptions = [
  { id: 'vegetarian', label: 'Vegetariano', icon: '🥬' },
  { id: 'vegan', label: 'Vegano', icon: '🌾' },
  { id: 'gluten-free', label: 'Sem Glúten', icon: '🍞' },
  { id: 'dairy-free', label: 'Sem Laticínios', icon: '🥛' },
  { id: 'nut-free', label: 'Sem Frutos Secos', icon: '🥜' },
  { id: 'low-sodium', label: 'Baixo Sódio', icon: '🧂' },
];

export const Step3Restricoes: React.FC<Step3Props> = ({ value, onChange }) => {
  const toggleRestriction = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((r) => r !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl font-bold mb-2">Alguma restrição alimentar?</h3>
        <p className="text-gray-600">
          Selecione as restrições que se aplicam a você (opcional)
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {restrictionOptions.map((option) => (
          <label
            key={option.id}
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary hover:bg-primary hover:bg-opacity-5 transition-colors"
          >
            <input
              type="checkbox"
              checked={value.includes(option.id)}
              onChange={() => toggleRestriction(option.id)}
              className="w-5 h-5 text-primary rounded focus:ring-0"
            />
            <span className="ml-3 text-lg">{option.icon}</span>
            <span className="ml-3 font-semibold">{option.label}</span>
          </label>
        ))}
      </div>

      {value.length > 0 && (
        <div className="p-3 bg-primary bg-opacity-10 border-l-4 border-primary rounded">
          <p className="text-sm font-semibold text-primary">
            ✓ Restrições selecionadas: <strong>{value.length}</strong>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {restrictionOptions
              .filter((o) => value.includes(o.id))
              .map((o) => o.label)
              .join(', ')}
          </p>
        </div>
      )}

      {value.length === 0 && (
        <div className="p-3 bg-blue-100 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-blue-900">
            💡 Sem restrições - você terá mais opções de refeições!
          </p>
        </div>
      )}
    </div>
  );
};
