let pyodideInstance: any = null;
let stdoutBuffer: string[] = [];

export interface ExecutionResult {
  output: string;
  error: string | null;
}

export async function initPyodide(
  onStatusChange: (status: 'idle' | 'loading' | 'ready' | 'error') => void
): Promise<any> {
  if (pyodideInstance) {
    onStatusChange('ready');
    return pyodideInstance;
  }

  onStatusChange('loading');
  try {
    // 1. Inject the Pyodide CDN script
    if (!(window as any).loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Pyodide from CDN'));
        document.head.appendChild(script);
      });
    }

    // 2. Load Pyodide
    pyodideInstance = await (window as any).loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/',
      stdout: (text: string) => {
        stdoutBuffer.push(text);
      },
      stderr: (text: string) => {
        stdoutBuffer.push(text);
      },
    });

    // Initialize basic libraries
    await pyodideInstance.runPythonAsync('import io, sys');

    onStatusChange('ready');
    return pyodideInstance;
  } catch (err) {
    console.error('Failed to init Pyodide:', err);
    onStatusChange('error');
    throw err;
  }
}

export function resetPyodideGlobals(pyodide: any) {
  if (!pyodide) return;
  try {
    pyodide.runPython(`
# Clean up custom globals to prevent leak between runs/lessons
for key in list(globals().keys()):
    if not key.startswith('__') and key not in ['sys', 'io']:
        try:
            del globals()[key]
        except Exception:
            pass
`);
  } catch (e) {
    console.error('Error resetting globals:', e);
  }
}

export async function runPythonCode(pyodide: any, code: string): Promise<ExecutionResult> {
  if (!pyodide) {
    return { output: '', error: 'Pyodide не инициализирован.' };
  }

  stdoutBuffer = [];
  let error: string | null = null;

  try {
    // We redirect stdout/stderr in Python using io.StringIO to make sure we capture print() statements
    // that might happen during runs, and clean up afterwards.
    await pyodide.runPythonAsync(`
import io, sys
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

    // Run user code
    await pyodide.runPythonAsync(code);

    // Get output captured by StringIO
    const pyStdout = pyodide.runPython('sys.stdout.getvalue()');
    const pyStderr = pyodide.runPython('sys.stderr.getvalue()');

    let output = pyStdout || '';
    if (pyStderr) {
      output += (output ? '\n' : '') + pyStderr;
    }

    // Add stdoutBuffer items if any (fallback/direct print)
    if (stdoutBuffer.length > 0) {
      output += (output ? '\n' : '') + stdoutBuffer.join('\n');
    }

    return {
      output,
      error: null,
    };
  } catch (err: any) {
    // Capture traceback or error message
    error = err.message || String(err);
    
    // Attempt to extract python error output
    let output = '';
    try {
      const pyStdout = pyodide.runPython('sys.stdout.getvalue()');
      output = pyStdout || '';
    } catch (_) {}

    if (stdoutBuffer.length > 0) {
      output += (output ? '\n' : '') + stdoutBuffer.join('\n');
    }

    return {
      output,
      error,
    };
  } finally {
    // Restore default stdout/stderr streams
    try {
      pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);
    } catch (_) {}
  }
}
