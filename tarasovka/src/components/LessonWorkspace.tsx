import React, { useState, useEffect } from 'react';
import { PythonEditor } from './PythonEditor';
import { Lesson, ValidationResult } from '../types';
import { runPythonCode, resetPyodideGlobals } from '../pyodideService';
import { getFriendlyError, FriendlyError } from '../utils/errorFriendly';
import { Markdown } from './Markdown';
import { Play, CheckCircle, ArrowLeft, RotateCcw, AlertTriangle, Eye, HelpCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LessonWorkspaceProps {
  lesson: Lesson;
  pyodide: any;
  pyodideStatus: 'idle' | 'loading' | 'ready' | 'error';
  initialUserCode: string;
  onLessonCompleted: (lessonId: string, userCode: string, xpReward: number) => void;
  onBackToDashboard: () => void;
  onCodeChange: (lessonId: string, code: string) => void;
  isCompleted: boolean;
  onNextLesson: () => void;
  hasNextLesson: boolean;
}

export const LessonWorkspace: React.FC<LessonWorkspaceProps> = ({
  lesson,
  pyodide,
  pyodideStatus,
  initialUserCode,
  onLessonCompleted,
  onBackToDashboard,
  onCodeChange,
  isCompleted,
  onNextLesson,
  hasNextLesson,
}) => {
  const [code, setCode] = useState(initialUserCode || lesson.starterCode);
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [checkResult, setCheckResult] = useState<ValidationResult | null>(null);
  const [friendlyError, setFriendlyError] = useState<FriendlyError | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Sync state if lesson changes
  useEffect(() => {
    setCode(initialUserCode || lesson.starterCode);
    setConsoleOutput('');
    setCheckResult(null);
    setFriendlyError(null);
    setShowHint(false);
  }, [lesson, initialUserCode]);

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange(lesson.id, newCode);
  };

  const handleRunCode = async () => {
    if (pyodideStatus !== 'ready') return;
    setIsRunning(true);
    setConsoleOutput('Выполнение кода...\n');
    setCheckResult(null);
    setFriendlyError(null);

    // Reset Pyodide global namespace to ensure clean execution
    resetPyodideGlobals(pyodide);

    const result = await runPythonCode(pyodide, code);
    
    setIsRunning(false);
    
    if (result.error) {
      setConsoleOutput(result.output + '\n[ОШИБКА ВЫПОЛНЕНИЯ]\n' + result.error);
      const friendly = getFriendlyError(result.error);
      setFriendlyError(friendly);
    } else {
      setConsoleOutput(result.output || 'Код выполнился успешно (вывод пуст).');
    }
  };

  const handleCheckSolution = async () => {
    if (pyodideStatus !== 'ready') return;
    setIsChecking(true);
    setConsoleOutput('Запуск проверки...\n');
    setCheckResult(null);
    setFriendlyError(null);

    resetPyodideGlobals(pyodide);

    // 1. Run the user's code first
    const result = await runPythonCode(pyodide, code);

    if (result.error) {
      setIsChecking(false);
      setConsoleOutput(result.output + '\n[ОШИБКА ВЫПОЛНЕНИЯ]\n' + result.error);
      const friendly = getFriendlyError(result.error);
      setFriendlyError(friendly);
      setCheckResult({
        success: false,
        message: 'Не удалось проверить решение, так как код завершился с ошибкой.',
      });
      return;
    }

    setConsoleOutput(result.output);

    // 2. Run the lesson validation logic
    try {
      const validation = await lesson.validate(code, pyodide, result.output, null);
      setCheckResult(validation);

      if (validation.success) {
        // Trigger fireworks!
        try {
          const triggerConfetti = (confetti as any)?.default || confetti;
          if (typeof triggerConfetti === 'function') {
            triggerConfetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#00f2fe', '#7f00ff', '#39ff14', '#ffffff'],
            });
          }
        } catch (err) {
          console.error('Confetti animation error:', err);
        }
        
        onLessonCompleted(lesson.id, code, 100); // 100 XP per lesson
      }
    } catch (e: any) {
      setCheckResult({
        success: false,
        message: 'Произошла непредвиденная ошибка при проверке: ' + e.message,
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleResetCode = () => {
    if (window.confirm('Сбросить код до первоначального шаблона?')) {
      setCode(lesson.starterCode);
      onCodeChange(lesson.id, lesson.starterCode);
      setCheckResult(null);
      setFriendlyError(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-slate-950 animate-fadeIn overflow-hidden">
      {/* LEFT COLUMN: THEORY & OBJECTIVES */}
      <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-900 h-1/2 lg:h-[calc(100vh-64px)]">
        {/* Workspace Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-900 bg-slate-950">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>К списку уроков</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
              +100 XP
            </span>
            {isCompleted && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Пройдено
              </span>
            )}
          </div>
        </div>

        {/* Content Pane */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            {lesson.title}
          </h2>

          <Markdown content={lesson.theory} />

          {/* Objective Card */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-purple-600" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Задание:
            </h4>
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
              {lesson.taskDescription}
            </p>
          </div>

          {/* Hint Area */}
          <div>
            {showHint ? (
              <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/20 text-xs text-amber-200 leading-relaxed flex items-start gap-2.5 animate-slideDown">
                <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-1">Подсказка к уроку:</span>
                  {lesson.hint}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowHint(true)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors py-1.5 px-3 rounded-lg border border-transparent hover:border-slate-800 hover:bg-slate-900/30"
              >
                <Eye className="w-4 h-4" />
                <span>Показать подсказку</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: EDITOR & CONSOLE */}
      <div className="w-full lg:w-1/2 flex flex-col h-1/2 lg:h-[calc(100vh-64px)]">
        {/* Monaco Editor Container */}
        <div className="flex-1 min-h-[300px] flex flex-col bg-slate-950 border-b border-slate-900 relative">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-900">
            <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              редактор кода python
            </div>
            <button
              onClick={handleResetCode}
              className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-850 px-2.5 py-1 rounded transition-colors"
              title="Сбросить код"
            >
              <RotateCcw className="w-3 h-3" />
              Сброс
            </button>
          </div>

          {/* Editor */}
          <div className="flex-1 relative overflow-hidden">
            <PythonEditor
              value={code}
              onChange={handleEditorChange}
            />
          </div>
        </div>

        {/* Console & Results Panel */}
        <div className="h-[250px] flex flex-col bg-slate-950">
          {/* Console Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-900 bg-slate-950">
            <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
              консоль вывода
            </div>
            {pyodideStatus === 'loading' && (
              <span className="text-[10px] text-yellow-500 font-bold animate-pulse">
                Подключение Python...
              </span>
            )}
            {pyodideStatus === 'ready' && (
              <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Python готов
              </span>
            )}
            {pyodideStatus === 'error' && (
              <span className="text-[10px] text-red-500 font-bold">
                Сбой подключения
              </span>
            )}
          </div>

          {/* Console Screen and Run Actions */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Terminal Screen */}
            <div className="flex-1 bg-slate-950 p-4 font-mono text-xs overflow-y-auto border-b md:border-b-0 md:border-r border-slate-900 scrollbar-thin flex flex-col">
              {consoleOutput ? (
                <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed flex-1">
                  {consoleOutput}
                </pre>
              ) : (
                <div className="text-slate-600 flex-1 flex items-center justify-center select-none text-center">
                  {pyodideStatus === 'loading'
                    ? 'Загрузка Python... Это может занять несколько секунд при первом запуске.'
                    : 'Код еще не запускался. Напишите решение и нажмите "Выполнить" или "Проверить".'}
                </div>
              )}

              {/* Friendly error panel inside console */}
              {friendlyError && (
                <div className="mt-4 p-3 rounded-xl border border-red-950 bg-red-950/20 text-red-200 animate-slideUp space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-red-400">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Разбор ошибки: {friendlyError.name}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-red-300">
                    {friendlyError.friendlyMessage}
                  </p>
                  <p className="text-[11px] leading-relaxed text-slate-400 italic">
                    <strong className="text-slate-300 not-italic">Совет:</strong> {friendlyError.suggestion}
                  </p>
                </div>
              )}

              {/* Success validation panel inside console */}
              {checkResult && (
                <div
                  className={`mt-4 p-3 rounded-xl border animate-slideUp flex items-start gap-2.5 ${
                    checkResult.success
                      ? 'border-emerald-950 bg-emerald-950/20 text-emerald-200'
                      : 'border-red-950 bg-red-950/20 text-red-200'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {checkResult.success ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold block mb-0.5">
                      {checkResult.success ? 'Отлично! Проверка пройдена.' : 'Ошибка проверки:'}
                    </span>
                    <span className="text-[11px] leading-relaxed block text-slate-300">
                      {checkResult.success
                        ? 'Вы успешно решили это практическое задание и получили 100 XP!'
                        : checkResult.message || 'Проверьте правильность выполнения задания.'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Run Actions Column */}
            <div className="w-full md:w-56 p-4 bg-slate-950 flex flex-col gap-3 justify-center border-t md:border-t-0 border-slate-900 shrink-0">
              <button
                onClick={handleRunCode}
                disabled={isRunning || isChecking || pyodideStatus !== 'ready'}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-850 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-800 hover:border-slate-700 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Выполнить код
              </button>

              <button
                onClick={handleCheckSolution}
                disabled={isRunning || isChecking || pyodideStatus !== 'ready'}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Проверить решение
              </button>

              {checkResult?.success && hasNextLesson && (
                <button
                  onClick={onNextLesson}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse"
                >
                  <span>Далее</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
