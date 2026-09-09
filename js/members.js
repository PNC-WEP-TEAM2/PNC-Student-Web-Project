const defaultMembers = [
  { name: 'Maya Chen', role: 'Lead Developer', photo: 'https://i.pravatar.cc/500?img=47' },
  { name: 'Noah Williams', role: 'UI/UX Designer', photo: 'https://i.pravatar.cc/500?img=12' },
  { name: 'Amina Patel', role: 'Frontend Engineer', photo: 'https://i.pravatar.cc/500?img=32' },
  { name: 'Leo Martin', role: 'Product Strategist', photo: 'https://i.pravatar.cc/500?img=68' },
  { name: 'Sofia Garcia', role: 'Content Lead', photo: 'https://i.pravatar.cc/500?img=44' }
];

function getMembers() {
  const stored = localStorage.getItem('members');
  if (!stored) {
    localStorage.setItem('members', JSON.stringify(defaultMembers));
    return defaultMembers;
  }
  return JSON.parse(stored);
}

function saveMembers(members) { localStorage.setItem('members', JSON.stringify(members)); }
function addMember(member) {
  const members = getMembers();
  members.push({
    name: member.name,
    role: member.role,
    photo: member.photo || 'https://i.pravatar.cc/500?img=12'
  });
  saveMembers(members);
  renderMembers();
}
function deleteMember(index) { const members = getMembers(); members.splice(index, 1); saveMembers(members); renderMembers(); }

function renderMembers() {
  const tableBody = document.querySelector('#memberRows');
  if (!tableBody) return;
  const canManage = currentUser?.role === 'Admin';
  const members = getMembers();
  const memberCount = document.querySelector('#memberCount');
  if (memberCount) memberCount.textContent = members.length;
  tableBody.innerHTML = members.map((member, index) => `
    <tr>
      <td><div class="member-cell"><img class="member-avatar" src="${member.photo || 'https://i.pravatar.cc/500?img=12'}" alt="${escapeHtml(member.name)}" /><span>${escapeHtml(member.name)}</span></div></td>
      <td><span class="role-pill">${escapeHtml(member.role)}</span></td>
      <td>${canManage ? `<button class="btn btn-danger" type="button" data-delete="${index}">Delete</button>` : '<span aria-label="View only">-</span>'}</td>
    </tr>`).join('');
  tableBody.querySelectorAll('[data-delete]').forEach((button) => button.addEventListener('click', () => deleteMember(Number(button.dataset.delete))));
}

function escapeHtml(value) { const element = document.createElement('div'); element.textContent = value; return element.innerHTML; }

const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
if (!currentUser) {
  window.location.href = 'login.html';
} else if (currentUser.role !== 'Admin') {
  window.location.href = 'tasks.html';
}
const currentUsername = document.querySelector('#currentUsername');
const currentRole = document.querySelector('#currentRole');
const accessLevel = document.querySelector('#accessLevel');
const authWarning = document.querySelector('#authWarning');
if (currentUsername && currentRole) {
  currentUsername.textContent = currentUser?.username || 'Guest';
  currentRole.textContent = currentUser?.role || 'Not signed in';
}
if (accessLevel && currentUser?.role === 'Admin') accessLevel.textContent = 'Admin';
if (!currentUser && authWarning) {
  authWarning.hidden = false;
  authWarning.innerHTML = 'You are viewing the dashboard as a guest. <a href="login.html">Log in</a> to manage the team.';
}
const adminControls = document.querySelector('.admin-only');
if (adminControls && currentUser?.role !== 'Admin') adminControls.hidden = true;

const memberForm = document.querySelector('#memberForm');
if (memberForm) {
  memberForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nameInput = document.querySelector('#memberName');
    const roleInput = document.querySelector('#memberRole');
    const photoInput = document.querySelector('#memberPhoto');

    addMember({
      name: nameInput.value.trim(),
      role: roleInput.value.trim(),
      photo: photoInput ? photoInput.value.trim() : ''
    });

    memberForm.reset();
  });
}
renderMembers();
