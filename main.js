import { displayTodos, loadTodos } from './modules/todo.js';

loadTodos().then(displayTodos);
