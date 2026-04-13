'use client';

import React, { useState } from 'react';
import { Button, Card, CardHeader, CardBody, ToastContainer, useToast } from '@/components';
import { usePlanStore } from '@/stores';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DashboardPage() {
  const { currentPlan, dailyTasks, completeTask } = usePlanStore();
  const { success, toasts } = useToast();
  const [selectedDay, setSelectedDay] = useState(1);
  const [checkinData, setCheckinData] = useState({
    mood: 0,
    energy: 0,
  });

  const startDate = currentPlan ? new Date(currentPlan.start_date + 'T00:00:00') : new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);

  const daysSinceStart = Math.max(
    0,
    Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );

  const currentTask = dailyTasks.find((t) => t.day_number === selectedDay);
  const completedTasks = dailyTasks.filter((t) => t.completed_at).length;
  const completionPercentage = Math.round((completedTasks / dailyTasks.length) * 100);

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
    success('Parabéns! Tarefa completada! 🎉');
  };

  const handleCheckin = () => {
    if (checkinData.mood === 0 || checkinData.energy === 0) {
      return;
    }
    success(`Check-in salvo: Humor ${checkinData.mood}/5, Energia ${checkinData.energy}/10`);
    setCheckinData({ mood: 0, energy: 0 });
  };

  if (!currentPlan) return null;

  return (
    <div className="space-y-8 py-8">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="text-center">Dias Completos</CardHeader>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-primary">{completedTasks}</div>
            <div className="text-xs text-gray-600">de {dailyTasks.length}</div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="text-center">Progresso</CardHeader>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-secondary">{completionPercentage}%</div>
            <div className="text-xs text-gray-600">completo</div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="text-center">Objetivo</CardHeader>
          <CardBody className="text-center text-primary capitalize font-semibold">
            {currentPlan.objective}
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="text-center">Início</CardHeader>
          <CardBody className="text-center text-xs">
            {format(startDate, "dd 'de' MMM", { locale: ptBR })}
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <h2 className="font-serif text-2xl font-bold mb-4">Cronograma</h2>

          <div className="space-y-3 mb-6">
            {dailyTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => setSelectedDay(task.day_number)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedDay === task.day_number
                    ? 'border-primary bg-primary bg-opacity-10'
                    : task.completed_at
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-primary'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        task.completed_at
                          ? 'bg-green-500 text-white'
                          : task.day_number === daysSinceStart
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {task.completed_at ? '✓' : task.day_number}
                    </div>
                    <div>
                      <p className="font-semibold">Dia {task.day_number}</p>
                      <p className="text-xs text-gray-600 line-clamp-1">{task.notes}</p>
                    </div>
                  </div>
                  {task.day_number === daysSinceStart && (
                    <span className="text-xs bg-primary text-white px-2 py-1 rounded">
                      HOJE
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Daily Task Detail */}
        <div>
          <h2 className="font-serif text-2xl font-bold mb-4">
            Dia {selectedDay}
          </h2>

          {currentTask && (
            <div className="space-y-4">
              {/* Daily Notes */}
              <Card>
                <CardHeader className="text-sm">💭 Reflexão do Dia</CardHeader>
                <CardBody>{currentTask.notes}</CardBody>
              </Card>

              {/* Prayer */}
              <Card>
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl mb-2">🙏</div>
                    <h3 className="font-bold text-sm">Oração</h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {currentTask.prayer.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      ⏱️ {currentTask.prayer.duration_minutes} min
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleCompleteTask(currentTask.id)}
                    disabled={currentTask.completed_at ? true : false}
                    className="w-full"
                  >
                    {currentTask.completed_at ? '✓ Realizada' : 'Marcar como Feito'}
                  </Button>
                </div>
              </Card>

              {/* Meditation */}
              <Card>
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl mb-2">🧘</div>
                    <h3 className="font-bold text-sm">Meditação</h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {currentTask.meditation.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      ⏱️ {currentTask.meditation.duration_minutes} min
                    </p>
                    {currentTask.meditation.audio_url && (
                      <a
                        href={currentTask.meditation.audio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary underline hover:no-underline"
                      >
                        Ouvir áudio →
                      </a>
                    )}
                  </div>
                </div>
              </Card>

              {/* Meal */}
              <Card>
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl mb-2">🥗</div>
                    <h3 className="font-bold text-sm">Refeição Sugerida</h3>
                    <p className="text-xs text-gray-600 mb-2">{currentTask.meal.title}</p>
                    <p className="text-xs text-gray-500">
                      {currentTask.meal.calories} kcal • {currentTask.meal.prep_time_minutes} min
                    </p>
                  </div>
                </div>
              </Card>

              {/* Checkin */}
              <Card>
                <div className="space-y-3">
                  <h3 className="font-bold text-sm">💭 Como você se sente?</h3>

                  <div>
                    <label className="text-xs font-semibold text-gray-600">Humor</label>
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((mood) => (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => setCheckinData((prev) => ({ ...prev, mood }))}
                          className={`text-2xl p-1 rounded transition-transform ${
                            checkinData.mood === mood ? 'scale-125' : 'hover:scale-110'
                          }`}
                        >
                          {
                            [
                              '😔', // 1
                              '😟', // 2
                              '😐', // 3
                              '🙂', // 4
                              '😊', // 5
                            ][mood - 1]
                          }
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600">Energia</label>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((energy) => (
                        <button
                          key={energy}
                          type="button"
                          onClick={() => setCheckinData((prev) => ({ ...prev, energy: energy * 2 }))}
                          className={`flex-1 h-8 rounded transition-all ${
                            checkinData.energy === energy * 2
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 hover:bg-primary hover:bg-opacity-30'
                          }`}
                        >
                          <span className="text-xs font-bold">{energy}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={handleCheckin}
                    disabled={checkinData.mood === 0 || checkinData.energy === 0}
                    className="w-full"
                  >
                    Salvar Check-in
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
