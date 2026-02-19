'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, ToastContainer, useToast } from '@/components';
import { plansAPI } from '@/api';
import { usePlanStore } from '@/stores';
import { Objective, Duration } from '@/types';
import { format } from 'date-fns';
import { Step1Objetivo } from './steps/Step1Objetivo';
import { Step2Duracao } from './steps/Step2Duracao';
import { Step3Restricoes } from './steps/Step3Restricoes';
import { Step4Data } from './steps/Step4Data';

type Step = 1 | 2 | 3 | 4;

export default function WizardPage() {
  const router = useRouter();
  const { success, error: showError, toasts } = useToast();
  const { setCurrentPlan, setDailyTasks } = usePlanStore();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    objective: '' as Objective,
    duration: 7 as Duration,
    restrictions: [] as string[],
    start_date: format(new Date(), 'yyyy-MM-dd'),
  });

  const handleNext = () => {
    // Validation per step
    if (currentStep === 1 && !formData.objective) {
      showError('Por favor, selecione um objetivo');
      return;
    }
    if (currentStep === 4) {
      handleSubmit();
      return;
    }

    setCurrentStep((prev) => (prev + 1) as Step);
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    setIsLoading(true);
    try {
      const response = await plansAPI.create(
        formData.objective,
        formData.duration,
        formData.restrictions,
        formData.start_date
      );

      setCurrentPlan(response.plan);
      setDailyTasks(response.daily_tasks);

      success('Plano criado com sucesso! 🎉');

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      showError(err.message || 'Erro ao criar plano');
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercent = (currentStep / 4) * 100;

  return (
    <div className="py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-2xl font-bold">
            Passo {currentStep} de 4
          </h2>
          <span className="text-sm text-gray-600">
            {Math.round(progressPercent)}% completo
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <form onSubmit={handleSubmit} className="space-y-8 mb-8">
        {currentStep === 1 && (
          <Step1Objetivo
            value={formData.objective}
            onChange={(objective) =>
              setFormData((prev) => ({ ...prev, objective }))
            }
          />
        )}

        {currentStep === 2 && (
          <Step2Duracao
            value={formData.duration}
            onChange={(duration) =>
              setFormData((prev) => ({ ...prev, duration }))
            }
          />
        )}

        {currentStep === 3 && (
          <Step3Restricoes
            value={formData.restrictions}
            onChange={(restrictions) =>
              setFormData((prev) => ({ ...prev, restrictions }))
            }
          />
        )}

        {currentStep === 4 && (
          <Step4Data
            value={formData.start_date}
            onChange={(start_date) =>
              setFormData((prev) => ({ ...prev, start_date }))
            }
          />
        )}

        {/* Navigation */}
        <div className="flex gap-4 justify-between pt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1 || isLoading}
          >
            ← Anterior
          </Button>

          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleNext}
            isLoading={isLoading}
          >
            {currentStep === 4 ? 'Gerar Plano 🚀' : 'Próximo →'}
          </Button>
        </div>
      </form>

      {/* Progress Indicator */}
      <div className="flex gap-2 justify-center mt-8">
        {[1, 2, 3, 4].map((step) => (
          <button
            key={step}
            onClick={() => step < currentStep && setCurrentStep(step as Step)}
            className={`w-10 h-10 rounded-full font-bold transition-colors ${
              step === currentStep
                ? 'bg-primary text-white'
                : step < currentStep
                ? 'bg-green-500 text-white cursor-pointer'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step < currentStep ? '✓' : step}
          </button>
        ))}
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
