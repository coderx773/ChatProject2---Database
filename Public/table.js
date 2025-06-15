const userTableContainer = document.getElementById('userTableContainer');

let users = [];
let sortField = 'name';
let sortAscending = true;

function renderUsers() {
  const sorted = [...users].sort((a, b) => {
    if (sortField === 'name') {
      return sortAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else {
      return sortAscending ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
    }
  });

  if (!sorted.length) {
    userTableContainer.innerHTML = '<p>No users found.</p>';
    return;
  }

  const rows = sorted.map(user => `
    <tr>
      <td>${user.name}</td>
      <td>${user.age}</td>
      <td>${user.height}</td>
    </tr>
  `).join('');

  userTableContainer.innerHTML = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
      <button onclick="toggleSort('name', this)">Name <span id="sort-arrow-name">▲</span></button>
      <button onclick="toggleSort('age', this)">Age <span id="sort-arrow-age">▲</span></button>
      <button onclick="toggleSort('height', this)">Height <span id="sort-arrow-height">▲</span></button>
    </div>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
  updateSortIcons();
}

function updateSortIcons() {
  const fields = ['name', 'age', 'height'];
  fields.forEach(field => {
    const arrowSpan = document.getElementById(`sort-arrow-${field}`);
    if (!arrowSpan) return;
    arrowSpan.textContent = sortAscending ? '⬆' : '⬇';
  });
}

async function loadUsers() {
  const res = await fetch('/api/users');
  users = await res.json();
  renderUsers();
}

function toggleSort(field, btn) {
  if (sortField === field) {
    sortAscending = !sortAscending;
  } else {
    sortField = field;
    sortAscending = true;
  }
  renderUsers();
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

loadUsers();