import React from 'react';
import { UserProgress, Module, Lesson } from '../types';
import { Award, BookOpen, Flame, Trophy, Play, CheckCircle, Zap } from 'lucide-react';

interface DashboardProps {
  progress: UserProgress;
  modules: Module[];
  lessons: Lesson[];
  onStartLesson: (lessonId: string) => void;
  onResetProgress: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  modules,
  lessons,
  onStartLesson,
  onResetProgress,
}) => {
  const totalLessons = lessons.length;
  const completedCount = progress.completedLessons.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100) || 0;

  // Calculate user level (e.g., every 200 XP = 1 Level)
  const xpPerLevel = 200;
  const currentLevel = Math.floor(progress.xp / xpPerLevel) + 1;
  const xpInCurrentLevel = progress.xp % xpPerLevel;
  const levelProgressPercent = Math.round((xpInCurrentLevel / xpPerLevel) * 100);

  // List of achievements defined statically
  const achievements = [
    {
      id: 'first_lesson',
      title: 'Первый запуск',
      description: 'Успешно выполни свой первый урок по Python.',
      xpReward: 50,
      unlocked: progress.completedLessons.length >= 1,
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
    },
    {
      id: 'module_1',
      title: 'Покоритель основ',
      description: 'Пройди первый модуль и освой базовый синтаксис.',
      xpReward: 100,
      unlocked: lessons.filter(l => l.moduleId === 'basics').every(l => progress.completedLessons.includes(l.id)),
      icon: <BookOpen className="w-6 h-6 text-cyan-400" />,
    },
    {
      id: 'halfway',
      title: 'Экватор пройден',
      description: 'Заверши 9 уроков обучения.',
      xpReward: 150,
      unlocked: progress.completedLessons.length >= 9,
      icon: <Award className="w-6 h-6 text-purple-400" />,
    },
    {
      id: 'pro_coder',
      title: 'ООП Мастер',
      description: 'Пройди модуль ООП и начни писать структурированный код.',
      xpReward: 200,
      unlocked: lessons.filter(l => l.moduleId === 'advanced_oop').every(l => progress.completedLessons.includes(l.id)),
      icon: <Trophy className="w-6 h-6 text-emerald-400" />,
    },
    {
      id: 'complete_all',
      title: 'Настоящий Питонист',
      description: 'Успешно заверши все уроки курса от Нуба до Про.',
      xpReward: 300,
      unlocked: progress.completedLessons.length === totalLessons,
      icon: <Trophy className="w-6 h-6 text-amber-400 animate-bounce" />,
    },
  ];

  // Find the first uncompleted lesson to continue
  const getNextLessonId = () => {
    const next = lessons.find((l) => !progress.completedLessons.includes(l.id));
    return next ? next.id : lessons[0]?.id;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header / Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-950 via-purple-950/20 to-slate-950 p-8 md:p-12 mb-8 shadow-2xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Интерактивный Курс Python
            </span>
            <h1 className="text-3xl md:text-5xl font-black mt-3 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
              С нуля до разработчика
            </h1>
            <p className="text-slate-400 mt-2 text-base md:text-lg max-w-xl">
              Учись теории, пиши код в консоли и получай мгновенные проверки. Никакой лишней воды, только практика.
            </p>
          </div>
          <button
            onClick={() => onStartLesson(getNextLessonId())}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 hover:scale-105"
          >
            <Play className="w-5 h-5 fill-current" />
            {completedCount === 0 ? 'Начать обучение' : 'Продолжить путь'}
          </button>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* XP & Level */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Trophy className="w-24 h-24 text-cyan-400" />
          </div>
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Ваш уровень</h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold text-white">{currentLevel}</span>
            <span className="text-slate-500 text-sm">УРОВЕНЬ</span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>{xpInCurrentLevel} / {xpPerLevel} XP</span>
              <span>До ур. {currentLevel + 1}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lessons Progress */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <BookOpen className="w-24 h-24 text-purple-400" />
          </div>
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Пройдено уроков</h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold text-white">{completedCount}</span>
            <span className="text-slate-500 text-sm">из {totalLessons}</span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Общий прогресс</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Flame className="w-24 h-24 text-orange-400" />
          </div>
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Серия дней</h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold text-white">{progress.streak}</span>
            <span className="text-slate-500 text-sm">{progress.streak === 1 ? 'день' : progress.streak >= 2 && progress.streak <= 4 ? 'дня' : 'дней'} подрят</span>
          </div>
          <p className="text-xs text-slate-400 mt-5">
            Занимайся каждый день, чтобы развивать привычку и умножать получаемый опыт!
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Syllabus / Modules */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Программа обучения
          </h2>
          <div className="space-y-4">
            {modules.map((mod, idx) => {
              const moduleLessons = lessons.filter((l) => l.moduleId === mod.id);
              const moduleCompleted = moduleLessons.filter((l) =>
                progress.completedLessons.includes(l.id)
              );
              const isFinished = moduleCompleted.length === moduleLessons.length;
              const isStarted = moduleCompleted.length > 0;

              return (
                <div
                  key={mod.id}
                  className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700/50 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="font-bold text-white text-lg">{mod.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">{mod.description}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 whitespace-nowrap font-medium">
                      {moduleCompleted.length} / {moduleLessons.length}
                    </span>
                  </div>

                  {/* Micro list of lessons in module */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    {moduleLessons.map((les) => {
                      const isDone = progress.completedLessons.includes(les.id);
                      return (
                        <button
                          key={les.id}
                          onClick={() => onStartLesson(les.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 group/item ${
                            isDone
                              ? 'bg-slate-950/20 border-emerald-950 hover:border-emerald-800 text-emerald-300'
                              : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-slate-700 shrink-0 group-hover/item:border-cyan-400 transition-colors" />
                          )}
                          <span className="text-sm font-medium truncate">{les.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements / Trophy Room */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-400" />
            Достижения
          </h2>
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`flex gap-4 p-4 rounded-xl border transition-all ${
                  ach.unlocked
                    ? 'bg-slate-900/60 border-purple-500/30'
                    : 'bg-slate-950/30 border-slate-850 opacity-50'
                }`}
              >
                <div
                  className={`p-3 rounded-xl shrink-0 flex items-center justify-center ${
                    ach.unlocked ? 'bg-purple-500/10' : 'bg-slate-800'
                  }`}
                >
                  {ach.unlocked ? ach.icon : <Award className="w-6 h-6 text-slate-500" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`font-bold text-sm ${ach.unlocked ? 'text-white' : 'text-slate-400'}`}>
                      {ach.title}
                    </h4>
                    {ach.unlocked && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold">
                        +{ach.xpReward} XP
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reset button at the very bottom */}
          <div className="pt-6">
            <button
              onClick={() => {
                if (window.confirm('Вы уверены, что хотите сбросить весь пройденный прогресс и накопленный опыт? Это действие необратимо.')) {
                  onResetProgress();
                }
              }}
              className="text-xs text-red-500/60 hover:text-red-400 hover:underline transition-colors block mx-auto"
            >
              Сбросить весь прогресс обучения
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
