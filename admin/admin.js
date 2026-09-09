(() => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!currentUser || currentUser.role !== 'Admin') {
    window.location.href = '../pages/login.html';
    return;
  }

  const membersKey = 'members';
  const defaultMembers = [
    { name: 'Maya Chen', role: 'Lead Developer', photo: 'https://i.pravatar.cc/500?img=47' },
    { name: 'Noah Williams', role: 'UI/UX Designer', photo: 'https://i.pravatar.cc/500?img=12' },
    { name: 'Amina Patel', role: 'Frontend Engineer', photo: 'https://i.pravatar.cc/500?img=32' },
    { name: 'Leo Martin', role: 'Product Strategist', photo: 'https://i.pravatar.cc/500?img=68' },
    { name: 'Sofia Garcia', role: 'Content Lead', photo: 'https://i.pravatar.cc/500?img=44' }
  ];

  function getMembers() {
    const stored = localStorage.getItem(membersKey);
    if (!stored) {
      localStorage.setItem(membersKey, JSON.stringify(defaultMembers));
      return defaultMembers;
    }
    return JSON.parse(stored);
  }

  function saveMembers(members) { localStorage.setItem(membersKey, JSON.stringify(members)); }
  function escapeHtml(value) { const element = document.createElement('div'); element.textContent = value; return element.innerHTML; }

  function renderMembers() {
    const members = getMembers();
    document.querySelector('#memberCount').textContent = members.length;
    document.querySelector('#directoryCount').textContent = `${members.length} nodes`;
    document.querySelector('#memberRows').innerHTML = members.map((member, index) => `
      <tr>
        <td><div class="member-row"><img class="member-avatar" src="${member.photo || 'https://i.pravatar.cc/500?img=12'}" alt="${escapeHtml(member.name)}" /><strong>${escapeHtml(member.name)}</strong></div></td>
        <td>${escapeHtml(member.role)}</td>
        <td><span class="node-state">● ONLINE</span></td>
        <td><button class="delete-button" type="button" data-delete="${index}">REMOVE</button></td>
      </tr>`).join('');
    document.querySelectorAll('[data-delete]').forEach((button) => button.addEventListener('click', () => {
      const next = getMembers();
      next.splice(Number(button.dataset.delete), 1);
      saveMembers(next);
      renderMembers();
    }));
  }

  const taskCount = JSON.parse(localStorage.getItem('tasks') || '[]').length;
  document.querySelector('#taskCount').textContent = taskCount;
  document.querySelector('#adminName').textContent = currentUser.username;
  document.querySelector('#userInitial').textContent = currentUser.username.charAt(0).toUpperCase();
  document.querySelector('#memberForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.querySelector('#memberName').value.trim();
    const role = document.querySelector('#memberRole').value.trim();
    const photo = document.querySelector('#memberPhoto').value.trim();
    if (!name || !role) return;
    const members = getMembers();
    members.push({ name, role, photo: photo || 'https://i.pravatar.cc/500?img=12' });
    saveMembers(members);
    event.target.reset();
    renderMembers();
  });
  document.querySelector('#logoutButton').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = '../pages/login.html';
  });
  renderMembers();
})();
