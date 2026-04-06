/* ============================================================
   Cronograma Study — Application Logic
   script.js
============================================================ */

// ══ STATE ══
let state = JSON.parse(localStorage.getItem('cs_state') || 'null') || {
  xp: 0, level: 1, streak: 0, lastActiveDate: null,
  tasksCompleted: 0, gamesCompleted: 0,
  dayData: {}, achievements: {},
  langProgress: { py: 0, js: 0, sol: 0, ts: 0, html: 0 },
  streakDays: [],
};

const XP_PER_LEVEL = 200;
let currentLang = 'pt'; // Sempre inicia em Português (Brasil)
let darkTheme = localStorage.getItem('cs_theme') !== 'light';
let currentCalMonth = new Date().getMonth();
let currentCalYear = 2026;
let selectedDate = null;
let currentLesson = null;

// ══ TRANSLATIONS ══
const i18n = {
  pt: {
    dashboard:'Dashboard', schedule:'Cronograma', programming:'Programação',
    games:'Mini-Games', achievements:'Conquistas',
    'total-xp':'XP Total', level:'Nível', streak:'Sequência',
    'tasks-done':'Missões Completas', 'achievements-earned':'Conquistas',
    'games-played':'Jogos Completos', 'this-week':'Esta Semana',
    'lang-progress':'Progresso por Linguagem', 'recent-ach':'Conquistas Recentes',
    'today-tasks':'Missões de Hoje', 'no-tasks-today':'Nenhuma missão para hoje. Vá ao Cronograma para adicionar!',
    'schedule-title':'Cronograma 2026','schedule-sub':'Clique em um dia para ver e gerenciar suas missões',
    monthly:'Mensal', yearly:'Anual',
    notes:'Anotações', add:'Adicionar', save:'Salvar',
    'programming-title':'Aprendizado de Programação','programming-sub':'Escolha uma linguagem e comece a explorar',
    beginner:'Iniciante', intermediate:'Intermediário', advanced:'Avançado', challenge:'Desafio',
    'lesson-variables':'Variáveis & Tipos','lesson-variables-desc':'Aprenda a armazenar e trabalhar com diferentes tipos de dados.',
    'lesson-loops':'Loops & Iteração','lesson-loops-desc':'Repita ações com loops for e while.',
    'lesson-functions':'Funções','lesson-functions-desc':'Organize o código em blocos reutilizáveis.',
    'lesson-lists':'Listas & Dicionários','lesson-lists-desc':'Colete e organize dados de forma eficiente.',
    'lesson-oop':'Classes & OOP','lesson-oop-desc':'Programação orientada a objetos em Python.',
    'lesson-challenge':'Mini Projeto','lesson-challenge-desc':'Aplique o que aprendeu em um projeto real.',
    'py-desc':'Linguagem versátil, ideal para iniciantes, dados e IA.',
    'js-desc':'A linguagem da web — desde interatividade até aplicações full-stack.',
    'sol-desc':'Linguagem para smart contracts na blockchain Ethereum.',
    'ts-desc':'JavaScript com tipos estáticos para um código mais robusto.',
    'html-desc':'A base da web — estrutura e estilo.',
    'games-title':'Mini-Games de Programação','games-sub':'Aprenda jogando — ganhe XP e conquistas!',
    'game-quiz':'Quiz','game-quiz-desc':'Responda perguntas de múltipla escolha sobre programação.',
    'game-code':'Complete o Código','game-code-desc':'Preencha os espaços em branco no código correto.',
    'game-debug':'Encontre o Bug','game-debug-desc':'Identifique o erro no código — você consegue?',
    'game-logic':'Lógica','game-logic-desc':'Desafios de lógica e raciocínio computacional.',
    question:'Pergunta', next:'Próxima →', finish:'Finalizar 🎉', check:'Verificar ✓',
    'debug-inst':'Clique na linha que contém o erro.',
    'achievements-title':'Conquistas & Recompensas','achievements-sub':'Complete missões para desbloquear conquistas épicas!',
    focus:'Foco','focus-ready':'Pronto para focar?',start:'Iniciar',pause:'Pausar',close:'Fechar',
    'lesson-done':'Lição Concluída! +30 XP',
    'dash-sub':'Sua central de progresso e missões',
    'js-dom-desc':'Interaja e modifique elementos HTML com JavaScript.',
    'js-events-desc':'Responda a cliques, teclas e outras interações.',
    'js-async-desc':'Trabalhe com operações assíncronas e a fetch API.',
    'js-es6-desc':'Arrow functions, destructuring, spread e muito mais.',
    'sol-contracts-desc':'O que são e como criar o seu primeiro contrato.',
    'sol-tokens-desc':'Crie o seu próprio token na blockchain.',
    'sol-nft-desc':'Crie tokens não fungíveis únicos.',
    'ts-types-desc':'Defina tipos e interfaces para estruturar dados.',
    'ts-generics-desc':'Funções e classes reutilizáveis com tipos dinâmicos.',
    'html-basics':'Estrutura HTML','html-basics-desc':'Tags, elementos e a anatomia de uma página web.',
    'html-flex-desc':'Layouts modernos e responsivos com CSS.',
    'html-anim-desc':'Dê vida às páginas com transições e animações.',
  },
  en: {
    dashboard:'Dashboard', schedule:'Schedule', programming:'Programming',
    games:'Mini-Games', achievements:'Achievements',
    'total-xp':'Total XP', level:'Level', streak:'Streak',
    'tasks-done':'Missions Done', 'achievements-earned':'Achievements',
    'games-played':'Games Played', 'this-week':'This Week',
    'lang-progress':'Progress by Language', 'recent-ach':'Recent Achievements',
    'today-tasks':"Today's Missions", 'no-tasks-today':"No missions today. Go to Schedule to add some!",
    'schedule-title':'Schedule 2026','schedule-sub':'Click a day to view and manage your missions',
    monthly:'Monthly', yearly:'Yearly',
    notes:'Notes', add:'Add', save:'Save',
    'programming-title':'Programming Learning','programming-sub':'Choose a language and start exploring',
    beginner:'Beginner', intermediate:'Intermediate', advanced:'Advanced', challenge:'Challenge',
    'lesson-variables':'Variables & Types','lesson-variables-desc':'Learn to store and work with different data types.',
    'lesson-loops':'Loops & Iteration','lesson-loops-desc':'Repeat actions with for and while loops.',
    'lesson-functions':'Functions','lesson-functions-desc':'Organise code in reusable, modular blocks.',
    'lesson-lists':'Lists & Dictionaries','lesson-lists-desc':'Collect and organise data efficiently.',
    'lesson-oop':'Classes & OOP','lesson-oop-desc':'Object-oriented programming in Python.',
    'lesson-challenge':'Mini Project','lesson-challenge-desc':'Apply what you learned in a real project.',
    'py-desc':'Versatile language ideal for beginners, data science, and AI.',
    'js-desc':'The language of the web — from interactivity to full-stack apps.',
    'sol-desc':'Language for smart contracts on the Ethereum blockchain.',
    'ts-desc':'JavaScript with static types for more robust code.',
    'html-desc':'The foundation of the web — structure and style.',
    'games-title':'Programming Mini-Games','games-sub':'Learn by playing — earn XP and achievements!',
    'game-quiz':'Quiz','game-quiz-desc':'Answer multiple-choice questions about programming.',
    'game-code':'Complete the Code','game-code-desc':'Fill in the blanks in the correct code.',
    'game-debug':'Find the Bug','game-debug-desc':'Identify the error in the code — can you do it?',
    'game-logic':'Logic','game-logic-desc':'Logic and computational reasoning challenges.',
    question:'Question', next:'Next →', finish:'Finish 🎉', check:'Verify ✓',
    'debug-inst':'Click the line that contains the error.',
    'achievements-title':'Achievements & Rewards','achievements-sub':'Complete missions to unlock epic achievements!',
    focus:'Focus','focus-ready':'Ready to focus?',start:'Start',pause:'Pause',close:'Close',
    'lesson-done':'Lesson Done! +30 XP',
    'dash-sub':'Your progress and mission hub',
    'js-dom-desc':'Interact with and modify HTML elements using JavaScript.',
    'js-events-desc':'Respond to clicks, keys, and other interactions.',
    'js-async-desc':'Work with async operations and the fetch API.',
    'js-es6-desc':'Arrow functions, destructuring, spread and more.',
    'sol-contracts-desc':'What they are and how to create your first contract.',
    'sol-tokens-desc':'Create your own token on the blockchain.',
    'sol-nft-desc':'Create unique non-fungible tokens.',
    'ts-types-desc':'Define types and interfaces to structure data.',
    'ts-generics-desc':'Reusable functions and classes with dynamic types.',
    'html-basics':'HTML Structure','html-basics-desc':'Tags, elements, and the anatomy of a web page.',
    'html-flex-desc':'Modern and responsive layouts with CSS.',
    'html-anim-desc':'Bring pages to life with transitions and animations.',
  }
};

function t(key) { return i18n[currentLang][key] || key; }

// ══ ACHIEVEMENTS ══
const ACHIEVEMENTS_DEF = [
  { id:'first_task', icon:'⭐', name_pt:'Primeira Missão', name_en:'First Mission', desc_pt:'Complete a sua primeira missão', desc_en:'Complete your first mission', condition: s => s.tasksCompleted >= 1 },
  { id:'five_tasks', icon:'🌟', name_pt:'5 Missões', name_en:'5 Missions', desc_pt:'Complete 5 missões', desc_en:'Complete 5 missions', condition: s => s.tasksCompleted >= 5 },
  { id:'twenty_tasks', icon:'💫', name_pt:'20 Missões', name_en:'20 Missions', desc_pt:'Complete 20 missões', desc_en:'Complete 20 missions', condition: s => s.tasksCompleted >= 20 },
  { id:'level5', icon:'🏅', name_pt:'Nível 5', name_en:'Level 5', desc_pt:'Alcance o nível 5', desc_en:'Reach level 5', condition: s => s.level >= 5 },
  { id:'level10', icon:'🥇', name_pt:'Nível 10', name_en:'Level 10', desc_pt:'Alcance o nível 10', desc_en:'Reach level 10', condition: s => s.level >= 10 },
  { id:'streak3', icon:'🔥', name_pt:'3 Dias Seguidos', name_en:'3-Day Streak', desc_pt:'Mantenha 3 dias de sequência', desc_en:'Keep a 3-day streak', condition: s => s.streak >= 3 },
  { id:'streak7', icon:'🌊', name_pt:'Semana Perfeita', name_en:'Perfect Week', desc_pt:'7 dias seguidos!', desc_en:'7 days in a row!', condition: s => s.streak >= 7 },
  { id:'first_quiz', icon:'🧠', name_pt:'Quiz Master', name_en:'Quiz Master', desc_pt:'Complete um quiz', desc_en:'Complete a quiz', condition: s => s.gamesCompleted >= 1 },
  { id:'xp500', icon:'💎', name_pt:'500 XP', name_en:'500 XP', desc_pt:'Ganhe 500 XP total', desc_en:'Earn 500 total XP', condition: s => s.xp >= 500 },
  { id:'xp1000', icon:'👑', name_pt:'Mil XP!', name_en:'Thousand XP!', desc_pt:'Ganhe 1000 XP total', desc_en:'Earn 1000 total XP', condition: s => s.xp >= 1000 },
  { id:'first_lesson', icon:'📖', name_pt:'Estudioso', name_en:'Scholar', desc_pt:'Complete uma lição', desc_en:'Complete a lesson', condition: s => Object.values(s.langProgress).some(v=>v>0) },
  { id:'all_langs', icon:'🌍', name_pt:'Poliglota', name_en:'Polyglot', desc_pt:'Aprenda em todas as linguagens', desc_en:'Study all languages', condition: s => Object.values(s.langProgress).every(v=>v>0) },
];

// ══ QUIZ DATA ══
const QUIZ_QUESTIONS = [
  { q:'O que faz o comando `print()` em Python?', q_en:'What does the `print()` command do in Python?', opts:['Escreve na tela','Apaga arquivos','Cria variáveis','Fecha o programa'], opts_en:['Writes to screen','Deletes files','Creates variables','Closes the program'], ans:0 },
  { q:'Qual é o operador de igualdade estrita em JavaScript?', q_en:'What is the strict equality operator in JavaScript?', opts:['=','==','===','!=='], opts_en:['=','==','===','!=='], ans:2 },
  { q:'O que significa HTML?', q_en:'What does HTML stand for?', opts:['HyperText Markup Language','High Tech Modern Language','Home Tool Markup Language','HyperText Machine Learning'], opts_en:['HyperText Markup Language','High Tech Modern Language','Home Tool Markup Language','HyperText Machine Learning'], ans:0 },
  { q:'Como se cria uma lista em Python?', q_en:'How do you create a list in Python?', opts:['list = {}','list = []','list = ()','list = <>'], opts_en:['list = {}','list = []','list = ()','list = <>'], ans:1 },
  { q:'Em Solidity, qual keyword define um contrato?', q_en:'In Solidity, which keyword defines a contract?', opts:['class','contract','function','struct'], opts_en:['class','contract','function','struct'], ans:1 },
  { q:'Qual tipo de dado em TypeScript representa texto?', q_en:'Which TypeScript type represents text?', opts:['int','char','string','text'], opts_en:['int','char','string','text'], ans:2 },
  { q:'O que é um loop `for` em programação?', q_en:'What is a `for` loop in programming?', opts:['Uma variável','Uma condição','Uma repetição','Uma função'], opts_en:['A variable','A condition','A repetition','A function'], ans:2 },
  { q:'Em CSS, qual propriedade define a cor do fundo?', q_en:'In CSS, which property defines background color?', opts:['color','background-color','bg-color','fill'], opts_en:['color','background-color','bg-color','fill'], ans:1 },
  { q:'O que é uma função em programação?', q_en:'What is a function in programming?', opts:['Um número','Um bloco de código reutilizável','Uma pasta de arquivos','Um tipo de dado'], opts_en:['A number','A reusable block of code','A folder of files','A data type'], ans:1 },
  { q:'O que o operador `+` faz com strings em JavaScript?', q_en:'What does the `+` operator do in JavaScript with strings?', opts:['Soma números','Concatena strings','Divide texto','Cria arrays'], opts_en:['Adds numbers','Concatenates strings','Divides text','Creates arrays'], ans:1 },
];

const CODE_CHALLENGES = [
  { title:'Python: Hello World', description_pt:'Complete o código para imprimir "Hello, World!"', description_en:'Complete the code to print "Hello, World!"', before:'# Imprime uma mensagem\n', placeholder:'___("Hello, World!")', after:'', answer:'print' },
  { title:'JavaScript: Arrow Function', description_pt:'Complete a arrow function que dobra um número.', description_en:'Complete the arrow function that doubles a number.', before:'const double = ', placeholder:'___ => num * 2', after:'\nconsole.log(double(5)); // 10', answer:'num' },
  { title:'Python: Lista', description_pt:'Complete a lista com uma terceira fruta.', description_en:'Complete the list with a third fruit.', before:'frutas = ', placeholder:'["maçã", "banana", ___]', after:'\nprint(len(frutas))', answer:'"laranja"' },
];

const DEBUG_CHALLENGES = [
  { title:'Python Bug', desc_pt:'Uma linha tem um erro de digitação.', desc_en:'One line has a typo.',
    lines:['def greet(name):','    mesage = "Hello, " + name','    print(mesage)','greet("Alice")'],
    bugLine:1, fix_pt:'Erro: `mesage` deveria ser `message`.', fix_en:'Bug: `mesage` should be `message`.' },
  { title:'JavaScript Bug', desc_pt:'Encontre o bug neste código.', desc_en:'Find the bug in this code.',
    lines:['const arr = [1, 2, 3];','for (let i = 0; i <= arr.length; i++) {','  console.log(arr[i]);','}'],
    bugLine:1, fix_pt:'Bug: `<=` deveria ser `<` — senão acessa um índice fora do array.', fix_en:'Bug: `<=` should be `<` — otherwise it accesses an out-of-bounds index.' },
];

const LOGIC_CHALLENGES = [
  { q_pt:'Se `x = 5` e `y = x * 2 + 3`, qual é o valor de `y`?', q_en:'If `x = 5` and `y = x * 2 + 3`, what is the value of `y`?', type:'number', answer:'13' },
  { q_pt:'Quantas vezes o loop abaixo imprime?\n`for i in range(3):`\n`    print(i)`', q_en:'How many times does the loop below print?\n`for i in range(3):`\n`    print(i)`', type:'number', answer:'3' },
  { q_pt:'Qual é o resultado de `"abc"[1]` em Python?', q_en:'What is the result of `"abc"[1]` in Python?', type:'text', answer:'b' },
];

// ══ LESSON CONTENT ══
const LESSON_CONTENT = {
  py: {
    variables: {
      title_pt:'Variáveis & Tipos em Python', title_en:'Variables & Types in Python',
      content_pt:`<p>Em Python, variáveis são criadas automaticamente quando você atribui um valor.</p>
<pre>nome = "Alice"        # string
idade = 25            # inteiro (int)
altura = 1.75         # decimal (float)
ativo = True          # booleano (bool)

print(type(nome))     # &lt;class 'str'&gt;</pre>
<p><strong>Exercício:</strong> Crie uma variável com o seu nome e outra com o seu ano de nascimento. Imprima ambas.</p>`,
      content_en:`<p>In Python, variables are created automatically when you assign a value.</p>
<pre>name = "Alice"        # string
age = 25              # integer (int)
height = 1.75         # float
active = True         # boolean (bool)

print(type(name))     # &lt;class 'str'&gt;</pre>
<p><strong>Exercise:</strong> Create a variable with your name and another with your birth year. Print both.</p>`,
    },
    loops: {
      title_pt:'Loops em Python', title_en:'Loops in Python',
      content_pt:`<p>Loops permitem repetir código. O <code>for</code> itera sobre sequências, o <code>while</code> repete enquanto uma condição for verdadeira.</p>
<pre># for loop
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# while loop
contador = 0
while contador < 3:
    print(contador)
    contador += 1</pre>
<p><strong>Exercício:</strong> Escreva um loop que imprime os números de 1 a 10.</p>`,
      content_en:`<p>Loops allow you to repeat code. <code>for</code> iterates over sequences, <code>while</code> repeats while a condition is true.</p>
<pre># for loop
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# while loop
counter = 0
while counter < 3:
    print(counter)
    counter += 1</pre>
<p><strong>Exercise:</strong> Write a loop that prints numbers from 1 to 10.</p>`,
    },
    functions: {
      title_pt:'Funções em Python', title_en:'Functions in Python',
      content_pt:`<p>Funções organizam código em blocos reutilizáveis usando a palavra-chave <code>def</code>.</p>
<pre>def saudacao(nome):
    return f"Olá, {nome}!"

mensagem = saudacao("Maria")
print(mensagem)  # Olá, Maria!

# Função com valor padrão
def potencia(base, exp=2):
    return base ** exp

print(potencia(3))    # 9
print(potencia(3, 3)) # 27</pre>`,
      content_en:`<p>Functions organise code into reusable blocks using the <code>def</code> keyword.</p>
<pre>def greet(name):
    return f"Hello, {name}!"

message = greet("Maria")
print(message)  # Hello, Maria!

def power(base, exp=2):
    return base ** exp

print(power(3))    # 9
print(power(3, 3)) # 27</pre>`,
    },
    lists: {
      title_pt:'Listas & Dicionários', title_en:'Lists & Dictionaries',
      content_pt:`<p>Listas armazenam sequências ordenadas. Dicionários armazenam pares chave-valor.</p>
<pre>frutas = ["maçã", "banana", "laranja"]
frutas.append("manga")
print(frutas[0])  # maçã

pessoa = {
    "nome": "João",
    "idade": 30,
    "cidade": "São Paulo"
}
print(pessoa["nome"])  # João</pre>`,
      content_en:`<p>Lists store ordered sequences. Dictionaries store key-value pairs.</p>
<pre>fruits = ["apple", "banana", "orange"]
fruits.append("mango")
print(fruits[0])  # apple

person = {
    "name": "John",
    "age": 30,
    "city": "New York"
}
print(person["name"])  # John</pre>`,
    },
    oop: {
      title_pt:'Classes & OOP', title_en:'Classes & OOP',
      content_pt:`<p>A Programação Orientada a Objetos organiza código em classes e objetos.</p>
<pre>class Animal:
    def __init__(self, nome, som):
        self.nome = nome
        self.som = som

    def falar(self):
        return f"{self.nome} faz: {self.som}!"

cachorro = Animal("Rex", "Au")
print(cachorro.falar())  # Rex faz: Au!</pre>`,
      content_en:`<p>Object-Oriented Programming organises code into classes and objects.</p>
<pre>class Animal:
    def __init__(self, name, sound):
        self.name = name
        self.sound = sound

    def speak(self):
        return f"{self.name} says: {self.sound}!"

dog = Animal("Rex", "Woof")
print(dog.speak())  # Rex says: Woof!</pre>`,
    },
    challenge: {
      title_pt:'Mini Projeto Python', title_en:'Python Mini Project',
      content_pt:`<p>Crie uma calculadora simples com as 4 operações básicas.</p>
<pre>def calcular(a, operacao, b):
    if operacao == "+":
        return a + b
    elif operacao == "-":
        return a - b
    elif operacao == "*":
        return a * b
    elif operacao == "/":
        if b != 0:
            return a / b
        return "Erro: divisão por zero!"
    return "Operação inválida"

print(calcular(10, "+", 5))  # 15
print(calcular(10, "/", 2))  # 5.0</pre>
<p><strong>Desafio:</strong> Adicione suporte para potenciação (<code>**</code>) e módulo (<code>%</code>).</p>`,
      content_en:`<p>Create a simple calculator with the 4 basic operations.</p>
<pre>def calculate(a, operation, b):
    if operation == "+":
        return a + b
    elif operation == "-":
        return a - b
    elif operation == "*":
        return a * b
    elif operation == "/":
        if b != 0:
            return a / b
        return "Error: division by zero!"
    return "Invalid operation"

print(calculate(10, "+", 5))  # 15
print(calculate(10, "/", 2))  # 5.0</pre>
<p><strong>Challenge:</strong> Add support for exponentiation (<code>**</code>) and modulo (<code>%</code>).</p>`,
    },
  },
  js: {
    dom: {
      title_pt:'DOM em JavaScript', title_en:'DOM in JavaScript',
      content_pt:`<p>O DOM permite manipular elementos HTML com JavaScript.</p>
<pre>// Selecionar elementos
const titulo = document.getElementById("titulo");
const botoes = document.querySelectorAll(".btn");

// Modificar conteúdo
titulo.textContent = "Olá, Mundo!";
titulo.style.color = "blue";

// Criar elementos
const novoEl = document.createElement("p");
novoEl.textContent = "Sou novo!";
document.body.appendChild(novoEl);</pre>`,
      content_en:`<p>The DOM lets you manipulate HTML elements with JavaScript.</p>
<pre>// Select elements
const title = document.getElementById("title");
const buttons = document.querySelectorAll(".btn");

// Modify content
title.textContent = "Hello, World!";
title.style.color = "blue";

// Create elements
const newEl = document.createElement("p");
newEl.textContent = "I'm new!";
document.body.appendChild(newEl);</pre>`,
    },
    events: {
      title_pt:'Eventos em JavaScript', title_en:'Events in JavaScript',
      content_pt:`<p>Eventos respondem a interações do usuário.</p>
<pre>const botao = document.getElementById("btn");

botao.addEventListener("click", function() {
  alert("Você clicou no botão!");
});

document.addEventListener("keydown", (e) => {
  console.log("Tecla pressionada:", e.key);
});</pre>`,
      content_en:`<p>Events respond to user interactions.</p>
<pre>const button = document.getElementById("btn");

button.addEventListener("click", function() {
  alert("You clicked the button!");
});

document.addEventListener("keydown", (e) => {
  console.log("Key pressed:", e.key);
});</pre>`,
    },
    async: {
      title_pt:'Async & Promises', title_en:'Async & Promises',
      content_pt:`<p>JavaScript é assíncrono. Promises e async/await gerenciam operações demoradas.</p>
<pre>// Promise
fetch("https://api.exemplo.com/dados")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Async/Await
async function obterDados() {
  try {
    const res = await fetch("https://api.exemplo.com");
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}</pre>`,
      content_en:`<p>JavaScript is asynchronous. Promises and async/await manage long operations.</p>
<pre>// Promise
fetch("https://api.example.com/data")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Async/Await
async function getData() {
  try {
    const res = await fetch("https://api.example.com");
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}</pre>`,
    },
    es6: {
      title_pt:'ES6+ Features', title_en:'ES6+ Features',
      content_pt:`<p>JavaScript moderno tem muitas funcionalidades poderosas.</p>
<pre>// Arrow functions
const soma = (a, b) => a + b;

// Destructuring
const { nome, idade } = pessoa;
const [primeiro, ...resto] = array;

// Template literals
const msg = \`Olá, \${nome}! Você tem \${idade} anos.\`;

// Spread operator
const novo = [...arr1, ...arr2];
const merged = { ...obj1, ...obj2 };

// Optional chaining
const cidade = user?.address?.city ?? "Desconhecida";</pre>`,
      content_en:`<p>Modern JavaScript has many powerful features.</p>
<pre>// Arrow functions
const add = (a, b) => a + b;

// Destructuring
const { name, age } = person;
const [first, ...rest] = array;

// Template literals
const msg = \`Hello, \${name}! You are \${age} years old.\`;

// Spread operator
const merged_arr = [...arr1, ...arr2];
const merged_obj = { ...obj1, ...obj2 };

// Optional chaining
const city = user?.address?.city ?? "Unknown";</pre>`,
    },
  },
  sol: {
    contracts: {
      title_pt:'Smart Contracts em Solidity', title_en:'Smart Contracts in Solidity',
      content_pt:`<p>Smart contracts são programas que rodam na blockchain Ethereum.</p>
<pre>// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MeuPrimeiro {
    string public mensagem;

    constructor(string memory _msg) {
        mensagem = _msg;
    }

    function atualizar(string memory _nova) public {
        mensagem = _nova;
    }
}</pre>`,
      content_en:`<p>Smart contracts are programs that run on the Ethereum blockchain.</p>
<pre>// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyFirst {
    string public message;

    constructor(string memory _msg) {
        message = _msg;
    }

    function update(string memory _new) public {
        message = _new;
    }
}</pre>`,
    },
    tokens: {
      title_pt:'Tokens ERC-20', title_en:'ERC-20 Tokens',
      content_pt:`<p>ERC-20 é o padrão para tokens fungíveis na Ethereum.</p>
<pre>pragma solidity ^0.8.0;

contract MeuToken {
    string public name = "MeuToken";
    string public symbol = "MTK";
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    constructor(uint256 _supply) {
        totalSupply = _supply;
        balanceOf[msg.sender] = _supply;
    }

    function transfer(address _to, uint256 _val) public {
        require(balanceOf[msg.sender] >= _val);
        balanceOf[msg.sender] -= _val;
        balanceOf[_to] += _val;
    }
}</pre>`,
      content_en:`<p>ERC-20 is the standard for fungible tokens on Ethereum.</p>
<pre>pragma solidity ^0.8.0;

contract MyToken {
    string public name = "MyToken";
    string public symbol = "MTK";
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    constructor(uint256 _supply) {
        totalSupply = _supply;
        balanceOf[msg.sender] = _supply;
    }

    function transfer(address _to, uint256 _val) public {
        require(balanceOf[msg.sender] >= _val);
        balanceOf[msg.sender] -= _val;
        balanceOf[_to] += _val;
    }
}</pre>`,
    },
    nft: {
      title_pt:'NFTs (ERC-721)', title_en:'NFTs (ERC-721)',
      content_pt:`<p>ERC-721 é o padrão para tokens não fungíveis (NFTs).</p>
<pre>pragma solidity ^0.8.0;

contract MeuNFT {
    uint256 public tokenCount;
    mapping(uint256 => address) public ownerOf;

    event Transfer(address from, address to, uint256 tokenId);

    function mint(address _to) public {
        tokenCount++;
        ownerOf[tokenCount] = _to;
        emit Transfer(address(0), _to, tokenCount);
    }

    function transfer(address _to, uint256 _id) public {
        require(ownerOf[_id] == msg.sender);
        ownerOf[_id] = _to;
        emit Transfer(msg.sender, _to, _id);
    }
}</pre>`,
      content_en:`<p>ERC-721 is the standard for non-fungible tokens (NFTs).</p>
<pre>pragma solidity ^0.8.0;

contract MyNFT {
    uint256 public tokenCount;
    mapping(uint256 => address) public ownerOf;

    event Transfer(address from, address to, uint256 tokenId);

    function mint(address _to) public {
        tokenCount++;
        ownerOf[tokenCount] = _to;
        emit Transfer(address(0), _to, tokenCount);
    }

    function transfer(address _to, uint256 _id) public {
        require(ownerOf[_id] == msg.sender);
        ownerOf[_id] = _to;
        emit Transfer(msg.sender, _to, _id);
    }
}</pre>`,
    },
  },
  ts: {
    types: {
      title_pt:'Types & Interfaces em TypeScript', title_en:'Types & Interfaces in TypeScript',
      content_pt:`<p>TypeScript adiciona tipos estáticos ao JavaScript.</p>
<pre>let nome: string = "Alice";
let idade: number = 25;
let ativo: boolean = true;

interface Usuario {
  id: number;
  nome: string;
  email: string;
  admin?: boolean;
}

type ID = string | number;

const usuario: Usuario = {
  id: 1,
  nome: "João",
  email: "joao@exemplo.com"
};</pre>`,
      content_en:`<p>TypeScript adds static types to JavaScript.</p>
<pre>let name: string = "Alice";
let age: number = 25;
let active: boolean = true;

interface User {
  id: number;
  name: string;
  email: string;
  admin?: boolean;
}

type ID = string | number;

const user: User = {
  id: 1,
  name: "John",
  email: "john@example.com"
};</pre>`,
    },
    generics: {
      title_pt:'Generics em TypeScript', title_en:'Generics in TypeScript',
      content_pt:`<p>Generics permitem criar código reutilizável com tipos flexíveis.</p>
<pre>function primeiro&lt;T&gt;(arr: T[]): T {
  return arr[0];
}

const num = primeiro([1, 2, 3]);    // number
const str = primeiro(["a", "b"]);   // string

interface Resposta&lt;T&gt; {
  data: T;
  erro: string | null;
  carregando: boolean;
}</pre>`,
      content_en:`<p>Generics allow you to create reusable code with flexible types.</p>
<pre>function first&lt;T&gt;(arr: T[]): T {
  return arr[0];
}

const num = first([1, 2, 3]);    // number
const str = first(["a", "b"]);   // string

interface Response&lt;T&gt; {
  data: T;
  error: string | null;
  loading: boolean;
}</pre>`,
    },
  },
  html: {
    basics: {
      title_pt:'Estrutura HTML', title_en:'HTML Structure',
      content_pt:`<p>HTML define a estrutura de páginas web usando tags.</p>
<pre>&lt;!DOCTYPE html&gt;
&lt;html lang="pt-BR"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;title&gt;Minha Página&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;h1&gt;Título Principal&lt;/h1&gt;
  &lt;p&gt;Um parágrafo de texto.&lt;/p&gt;
  &lt;a href="https://exemplo.com"&gt;Link&lt;/a&gt;
  &lt;ul&gt;
    &lt;li&gt;Item 1&lt;/li&gt;
    &lt;li&gt;Item 2&lt;/li&gt;
  &lt;/ul&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>`,
      content_en:`<p>HTML defines the structure of web pages using tags.</p>
<pre>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;title&gt;My Page&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;h1&gt;Main Title&lt;/h1&gt;
  &lt;p&gt;A paragraph of text.&lt;/p&gt;
  &lt;a href="https://example.com"&gt;Link&lt;/a&gt;
  &lt;ul&gt;
    &lt;li&gt;Item 1&lt;/li&gt;
    &lt;li&gt;Item 2&lt;/li&gt;
  &lt;/ul&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>`,
    },
    flexbox: {
      title_pt:'Flexbox & Grid CSS', title_en:'Flexbox & Grid CSS',
      content_pt:`<p>Flexbox e Grid são as melhores ferramentas para layouts modernos.</p>
<pre>/* Flexbox */
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* Grid responsivo */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}</pre>`,
      content_en:`<p>Flexbox and Grid are the best tools for modern layouts.</p>
<pre>/* Flexbox */
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}</pre>`,
    },
    animation: {
      title_pt:'CSS Animations', title_en:'CSS Animations',
      content_pt:`<p>CSS permite criar animações fluidas sem JavaScript.</p>
<pre>/* Transições */
.botao {
  background: blue;
  transition: background 0.3s ease, transform 0.2s;
}
.botao:hover {
  background: purple;
  transform: translateY(-4px);
}

/* Keyframes */
@keyframes aparecer {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.elemento {
  animation: aparecer 0.5s ease forwards;
}</pre>`,
      content_en:`<p>CSS lets you create smooth animations without JavaScript.</p>
<pre>/* Transitions */
.button {
  background: blue;
  transition: background 0.3s ease, transform 0.2s;
}
.button:hover {
  background: purple;
  transform: translateY(-4px);
}

/* Keyframes */
@keyframes appear {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.element {
  animation: appear 0.5s ease forwards;
}</pre>`,
    },
  },
};

// ══ HELPERS ══
function saveState() { localStorage.setItem('cs_state', JSON.stringify(state)); }

function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function dateKey(year, month, day) {
  return `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

function getDayData(key) {
  if (!state.dayData[key]) state.dayData[key] = { tasks: [], notes: '' };
  return state.dayData[key];
}

// ══ XP & LEVEL ══
function addXP(amount) {
  state.xp += amount;
  checkLevel();
  saveState();
  updateXPDisplay();
  showToast(`+${amount} XP ⚡`, 'xp');
}

function checkLevel() {
  const newLevel = Math.floor(state.xp / XP_PER_LEVEL) + 1;
  if (newLevel > state.level) {
    state.level = newLevel;
    showToast(`🎉 Level Up! Nível ${state.level}`, 'ach');
  }
}

function updateXPDisplay() {
  const xpInLevel = state.xp % XP_PER_LEVEL;
  const pct = (xpInLevel / XP_PER_LEVEL) * 100;
  document.getElementById('xp-bar').style.width = pct + '%';
  document.getElementById('xp-label').textContent = state.xp + ' XP';
  document.getElementById('level-num').textContent = state.level;
  document.getElementById('streak-count').textContent = state.streak;
  document.getElementById('stat-xp').textContent = state.xp;
  document.getElementById('stat-lvl').textContent = state.level;
  document.getElementById('stat-streak').textContent = state.streak;
  document.getElementById('stat-tasks').textContent = state.tasksCompleted;
  document.getElementById('stat-ach').textContent = Object.values(state.achievements).filter(Boolean).length;
  document.getElementById('stat-games').textContent = state.gamesCompleted;
}

// ══ STREAK ══
function checkStreak() {
  const today = getToday();
  if (state.lastActiveDate === today) return;
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
  const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;
  if (state.lastActiveDate === yKey) { state.streak++; }
  else { state.streak = 1; }
  state.lastActiveDate = today;
  if (!state.streakDays) state.streakDays = [];
  if (!state.streakDays.includes(today)) state.streakDays.push(today);
  if (state.streakDays.length > 7) state.streakDays = state.streakDays.slice(-7);
  saveState();
}

// ══ ACHIEVEMENTS ══
function checkAchievements() {
  let newUnlocked = false;
  ACHIEVEMENTS_DEF.forEach(a => {
    if (!state.achievements[a.id] && a.condition(state)) {
      state.achievements[a.id] = true;
      newUnlocked = true;
      showToast(`🏆 ${currentLang==='pt'?a.name_pt:a.name_en}`, 'ach');
    }
  });
  if (newUnlocked) { saveState(); renderAchievements(); }
}

// ══ TOAST ══
function showToast(msg, type='info') {
  const tc = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${msg}</span>`;
  tc.appendChild(el);
  setTimeout(() => {
    el.style.opacity='0'; el.style.transform='translateX(40px)'; el.style.transition='all 0.3s';
    setTimeout(()=>el.remove(), 300);
  }, 2500);
}

// ══ NAV ══
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('section-'+btn.dataset.section).classList.add('active');
    if (btn.dataset.section === 'schedule') renderCalendar();
    if (btn.dataset.section === 'dashboard') renderDashboard();
  });
});

// ══ LANGUAGE ══
function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[currentLang][key]) el.textContent = i18n[currentLang][key];
  });
  document.getElementById('lang-btn').textContent = '🌐 ' + currentLang.toUpperCase();
  document.getElementById('new-task-input').placeholder = currentLang==='pt'?'Nova missão...':'New mission...';
  document.getElementById('notes-input').placeholder = currentLang==='pt'?'Anotações do dia...':'Day notes...';
  renderDashboard();
  renderAchievements();
}

document.getElementById('lang-btn').addEventListener('click', () => {
  currentLang = currentLang === 'pt' ? 'en' : 'pt';
  applyLang();
});

// ══ THEME ══
function applyTheme() {
  document.documentElement.setAttribute('data-theme', darkTheme ? 'dark' : 'light');
  document.getElementById('theme-btn').textContent = darkTheme ? '☀️' : '🌙';
}
document.getElementById('theme-btn').addEventListener('click', () => {
  darkTheme = !darkTheme;
  localStorage.setItem('cs_theme', darkTheme ? 'dark' : 'light');
  applyTheme();
});

// ══ CALENDAR ══
const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_PT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const DAYS_EN = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function daysInMonth(m, y) { return new Date(y, m+1, 0).getDate(); }
function firstDayOfMonth(m, y) { return new Date(y, m, 1).getDay(); }

function renderCalendar() {
  const months = currentLang==='pt'?MONTHS_PT:MONTHS_EN;
  const days   = currentLang==='pt'?DAYS_PT:DAYS_EN;
  const today  = getToday();
  document.getElementById('cal-month-label').textContent = `${months[currentCalMonth]} ${currentCalYear}`;
  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';
  days.forEach(d => {
    const l = document.createElement('div'); l.className='cal-day-label'; l.textContent=d; grid.appendChild(l);
  });
  const first = firstDayOfMonth(currentCalMonth, currentCalYear);
  const total = daysInMonth(currentCalMonth, currentCalYear);
  for (let i=0; i<first; i++) {
    const e=document.createElement('div'); e.className='cal-day empty'; grid.appendChild(e);
  }
  for (let d=1; d<=total; d++) {
    const key = dateKey(currentCalYear, currentCalMonth, d);
    const dd  = getDayData(key);
    const el  = document.createElement('div');
    el.className = 'cal-day';
    if (key===today) el.classList.add('today');
    if (key===selectedDate) el.classList.add('selected');
    const taskCount = dd.tasks.length;
    const doneCount = dd.tasks.filter(t=>t.done).length;
    if (taskCount>0) {
      el.classList.add('has-tasks');
      if (doneCount===taskCount) el.classList.add('has-done');
    }
    el.innerHTML = `<span class="cal-day-num">${d}</span>${taskCount>0?`<span class="cal-task-count">${doneCount}/${taskCount}</span>`:''}`;
    el.addEventListener('click', () => openDay(key, d));
    grid.appendChild(el);
  }
  renderYearView();
}

document.getElementById('cal-prev').addEventListener('click', () => {
  currentCalMonth--; if(currentCalMonth<0){currentCalMonth=11;currentCalYear--;} renderCalendar();
});
document.getElementById('cal-next').addEventListener('click', () => {
  currentCalMonth++; if(currentCalMonth>11){currentCalMonth=0;currentCalYear++;} renderCalendar();
});

document.querySelectorAll('.view-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.view-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('view-month').style.display = tab.dataset.view==='month'?'block':'none';
    document.getElementById('view-year').style.display  = tab.dataset.view==='year'?'block':'none';
  });
});

function renderYearView() {
  const months = currentLang==='pt'?MONTHS_PT:MONTHS_EN;
  const today  = getToday();
  const yg     = document.getElementById('year-grid');
  yg.innerHTML = '';
  for (let m=0; m<12; m++) {
    const mm = document.createElement('div');
    mm.className = 'month-mini';
    mm.innerHTML = `<h4>${months[m]}</h4><div class="mini-grid" id="mini-${m}"></div>`;
    mm.addEventListener('click', () => {
      currentCalMonth = m;
      document.querySelectorAll('.view-tab').forEach(t=>t.classList.remove('active'));
      document.querySelector('[data-view="month"]').classList.add('active');
      document.getElementById('view-month').style.display='block';
      document.getElementById('view-year').style.display='none';
      renderCalendar();
    });
    yg.appendChild(mm);
    const mgrid = mm.querySelector(`#mini-${m}`);
    const first = firstDayOfMonth(m, 2026);
    const total = daysInMonth(m, 2026);
    for (let i=0; i<first; i++) { const e=document.createElement('div'); mgrid.appendChild(e); }
    for (let d=1; d<=total; d++) {
      const key=dateKey(2026,m,d), dd=getDayData(key);
      const el=document.createElement('div'); el.className='mini-day'; el.textContent=d;
      if(key===today) el.classList.add('today-dot');
      if(dd.tasks.length>0) el.classList.add('has-tasks');
      mgrid.appendChild(el);
    }
  }
}

// ══ DAY PANEL ══
function openDay(key, day) {
  selectedDate = key;
  renderCalendar();
  const months = currentLang==='pt'?MONTHS_PT:MONTHS_EN;
  document.getElementById('day-panel-title').textContent = `${day} ${months[currentCalMonth]} ${currentCalYear}`;
  const dd = getDayData(key);
  renderTaskList(dd, key);
  document.getElementById('notes-input').value = dd.notes || '';
  document.getElementById('day-panel').classList.add('visible');
}

function renderTaskList(dd, key) {
  const list = document.getElementById('task-list');
  list.innerHTML = '';
  if (dd.tasks.length===0) {
    list.innerHTML = `<p style="color:var(--text3);font-size:0.82rem;padding:10px 0;">${currentLang==='pt'?'Sem missões. Adicione uma abaixo!':'No missions. Add one below!'}</p>`;
    return;
  }
  dd.tasks.forEach((task, idx) => {
    const row = document.createElement('div');
    row.className = 'task-item';
    row.innerHTML = `
      <div class="task-check ${task.done?'done':''}">${task.done?'✓':''}</div>
      <span class="task-text ${task.done?'done':''}">${task.text}</span>
      <span class="task-xp">+${task.xp} XP</span>
      <button class="task-del">🗑</button>
    `;
    row.querySelector('.task-check').addEventListener('click', ()=>toggleTask(key, idx));
    row.querySelector('.task-del').addEventListener('click', ()=>deleteTask(key, idx));
    list.appendChild(row);
  });
}

function toggleTask(key, idx) {
  const dd = getDayData(key), task = dd.tasks[idx];
  if (!task.done) {
    task.done = true; state.tasksCompleted++;
    addXP(task.xp); checkStreak(); checkAchievements(); updateDashToday();
  } else {
    task.done = false;
    state.tasksCompleted = Math.max(0, state.tasksCompleted-1);
    state.xp = Math.max(0, state.xp - task.xp);
    updateXPDisplay();
  }
  saveState(); renderTaskList(dd, key); renderCalendar();
}

function deleteTask(key, idx) {
  const dd = getDayData(key);
  dd.tasks.splice(idx, 1);
  saveState(); renderTaskList(dd, key); renderCalendar();
}

document.getElementById('add-task-btn').addEventListener('click', () => {
  if (!selectedDate) return;
  const input  = document.getElementById('new-task-input');
  const xpSel  = document.getElementById('task-xp-sel');
  const text   = input.value.trim();
  if (!text) return;
  const dd = getDayData(selectedDate);
  dd.tasks.push({ text, xp: parseInt(xpSel.value), done: false });
  saveState(); input.value = ''; renderTaskList(dd, selectedDate); renderCalendar();
});

document.getElementById('new-task-input').addEventListener('keydown', e => {
  if (e.key==='Enter') document.getElementById('add-task-btn').click();
});

document.getElementById('save-notes-btn').addEventListener('click', () => {
  if (!selectedDate) return;
  const dd = getDayData(selectedDate);
  dd.notes = document.getElementById('notes-input').value;
  saveState();
  showToast(currentLang==='pt'?'Anotações salvas ✓':'Notes saved ✓', 'info');
});

document.getElementById('close-day-panel').addEventListener('click', () => {
  document.getElementById('day-panel').classList.remove('visible');
  selectedDate = null; renderCalendar();
});

// ══ DASHBOARD ══
function renderDashboard() {
  const hour = new Date().getHours();
  document.getElementById('dash-greeting').textContent = currentLang==='pt'
    ? (hour<12?'Bom dia!':hour<18?'Boa tarde!':'Boa noite!')
    : (hour<12?'Good morning!':hour<18?'Good afternoon!':'Good evening!');
  renderStreakWeek();
  renderLangProgressBars();
  renderDashAchievements();
  updateDashToday();
  updateXPDisplay();
}

function renderStreakWeek() {
  const sw   = document.getElementById('streak-week-display');
  sw.innerHTML = '';
  const days = currentLang==='pt'?['D','S','T','Q','Q','S','S']:['S','M','T','W','T','F','S'];
  const today = new Date();
  for (let i=6; i>=0; i--) {
    const d = new Date(today); d.setDate(d.getDate()-i);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const dot = document.createElement('div');
    dot.className = 'streak-dot';
    if (state.streakDays && state.streakDays.includes(key)) dot.classList.add('on');
    dot.textContent = days[d.getDay()];
    sw.appendChild(dot);
  }
}

function renderLangProgressBars() {
  const container = document.getElementById('lang-progress-bars');
  container.innerHTML = '';
  const langs = [
    { key:'py',   name:'Python',     color:'var(--py)' },
    { key:'js',   name:'JS',         color:'var(--js)' },
    { key:'sol',  name:'Solidity',   color:'var(--sol)' },
    { key:'ts',   name:'TypeScript', color:'var(--ts)' },
    { key:'html', name:'HTML/CSS',   color:'var(--html)' },
  ];
  langs.forEach(l => {
    const pct = Math.min(100, (state.langProgress[l.key]||0)*10);
    container.innerHTML += `
      <div class="lang-progress-row">
        <div class="lang-progress-label">${l.name}</div>
        <div class="lang-progress-bar"><div class="lang-progress-fill" style="width:${pct}%;background:${l.color}"></div></div>
        <div class="lang-progress-pct">${pct}%</div>
      </div>`;
  });
}

function renderDashAchievements() {
  const container = document.getElementById('dash-achievements');
  container.innerHTML = '';
  const unlocked = ACHIEVEMENTS_DEF.filter(a => state.achievements[a.id]);
  if (unlocked.length===0) {
    container.innerHTML = `<span style="color:var(--text3);font-size:0.82rem;">${currentLang==='pt'?'Você ainda não tem conquistas. Complete missões!':'No achievements yet. Complete missions!'}</span>`;
    return;
  }
  unlocked.slice(-6).forEach(a => {
    container.innerHTML += `<div title="${currentLang==='pt'?a.name_pt:a.name_en}" style="background:var(--card2);border:1px solid var(--gold);border-radius:10px;padding:8px 12px;font-size:1.2rem;">${a.icon}</div>`;
  });
}

function updateDashToday() {
  const key = getToday(), dd = getDayData(key);
  const container = document.getElementById('dash-today-tasks');
  if (dd.tasks.length===0) {
    container.innerHTML = `<p style="color:var(--text3);font-size:0.85rem;">${t('no-tasks-today')}</p>`;
    return;
  }
  container.innerHTML = dd.tasks.map(task => `
    <div class="task-item">
      <div class="task-check ${task.done?'done':''}" style="cursor:default;">${task.done?'✓':''}</div>
      <span class="task-text ${task.done?'done':''}">${task.text}</span>
      <span class="task-xp">+${task.xp} XP</span>
    </div>`).join('');
}

// ══ ACHIEVEMENTS RENDER ══
function renderAchievements() {
  const grid = document.getElementById('achievements-grid');
  grid.innerHTML = '';
  ACHIEVEMENTS_DEF.forEach(a => {
    const unlocked = !!state.achievements[a.id];
    grid.innerHTML += `
      <div class="achievement ${unlocked?'unlocked':'locked'}">
        <div class="ach-icon">${a.icon}</div>
        <h4>${currentLang==='pt'?a.name_pt:a.name_en}</h4>
        <p>${currentLang==='pt'?a.desc_pt:a.desc_en}</p>
        ${unlocked?`<div style="color:var(--gold);font-size:0.75rem;margin-top:6px;font-weight:700;">✓ ${currentLang==='pt'?'Desbloqueada':'Unlocked'}</div>`:''}
      </div>`;
  });
}

// ══ PROGRAMMING ══
document.querySelectorAll('.lang-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.lang-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.lang-content').forEach(c=>c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('lang-'+tab.dataset.lang).classList.add('active');
  });
});

function openLesson(lang, topic) {
  const lesson = LESSON_CONTENT[lang]?.[topic];
  if (!lesson) return;
  currentLesson = { lang, topic };
  const content = document.getElementById('lesson-modal-content');
  const title   = currentLang==='pt' ? lesson.title_pt : lesson.title_en;
  const body    = currentLang==='pt' ? lesson.content_pt : lesson.content_en;
  content.innerHTML = `<h3>📖 ${title}</h3><div style="margin-top:14px;line-height:1.7;font-size:0.88rem;">${body}</div>`;
  document.getElementById('lesson-modal').classList.add('visible');
}

function closeLessonModal() {
  document.getElementById('lesson-modal').classList.remove('visible');
  currentLesson = null;
}

function markLessonDone() {
  if (!currentLesson) return;
  const { lang } = currentLesson;
  if (!state.langProgress[lang]) state.langProgress[lang] = 0;
  state.langProgress[lang] = Math.min(10, state.langProgress[lang] + 1);
  addXP(30); checkAchievements(); closeLessonModal(); renderLangProgressBars();
}

document.getElementById('lesson-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('lesson-modal')) closeLessonModal();
});

// ══ MINI-GAMES ══
let quizIdx=0, quizScore=0, quizAnswered=false;
let codeIdx=0, debugIdx=0, logicIdx=0;

function startGame(type) {
  document.getElementById('games-grid-select').style.display = 'none';
  if (type==='quiz')  { startQuiz();  document.getElementById('quiz-area').classList.add('visible'); }
  if (type==='code')  { startCode();  document.getElementById('code-area').classList.add('visible'); }
  if (type==='debug') { startDebug(); document.getElementById('debug-area').classList.add('visible'); }
  if (type==='logic') { startLogic(); document.getElementById('logic-area').style.display='block'; }
}

function closeGame() {
  document.getElementById('games-grid-select').style.display = 'grid';
  document.getElementById('quiz-area').classList.remove('visible');
  document.getElementById('code-area').classList.remove('visible');
  document.getElementById('debug-area').classList.remove('visible');
  document.getElementById('logic-area').style.display = 'none';
}

// Quiz
function startQuiz() { quizIdx=0; quizScore=0; renderQuizQuestion(); }

function renderQuizQuestion() {
  const q = QUIZ_QUESTIONS[quizIdx];
  document.getElementById('q-num').textContent = quizIdx+1;
  document.getElementById('quiz-progress').style.width = ((quizIdx+1)/10*100)+'%';
  document.getElementById('quiz-score').textContent = quizScore;
  document.getElementById('quiz-question').textContent = currentLang==='pt' ? q.q : q.q_en;
  document.getElementById('quiz-feedback').style.display = 'none';
  document.getElementById('quiz-next-btn').style.display = 'none';
  document.getElementById('quiz-finish-btn').style.display = 'none';
  quizAnswered = false;
  const opts = currentLang==='pt' ? q.opts : q.opts_en;
  document.getElementById('quiz-options').innerHTML = opts.map((o,i) =>
    `<button class="quiz-opt" onclick="answerQuiz(${i})">${o}</button>`
  ).join('');
}

function answerQuiz(idx) {
  if (quizAnswered) return;
  quizAnswered = true;
  const q    = QUIZ_QUESTIONS[quizIdx];
  const opts = document.querySelectorAll('.quiz-opt');
  const fb   = document.getElementById('quiz-feedback');
  opts.forEach((o,i) => {
    if (i===q.ans) o.classList.add('correct');
    else if (i===idx && idx!==q.ans) o.classList.add('wrong');
    o.disabled = true;
  });
  if (idx===q.ans) {
    quizScore++;
    fb.textContent = '✅ '+(currentLang==='pt'?'Correto! +25 XP':'Correct! +25 XP');
    fb.className = 'quiz-feedback correct';
  } else {
    fb.textContent = '❌ '+(currentLang==='pt'?`Errado. Correto: ${q.opts[q.ans]}`:`Wrong. Correct: ${q.opts_en[q.ans]}`);
    fb.className = 'quiz-feedback wrong';
  }
  fb.style.display = 'block';
  if (quizIdx < QUIZ_QUESTIONS.length-1) document.getElementById('quiz-next-btn').style.display='inline-block';
  else document.getElementById('quiz-finish-btn').style.display='inline-block';
}

document.getElementById('quiz-next-btn').addEventListener('click', () => { quizIdx++; renderQuizQuestion(); });
document.getElementById('quiz-finish-btn').addEventListener('click', () => {
  const earned = quizScore * 25;
  state.gamesCompleted++;
  addXP(earned); checkAchievements(); closeGame();
  showToast(`🧠 Quiz: ${quizScore}/10 — +${earned} XP`, 'ach');
  renderDashboard();
});

// Code Challenge
function startCode() { codeIdx=0; renderCodeChallenge(); }

function renderCodeChallenge() {
  const ch   = CODE_CHALLENGES[codeIdx % CODE_CHALLENGES.length];
  const desc = currentLang==='pt' ? ch.description_pt : ch.description_en;
  document.getElementById('code-challenge-content').innerHTML = `
    <h4 style="margin-bottom:10px;font-weight:800;">${ch.title}</h4>
    <p style="color:var(--text2);font-size:0.85rem;margin-bottom:12px;">${desc}</p>
    <pre style="margin-bottom:0;">${ch.before}<span style="color:var(--gold)">___BLANK___</span>${ch.after}</pre>
    <div style="margin-top:10px;">
      <input type="text" class="task-input" id="code-answer-input"
        placeholder="${currentLang==='pt'?'Sua resposta...':'Your answer...'}" style="margin-bottom:0;">
    </div>`;
  document.getElementById('code-feedback').innerHTML = '';
  document.getElementById('code-next-ch-btn').style.display = 'none';
  document.getElementById('code-answer-input').addEventListener('keydown', e => {
    if (e.key==='Enter') document.getElementById('code-check-btn').click();
  });
}

document.getElementById('code-check-btn').addEventListener('click', () => {
  const ch     = CODE_CHALLENGES[codeIdx % CODE_CHALLENGES.length];
  const answer = (document.getElementById('code-answer-input')?.value||'').trim();
  const fb     = document.getElementById('code-feedback');
  const correct = answer.toLowerCase()===ch.answer.toLowerCase().replace(/['"]/g,'').trim()
    || answer===ch.answer
    || answer.replace(/['"]/g,'')===ch.answer.replace(/['"]/g,'');
  if (correct) {
    fb.innerHTML = `<div class="quiz-feedback correct">✅ ${currentLang==='pt'?'Correto! +50 XP':'Correct! +50 XP'}</div>`;
    state.gamesCompleted++; addXP(50); checkAchievements();
    document.getElementById('code-next-ch-btn').style.display = 'inline-block';
  } else {
    fb.innerHTML = `<div class="quiz-feedback wrong">❌ ${currentLang==='pt'?`Tente novamente. Dica: "${ch.answer}"`:`Try again. Hint: "${ch.answer}"`}</div>`;
  }
});

document.getElementById('code-next-ch-btn').addEventListener('click', () => { codeIdx++; renderCodeChallenge(); });

// Debug
function startDebug() { debugIdx=0; renderDebugChallenge(); }

function renderDebugChallenge() {
  const ch   = DEBUG_CHALLENGES[debugIdx % DEBUG_CHALLENGES.length];
  const desc = currentLang==='pt' ? ch.desc_pt : ch.desc_en;
  document.getElementById('debug-feedback').innerHTML = '';
  document.getElementById('debug-next-btn').style.display = 'none';
  const lines = document.getElementById('debug-lines');
  lines.innerHTML = `<p style="color:var(--text2);font-size:0.82rem;margin-bottom:10px;">${ch.title} — ${desc}</p>`;
  ch.lines.forEach((line, i) => {
    const el = document.createElement('div');
    el.className = 'bug-line';
    el.innerHTML = `<span class="line-num">${i+1}</span><span>${line}</span>`;
    el.addEventListener('click', () => selectBugLine(i, ch));
    lines.appendChild(el);
  });
}

function selectBugLine(idx, ch) {
  document.querySelectorAll('.bug-line').forEach(l=>l.classList.remove('selected','correct'));
  const lines = document.querySelectorAll('.bug-line');
  lines[idx].classList.add('selected');
  const fb = document.getElementById('debug-feedback');
  if (idx===ch.bugLine) {
    lines[idx].classList.remove('selected');
    lines[idx].classList.add('correct');
    fb.innerHTML = `<div class="quiz-feedback correct">✅ ${currentLang==='pt'?ch.fix_pt:ch.fix_en}</div>`;
    state.gamesCompleted++; addXP(75); checkAchievements();
    document.getElementById('debug-next-btn').style.display = 'inline-block';
  } else {
    fb.innerHTML = `<div class="quiz-feedback wrong">❌ ${currentLang==='pt'?'Não é essa linha. Tente outra!':'Not that line. Try another!'}</div>`;
  }
}

document.getElementById('debug-next-btn').addEventListener('click', () => { debugIdx++; renderDebugChallenge(); });

// Logic
function startLogic() { logicIdx=0; renderLogicChallenge(); }

function renderLogicChallenge() {
  const ch = LOGIC_CHALLENGES[logicIdx % LOGIC_CHALLENGES.length];
  const q  = currentLang==='pt' ? ch.q_pt : ch.q_en;
  document.getElementById('logic-feedback').innerHTML = '';
  document.getElementById('logic-next-btn').style.display = 'none';
  document.getElementById('logic-content').innerHTML = `
    <p style="font-weight:700;font-size:0.95rem;line-height:1.6;white-space:pre-line;">${q}</p>
    <div style="margin-top:14px;">
      <input type="text" class="task-input" id="logic-answer-input"
        placeholder="${currentLang==='pt'?'Sua resposta...':'Your answer...'}" style="margin-bottom:0;">
    </div>`;
  document.getElementById('logic-answer-input').addEventListener('keydown', e => {
    if (e.key==='Enter') document.getElementById('logic-check-btn').click();
  });
}

document.getElementById('logic-check-btn').addEventListener('click', () => {
  const ch     = LOGIC_CHALLENGES[logicIdx % LOGIC_CHALLENGES.length];
  const answer = (document.getElementById('logic-answer-input')?.value||'').trim().toLowerCase();
  const fb     = document.getElementById('logic-feedback');
  if (answer===ch.answer.toLowerCase()) {
    fb.innerHTML = `<div class="quiz-feedback correct">✅ ${currentLang==='pt'?'Correto! +40 XP':'Correct! +40 XP'}</div>`;
    state.gamesCompleted++; addXP(40); checkAchievements();
    document.getElementById('logic-next-btn').style.display = 'inline-block';
  } else {
    fb.innerHTML = `<div class="quiz-feedback wrong">❌ ${currentLang==='pt'?`Resposta: ${ch.answer}`:`Answer: ${ch.answer}`}</div>`;
  }
});

document.getElementById('logic-next-btn').addEventListener('click', () => { logicIdx++; renderLogicChallenge(); });

// ══ FOCUS MODE ══
let focusDuration  = 25 * 60;
let focusRemaining = focusDuration;
let focusInterval  = null;
let focusPaused    = false;
const circumference = 2 * Math.PI * 124;

document.getElementById('focus-btn').addEventListener('click', () => {
  document.getElementById('focus-overlay').classList.add('visible');
  resetFocus();
});

function closeFocus() {
  document.getElementById('focus-overlay').classList.remove('visible');
  clearInterval(focusInterval); focusInterval=null; resetFocus();
}

function setFocusDuration(mins) {
  focusDuration=mins*60; focusRemaining=focusDuration;
  clearInterval(focusInterval); focusInterval=null; focusPaused=false;
  document.getElementById('focus-start-btn').style.display = 'inline-block';
  document.getElementById('focus-pause-btn').style.display = 'none';
  updateFocusDisplay();
}

function resetFocus() {
  focusRemaining=focusDuration; focusPaused=false;
  clearInterval(focusInterval); focusInterval=null;
  document.getElementById('focus-start-btn').style.display = 'inline-block';
  document.getElementById('focus-pause-btn').style.display = 'none';
  updateFocusDisplay();
}

function updateFocusDisplay() {
  const m = Math.floor(focusRemaining/60);
  const s = focusRemaining % 60;
  document.getElementById('focus-timer').textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  const pct = focusRemaining / focusDuration;
  document.getElementById('focus-ring').style.strokeDashoffset = circumference * pct;
  document.getElementById('focus-ring').style.strokeDasharray  = circumference;
}

document.getElementById('focus-start-btn').addEventListener('click', () => {
  if (focusInterval) return;
  focusInterval = setInterval(() => {
    if (!focusPaused) {
      focusRemaining--;
      updateFocusDisplay();
      if (focusRemaining<=0) {
        clearInterval(focusInterval); focusInterval=null;
        document.getElementById('focus-label').textContent = currentLang==='pt'?'🎉 Sessão completa!':'🎉 Session complete!';
        addXP(50); checkAchievements();
      }
    }
  }, 1000);
  document.getElementById('focus-start-btn').style.display = 'none';
  document.getElementById('focus-pause-btn').style.display = 'inline-block';
  document.getElementById('focus-label').textContent = currentLang==='pt'?'Focando...':'Focusing...';
});

document.getElementById('focus-pause-btn').addEventListener('click', () => {
  focusPaused = !focusPaused;
  document.getElementById('focus-pause-btn').textContent = focusPaused
    ? (currentLang==='pt'?'▶ Continuar':'▶ Resume')
    : (currentLang==='pt'?'⏸ Pausar':'⏸ Pause');
  document.getElementById('focus-label').textContent = focusPaused
    ? (currentLang==='pt'?'⏸ Pausado':'⏸ Paused')
    : (currentLang==='pt'?'Focando...':'Focusing...');
});

updateFocusDisplay();

// ══ INIT ══
function init() {
  applyTheme();
  checkStreak();
  updateXPDisplay();
  applyLang();
  renderDashboard();
  renderAchievements();
  renderCalendar();
}

init();