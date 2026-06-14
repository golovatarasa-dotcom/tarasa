import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LessonWorkspace } from './components/LessonWorkspace';
import { lessons, modules } from './lessons';
import { UserProgress } from './types';
import { initPyodide } from './pyodideService';
import { Terminal, Flame, Trophy, Menu, LayoutDashboard } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'py_zero_to_hero_progress';

const initialProgress: UserProgress = {
  completedLessons: [],
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  achievements: [],
  codeHistory: {},
};

function App() {
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [pyodide, setPyodide] = useState<any>(null);
  const [pyodideStatus, setPyodideStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  // Load progress and init Pyodide on mount
  useEffect(() => {
    // 1. Load progress
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with initialProgress to guarantee all keys exist
        const merged: UserProgress = {
          completedLessons: parsed.completedLessons || [],
          xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
          streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
          lastActiveDate: parsed.lastActiveDate || null,
          achievements: parsed.achievements || [],
          codeHistory: parsed.codeHistory || {},
        };
        
        // Calculate streak integrity
        const updatedProgress = checkAndUpdateStreak(merged);
        setProgress(updatedProgress);
      } catch (e) {
        console.error('Failed to parse progress from localStorage:', e);
      }
    }

    // 2. Load Pyodide in background
    initPyodide(setPyodideStatus)
      .then((instance) => {
        setPyodide(instance);
      })
      .catch(() => {
        setPyodideStatus('error');
      });
  }, []);

  // Check and update streak based on dates
  const checkAndUpdateStreak = (userProgress: UserProgress): UserProgress => {
    if (!userProgress.lastActiveDate) {
      return { ...userProgress, streak: 0 };
    }

    const todayStr = new Date().toDateString();
    const lastActiveStr = new Date(userProgress.lastActiveDate).toDateString();

    if (todayStr === lastActiveStr) {
      // Already active today, streak is preserved
      return userProgress;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = new Date(userProgress.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today.getTime() - lastActive.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Last active yesterday, streak preserved
      return userProgress;
    } else {
      // Broke the streak (more than 1 day difference)
      return { ...userProgress, streak: 0 };
    }
  };

  // Save progress changes to localStorage
  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProgress));
  };

  const handleLessonCompleted = (lessonId: string, userCode: string, xpReward: number) => {
    const isFirstTime = !progress.completedLessons.includes(lessonId);
    
    let updatedCompleted = [...progress.completedLessons];
    if (isFirstTime) {
      updatedCompleted.push(lessonId);
    }

    // Record code history
    const updatedHistory = {
      ...progress.codeHistory,
      [lessonId]: userCode,
    };

    // Calculate XP
    const newXp = isFirstTime ? progress.xp + xpReward : progress.xp;

    // Calculate Streak increment
    const todayStr = new Date().toDateString();
    const lastActiveStr = progress.lastActiveDate ? new Date(progress.lastActiveDate).toDateString() : '';
    
    let newStreak = progress.streak;
    if (lastActiveStr === '') {
      newStreak = 1;
    } else if (todayStr !== lastActiveStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastActiveStr === yesterday.toDateString()) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    const newProgress: UserProgress = {
      ...progress,
      completedLessons: updatedCompleted,
      codeHistory: updatedHistory,
      xp: newXp,
      streak: newStreak,
      lastActiveDate: new Date().toISOString(),
    };

    saveProgress(newProgress);
  };

  const handleCodeChange = (lessonId: string, code: string) => {
    saveProgress({
      ...progress,
      codeHistory: {
        ...progress.codeHistory,
        [lessonId]: code,
      },
    });
  };

  const handleResetProgress = () => {
    saveProgress(initialProgress);
    setActiveLessonId(null);
  };

  const handleStartLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
  };

  const currentLesson = lessons.find((l) => l.id === activeLessonId);
  const currentLessonIndex = currentLesson ? lessons.indexOf(currentLesson) : -1;
  const hasNextLesson = currentLessonIndex !== -1 && currentLessonIndex < lessons.length - 1;

  const handleNextLesson = () => {
    if (hasNextLesson) {
      setActiveLessonId(lessons[currentLessonIndex + 1].id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* GLOBAL NAVBAR */}
      <header className="h-16 border-b border-slate-900 bg-slate-950 flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white lg:hidden transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setActiveLessonId(null)}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent block">
                PYTHON ТРЕНАЖЕР
              </span>
              <span className="text-[10px] text-slate-500 block leading-none font-medium">
                от Нуба до Про
              </span>
            </div>
          </button>
        </div>

        {/* Header Stats */}
        <div className="flex items-center gap-4">
          {/* Streak Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
            <Flame className="w-4 h-4 fill-current animate-pulse" />
            <span>{progress.streak} дн.</span>
          </div>

          {/* XP Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
            <Trophy className="w-4 h-4" />
            <span>{progress.xp} XP</span>
          </div>
        </div>
      </header>

      {/* WORKSPACE CONTAINER */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION */}
        <Sidebar
          modules={modules}
          lessons={lessons}
          progress={progress}
          activeLessonId={activeLessonId}
          onSelectLesson={setActiveLessonId}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* MAIN DISPLAY AREA */}
        <main className="flex-1 overflow-y-auto bg-slate-950 scrollbar-thin relative">
          {activeLessonId === null || !currentLesson ? (
            <Dashboard
              progress={progress}
              modules={modules}
              lessons={lessons}
              onStartLesson={handleStartLesson}
              onResetProgress={handleResetProgress}
            />
          ) : (
            <LessonWorkspace
              lesson={currentLesson}
              pyodide={pyodide}
              pyodideStatus={pyodideStatus}
              initialUserCode={progress.codeHistory[currentLesson.id] || ''}
              onLessonCompleted={handleLessonCompleted}
              onBackToDashboard={() => setActiveLessonId(null)}
              onCodeChange={handleCodeChange}
              isCompleted={progress.completedLessons.includes(currentLesson.id)}
              onNextLesson={handleNextLesson}
              hasNextLesson={hasNextLesson}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
