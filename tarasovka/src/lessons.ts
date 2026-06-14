import { Lesson, Module } from './types';

export const modules: Module[] = [
  {
    id: 'basics',
    title: 'Модуль 1: Первые шаги',
    description: 'Основы синтаксиса, переменные, простые вычисления и вывод данных.',
  },
  {
    id: 'flow_control',
    title: 'Модуль 2: Управление программой',
    description: 'Условия, циклы и принятие решений в коде.',
  },
  {
    id: 'data_structures',
    title: 'Модуль 3: Структуры данных',
    description: 'Списки, кортежи, множества и словари для хранения информации.',
  },
  {
    id: 'functions',
    title: 'Модуль 4: Функции и организация кода',
    description: 'Повторное использование кода, области видимости и стандартные библиотеки.',
  },
  {
    id: 'advanced_oop',
    title: 'Модуль 5: ООП и продвинутые темы',
    description: 'Классы, наследование, исключения, файлы и лаконичный код.',
  },
];

export const lessons: Lesson[] = [
  // --- MODULE 1: BASICS ---
  {
    id: 'hello_world',
    moduleId: 'basics',
    title: '1. Привет, Python!',
    theory: `### Твоя первая программа на Python!

Добро пожаловать в мир программирования! Python — один из самых популярных и простых в освоении языков в мире. Его используют для создания сайтов, искусственного интеллекта, игр и автоматизации задач.

В Python для вывода информации на экран (в консоль) используется функция \`print()\`. 
Текст, который мы хотим вывести, должен быть заключен в круглые скобки и кавычки (одинарные или двойные):

\`\`\`python
print("Привет, мир!")
print('Python — это круто!')
\`\`\`

> [!NOTE]
> Кавычки сообщают Python, что внутри находится обычный текст (строка), а не команды языка. Одинарные \`'\` и двойные \`"\` кавычки работают абсолютно одинаково. Главное — закрывать той же кавычкой, которой открыли.`,
    taskDescription: `Напиши программу, которая выводит в консоль фразу:
\`Привет, Питон!\` (соблюдай регистр букв и знаки препинания).`,
    starterCode: `# Напиши свой код ниже
`,
    hint: `Используй функцию print() и передай ей в кавычках строку "Привет, Питон!". Например: print("Привет, Питон!")`,
    validate: async (code, pyodide, output, error) => {
      if (error) return { success: false, message: 'Программа завершилась с ошибкой.' };
      const normalizedOutput = output.trim();
      if (normalizedOutput === 'Привет, Питон!') {
        return { success: true };
      }
      if (normalizedOutput.toLowerCase() === 'привет, питон!') {
        return { success: false, message: 'Почти верно, но обрати внимание на регистр букв. Должно быть: "Привет, Питон!" с большой буквы.' };
      }
      return { success: false, message: `Ожидался вывод: "Привет, Питон!", но программа вывела: "${normalizedOutput || 'ничего'}"` };
    },
  },
  {
    id: 'variables',
    moduleId: 'basics',
    title: '2. Переменные и типы данных',
    theory: `### Что такое переменные?

Представь, что переменная — это коробка с наклеенным ярлыком (именем), в которой лежит какое-то значение. Мы можем обращаться к коробке по имени, чтобы узнать, что там лежит, или заменить содержимое.

В Python переменная создается с помощью знака равенства \`=\`. Слева пишется имя переменной, справа — значение:

\`\`\`python
name = "Анна"  # Это строка (str)
age = 25       # Это целое число (int)
height = 1.75  # Это число с плавающей точкой (float)
is_student = True  # Это логический тип (bool) — может быть True или False
\`\`\`

> [!IMPORTANT]
> Имена переменных в Python чувствительны к регистру (\`age\` и \`Age\` — разные переменные), должны начинаться с буквы или знака подчеркивания \`_\` и не могут содержать пробелов. Стиль именования в Python называется **snake_case** (все буквы маленькие, слова разделяются подчеркиванием: \`my_cool_variable\`).`,
    taskDescription: `Создай две переменные:
1. Переменную \`name\` и присвой ей строковое значение \`"Алексей"\`.
2. Переменную \`age\` и присвой ей числовое значение \`20\`.`,
    starterCode: `# Объяви переменные name и age ниже
`,
    hint: `Запиши:
name = "Алексей"
age = 20`,
    validate: async (code, pyodide, output, error) => {
      if (error) return { success: false, message: 'Код содержит ошибки.' };
      try {
        const nameExists = pyodide.globals.has('name');
        const ageExists = pyodide.globals.has('age');
        
        if (!nameExists) {
          return { success: false, message: 'Переменная name не создана.' };
        }
        if (!ageExists) {
          return { success: false, message: 'Переменная age не создана.' };
        }
        
        const nameVal = pyodide.globals.get('name');
        const ageVal = pyodide.globals.get('age');
        
        if (nameVal !== 'Алексей') {
          return { success: false, message: `Переменная name должна быть равна "Алексей" (у тебя: "${nameVal}")` };
        }
        if (ageVal !== 20) {
          return { success: false, message: `Переменная age должна быть равна 20 (у тебя: ${ageVal})` };
        }
        
        return { success: true };
      } catch (e: any) {
        return { success: false, message: 'Не удалось проверить переменные: ' + e.message };
      }
    },
  },
  {
    id: 'arithmetic',
    moduleId: 'basics',
    title: '3. Арифметика в Python',
    theory: `### Математика в Python

Python отлично умеет считать. Вот основные математические операторы:
* \`+\` сложение
* \`-\` вычитание
* \`*\` умножение
* \`/\` обычное деление (всегда дает дробный результат: \`float\`)
* \`//\` деление нацело (отбрасывает дробную часть)
* \`%\` остаток от деления
* \`**\` возведение в степень (например, \`2 ** 3\` равен 8)

Примеры:
\`\`\`python
a = 10 % 3  # Остаток от деления равен 1 (т.к. 10 = 3 * 3 + 1)
b = 5 ** 2  # Возведение в квадрат: 25
c = 7 // 2  # Деление нацело: 3
\`\`\`

Порядок выполнения операций такой же, как в обычной математике (скобки меняют приоритет).`,
    taskDescription: `1. Создай переменную \`rem\` и запиши в нее остаток от деления числа 17 на 5.
2. Создай переменную \`power\` и запиши в нее результат возведения числа 2 в 10-ю степень.`,
    starterCode: `# Выполни математические расчеты
rem = 
power = 
`,
    hint: `Используй оператор % для остатка и ** для возведения в степень.
Например:
rem = 17 % 5
power = 2 ** 10`,
    validate: async (code, pyodide, output, error) => {
      if (error) return { success: false, message: 'Код содержит ошибки.' };
      try {
        if (!pyodide.globals.has('rem')) return { success: false, message: 'Переменная rem отсутствует.' };
        if (!pyodide.globals.has('power')) return { success: false, message: 'Переменная power отсутствует.' };
        
        const remVal = pyodide.globals.get('rem');
        const powerVal = pyodide.globals.get('power');
        
        if (remVal !== 2) return { success: false, message: 'Значение rem неверно. Подсказка: 17 = 3 * 5 + 2, остаток равен 2.' };
        if (powerVal !== 1024) return { success: false, message: 'Значение power неверно. 2 в 10-й степени должно быть 1024.' };
        
        return { success: true };
      } catch (e: any) {
        return { success: false, message: 'Ошибка валидации: ' + e.message };
      }
    },
  },
  {
    id: 'strings',
    moduleId: 'basics',
    title: '4. Работа со строками',
    theory: `### Склеивание строк и другие фокусы

Строки в Python можно складывать (это называется **конкатенация**) и умножать на числа!

\`\`\`python
hello = "Привет"
name = "Антон"
sentence = hello + ", " + name + "!"  # "Привет, Антон!"

echo = "Ау! " * 3  # "Ау! Ау! Ау! "
\`\`\`

Узнать длину строки можно с помощью встроенной функции \`len()\`:
\`\`\`python
length = len("Python")  # Получим 6
\`\`\`

Чтобы взять конкретную букву или часть строки (срез), используются квадратные скобки:
\`\`\`python
word = "Привет"
first_letter = word[0]  # Индексация начинается с 0! Получим 'П'
sub_word = word[0:3]    # Срез от индекса 0 до 3 (не включая 3). Получим 'При'
\`\`\`
`,
    taskDescription: `1. Создай переменную \`word\` со значением \`"Программирование"\`.
2. Создай переменную \`word_len\` и запиши в нее длину переменной \`word\`.
3. Создай переменную \`slice_word\` и запиши в нее срез из первых 5 символов переменной \`word\` (с индексом от 0 до 5, не включая 5).`,
    starterCode: `# Напиши код для работы со строками
word = "Программирование"
word_len = 
slice_word = 
`,
    hint: `Длину можно найти так: len(word). Срез первых пяти символов: word[0:5].`,
    validate: async (code, pyodide, output, error) => {
      if (error) return { success: false, message: 'Код содержит ошибки.' };
      try {
        if (!pyodide.globals.has('word')) return { success: false, message: 'Переменная word отсутствует.' };
        if (!pyodide.globals.has('word_len')) return { success: false, message: 'Переменная word_len отсутствует.' };
        if (!pyodide.globals.has('slice_word')) return { success: false, message: 'Переменная slice_word отсутствует.' };
        
        const wordVal = pyodide.globals.get('word');
        const lenVal = pyodide.globals.get('word_len');
        const sliceVal = pyodide.globals.get('slice_word');
        
        if (wordVal !== 'Программирование') return { success: false, message: 'Переменная word изменена. Она должна содержать "Программирование".' };
        if (lenVal !== 16) return { success: false, message: `Длина слова найдена неверно. Ожидалось 16, получено ${lenVal}. Используй len(word).` };
        if (sliceVal !== 'Прогр') return { success: false, message: `Срез получен неверно. Ожидалось "Прогр", получено "${sliceVal}". Используй word[0:5].` };
        
        return { success: true };
      } catch (e: any) {
        return { success: false, message: 'Ошибка валидации: ' + e.message };
      }
    },
  },

  // --- MODULE 2: FLOW CONTROL ---
  {
    id: 'conditions',
    moduleId: 'flow_control',
    title: '5. Условия (if-elif-else)',
    theory: `### Принятие решений: оператор IF

Программы становятся умными, когда умеют выбирать, какой код выполнять. Для этого служит конструкция \`if\`:

\`\`\`python
age = 18
if age >= 18:
    print("Доступ разрешен")
else:
    print("Вход воспрещен")
\`\`\`

Если вариантов больше, чем два, мы используем \`elif\` (сокращение от else if):

\`\`\`python
score = 85
if score >= 90:
    print("Отлично!")
elif score >= 70:
    print("Хорошо!")
else:
    print("Нужно подучить")
\`\`\`

> [!IMPORTANT]
> Обрати внимание на двоеточие \`:\` в конце строки с условием и **отступы в 4 пробела** на строках с кодом выполнения. В Python отступы обязательны и показывают, какой код относится к условию.

Логические операторы:
* \`and\` (И) — оба условия верны.
* \`or\` (ИЛИ) — хотя бы одно условие верно.
* \`not\` (НЕ) — отрицание (меняет True на False).`,
    taskDescription: `Напиши код, который проверяет переменную \`num\`.
* Если \`num\` больше нуля, программа должна вывести строку: \`положительное\`.
* Если \`num\` меньше нуля, вывести строку: \`отрицательное\`.
* Если \`num\` равен нулю, вывести: \`ноль\`.

Переменная \`num\` уже создана за кулисами тестов, не нужно объявлять ее значение жестко в коде. Просто используй \`num\` в условиях.`,
    starterCode: `# Переменная num будет задана автоматически при тестировании.
# Напиши ветвление if-elif-else ниже:
`,
    hint: `Твой код должен начинаться так:
if num > 0:
    print("положительное")
elif num < 0:
    print("отрицательное")
...`,
    validate: async (code, pyodide, output, error) => {
      if (error) return { success: false, message: 'Код содержит ошибки синтаксиса или выполнения.' };
      try {
        // We will run the code with 3 different values of num
        const testValues = [12, -8, 0];
        const expectedOutputs = ['положительное', 'отрицательное', 'ноль'];
        
        for (let i = 0; i < testValues.length; i++) {
          const val = testValues[i];
          const expected = expectedOutputs[i];
          
          // Reset console output and run with mocked global
          pyodide.globals.set('num', val);
          
          // Clear standard output in Python memory by importing sys and overriding
          // Actually, we can run it within a simple function wrapper in Python or just run it.
          // Since the user is printing, let's catch what they printed.
          // In our runner, stdout is caught. Let's see how we can run and capture.
          // We can run:
          pyodide.runPython(`
import io, sys
sys.stdout = io.StringIO()
`);
          pyodide.runPython(code);
          const valOutput = pyodide.runPython('sys.stdout.getvalue()').trim();
          
          if (valOutput !== expected) {
            return { 
              success: false, 
              message: `Тест не пройден для num = ${val}. Ожидался вывод "${expected}", но твоя программа вывела "${valOutput || 'ничего'}"` 
            };
          }
        }
        
        return { success: true };
      } catch (e: any) {
        return { success: false, message: 'Ошибка во время тестирования кода: ' + e.message };
      }
    },
  },
  {
    id: 'while_loops',
    moduleId: 'flow_control',
    title: '6. Цикл while',
    theory: `### Повторение кода: цикл while

Циклы используются, чтобы повторять действия. Цикл \`while\` (пока) выполняет код внутри себя до тех пор, пока его условие остается истинным (\`True\`).

\`\`\`python
count = 1
while count <= 5:
    print("Шаг", count)
    count = count + 1  # Увеличиваем счетчик (можно записать как count += 1)
\`\`\`

> [!CAUTION]
> Всегда следи за тем, чтобы условие цикла когда-нибудь становилось ложным (\`False\`). Иначе программа зависнет в **бесконечном цикле**, перегрузив компьютер!

Мы можем прервать цикл досрочно с помощью команды \`break\` или пропустить оставшуюся часть итерации с помощью \`continue\`.`,
    taskDescription: `Используя цикл \`while\`, найди сумму всех чисел от 1 до 10 включительно.
Результат запиши в переменную \`total_sum\`.
В коде обязательно должен использоваться цикл \`while\`!`,
    starterCode: `# Найди сумму чисел от 1 до 10 с помощью while
total_sum = 0
number = 1

# Напиши цикл ниже:
`,
    hint: `Запиши условие: while number <= 10:. Внутри цикла прибавляй number к total_sum (total_sum += number) и увеличивай number на 1 (number += 1).`,
    validate: async (code, pyodide, output, error) => {
      if (error) return { success: false, message: 'Код содержит ошибки.' };
      if (!code.includes('while')) {
        return { success: false, message: 'Вы должны использовать цикл while для решения этой задачи!' };
      }
      try {
        if (!pyodide.globals.has('total_sum')) return { success: false, message: 'Переменная total_sum отсутствует.' };
        const sumVal = pyodide.globals.get('total_sum');
        if (sumVal !== 55) {
          return { success: false, message: `Сумма найдена неверно. Ожидалось 55, но получено ${sumVal}.` };
        }
        return { success: true };
      } catch (e: any) {
        return { success: false, message: 'Ошибка валидации: ' + e.message };
      }
    },
  },
  {
    id: 'for_loops',
    moduleId: 'flow_control',
    title: '7. Цикл for и range',
    theory: `### Цикл FOR и диапазоны RANGE

В Python цикл \`for\` проходит по элементам любой последовательности (например, по списку или по буквам в строке).

Если нужно повторить действие определенное количество раз, используют генератор последовательности чисел \`range()\`:
* \`range(5)\` — выдаст числа от 0 до 4 (всего 5 чисел: 0, 1, 2, 3, 4).
* \`range(1, 6)\` — выдаст числа от 1 до 5 (правая граница не включается!).
* \`range(2, 11, 2)\` — выдаст числа от 2 до 10 с шагом 2 (т.е. 2, 4, 6, 8, 10).

Пример:
\`\`\`python
for i in range(1, 4):
    print("Номер", i)
# Выведет: Номер 1, Номер 2, Номер 3
\`\`\`
`,
    taskDescription: `Напиши цикл \`for\`, который выводит в консоль (каждое на новой строке) все **четные** числа от 2 до 20 включительно.`,
    starterCode: `# Используй цикл for и range() для вывода четных чисел от 2 до 20
`,
    hint: `Используй range(2, 21, 2) — это сгенерирует четные числа от 2 до 20. Внутри цикла делай print(i).`,
    validate: async (code, pyodide, output, error) => {
      if (error) return { success: false, message: 'Код содержит ошибки.' };
      if (!code.includes('for') || !code.includes('range')) {
        return { success: false, message: 'Необходимо использовать цикл for и функцию range().' };
      }
      const numbers = output.trim().split(/\s+/).map(Number);
      const expected = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
      
      if (JSON.stringify(numbers) === JSON.stringify(expected)) {
        return { success: true };
      }
      return { success: false, message: `Ожидались числа [2, 4, 6, 8, 10, 12, 14, 16, 18, 20], но твоя программа вывела: [${numbers.join(', ')}]` };
    },
  },

  // --- MODULE 3: DATA STRUCTURES ---
  {
    id: 'lists',
    moduleId: 'data_structures',
    title: '8. Списки (list)',
    theory: `### Хранилища данных: Списки

Список (\`list\`) в Python — это упорядоченная структура, которая может хранить набор любых элементов. В других языках это называется массивом.

Элементы списка записываются через запятую в квадратных скобках:
\`\`\`python
animals = ["кот", "собака", "попугай"]
\`\`\`

Индексация элементов начинается с 0. Можно брать элементы с конца, используя отрицательные индексы (\`-1\` — последний элемент):
\`\`\`python
print(animals[0])   # "кот"
print(animals[-1])  # "попугай"
\`\`\`

Основные операции со списками:
* \`len(animals)\` — получить длину списка (3).
* \`animals.append("слон")\` — добавить элемент в конец списка.
* \`animals.pop()\` — удалить и вернуть последний элемент.
* \`animals.sort()\` — отсортировать список по возрастанию.`,
    taskDescription: `1. Создай список \`fruits\` с тремя строками: \`"banana"\`, \`"apple"\` и \`"cherry"\`.
2. Добавь в конец этого списка элемент \`"orange"\` с помощью метода \`append()\`.
3. Отсортируй список с помощью метода \`sort()\`.
4. Сохрани длину итогового списка в переменную \`fruits_count\`.`,
    starterCode: `# Создай, измени и отсортируй список
`,
    hint: `Запиши:
fruits = ["banana", "apple", "cherry"]
fruits.append("orange")
fruits.sort()
fruits_count = len(fruits)`,
    validate: async (code, pyodide, output, error) => {
      if (error) return { success: false, message: 'Код содержит ошибки.' };
      try {
        if (!pyodide.globals.has('fruits')) return { success: false, message: 'Переменная fruits отсутствует.' };
        if (!pyodide.globals.has('fruits_count')) return { success: false, message: 'Переменная fruits_count отсутствует.' };
        
        const fruitsProxy = pyodide.globals.get('fruits');
        const fruits = fruitsProxy.toJs();
        const count = pyodide.globals.get('fruits_count');
        
        const expected = ["apple", "banana", "cherry", "orange"];
        
        if (JSON.stringify(fruits) !== JSON.stringify(expected)) {
          return { success: false, message: `Список отсортирован неверно. Ожидался: ${JSON.stringify(expected)}, а получен: ${JSON.stringify(fruits)}` };
        }
        if (count !== 4) {
          return { success: false, message: `fruits_count должен быть равен 4 (у тебя ${count}).` };
        }
        
        return { success: true };
      } catch (e: any) {
        return { success: false, message: 'Ошибка валидации списка: ' + e.message };
      }
    },
  },
  {
    id: 'tuples_sets',
    moduleId: 'data_structures',
    title: '9. Кортежи и Множества',
    theory: `### Кортежи и Множества: неизменяемость и уникальность

Кроме списков, в Python есть кортежи (\`tuple\`) и множества (\`set\`).

1. **Кортеж (tuple)** — это **неизменяемый** список. После создания в него нельзя добавить или удалить элементы. Создается в круглых скобках:
\`\`\`python
point = (10, 20, 30)
# point[0] = 5  <- Вызовет ошибку TypeError!
\`\`\`

2. **Множество (set)** — хранит только **уникальные** элементы в случайном порядке. Множество автоматически убирает все дубликаты! Создается с помощью фигурных скобок или функции \`set()\`:
\`\`\`python
unique_names = {"Иван", "Маша", "Иван"}
print(unique_names)  # Выведет только {'Иван', 'Маша'}

# Превращение списка с дублями в уникальный набор:
numbers = [1, 1, 2, 3, 3]
unique_numbers = set(numbers)  # {1, 2, 3}
\`\`\`
`,
    taskDescription: `1. Создай кортеж \`colors\` с тремя цветами: \`"red"\`, \`"green"\`, \`"blue"\`.
2. Создай список с дубликатами: \`dup_list = [1, 2, 2, 3, 3, 3, 4]\`.
3. Создай из списка \`dup_list\` множество \`unique_numbers\`, вызвав функцию \`set(dup_list)\`.`,
    starterCode: `# Создай кортеж colors и множество unique_numbers
colors = 
dup_list = [1, 2, 2, 3, 3, 3, 4]
unique_numbers = 
`,
    hint: `colors должен быть в круглых скобках: colors = ("red", "green", "blue"). Для unique_numbers напиши: unique_numbers = set(dup_list)`,
    validate: async (code, pyodide, output, error) => {
      if (error) return { success: false, message: 'Код содержит ошибки.' };
      try {
        if (!pyodide.globals.has('colors')) return { success: false, message: 'Переменная colors отсутствует.' };
        if (!pyodide.globals.has('unique_numbers')) return { success: false, message: 'Переменная unique_numbers отсутствует.' };
        
        const colorsProxy = pyodide.globals.get('colors');
        const uniqueNumbersProxy = pyodide.globals.get('unique_numbers');
        
        // In python pyodide, tuple type represents as PyProxy
        const isTuple = pyodide.runPython('type(colors) is tuple');
        const isSet = pyodide.runPython('type(unique_numbers) is set');
        
        if (!isTuple) return { success: false, message: 'colors должен быть именно кортежем (tuple), то есть быть объявлен в круглых скобках.' };
        if (!isSet) return { success: false, message: 'unique_numbers должен быть множеством (set).' };
        
        const colorsArr = colorsProxy.toJs();
        const uniqueSet = Array.from(uniqueNumbersProxy.toJs() as any).sort();
        
        if (colorsArr.join(',') !== 'red,green,blue') {
          return { success: false, message: 'Содержимое кортежа colors неверно.' };
        }
        if (uniqueSet.join(',') !== '1,2,3,4') {
          return { success: false, message: 'Содержимое множества unique_numbers неверно. Ожидалось {1, 2, 3, 4}' };
        }
        
        return { success: true };
      } catch (e: any) {
        return { success: false, message: 'Ошибка проверки: ' + e.message };
      }
    },
  },
  {
    id: 'dictionaries',
    moduleId: 'data_structures',
    title: '10. Словари (dict)',
    theory: `### Словари: хранение данных «ключ-значение»

Словарь (\`dict\`) хранит информацию парами: **ключ** и связанное с ним **значение**. Это похоже на телефонную книгу, где по имени человека (ключ) можно найти его номер (значение).

Создается словарь в фигурных скобках через двоеточия:
\`\`\`python
user = {
    "name": "Алина",
    "age": 20,
    "is_admin": False
}
\`\`\`

Доступ к значениям и их изменение осуществляются через квадратные скобки по ключу:
\`\`\`python
print(user["name"])  # "Алина"

# Добавление нового ключа или изменение старого:
user["city"] = "Казань"
user["age"] = 21
\`\`\`
`,
    taskDescription: `Создай словарь \`student\`, содержащий следующие пары:
* Ключ \`"name"\` со значением \`"Иван"\`
* Ключ \`"age"\` со значением \`21\`
* Ключ \`"skills"\` со списком значений \`["Python", "Git"]\`

Затем добавь в словарь \`student\` новое поле:
* Ключ \`"city"\` со значением \`"Москва"\`.`,
    starterCode: `# Создай словарь student и добавь в него поле city
student = {
    
}

# Добавь ключ "city" ниже:
`,
    hint: `Напиши:
student = {
    "name": "Иван",
    "age": 21,
    "skills": ["Python", "Git"]
}
student["city"] = "Москва"`,
    validate: async (code, pyodide, output, error) => {
      if (error) return { success: false, message: 'Код содержит ошибки.' };
      try {
        if (!pyodide.globals.has('student')) return { success: false, message: 'Словарь student не найден.' };
        
        const isDict = pyodide.runPython('type(student) is dict');
        if (!isDict) return { success: false, message: 'student должен быть словарем (dict).' };
        
        const student = pyodide.globals.get('student').toJs();
        
        if (student.get('name') !== 'Иван') return { success: false, message: 'Поле "name" должно быть "Иван".' };
        if (student.get('age') !== 21) return { success: false, message: 'Поле "age" должно быть 21.' };
        
        const skills = student.get('skills');
        if (!Array.isArray(skills) || skills.join(',') !== 'Python,Git') {
          return { success: false, message: 'Поле "skills" должно содержать список ["Python", "Git"].' };
        }
        
        if (student.get('city') !== 'Москва') return { success: false, message: 'Вы забыли добавить поле "city" со значением "Москва".' };
        
        return { success: true };
      } catch (e: any) {
        return { success: false, message: 'Ошибка валидации словаря: ' + e.message };
      }
    },
  },

  // --- MODULE 4: FUNCTIONS ---
  {
    id: 'functions_def',
    moduleId: 'functions',
    title: '11. Создание функций (def)',
    theory: `### Повторное использование кода: Функции

Функция — это именованный блок кода, который выполняет определенную задачу. Мы один раз пишем логику, а потом можем многократно «вызывать» ее из любого места программы.

Функции создаются ключевым словом \`def\`, за которым идет имя, параметры в круглых скобках и двоеточие. Внутри функции используется оператор \`return\` для возвращения результата работы:

\`\`\`python
def greet(name):
    return "Привет, " + name + "!"

# Вызов функции
message = greet("Света")
print(message)  # "Привет, Света!"
\`\`\`

Если мы не пишем \`return\`, функция отработает и вернет пустое значение \`None\`.`,
    taskDescription: `Создай две функции:
1. Функция \`multiply(a, b)\`, которая принимает два числа и возвращает результат их умножения.
2. Функция \`is_even(n)\`, которая принимает целое число и возвращает \`True\`, если число четное, и \`False\`, если нечетное.`,
    starterCode: `# Создай функции multiply и is_even
def multiply(a, b):
    # твой код
    pass

def is_even(n):
    # твой код
    pass
`,
    hint: `В multiply верни a * b. В is_even верни результат сравнения остатка от деления на 2 с нулем: return n % 2 == 0.`,
    validate: async (code, pyodide, output, error) => {
      if (error) return { success: false, message: 'Код содержит ошибки.' };
      try {
        if (!pyodide.globals.has('multiply')) return { success: false, message: 'Функция multiply не создана.' };
        if (!pyodide.globals.has('is_even')) return { success: false, message: 'Функция is_even не создана.' };
        
        const mult = pyodide.globals.get('multiply');
        const isEven = pyodide.globals.get('is_even');
        
        if (mult(3, 5) !== 15 || mult(-2, 10) !== -20) {
          return { success: false, message: 'Функция multiply работает неверно.' };
        }
        
        if (isEven(4) !== true || isEven(7) !== false) {
          return { success: false, message: 'Функция is_even работает неверно.' };
        }
        
        return { success: true };
      } catch (e: any) {
        return { success: false, message: 'Ошибка при вызове ваших функций: ' + e.message };
      }
    },
  },
  {
    id: 'scope',
    moduleId: 'functions',
    title: '12. Области видимости',
    theory: `### Локальные и Глобальные переменные

Переменные, созданные внутри функции, называются **локальными** и видны только внутри этой функции.

Переменные, созданные в основном коде, называются **глобальными** и видны везде. Однако, если мы хотим *изменить* глобальную переменную внутри функции, Python потребует явно указать это с помощью ключевого слова \`global\`:

\`\`\`python
x = 10  # Глобальная переменная

def set_x():
    x = 20  # Создает новую ЛОКАЛЬНУЮ переменную x! Глобальный x остался равен 10.

def modify_x():
    global x  # Сообщаем, что будем менять глобальный x
    x = 50    # Глобальный x теперь равен 50!
\`\`\`
`,
    taskDescription: `1. Создай глобальную переменную \`counter\` и установи ее в значение \`0\`.
2. Создай функцию \`increment()\`, которая при каждом вызове увеличивает значение глобального \`counter\` на 1. Используй ключевое слово \`global\`.`,
    starterCode: `# Объяви counter и напиши функцию increment
counter = 0

def increment():
    # Используй global counter и увеличь counter на 1
`,
    hint: `Внутри функции increment() первой строкой должно идти: global counter. На следующей строке: counter += 1 (или counter = counter + 1).`,
    validate: async (code, pyodide, output, error) => {
      if (error) return { success: false, message: 'Код содержит ошибки.' };
      if (!code.includes('global counter')) {
        return { success: false, message: 'Необходимо использовать "global counter" внутри функции.' };
      }
      try {
        if (!pyodide.globals.has('counter')) return { success: false, message: 'Переменная counter не найдена.' };
        if (!pyodide.globals.has('increment')) return { success: false, message: 'Функция increment не найдена.' };
        
        const inc = pyodide.globals.get('increment');
        
        // Reset counter to 0 just in case and call increment twice
        pyodide.globals.set('counter', 0);
        inc();
        let val = pyodide.globals.get('counter');
        if (val !== 1) return { success: false, message: `После одного вызова increment() counter равен ${val}, а должен быть 1.` };
        
        inc();
        val = pyodide.globals.get('counter');
        if (val !== 2) return { success: false, message: `После второго вызова increment() counter равен ${val}, а должен быть 2.` };
        
        return { success: true };
      } catch (e: any) {
        return { success: false, message: 'Ошибка валидации счетчика: ' + e.message };
      }
    },
  },
  {
    id: 'modules',
    moduleId: 'functions',
    title: '13. Модули и библиотеки',
    theory: `### Модули: расширяем возможности Python

В Python встроена масса полезных библиотек (модулей). Чтобы использовать их, нужно написать команду \`import имя_модуля\`.

Например, модуль \`math\` содержит сложные математические функции и константы:
\`\`\`python
import math

print(math.pi)        # Число Пи (3.1415...)
print(math.sqrt(25))  # Квадратный корень (5.0)
\`\`\`

Модуль \`random\` служит для работы со случайными числами:
\`\`\`python
import random

num = random.randint(1, 10)  # Случайное целое от 1 до 10 включительно
\`\`\`
`,
    taskDescription: `Используй модуль \`math\`:
1. Найди квадратный корень из числа \`144\` и сохрани его в переменную \`root_val\`.
2. Рассчитай площадь круга с радиусом \`r = 5\` по формуле \(S = \pi r^2\). Используй значение \`math.pi\` для \(\pi\) и запиши результат в переменную \`circle_area\`.`,
    starterCode: `# Импортируй модуль math и сделай расчеты
import math

root_val = 
circle_area = 
`,
    hint: `Запиши:
root_val = math.sqrt(144)
circle_area = math.pi * (5 ** 2)`,
    validate: async (code, pyodide, output, error) => {
      if (error) return { success: false, message: 'Код содержит ошибки.' };
      try {
        if (!pyodide.globals.has('root_val')) return { success: false, message: 'Переменная root_val отсутствует.' };
        if (!pyodide.globals.has('circle_area')) return { success: false, message: 'Переменная circle_area отсутствует.' };
        
        const root = pyodide.globals.get('root_val');
        const area = pyodide.globals.get('circle_area');
        
        if (root !== 12.0) return { success: false, message: `Квадратный корень из 144 найден неверно. Ожидалось 12.0, получено ${root}` };
        if (Math.abs(area - 78.5398) > 0.01) return { success: false, message: `Площадь круга вычислена неверно. Ожидалось около 78.54, получено ${area}` };
        
        return { success: true };
      } catch (e: any) {
        return { success: false, message: 'Ошибка валидации расчетов: ' + e.message };
      }
    },
  },

  // --- MODULE 5: ADVANCED & OOP ---
  {
    id: 'oop_classes',
    moduleId: 'advanced_oop',
    title: '14. Классы и объекты (ООП)',
    theory: `### Объектно-Ориентированное Программирование

ООП позволяет объединять данные (переменные) и функции (методы) в единые сущности — **объекты**.
**Класс** — это «чертеж» или шаблон для создания объектов.

\`\`\`python
class Cat:
    # Конструктор класса. Вызывается автоматически при создании котика.
    def __init__(self, name, color):
        self.name = name    # Атрибут объекта
        self.color = color  # Атрибут объекта
        
    # Метод класса
    def meow(self):
        return f"{self.name} говорит: Мяу!"

# Создание объектов класса Cat (экземпляров)
my_cat = Cat("Барсик", "рыжий")
print(my_cat.name)   # "Барсик"
print(my_cat.meow()) # "Барсик говорит: Мяу!"
\`\`\`

> [!NOTE]
> Параметр \`self\` в методах указывает на конкретный объект, с которым мы сейчас работаем. Писать его в аргументах при создании метода обязательно, но при вызове (например, \`my_cat.meow()\`) передавать его вручную не нужно.`,
    taskDescription: `Создай класс \`Dog\`:
1. Напиши конструктор \`__init__(self, name, breed)\`, сохраняющий имя собаки в атрибут \`self.name\`, а породу — в \`self.breed\`.
2. Напиши метод \`bark(self)\`, который возвращает строку: \`"[имя_собаки] гавкает!"\` (например, \`"Рекс гавкает!"\`). Используй f-строку.`,
    starterCode: `# Создай класс Dog
class Dog:
    # Напиши конструктор __init__
    
    # Напиши метод bark
`,
    hint: `Код класса Dog должен выглядеть так:
class Dog:
    def __init__(self, name, breed):
        self.name = name
        self.breed = breed
    def bark(self):
        return f"{self.name} гавкает!"`,
    validate: async (code, pyodide, output, error) => {
      if (error) return { success: false, message: 'Код содержит ошибки синтаксиса.' };
      try {
        if (!pyodide.globals.has('Dog')) return { success: false, message: 'Класс Dog не найден.' };
        
        pyodide.runPython(`
test_dog = Dog("Шарик", "Такса")
test_name = test_dog.name
test_breed = test_dog.breed
test_bark = test_dog.bark()
`);
        
        const name = pyodide.globals.get('test_name');
        const breed = pyodide.globals.get('test_breed');
        const bark = pyodide.globals.get('test_bark');
        
        if (name !== 'Шарик') return { success: false, message: `Конструктор неверно сохраняет имя (ожидалось "Шарик", получено "${name}").` };
        if (breed !== 'Такса') return { success: false, message: `Конструктор неверно сохраняет породу (ожидалось "Такса", получено "${breed}").` };
        if (bark !== 'Шарик гавкает!') return { success: false, message: `Метод bark() вернул неверную строку: "${bark}". Ожидалось: "Шарик гавкает!"` };
        
        return { success: true };
      } catch (e: any) {
        return { success: false, message: 'Ошибка при вызове класса Dog: ' + e.message };
      }
    },
  },
  {
    id: 'oop_inheritance',
    moduleId: 'advanced_oop',
    title: '15. Наследование и полиморфизм',
    theory: `### Наследование классов

Наследование позволяет создать дочерний класс, который автоматически получит все методы и свойства родительского класса, но при этом сможет добавить свои или изменить старые (**переопределение**).

\`\`\`python
class Vehicle:
    def start_engine(self):
        return "Двигатель запущен"

# Car наследует все от Vehicle:
class Car(Vehicle):
    def drive(self):
        return "Машина едет"

my_car = Car()
print(my_car.start_engine()) # "Двигатель запущен" (унаследованный метод)
print(my_car.drive())        # "Машина едет" (собственный метод)
\`\`\`

Если в дочернем классе написать метод с тем же именем, что и в родительском, он заменит его (переопределит). Это и есть полиморфизм.`,
    taskDescription: `1. Создай класс \`Animal\` с методом \`speak(self)\`, который возвращает строку \`"Звук"\`.
2. Создай класс \`Cat(Animal)\` (наследующий \`Animal\`) и переопредели его метод \`speak()\`, чтобы он возвращал строку \`"Мяу"\`.
3. Создай класс \`Cow(Animal)\` (наследующий \`Animal\`) и переопредели его метод \`speak()\`, чтобы он возвращал строку \`"Муу"\`.`,
    starterCode: `# Создай родительский класс Animal и дочерние Cat, Cow
class Animal:
    # твой код
    pass
`,
    hint: `Объяви класс Cat наследующим Animal: class Cat(Animal):. Внутри переопредели метод: def speak(self): return "Мяу". Аналогично для класса Cow.`,
    validate: async (code, pyodide, output, error) => {
      if (error) return { success: false, message: 'Код содержит ошибки.' };
      try {
        if (!pyodide.globals.has('Animal')) return { success: false, message: 'Класс Animal отсутствует.' };
        if (!pyodide.globals.has('Cat')) return { success: false, message: 'Класс Cat отсутствует.' };
        if (!pyodide.globals.has('Cow')) return { success: false, message: 'Класс Cow отсутствует.' };
        
        pyodide.runPython(`
c = Cat()
w = Cow()
c_speak = c.speak()
w_speak = w.speak()
is_cat_animal = isinstance(c, Animal)
is_cow_animal = isinstance(w, Animal)
`);
        const cSpeak = pyodide.globals.get('c_speak');
        const wSpeak = pyodide.globals.get('w_speak');
        const catIsAnimal = pyodide.globals.get('is_cat_animal');
        const cowIsAnimal = pyodide.globals.get('is_cow_animal');
        
        if (!catIsAnimal) return { success: false, message: 'Класс Cat должен наследоваться от Animal (class Cat(Animal):).' };
        if (!cowIsAnimal) return { success: false, message: 'Класс Cow должен наследоваться от Animal (class Cow(Animal):).' };
        
        if (cSpeak !== 'Мяу') return { success: false, message: `Cat.speak() должен возвращать "Мяу" (возвращает: "${cSpeak}").` };
        if (wSpeak !== 'Муу') return { success: false, message: `Cow.speak() должен возвращать "Муу" (возвращает: "${wSpeak}").` };
        
        return { success: true };
      } catch (e: any) {
        return { success: false, message: 'Ошибка валидации наследования: ' + e.message };
      }
    },
  },
  {
    id: 'exceptions',
    moduleId: 'advanced_oop',
    title: '16. Обработка исключений (try-except)',
    theory: `### Обработка ошибок в программе

Ошибки во время выполнения программы (например, деление на ноль или чтение несуществующего файла) называются **исключениями**. Чтобы программа не «вылетала», ошибки можно перехватывать с помощью блока \`try-except\`:

\`\`\`python
try:
    number = int("привет")  # Это вызовет ошибку ValueError
    print("Эта строка не выполнится")
except ValueError:
    print("Не получилось превратить текст в число!")
\`\`\`

Мы можем перехватывать конкретные ошибки (как \`ValueError\` или \`ZeroDivisionError\`) или любые ошибки с помощью общего \`except Exception:\`.`,
    taskDescription: `Напиши функцию \`safe_divide(a, b)\`, которая делит \`a\` на \`b\`.
* Внутри функции используй блок \`try-except\` для перехвата ошибки деления на ноль: \`ZeroDivisionError\`.
* Если деление прошло успешно, верни результат.
* Если возникло деление на ноль, верни строку \`"Деление на ноль невозможно"\`.`,
    starterCode: `# Напиши безопасное деление safe_divide(a, b)
def safe_divide(a, b):
    # твой код
    pass
`,
    hint: `Внутри функции напиши:
try:
    return a / b
except ZeroDivisionError:
    return "Деление на ноль невозможно"`,
    validate: async (code, pyodide, output, error) => {
      if (error) return { success: false, message: 'Код содержит ошибки.' };
      try {
        if (!pyodide.globals.has('safe_divide')) return { success: false, message: 'Функция safe_divide не найдена.' };
        
        const divide = pyodide.globals.get('safe_divide');
        
        if (divide(10, 2) !== 5.0) return { success: false, message: 'Деление 10 / 2 должно возвращать 5.0.' };
        if (divide(10, 0) !== 'Деление на ноль невозможно') {
          return { success: false, message: 'При делении 10 / 0 функция должна возвращать строку "Деление на ноль невозможно".' };
        }
        
        return { success: true };
      } catch (e: any) {
        return { success: false, message: 'Ошибка при вызове safe_divide: ' + e.message };
      }
    },
  },
  {
    id: 'list_comprehensions',
    moduleId: 'advanced_oop',
    title: '17. Списковые включения (List Comprehension)',
    theory: `### Однострочники Python: Списковые включения

В Python есть элегантный способ быстро создавать новые списки из старых в одну строчку. Это называется **List Comprehension** (списковое включение).

Обычный способ создать список квадратов чисел:
\`\`\`python
squares = []
for x in range(1, 6):
    squares.append(x ** 2)
\`\`\`

Через списковое включение это пишется гораздо лаконичнее:
\`\`\`python
squares = [x ** 2 for x in range(1, 6)]  # [1, 4, 9, 16, 25]
\`\`\`

Мы можем добавлять фильтрацию с помощью \`if\`:
\`\`\`python
# Оставляем только четные числа:
evens = [x for x in range(1, 10) if x % 2 == 0]  # [2, 4, 6, 8]
\`\`\`
`,
    taskDescription: `Дан список чисел: \`nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\`.
Используя **списковое включение (List Comprehension)** в одну строку, создай новый список \`squared_evens\`, который будет содержать квадраты только **четных** чисел из списка \`nums\`.`,
    starterCode: `nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
# Создай список squared_evens ниже
squared_evens = 
`,
    hint: `Формула должна выглядеть так: [x ** 2 for x in nums if x % 2 == 0]`,
    validate: async (code, pyodide, output, error) => {
      if (error) return { success: false, message: 'Код содержит ошибки.' };
      if (!code.includes('for') || !code.includes('if')) {
        return { success: false, message: 'Вы должны использовать списковое включение с циклом for и условием if.' };
      }
      try {
        if (!pyodide.globals.has('squared_evens')) return { success: false, message: 'Переменная squared_evens не найдена.' };
        
        const proxy = pyodide.globals.get('squared_evens');
        const result = proxy.toJs();
        const expected = [4, 16, 36, 64, 100];
        
        if (JSON.stringify(result) !== JSON.stringify(expected)) {
          return { success: false, message: `Результат неверный. Ожидалось: ${JSON.stringify(expected)}, а получено: ${JSON.stringify(result)}` };
        }
        
        return { success: true };
      } catch (e: any) {
        return { success: false, message: 'Ошибка валидации: ' + e.message };
      }
    },
  },
  {
    id: 'file_operations',
    moduleId: 'advanced_oop',
    title: '18. Работа с файлами',
    theory: `### Чтение и Запись файлов

Python умеет открывать файлы на чтение (\`r\`) и запись (\`w\`).
Для надежности файлы открывают с помощью оператора \`with\` (контекстного менеджера) — так файл автоматически закроется после окончания работы, даже если в программе произойдет ошибка:

\`\`\`python
# Запись в файл:
with open("test.txt", "w", encoding="utf-8") as f:
    f.write("Привет, файл!")

# Чтение из файла:
with open("test.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)  # "Привет, файл!"
\`\`\`

> [!TIP]
> Параметр \`encoding="utf-8"\` обязателен при работе с русским текстом, чтобы буквы отображались правильно.`,
    taskDescription: `1. Открой файл с именем \`"learning.txt"\` в режиме записи (\`"w"\`) и запиши туда строку \`"Я учу Python!"\`.
2. Затем открой этот же файл в режиме чтения (\`"r"\`), прочитай его содержимое и сохрани в переменную \`file_content\`.`,
    starterCode: `# Запиши строку в файл learning.txt, затем прочитай в file_content
`,
    hint: `Напиши:
with open("learning.txt", "w", encoding="utf-8") as f:
    f.write("Я учу Python!")

with open("learning.txt", "r", encoding="utf-8") as f:
    file_content = f.read()`,
    validate: async (code, pyodide, output, error) => {
      if (error) return { success: false, message: 'Код содержит ошибки.' };
      if (!code.includes('with open') || !code.includes('learning.txt')) {
        return { success: false, message: 'Используйте конструкцию with open() для работы с файлом "learning.txt".' };
      }
      try {
        if (!pyodide.globals.has('file_content')) return { success: false, message: 'Переменная file_content не найдена.' };
        
        const content = pyodide.globals.get('file_content');
        if (content !== 'Я учу Python!') {
          return { success: false, message: `Содержимое файла прочитано неверно: "${content}". Ожидалось: "Я учу Python!"` };
        }
        
        return { success: true };
      } catch (e: any) {
        return { success: false, message: 'Ошибка при проверке файловых операций: ' + e.message };
      }
    },
  },
];
