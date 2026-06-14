export interface FriendlyError {
  name: string;
  originalMessage: string;
  friendlyMessage: string;
  suggestion: string;
}

export function getFriendlyError(errorString: string): FriendlyError {
  if (!errorString) {
    return {
      name: 'Неизвестная ошибка',
      originalMessage: '',
      friendlyMessage: 'Что-то пошло не так при выполнении кода.',
      suggestion: 'Проверьте код на опечатки и попробуйте запустить снова.',
    };
  }

  // Extract error type and message
  // Pyodide tracebacks end with something like: "TypeError: unsupported operand type(s) for +: 'int' and 'str'"
  // or "SyntaxError: invalid syntax (line 3)"
  const lines = errorString.trim().split('\n');
  const lastLine = lines[lines.length - 1] || '';
  
  let errorType = 'Error';
  let errorMessage = lastLine;
  
  const match = lastLine.match(/^([a-zA-Z]+Error|SyntaxError|IndentationError):\s*(.*)$/);
  if (match) {
    errorType = match[1];
    errorMessage = match[2];
  } else {
    // Try to find if there is a traceback line containing the error
    for (let i = lines.length - 1; i >= 0; i--) {
      const m = lines[i].match(/^([a-zA-Z]+Error|SyntaxError|IndentationError):\s*(.*)$/);
      if (m) {
        errorType = m[1];
        errorMessage = m[2];
        break;
      }
    }
  }

  let friendlyMessage = errorMessage;
  let suggestion = 'Проверьте написание и структуру кода.';

  switch (errorType) {
    case 'SyntaxError':
      friendlyMessage = 'Синтаксическая ошибка (SyntaxError). В коде нарушены правила грамматики Python.';
      if (errorMessage.includes('invalid syntax')) {
        suggestion = 'Скорее всего, вы пропустили двоеточие `:` в конце условия/цикла/функции, забыли закрыть скобку `)` или кавычку `"`/`\'`.';
      } else if (errorMessage.includes('was never closed')) {
        suggestion = 'Вы открыли скобку или кавычку, но забыли закрыть её. Проверьте парность скобок () [] {} и кавычек.';
      } else {
        suggestion = 'Внимательно проверьте каждую строчку. Ошибки в синтаксисе часто подсвечиваются красной волнистой линией.';
      }
      break;

    case 'IndentationError':
      friendlyMessage = 'Ошибка отступов (IndentationError). Отступы в Python определяют структуру блоков кода.';
      if (errorMessage.includes('expected an indented block')) {
        suggestion = 'После объявлений `if`, `else`, `while`, `for`, `def` обязательно должен идти блок кода со смещением вправо (обычно 4 пробела или 1 Tab).';
      } else if (errorMessage.includes('unexpected indent')) {
        suggestion = 'Вы сделали лишний отступ там, где он не нужен. Все команды на одном уровне вложенности должны начинаться с одной позиции.';
      } else {
        suggestion = 'Убедитесь, что вы используете одинаковые отступы (везде пробелы или везде Tab) и они расставлены ровно.';
      }
      break;

    case 'NameError':
      const nameMatch = errorMessage.match(/name '([^']+)' is not defined/);
      const undefinedName = nameMatch ? nameMatch[1] : '';
      friendlyMessage = `Имя '${undefinedName || 'переменной'}' не определено (NameError).`;
      suggestion = undefinedName 
        ? `Вы пытаетесь использовать '${undefinedName}', но Python о ней ничего не знает. Возможно, вы опечатались в имени, забыли объявить эту переменную ранее или не импортировали нужную библиотеку.`
        : 'Убедитесь, что все используемые переменные и функции объявлены выше по коду и написаны без опечаток.';
      break;

    case 'TypeError':
      friendlyMessage = 'Ошибка типов данных (TypeError). Вы пытаетесь выполнить операцию с несовместимыми типами.';
      if (errorMessage.includes('unsupported operand type')) {
        suggestion = 'Например, нельзя складывать текст и числа напрямую: `"Возраст: " + 20` вызовет ошибку. Преобразуйте число в строку с помощью `str(20)` или используйте f-строки: `f"Возраст: {20}"`.';
      } else if (errorMessage.includes('is not callable')) {
        suggestion = 'Вы пытаетесь вызвать как функцию то, что функцией не является (например, поставили круглые скобки `()` после обычной переменной или забыли знак умножения `*`).';
      } else {
        suggestion = 'Проверьте типы данных переменных, участвующих в операции. Используйте `type(переменная)` для проверки типа.';
      }
      break;

    case 'ZeroDivisionError':
      friendlyMessage = 'Деление на ноль (ZeroDivisionError).';
      suggestion = 'В математике и программировании деление на ноль запрещено. Проверьте делитель в ваших вычислениях: он равен нулю.';
      break;

    case 'IndexError':
      friendlyMessage = 'Индекс списка вне диапазона (IndexError).';
      suggestion = 'Вы пытаетесь обратиться к элементу списка по индексу, которого не существует. Помните: индексация начинается с 0, и последний элемент имеет индекс `len(list) - 1`.';
      break;

    case 'KeyError':
      const keyMatch = errorMessage.match(/'([^']+)'/);
      const missingKey = keyMatch ? keyMatch[1] : '';
      friendlyMessage = `Ошибка ключа (KeyError): ключ '${missingKey || ''}' отсутствует в словаре.`;
      suggestion = 'Вы пытаетесь получить значение по ключу, которого нет в словаре. Убедитесь в правильности ключа или используйте метод `.get(ключ, значение_по_умолчанию)`, чтобы избежать падения программы.';
      break;

    case 'AttributeError':
      friendlyMessage = 'Ошибка атрибута (AttributeError).';
      suggestion = 'Вы пытаетесь вызвать метод или свойство, которого нет у данного объекта. Например, метод `.append()` есть у списков, но его нет у строк или чисел.';
      break;

    case 'ValueError':
      friendlyMessage = 'Некорректное значение (ValueError).';
      suggestion = 'Функция получила аргумент правильного типа, но с неподходящим значением. Например, `int("привет")` не сможет перевести буквы в число.';
      break;
  }

  return {
    name: errorType,
    originalMessage: errorMessage,
    friendlyMessage,
    suggestion,
  };
}
