import React from 'react';
import { Input } from '@/components';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Step4Props {
  value: string;
  onChange: (date: string) => void;
}

export const Step4Data: React.FC<Step4Props> = ({ value, onChange }) => {
  const selectedDate = value ? new Date(value + 'T00:00:00') : new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = format(tomorrow, 'yyyy-MM-dd');
  const maxDate = format(addDays(new Date(), 365), 'yyyy-MM-dd');

  const formattedDate = selectedDate
    ? format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : '';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl font-bold mb-2">Quando você quer começar?</h3>
        <p className="text-gray-600">
          Escolha a data de início do seu jejum (mínimo amanhã)
        </p>
      </div>

      <div className="space-y-4">
        <Input
          type="date"
          label="Data de Início"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={minDate}
          max={maxDate}
          required
        />

        {formattedDate && (
          <div className="p-4 bg-primary bg-opacity-10 border-l-4 border-primary rounded">
            <p className="text-sm text-gray-600">Data selecionada:</p>
            <p className="font-serif text-xl font-bold text-primary capitalize">
              {formattedDate}
            </p>
          </div>
        )}

        {/* Quick Start Options */}
        <div className="space-y-3 pt-4">
          <p className="text-sm font-semibold text-gray-600">Desejos rápidos:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[0, 1, 3, 7].map((daysFromNow) => {
              const date = new Date();
              date.setDate(date.getDate() + daysFromNow);
              const dateStr = format(date, 'yyyy-MM-dd');
              const dayLabel =
                daysFromNow === 0
                  ? 'Hoje'
                  : daysFromNow === 1
                  ? 'Amanhã'
                  : `+${daysFromNow}d`;

              return (
                <button
                  key={daysFromNow}
                  type="button"
                  onClick={() => onChange(dateStr)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    value === dateStr
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dayLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {value && (
        <div className="p-3 bg-green-100 border-l-4 border-green-500 rounded">
          <p className="text-sm text-green-900">
            ✓ Tudo pronto! Você terá seu plano personalizado em segundos.
          </p>
        </div>
      )}
    </div>
  );
};
