'use strict';

class Note {
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }
}

const todoForm = document.getElementById('todo-form');
console.log(todoForm);
const todosContainer = document.getElementById('todo-container');
console.log(todosContainer);

todoForm.addEventListener('submit', event => {
  event.preventDefault();
  console.log(event);
});

const buildAndAppendElement = function (
  text,
  parentElement,
  elementType,
  classesArr
) {
  const newElement = document.createElement(elementType);
  if (classesArr) newElement.classList.add(...classesArr);
  newElement.innerText = text;
  parentElement.appendChild(newElement);
  return newElement;
};

function loadTodos(event) {
  return fetch('http://localhost:3000/notes/').then(r => r.json());
}

function displayTodos(todos) {
  todosContainer.replaceChildren();

  todos.forEach(todo => {
    displayTodo(todo);
  });
}

function displayTodo(todo) {
  console.log(todo.title, todo.body);
  // Build the card, store it's ID as as data tag and add it to the DOM
  const card = document.createElement('div');
  card.classList.add('card', 'm-4', 'p-0', 'border-0', 'shadow-sm');
  // card.dataset.id = id;

  // Create card body where all items will be added
  const cardBody = buildAndAppendElement('', card, 'div', ['card-body']);
  buildAndAppendElement(todo.title, cardBody, 'h3', ['card-title']);
  buildAndAppendElement(todo.body, cardBody, 'h6', ['card-subtitle', 'mb-2']);

  todosContainer.appendChild(card);
}

loadTodos().then(todos => displayTodos(todos));
