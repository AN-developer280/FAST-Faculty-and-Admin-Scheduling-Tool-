/* FAST teacher dashboard: Home + Department content (design only, no storage).
   Load AFTER teacher.js. Sidebar/top bar stay fixed; only <main id="view"> changes. */
(function () {
  /* ---------- PLACEHOLDER DATA (design only) ----------
     Later this comes from Django (admin adds departments, semesters, subjects).
     Shape: department -> semesters -> subjects */
  const DEPARTMENTS = [
    {
      id: 'cs', name: 'CS', semesters: [
        {name: 'Semester 1', subjects: [{name: 'Programming Fundamentals', ch: 3}, {name: 'Calculus', ch: 3}, {name: 'Applied Physics', ch: 3}]},
        {name: 'Semester 2', subjects: [{name: 'Object Oriented Programming', ch: 3}, {name: 'Networking', ch: 3}, {name: 'Discrete Mathematics', ch: 3}]},
        {name: 'Semester 3', subjects: [{name: 'Data Structures', ch: 3}, {name: 'Digital Logic Design', ch: 3}, {name: 'Linear Algebra', ch: 3}]}
      ]
    },
    {id: 'it', name: 'IT', semesters: []},
    {id: 'english', name: 'English', semesters: []},
    {id: 'math', name: 'Math', semesters: []}
  ];

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const view = document.getElementById('view');
  let openDept = null;   // null = department list, otherwise the department id being viewed

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const teacherName = () => (typeof TEACHER !== 'undefined' ? TEACHER.name : 'Teacher');
  const countSubjects = (d) => d.semesters.reduce((n, s) => n + s.subjects.length, 0);

  /* ---------- HOME (empty for now) ---------- */
  function homeView() {
    return `
      <h2 class="t-heading">Welcome, ${esc(teacherName())}</h2>
      <div class="t-alert">You have not selected subjects yet. <a class="t-link" href="#department">Go to Department</a></div>

      <div class="t-stats">
        <div class="t-card t-stat"><b>0</b><span>Subjects</span></div>
        <div class="t-card t-stat"><b>0</b><span>Lectures / week</span></div>
        <div class="t-card t-stat"><b>0%</b><span>Syllabus done</span></div>
      </div>

      <h3 class="t-section">Today (${DAYS[new Date().getDay()]})</h3>
      <p class="t-empty">No classes today.</p>`;
  }

  /* ---------- DEPARTMENT: one page, content changes ---------- */
  function departmentView() {
    // 1) list of departments
    if (!openDept) {
      return `
        <h2 class="t-heading">Select Department</h2>
        <p class="t-sub">Choose a department</p>
        <div class="t-grid">` + DEPARTMENTS.map((d) => `
          <button type="button" class="t-card t-pick" data-action="open-dept" data-id="${d.id}">
            <strong>${esc(d.name)}</strong><small>${countSubjects(d)} available</small>
          </button>`).join('') + '</div>';
    }

    // 2) semesters + subjects of the chosen department
    const dept = DEPARTMENTS.find((d) => d.id === openDept);
    return `
      <button type="button" class="t-link" data-action="back">← Departments</button>
      <h2 class="t-heading" style="margin-top:.6rem">${esc(dept.name)} Department</h2>` +
      (dept.semesters.length ? dept.semesters.map((sem) => `
        <h3 class="t-section">${esc(sem.name)}</h3>
        <div class="t-list">` + sem.subjects.map((s) => `
          <label class="t-card t-row">
            <input type="checkbox" class="t-check">
            <span class="name">${esc(s.name)}<small>${s.ch} CH</small></span>
            <span class="t-status">Available</span>
          </label>`).join('') + '</div>').join('')
      : '<p class="t-empty" style="margin-top:1rem">No semesters added yet.</p>');
    // NOTE: checkboxes do nothing yet. In Django this becomes a form/POST.
  }

  /* ---------- Other menu items ---------- */
  function soonView() {
    return `<h2 class="t-heading">${esc(document.getElementById('pageTitleText').textContent)}</h2><p class="t-sub">This page is coming soon.</p>`;
  }

  function render() {
    const id = location.hash.slice(1) || document.body.dataset.page || 'home';
    view.innerHTML = '<div class="t-view">' + (id === 'home' ? homeView() : id === 'department' ? departmentView() : soonView()) + '</div>';
  }

  view.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    if (el.dataset.action === 'open-dept') openDept = el.dataset.id;
    if (el.dataset.action === 'back') openDept = null;
    render();
  });

  // Clicking "Department" in the sidebar again returns to the department list
  document.getElementById('nav').addEventListener('click', (e) => {
    if (e.target.closest('a')) {openDept = null; setTimeout(render, 0);}
  });
  addEventListener('hashchange', () => {openDept = null; render();});
  render();
})();
