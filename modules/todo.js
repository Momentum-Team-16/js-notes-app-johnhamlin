import { buildAndAppendElement } from './john_dom.js';

const todoForm = document.getElementById('todo-form');
todoForm.addEventListener('submit', postTodo);
const todosContainer = document.getElementById('todo-container');

class Todo {
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }
}

async function postTodo(event) {
  event.preventDefault();
  const todo = new Todo(
    todoForm.elements['title'].value,
    todoForm.elements['body'].value
  );
  todoForm.reset();

  const todoFromServer = await fetch('http://localhost:3000/notes/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  }).then(r => r.json());

  displayTodo(todoFromServer);
}

async function updateTodo(todo, id) {
  fetch(`http://localhost:3000/notes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  }).then(r => r.json());
}

export function loadTodos(event) {
  return fetch('http://localhost:3000/notes/').then(r => r.json());
}

export function displayTodos(todos) {
  todosContainer.replaceChildren();
  todos.forEach(displayTodo);
}

function displayTodo(todo) {
  console.log(todo);

  // Build the card, store it's ID as as data tag and add it to the DOM
  const card = document.createElement('div');
  card.classList.add('card', 'm-4', 'p-0', 'border-0', 'shadow-sm');

  // Create card body where all items will be added
  const cardBody = buildAndAppendElement('', card, 'div', ['card-body', 'row']);
  const title = buildAndAppendElement(todo.title, cardBody, 'h3', [
    'card-title',
    'col-11',
  ]);
  const editBtn = buildAndAppendElement('edit', cardBody, 'button', [
    'btn',
    'btn-outline-primary',
    'col-1',
    'mb-2',
  ]);
  const saveBtn = buildAndAppendElement('save', false, 'button', [
    'btn',
    'btn-primary',
    'col-1',
    'mb-2',
  ]);
  const body = buildAndAppendElement(todo.body, cardBody, 'h6', [
    'card-subtitle',
    'mb-2',
    'col-11',
  ]);
  const deleteBtn = buildAndAppendElement('delete', cardBody, 'button', [
    'btn',
    'btn-outline-danger',
    'col-1',
  ]);

  editBtn.addEventListener('click', event => {
    cardBody.replaceChild(saveBtn, editBtn);
    title.contentEditable = true;
    body.contentEditable = true;

    // Move cursor to title field
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStart(title, 1);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  });

  saveBtn.addEventListener('click', event => {
    cardBody.replaceChild(editBtn, saveBtn);
    title.contentEditable = false;
    body.contentEditable = false;
    const newTodo = new Todo(title.innerText, body.innerText);
    updateTodo(newTodo, todo.id);
  });

  deleteBtn.addEventListener('click', event => {
    fetch(`http://localhost:3000/notes/${todo.id}`, {
      method: 'DELETE',
    });
    todosContainer.removeChild(card);
  });

  todosContainer.appendChild(card);
}
