import React, { useState } from 'react';
import { Module, Lesson, UserProgress } from '../types';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, LayoutDashboard, Terminal, Menu, X, Flame } from 'lucide-react';

interface SidebarProps {
  modules: Module[];
  lessons: Lesson[];
  progress: UserProgress;
  activeLessonId: string | null;
  onSelectLesson: (lessonId: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  modules,
  lessons,
  progress,
  activeLessonId,
  onSelectLesson,
  isOpen,
  onClose,
}) => {
  // Keep track of which modules are expanded
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    // Expand the module of the active lesson by default, or the first one
    const initial: Record<string, boolean> = {};
    modules.forEach((mod) => {
      initial[mod.id] = true; // All expanded by default for easy access
    });
    return initial;
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 border-r border-slate-900 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:h-[calc(100vh-64px)] ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Sidebar Header for Mobile only */}
      <div className="flex items-center justify-between p-4 border-b border-slate-900 lg:hidden">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <span className="font-extrabold text-white tracking-wider">PYTHON УЧЕБНИК</span>
        </div>
        <button onClick={onClose} className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {/* Dashboard Link */}
        <button
          onClick={() => {
            onSelectLesson(null);
            onClose();
          }}
          className={`flex items-center gap-3 w-full p-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
            activeLessonId === null
              ? 'bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
              : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Главная панель (Дашборд)</span>
        </button>

        {/* Modules list */}
        <div className="space-y-4">
          <div className="text-[11px] font-bold text-slate-500 tracking-widest uppercase px-1">
            Разделы курса
          </div>

          <div className="space-y-2">
            {modules.map((mod) => {
              const moduleLessons = lessons.filter((l) => l.moduleId === mod.id);
              const moduleCompleted = moduleLessons.filter((l) =>
                progress.completedLessons.includes(l.id)
              );
              const isExpanded = expandedModules[mod.id];

              return (
                <div key={mod.id} className="space-y-1">
                  {/* Module Header Button */}
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className="flex items-center justify-between w-full p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/30 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 shrink-0 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 shrink-0 text-slate-500" />
                      )}
                      <span className="font-bold text-xs truncate text-slate-300">
                        {mod.title.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-500 shrink-0 font-medium">
                      {moduleCompleted.length}/{moduleLessons.length}
                    </span>
                  </button>

                  {/* Module Lessons sub-list */}
                  {isExpanded && (
                    <div className="pl-4 space-y-1 border-l border-slate-900/80 ml-4 animate-slideDown">
                      {moduleLessons.map((les) => {
                        const isCompleted = progress.completedLessons.includes(les.id);
                        const isActive = activeLessonId === les.id;

                        return (
                          <button
                            key={les.id}
                            onClick={() => {
                              onSelectLesson(les.id);
                              onClose();
                            }}
                            className={`flex items-center gap-2.5 w-full p-2.5 rounded-lg text-left text-xs font-medium transition-all duration-200 group ${
                              isActive
                                ? 'bg-slate-900 border border-slate-800 text-white font-semibold shadow-inner'
                                : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors shrink-0" />
                            )}
                            <span className="truncate">{les.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar footer showing streak */}
      <div className="p-4 border-t border-slate-900 bg-slate-950">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-900">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Серия дней</div>
              <div className="text-sm font-extrabold text-white">{progress.streak} дн.</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Опыт (XP)</div>
            <div className="text-sm font-extrabold text-cyan-400">{progress.xp}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
