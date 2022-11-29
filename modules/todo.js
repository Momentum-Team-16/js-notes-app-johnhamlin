import { buildAndAppendElement } from './john_dom.js';

const URL = 'http://localhost:3000/notes/';
const todoForm = document.getElementById('todo-form');
todoForm.addEventListener('submit', postTodo);
const todosContainer = document.getElementById('todo-container');

class Todo {
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }
}

function loadTodos(event) {
  return fetch(URL).then(r => r.json());
}

function displayTodos(todos) {
  todosContainer.replaceChildren();
  todos.forEach(displayTodo);
}

function displayTodo(todo) {
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
    'text-nowrap',
  ]);
  const saveBtn = buildAndAppendElement('save', false, 'button', [
    'btn',
    'btn-primary',
    'col-1',
    'mb-2',
    'text-nowrap',
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
    'text-nowrap',
  ]);
  todosContainer.appendChild(card);

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
    fetch(`${URL}${todo.id}`, {
      method: 'DELETE',
    });
    todosContainer.removeChild(card);
  });
}

async function postTodo(event) {
  event.preventDefault();
  const todo = new Todo(
    todoForm.elements['title'].value,
    todoForm.elements['body'].value
  );

  const todoFromServer = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  }).then(r => r.json());

  todoForm.reset();
  displayTodo(todoFromServer);
}

async function updateTodo(todo, id) {
  fetch(`${URL}${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });
}

export { loadTodos, displayTodos };
