function getTasks() { return JSON.parse(localStorage.getItem('tasks') || '[]'); }
function saveTasks(tasks) { localStorage.setItem('tasks', JSON.stringify(tasks)); }
function renderTasks() {
  const list = document.querySelector('#taskList');
  if (!list) return;
  const tasks = getTasks();
  list.innerHTML = tasks.length ? tasks.map((task, index) => `<li class="task-item"><p>${escapeHtml(task)}</p><button class="btn btn-quiet" type="button" data-complete="${index}">Complete</button></li>`).join('') : '<li class="empty-state">No open tasks yet. Add the first one above.</li>';
  list.querySelectorAll('[data-complete]').forEach((button) => button.addEventListener('click', () => completeTask(Number(button.dataset.complete))));
}
function addTask(task) { const tasks = getTasks(); tasks.push(task); saveTasks(tasks); renderTasks(); }
function completeTask(index) { const tasks = getTasks(); tasks.splice(index, 1); saveTasks(tasks); renderTasks(); }
function escapeHtml(value) { const element = document.createElement('div'); element.textContent = value; return element.innerHTML; }
const taskForm = document.querySelector('#taskForm');
if (taskForm) taskForm.addEventListener('submit', (event) => { event.preventDefault(); const input = document.querySelector('#taskInput'); if (input.value.trim()) addTask(input.value.trim()); input.value = ''; });
renderTasks();
