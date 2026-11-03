 /* ---------- Teacher (replace with data from your API) ---------- */
    const TEACHER = {name: 'ARU', dept: 'Computer Science'};

    /* ---------- Menu ----------
       id    : used to highlight the current page (body data-page, or the #hash while this is one file)
       href  : change to the real page when each page has its own file, e.g. 'timetable.html'
       badge : optional number shown on the right (e.g. unread announcements) */
    
    const NAV = [
      {
        group: 'Main',
        items: [
          {id: 'home', label: 'Home', icon: 'fa-solid fa-house', href: '#home'},
          {id: 'department', label: 'Department', icon: 'fa-solid fa-building-columns', href: '#department'}
        ]
      },
      {
        group: 'Teaching',
        items: [
          {id: 'timetable', label: 'Timetable', icon: 'fa-solid fa-calendar-days', href: '#timetable'},
          {id: 'syllabus', label: 'Syllabus Tracker', icon: 'fa-solid fa-bullseye', href: '#syllabus'},
          {id: 'diary', label: 'Teacher Diary', icon: 'fa-solid fa-book-open', href: '#diary'},
          {id: 'attendance', label: 'Attendance', icon: 'fa-solid fa-clipboard-check', href: '#attendance'}
        ]
      },
      {
        group: 'More',
        items: [
          {id: 'requests', label: 'Leave & Request', icon: 'fa-solid fa-envelope', href: '#requests'},
          {id: 'announcements', label: 'Announcements', icon: 'fa-solid fa-bullhorn', href: '#announcements'},
          {id: 'report', label: 'My Report', icon: 'fa-solid fa-chart-line', href: '#report'}
        ]
      }
    ];

    const $ = (id) => document.getElementById(id);
    const BASE = 'nav-item group relative flex items-center gap-3 rounded-xl px-2.5 py-1.5 text-sm transition ';
    const ON = 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-400/30 ' +
      'before:absolute before:-left-3 before:top-1/2 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-white';
    const OFF = 'text-sky-100/90 font-medium hover:bg-white/10 hover:translate-x-0.5';


    function renderNav() {
      $('nav').innerHTML = NAV.map((g) =>
        '<p class="flex items-center gap-2 px-3 pb-1 pt-3 text-[10.5px] font-bold uppercase tracking-[0.14em] text-cyan-200/75 first:pt-1">' +
        g.group + '<span class="h-px flex-1 bg-white/15"></span></p>' +

        g.items.map((i) =>
          '<a href="' + i.href + '" data-id="' + i.id + '" class="' + BASE + '">' +

          '<span class="ic flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-base transition group-hover:bg-white/20">' +
          '<i class="' + i.icon + '"></i>' +
         
          '</span>' +

          '<span class="min-w-0 flex-1 truncate">' + i.label + '</span>' +

          (i.badge ? '<em class="badge rounded-full bg-rose-500 px-2 text-[11px] font-bold not-italic leading-5 text-white shadow shadow-rose-500/40">' + i.badge + '</em>' : '') +

          '</a>'
        ).join('')
      ).join('');
    }
    function setActive(id) {
      let label = 'Home';
      document.querySelectorAll('.nav-item').forEach((a) => {
        const on = a.dataset.id === id;
        a.className = BASE + (on ? ON : OFF);
        a.querySelector('.ic').className = 'ic flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base transition ' + (on ? 'bg-white/25 text-cyan-900' : 'bg-white/10 text-slate-200 group-hover:bg-white/20');
        if (on) {a.setAttribute('aria-current', 'page'); label = a.querySelector('.truncate').textContent;} else a.removeAttribute('aria-current');
      });
      $('pageTitleText').textContent = label;
      document.title = label + ' — FAST';
    }

    const currentId = () => (location.hash.slice(1) || document.body.dataset.page || 'home');

    /* ---------- Open / close on phones ---------- */
    const sidebar = $('sidebar'), overlay = $('overlay');
    function openMenu() {sidebar.classList.remove('-translate-x-full'); overlay.classList.remove('hidden'); $('menuBtn').setAttribute('aria-expanded', 'true');}
    function closeMenu() {sidebar.classList.add('-translate-x-full'); overlay.classList.add('hidden'); $('menuBtn').setAttribute('aria-expanded', 'false');}
    $('menuBtn').addEventListener('click', openMenu);
    $('closeBtn').addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {if (e.key === 'Escape') closeMenu();});
    $('nav').addEventListener('click', (e) => {if (e.target.closest('a')) closeMenu();});   // close after choosing a page
    addEventListener('resize', () => {if (innerWidth >= 1024) overlay.classList.add('hidden');});

    /* ---------- Top bar: theme + logout ---------- */
    $('themeBtn').addEventListener('click', () => {
      const dark = document.documentElement.classList.toggle('dark');
      if (window.FAST) FAST.setTheme(dark ? 'dark' : 'light'); else {try {localStorage.setItem('fast-theme', dark ? 'dark' : 'light');} catch (e) { } }
    });
    /* TODO (backend): call your logout API (clear the session), then send the teacher to the teacher login page:
         await fetch(FAST.urls.api + 'auth/logout', { method: 'POST', credentials: 'include' });
         window.location.href = 'index.html'; */
    $('logoutBtn').addEventListener('click', () => {window.location.href = 'index.html';});

    /* ---------- Small helper for your pages: badge count on a menu item, e.g. setBadge('announcements', 5) ---------- */
    window.setBadge = function (id, n) {
      const a = document.querySelector('.nav-item[data-id="' + id + '"]'); if (!a) return;
      let b = a.querySelector('.badge');
      if (!n) {if (b) b.remove(); return;}
      if (!b) {b = document.createElement('em'); b.className = 'badge rounded-full bg-rose-500 px-2 text-[11px] font-bold not-italic leading-5 text-white shadow shadow-rose-500/40'; a.appendChild(b);}
      b.textContent = n;
    };

    /* ---------- Start ---------- */
    $('tName').textContent = TEACHER.name;
    $('tDept').textContent = TEACHER.dept;
    $('tAvatar').textContent = TEACHER.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
    const now = new Date();
    $('tdMonth').textContent = now.toLocaleDateString('en-GB', {month: 'short'});
    $('tdDay').textContent = now.getDate();
    $('tdWeek').textContent = now.toLocaleDateString('en-GB', {weekday: 'long'});
    renderNav();
    setActive(currentId());
    addEventListener('hashchange', () => setActive(currentId()));