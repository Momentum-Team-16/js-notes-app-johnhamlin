'use strict';

class Todo {
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }
}

const todoForm = document.getElementById('todo-form');
todoForm.addEventListener('submit', postTodo);
const todosContainer = document.getElementById('todo-container');

function buildAndAppendElement(text, parentElement, elementType, classesArr) {
  const newElement = document.createElement(elementType);
  if (classesArr) newElement.classList.add(...classesArr);
  newElement.innerText = text;
  parentElement.appendChild(newElement);
  return newElement;
}

async function postTodo(event) {
  event.preventDefault();
  const todo = new Todo(
    todoForm.elements['title'].value,
    todoForm.elements['body'].value
  );
  const todoFromServer = await fetch('http://localhost:3000/notes/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  }).then(r => r.json());

  displayTodo(todoFromServer);
}

function loadTodos(event) {
  return fetch('http://localhost:3000/notes/').then(r => r.json());
}

function displayTodos(todos) {
  todosContainer.replaceChildren();

  todos.forEach(todo => {
    console.log(todo);

    displayTodo(todo);
  });
}

function displayTodo(todo) {
  // Build the card, store it's ID as as data tag and add it to the DOM
  const card = document.createElement('div');
  card.classList.add('card', 'm-4', 'p-0', 'border-0', 'shadow-sm');
  // card.dataset.id = id;

  // Create card body where all items will be added
  const cardBody = buildAndAppendElement('', card, 'div', ['card-body', 'row']);
  buildAndAppendElement(todo.title, cardBody, 'h3', ['card-title', 'col-11']);
  const deleteBtn = buildAndAppendElement('X', cardBody, 'button', [
    'btn',
    'btn-outline-danger',
    'col-1',
  ]);
  buildAndAppendElement(todo.body, cardBody, 'h6', ['card-subtitle', 'mb-2']);

  deleteBtn.addEventListener('click', event => {
    fetch(`http://localhost:3000/notes/${todo.id}`, {
      method: 'DELETE',
    });
    todosContainer.removeChild(card);
  });

  todosContainer.appendChild(card);
}

loadTodos().then(todos => displayTodos(todos));
