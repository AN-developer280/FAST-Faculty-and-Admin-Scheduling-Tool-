
(function () {
  const view = document.getElementById('view');

  if (!view) return;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));

  const currentId = () =>
    location.hash.slice(1) || document.body.dataset.page || 'home';


  /* =====================================================================================
     TIMETABLE

     HOW TO CONNECT (Django / API)
     -----------------------------

     Timetable.configure({
         onWeekChange: (weekStartISO) => {
             Timetable.setState('loading');

             fetch('/api/teacher/timetable?week=' + weekStartISO)
                 .then((r) => r.json())
                 .then((data) => Timetable.setData(data))
                 .catch((err) => Timetable.setState('error', {
                     message: err.message
                 }));
         },

         onRequestSubmit: (payload) =>
             fetch('/api/teacher/timetable/request', {
                 method: 'POST',
                 body: JSON.stringify(payload)
             }),

         links: {
             diary: '#diary',
             attendance: '#attendance',
             subjects: '#department'
         }
     });

     Timetable.setData({
         weekStart: '2026-11-09',

         timing: {
             title: 'Standing timing',

             slots: [
                 {
                     label: 'Lecture 1',
                     start: '14:00',
                     end: '14:40'
                 }
             ],

             breaks: [
                 {
                     after: 1,
                     start: '15:20',
                     end: '15:40'
                 }
             ]
         },

         subjects: [
             {
                 id: 1,
                 name: 'Subject',
                 code: 'CODE-101',
                 color: 'cyan'
             }
         ],

         entries: [
             {
                 id: 10,
                 subjectId: 1,
                 day: 0,
                 slot: 0,

                 start: '14:45',
                 end: '15:25',

                 dept: 'Dept',
                 semester: 3,
                 room: '12',
                 creditHours: 3,
                 nextTopic: 'Topic',

                 diary: 'done',
                 changeRequested: false,
                 pinned: false,

                 progress: {
                     done: 9,
                     total: 32
                 }
             }
         ],

         holidays: [
             {
                 day: 3,
                 label: 'Holiday'
             }
         ]
     });

     Other:
     Timetable.setState('loading' | 'error' | 'empty', { message })

     data.noSubjects = true
     ===================================================================================== */


  /* ---------- CSS ---------- */

  const TT_CSS = `

    .tt {
        --tt-line: rgba(8,145,178,.22);
        --tt-surf: rgba(255,255,255,.85);
        --tt-surf2: #ecfeff;
        --tt-today: #cffafe;
        --tt-dlg: #fff;
        --tt-mute: #64748b;

        color: #0f172a;
    }

    .dark .tt {
        --tt-line: rgba(125,211,252,.18);
        --tt-surf: #0a2036;
        --tt-surf2: #0c2b44;
        --tt-today: rgba(6,182,212,.22);
        --tt-dlg: #0b2238;
        --tt-mute: rgba(224,242,254,.65);

        color: #e0f2fe;
    }

    .tt * {
        box-sizing: border-box;
    }

    .tt-c-cyan { --ac: #06b6d4; }
    .tt-c-indigo { --ac: #6366f1; }
    .tt-c-emerald { --ac: #10b981; }
    .tt-c-blue { --ac: #3b82f6; }
    .tt-c-violet { --ac: #8b5cf6; }
    .tt-c-teal { --ac: #14b8a6; }
    .tt-c-orange { --ac: #f97316; }
    .tt-c-pink { --ac: #ec4899; }

    .tt-banner {
        margin: .75rem 0 1rem;
        padding: .75rem 1rem;
        border-radius: 1rem;
        border: 1px solid var(--tt-line);
        background: var(--tt-surf2);
        font-size: .875rem;
    }

    .tt-banner p + p {
        margin-top: .25rem;
    }

    .tt-bar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: .75rem;
        margin: 1.25rem 0 .75rem;
    }

    .tt-seg {
        display: inline-flex;
        align-items: center;
        border: 1px solid var(--tt-line);
        border-radius: 999px;
        padding: .25rem;
        background: var(--tt-surf);
    }

    .tt-ib {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 999px;
        border: 0;
        background: transparent;
        color: inherit;
        cursor: pointer;
    }

    .tt-ib:hover {
        background: var(--tt-today);
    }

    .tt-wk {
        min-width: 11rem;
        display: flex;
        gap: .5rem;
        justify-content: center;
        align-items: center;
        padding: 0 .5rem;
        font-weight: 700;
        font-size: .875rem;
        text-align: center;
    }

    .tt-pill {
        font-size: .625rem;
        font-weight: 700;
        text-transform: uppercase;
        background: #06b6d4;
        color: #fff;
        border-radius: 999px;
        padding: .1rem .5rem;
    }

    .tt-btn {
        display: inline-flex;
        align-items: center;
        gap: .5rem;
        border: 1px solid var(--tt-line);
        background: var(--tt-surf);
        color: inherit;
        border-radius: 999px;
        padding: .5rem 1rem;
        font: inherit;
        font-size: .875rem;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
    }

    .tt-btn:hover {
        border-color: #06b6d4;
    }

    .tt-btn[disabled] {
        opacity: .5;
        cursor: not-allowed;
    }

    .tt-btn-main {
        background: linear-gradient(90deg, #06b6d4, #2563eb);
        color: #fff;
        border-color: transparent;
        box-shadow: 0 6px 16px rgba(6,182,212,.3);
    }

    .tt-btn-warn {
        background: #fffbeb;
        color: #92400e;
        border-color: rgba(251,191,36,.6);
    }

    .dark .tt-btn-warn {
        background: rgba(251,191,36,.1);
        color: #fde68a;
    }

    .tt-spacer {
        margin-left: auto;
        display: flex;
        gap: .5rem;
    }

    .tt-tabs {
        display: inline-flex;
        border: 1px solid var(--tt-line);
        border-radius: 999px;
        padding: .25rem;
        background: rgba(224,242,254,.6);
    }

    .dark .tt-tabs {
        background: rgba(255,255,255,.05);
    }

    .tt-tab {
        border: 0;
        background: transparent;
        color: inherit;
        opacity: .75;
        border-radius: 999px;
        padding: .375rem 1rem;
        font: inherit;
        font-size: .875rem;
        font-weight: 600;
        cursor: pointer;
    }

    .tt-tab[aria-selected=true] {
        opacity: 1;
        color: #fff;
        background: linear-gradient(90deg, #06b6d4, #2563eb);
        box-shadow: 0 4px 12px rgba(6,182,212,.3);
    }

    .tt-legend {
        display: flex;
        flex-wrap: wrap;
        gap: .5rem;
        margin: .75rem 0;
    }

    .tt-chip {
        display: inline-flex;
        align-items: center;
        gap: .5rem;
        border: 1px solid var(--ac);
        background: color-mix(in srgb, var(--ac) 12%, transparent);
        color: inherit;
        border-radius: 999px;
        padding: .25rem .75rem;
        font: inherit;
        font-size: .75rem;
        font-weight: 600;
        cursor: pointer;
    }

    .tt-chip[aria-pressed=false] {
        opacity: .5;
        text-decoration: line-through;
        border-color: var(--tt-line);
        background: transparent;
    }

    .tt-dot {
        display: inline-block;
        width: .6rem;
        height: .6rem;
        border-radius: 50%;
        background: var(--ac);
        flex: none;
    }

    .tt-scroll {
        overflow-x: auto;
        border: 1px solid var(--tt-line);
        border-radius: 1rem;
    }

    .tt-grid {
        display: grid;
        gap: 1px;
        background: var(--tt-line);
        min-width: 880px;
        grid-template-columns: 78px repeat(5, minmax(150px, 1fr));
    }

    .tt-cell {
        background: var(--tt-surf);
        padding: .375rem;
    }

    .tt-cell.today {
        background: var(--tt-surf2);
    }

    .tt-head {
        background: var(--tt-surf);
        text-align: center;
        padding: .6rem .5rem;
    }

    .tt-head.today {
        background: var(--tt-today);
    }

    .tt-head b {
        display: block;
        font-size: .75rem;
        text-transform: uppercase;
        letter-spacing: .05em;
    }

    .tt-head span {
        font-size: .875rem;
        opacity: .7;
    }

    .tt-slot {
        background: var(--tt-surf);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: .625rem;
        line-height: 1.2;
        padding: .75rem .25rem;
        opacity: .9;
    }

    .tt-slot b {
        font-size: .6875rem;
        text-transform: uppercase;
    }

    .tt-break {
        grid-column: 1 / -1;
        background: #fffbeb;
        color: #92400e;
        text-align: center;
        font-size: .6875rem;
        font-weight: 600;
        padding: .375rem;
    }

    .dark .tt-break {
        background: rgba(251,191,36,.1);
        color: #fde68a;
    }

    .tt-off {
        background: var(--tt-surf);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: .4rem;
        font-size: .75rem;
        opacity: .6;
        padding: .5rem;
    }

    .tt-free {
        min-height: 78px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px dashed var(--tt-line);
        border-radius: .75rem;
        font-size: .6875rem;
        opacity: .5;
    }

    .tt-card {
        display: block;
        width: 100%;
        text-align: left;
        cursor: pointer;
        margin: 0 0 .375rem;
        padding: .625rem;
        border-radius: .75rem;
        border: 1px solid color-mix(in srgb, var(--ac) 35%, transparent);
        border-left: 4px solid var(--ac);
        background: color-mix(in srgb, var(--ac) 10%, #fff);
        color: color-mix(in srgb, var(--ac) 35%, #0b1220);
        font: inherit;
        transition: transform .15s, box-shadow .15s;
    }

    .dark .tt-card {
        background: color-mix(in srgb, var(--ac) 14%, transparent);
        color: #f0f9ff;
    }

    .tt-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 14px rgba(0,0,0,.14);
    }

    .tt-card.past {
        opacity: .7;
    }

    .tt-card .tm {
        display: flex;
        justify-content: space-between;
        gap: .25rem;
        font-size: .6875rem;
        font-weight: 700;
        color: var(--ac);
    }

    .tt-card .nm {
        margin: .25rem 0 0;
        font-size: .875rem;
        font-weight: 700;
        line-height: 1.25;
    }

    .tt-card .sm {
        font-size: .6875rem;
        opacity: .8;
        margin-top: .125rem;
    }

    .tt-card .tp {
        font-size: .6875rem;
        opacity: .9;
        margin-top: .25rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .tt-badges {
        display: flex;
        flex-wrap: wrap;
        gap: .25rem;
        margin-top: .375rem;
    }

    .tt-badges:empty {
        display: none;
    }

    .tt-badge {
        display: inline-block;
        border-radius: 999px;
        padding: .05rem .5rem;
        font-size: .625rem;
        font-weight: 700;
        line-height: 1rem;
    }

    .tt-b-now {
        background: #f43f5e;
        color: #fff;
    }

    .tt-b-done {
        background: #d1fae5;
        color: #065f46;
    }

    .tt-b-pend {
        background: #fef3c7;
        color: #92400e;
    }

    .tt-b-up {
        background: #e2e8f0;
        color: #334155;
    }

    .dark .tt-b-done {
        background: rgba(52,211,153,.15);
        color: #a7f3d0;
    }

    .dark .tt-b-pend {
        background: rgba(251,191,36,.15);
        color: #fde68a;
    }

    .dark .tt-b-up {
        background: rgba(255,255,255,.1);
        color: #e0f2fe;
    }

    .tt-days {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: .375rem;
        margin-bottom: .75rem;
    }

    .tt-dtab {
        border: 1px solid var(--tt-line);
        background: var(--tt-surf);
        color: inherit;
        border-radius: .75rem;
        padding: .5rem .25rem;
        text-align: center;
        font: inherit;
        cursor: pointer;
    }

    .tt-dtab b {
        display: block;
        font-size: .75rem;
        text-transform: uppercase;
    }

    .tt-dtab span {
        display: block;
        font-size: .6875rem;
        opacity: .8;
    }

    .tt-dtab[aria-selected=true] {
        color: #fff;
        border-color: transparent;
        background: linear-gradient(90deg, #06b6d4, #2563eb);
        box-shadow: 0 4px 12px rgba(6,182,212,.3);
    }

    .tt-day {
        border: 1px solid var(--tt-line);
        border-left: 4px solid var(--ac);
        border-radius: 1rem;
        background: var(--tt-surf);
        margin-bottom: .75rem;
        overflow: hidden;
    }

    .tt-day.past {
        opacity: .8;
    }

    .tt-day .top {
        display: flex;
        flex-wrap: wrap;
        gap: .5rem 1rem;
        padding: 1rem;
    }

    .tt-day .when {
        width: 7rem;
        flex: none;
    }

    .tt-day .when b {
        display: block;
        font-size: .875rem;
        color: var(--ac);
    }

    .tt-day .when small {
        color: var(--tt-mute);
        font-size: .6875rem;
    }

    .tt-day .what {
        flex: 1;
        min-width: 0;
    }

    .tt-day .what strong {
        font-size: 1rem;
    }

    .tt-day .what p {
        font-size: .75rem;
        color: var(--tt-mute);
        margin-top: .125rem;
    }

    .tt-day .acts {
        display: flex;
        flex-wrap: wrap;
        gap: .5rem;
        padding: .625rem 1rem;
        border-top: 1px solid var(--tt-line);
    }

    .tt-day .acts .tt-btn {
        padding: .25rem .75rem;
        font-size: .75rem;
    }

    .tt-msg {
        padding: 1.5rem;
        text-align: center;
        font-size: .875rem;
        border: 1px solid var(--tt-line);
        border-radius: 1rem;
        background: var(--tt-surf);
        color: var(--tt-mute);
    }

    .tt-table {
        width: 100%;
        min-width: 720px;
        border-collapse: collapse;
        font-size: .875rem;
        text-align: left;
    }

    .tt-table th {
        padding: .75rem 1rem;
        font-size: .6875rem;
        text-transform: uppercase;
        letter-spacing: .05em;
        color: #0e7490;
        border-bottom: 1px solid var(--tt-line);
    }

    .dark .tt-table th {
        color: #67e8f9;
    }

    .tt-table td {
        padding: .75rem 1rem;
        border-bottom: 1px solid var(--tt-line);
    }

    .tt-table tr[data-tt-action] {
        cursor: pointer;
    }

    .tt-table tr[data-tt-action]:hover,
    .tt-table tr[data-tt-action]:focus {
        background: var(--tt-today);
        outline: none;
    }

    .tt-box {
        border: 1px solid var(--tt-line);
        border-radius: 1rem;
        background: var(--tt-surf);
        overflow-x: auto;
    }

    .tt-state {
        max-width: 32rem;
        margin: 1.5rem auto;
        padding: 2rem;
        text-align: center;
        border: 1px solid var(--tt-line);
        border-radius: 1rem;
        background: var(--tt-surf);
    }

    .tt-state .big {
        font-size: 2.25rem;
        color: #0891b2;
    }

    .tt-state h3 {
        margin: .75rem 0 .25rem;
        font-size: 1.125rem;
        font-weight: 800;
    }

    .tt-state p {
        font-size: .875rem;
        color: var(--tt-mute);
    }

    .tt-state .row {
        display: flex;
        flex-wrap: wrap;
        gap: .5rem;
        justify-content: center;
        margin-top: 1.25rem;
    }

    .tt-load {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: .75rem;
        padding: .75rem;
        border: 1px solid var(--tt-line);
        border-radius: 1rem;
        background: var(--tt-surf);
    }

    .tt-load i {
        height: 6rem;
        border-radius: .75rem;
        background: var(--tt-today);
        animation: ttp 1.4s ease-in-out infinite;
    }

    @keyframes ttp {
        50% {
            opacity: .45;
        }
    }

    .tt-overlay {
        position: fixed;
        inset: 0;
        z-index: 60;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        background: rgba(15,23,42,.55);
        backdrop-filter: blur(4px);
    }

    .tt-dlg {
        width: 100%;
        max-width: 28rem;
        max-height: 92vh;
        overflow: auto;
        border-radius: 1.5rem;
        background: var(--tt-dlg);
        color: inherit;
        border: 1px solid var(--tt-line);
        padding: 1.25rem;
        box-shadow: 0 25px 50px rgba(0,0,0,.3);
    }

    .tt-dlg h2 {
        font-size: 1.125rem;
        font-weight: 800;
        line-height: 1.3;
    }

    .tt-x {
        flex: none;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        border: 0;
        background: rgba(148,163,184,.2);
        color: inherit;
        cursor: pointer;
    }

    .tt-eyebrow {
        font-size: .6875rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .05em;
        color: #0e7490;
    }

    .dark .tt-eyebrow {
        color: #67e8f9;
    }

    .tt-dl > div {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        padding: .5rem 0;
        font-size: .875rem;
        border-bottom: 1px solid var(--tt-line);
    }

    .tt-dl dt {
        color: var(--tt-mute);
    }

    .tt-dl dd {
        text-align: right;
        font-weight: 600;
        margin: 0;
    }

    .tt-bar2 {
        height: .5rem;
        border-radius: 999px;
        overflow: hidden;
        background: var(--tt-line);
        margin-top: .375rem;
    }

    .tt-bar2 i {
        display: block;
        height: 100%;
        background: linear-gradient(90deg, #06b6d4, #2563eb);
    }

    .tt-lbl {
        display: block;
        margin-top: .75rem;
        font-size: .875rem;
        font-weight: 500;
    }

    .tt-in {
        width: 100%;
        margin-top: .375rem;
        border: 1px solid var(--tt-line);
        border-radius: .75rem;
        padding: .6rem .75rem;
        font: inherit;
        font-size: .875rem;
        background: var(--tt-dlg);
        color: inherit;
    }

    .tt-in:focus {
        outline: 2px solid #06b6d4;
        outline-offset: 1px;
    }

    .tt-err {
        margin-top: .25rem;
        font-size: .75rem;
        color: #e11d48;
    }

    .dark .tt-err {
        color: #fda4af;
    }

    .tt-errbox {
        margin-top: .75rem;
        padding: .5rem .75rem;
        border-radius: .75rem;
        border: 1px solid rgba(244,63,94,.4);
        background: rgba(244,63,94,.08);
        font-size: .875rem;
        color: #be123c;
    }

    .dark .tt-errbox {
        color: #fecdd3;
    }

    .tt-grid2 {
        display: grid;
        gap: .75rem;
        grid-template-columns: 1fr 1fr;
        margin-top: .75rem;
    }

    .tt-grid2 .tt-lbl {
        margin-top: 0;
    }

    .tt-foot {
        display: flex;
        gap: .75rem;
        margin-top: 1.25rem;
    }

    .tt-foot .tt-btn-main {
        flex: 1;
        justify-content: center;
        padding: .75rem 1.25rem;
    }

    .tt [hidden] {
        display: none !important;
    }

    @media (max-width: 560px) {
        .tt-grid2 {
            grid-template-columns: 1fr;
        }
    }

    @media print {
        #sidebar,
        #overlay,
        header,
        .tt-noprint {
            display: none !important;
        }

        [class*="lg:pl-64"] {
            padding-left: 0 !important;
        }
    }

    `;


  /* ---------- add CSS to the page ---------- */

  (function () {
    const s = document.createElement('style');

    s.id = 'tt-style';
    s.textContent = TT_CSS;

    document.head.appendChild(s);
  })();


  /* ---------- helpers ---------- */

  const TT_D = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri'
  ];

  const TT_DF = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday'
  ];

  const TT_M = [
    'Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug',
    'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const TT_COL = [
    'cyan',
    'indigo',
    'emerald',
    'blue',
    'violet',
    'teal',
    'orange',
    'pink'
  ];

  const e_ = (s) =>
    (s == null ? '' : esc(s));

  const pad = (n) =>
    (n < 10 ? '0' + n : '' + n);

  const iso = (d) =>
    d.getFullYear() + '-' +
    pad(d.getMonth() + 1) + '-' +
    pad(d.getDate());

  const parseIso = (s) => {
    const p = String(s).split('-');

    return new Date(
      +p[0],
      +p[1] - 1,
      +p[2]
    );
  };

  const addDays = (d, n) =>
    new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate() + n
    );

  const mondayOf = (d) =>
    addDays(d, -((d.getDay() + 6) % 7));

  const mins = (t) => {
    const p = String(t).split(':');

    return (+p[0]) * 60 + (+p[1]);
  };

  const fmtT = (t) => {
    const m = mins(t);

    let h = Math.floor(m / 60);

    const ap = h >= 12 ? 'PM' : 'AM';

    h = h % 12 || 12;

    return h + ':' + pad(m % 60) + ' ' + ap;
  };

  const fmtR = (s, e) => {
    let a = fmtT(s);

    const b = fmtT(e);

    if (a.slice(-2) === b.slice(-2)) {
      a = a.slice(0, -3);
    }

    return a + ' – ' + b;
  };

  const fmtDM = (d) =>
    d.getDate() + ' ' + TT_M[d.getMonth()];

  const ic = (c) =>
    '<i class="' + c + '" aria-hidden="true"></i>';


  /* ---------- state ---------- */

  const emptyData = () => ({
    weekStart: null,

    timing: {
      title: '',
      slots: [],
      breaks: []
    },

    subjects: [],
    entries: [],
    holidays: [],

    noSubjects: false
  });

  const tt = {
    weekStart: mondayOf(new Date()),

    data: emptyData(),

    byId: {},
    subj: {},

    view: 'week',
    day: null,

    hidden: {},
    modal: null,

    state: null,
    errMsg: '',

    focusBack: null
  };

  const ttCfg = {
    links: {
      diary: '#diary',
      attendance: '#attendance',
      subjects: '#department'
    },

    onWeekChange: null,
    onRequestSubmit: null,
    onIcsExport: null,
    onRetry: null
  };

  let ttStarted = false;


  /* ---------- timetable data helpers ---------- */

  const slots = () =>
    tt.data.timing.slots || [];

  const dayDate = (i) =>
    addDays(tt.weekStart, i);

  const todayIdx = () => {
    const n = new Date();

    const i = Math.round(
      (
        new Date(
          n.getFullYear(),
          n.getMonth(),
          n.getDate()
        ) - tt.weekStart
      ) / 864e5
    );

    return i >= 0 && i < 5 ? i : -1;
  };

  const isThisWeek = () =>
    iso(tt.weekStart) === iso(mondayOf(new Date()));

  const holMap = () => {
    const m = {};

    (tt.data.holidays || []).forEach((h) => {
      m[h.day] = h;
    });

    return m;
  };

  const subjOf = (e) =>
    tt.subj[String(e.subjectId)] || {
      name: e.subjectName || 'Subject',
      code: '',
      color: 'cyan'
    };

  const times = (e) => {
    const s = slots()[e.slot] || {};

    const start = e.start || s.start;
    const end = e.end || s.end;

    return {
      start,
      end,

      custom: !!(
        e.start &&
        s.start &&
        (
          e.start !== s.start ||
          e.end !== s.end
        )
      )
    };
  };

  const visible = () =>
    (tt.data.entries || []).filter((e) =>
      !tt.hidden[String(e.subjectId)] &&
      times(e).start
    );

  const at = (day, t) => {
    const d = dayDate(day);
    const m = mins(t);

    return new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      Math.floor(m / 60),
      m % 60
    );
  };

  const info = (e) => {
    const t = times(e);

    const now = new Date();

    const s = at(e.day, t.start);
    const en = at(e.day, t.end);

    return {
      t,
      start: s,
      end: en,

      now: now >= s && now < en,
      past: now >= en
    };
  };

  const slotLabel = (i) =>
    (slots()[i] && slots()[i].label) ||
    'Lecture ' + (i + 1);

  const sortE = (a) =>
    a.slice().sort((x, y) =>
      x.day - y.day ||
      mins(times(x).start) - mins(times(y).start)
    );

  const classLine = (e) =>
    [
      e.dept,

      e.semester != null && e.semester !== ''
        ? 'Sem ' + e.semester
        : '',

      e.room
        ? 'Room ' + e.room
        : ''
    ]
      .filter(Boolean)
      .join(' · ');

  const linkHref = (kind, e) => {
    const f = ttCfg.links[kind];

    if (!f) return '#';

    return typeof f === 'function'
      ? f(e || {})
      : String(f).replace(
        '{id}',
        encodeURIComponent(e ? e.id : '')
      );
  };


  /* ---------- small HTML pieces ---------- */

  const badge = (cls, icon, text) =>
    '<span class="tt-badge ' + cls + '">' +
    (icon ? ic(icon) + ' ' : '') +
    e_(text) +
    '</span>';


  function badges(e, inf) {
    const o = [];

    if (inf.now) {
      o.push(
        badge('tt-b-now', '', 'Now')
      );
    }

    if (e.diary === 'done') {
      o.push(
        badge(
          'tt-b-done',
          'fa-solid fa-check',
          'Diary done'
        )
      );
    } else if (e.diary === 'pending') {
      o.push(
        badge(
          'tt-b-pend',
          'fa-regular fa-clock',
          'Diary pending'
        )
      );
    }

    if (e.changeRequested) {
      o.push(
        badge(
          'tt-b-pend',
          'fa-solid fa-rotate',
          'Change requested'
        )
      );
    }

    return o.join('');
  }


  function statusBadge(e, inf) {
    if (inf.now) {
      return badge('tt-b-now', '', 'Now');
    }

    if (e.changeRequested) {
      return badge(
        'tt-b-pend',
        'fa-solid fa-rotate',
        'Change requested'
      );
    }

    if (e.diary === 'done') {
      return badge(
        'tt-b-done',
        'fa-solid fa-check',
        'Diary done'
      );
    }

    if (e.diary === 'pending') {
      return badge(
        'tt-b-pend',
        'fa-regular fa-clock',
        'Diary pending'
      );
    }

    return inf.past
      ? ''
      : badge('tt-b-up', '', 'Upcoming');
  }


  /* ---------- sections ---------- */

  function ttBanner() {
    const sl = slots();

    if (!sl.length) return '';

    const T = tt.data.timing;
    const br = T.breaks || [];

    const hol = (tt.data.holidays || []).filter(
      (x) => x.day >= 0 && x.day < 5
    );

    return (
      '<div class="tt-banner">' +

      '<p>' +
      '<b>' +
      ic('fa-regular fa-clock') +
      ' ' +
      e_(T.title || 'Timing') +
      '</b>' +

      ' · ' +
      sl.length +
      ' lecture' +
      (sl.length === 1 ? '' : 's') +
      ' a day: ' +

      sl
        .map((s) => fmtR(s.start, s.end))
        .join(' · ') +

      br
        .map((b) =>
          ' · break ' + fmtR(b.start, b.end)
        )
        .join('') +

      '</p>' +

      (
        hol.length
          ? '<p>' +
          ic('fa-solid fa-umbrella-beach') +
          ' ' +
          hol
            .map((x) =>
              TT_D[x.day] +
              ': ' +
              e_(x.label || 'Holiday')
            )
            .join(' · ') +
          '</p>'
          : ''
      ) +

      '</div>'
    );
  }


  function ttSummary() {
    const list = visible();

    let a = '—';
    let b = '—';
    let c = '—';

    let n1 = '—';
    let n2 = '&nbsp;';

    if (list.length) {
      let total = 0;

      const subs = {};

      list.forEach((e) => {
        const t = times(e);

        total += mins(t.end) - mins(t.start);

        subs[String(e.subjectId)] = 1;
      });

      a = list.length;
      b = (Math.round(total / 6) / 10) + ' h';
      c = Object.keys(subs).length;

      const now = new Date();

      let next = null;
      let ni = null;

      sortE(list).forEach((e) => {
        const inf = info(e);

        if (!next && inf.end > now) {
          next = e;
          ni = inf;
        }
      });

      if (next) {
        n1 =
          (ni.now ? 'Now · ' : '') +
          e_(subjOf(next).name);

        n2 = ni.now
          ? 'Ends ' + fmtT(ni.t.end)
          : TT_D[next.day] +
          ' · ' +
          fmtR(ni.t.start, ni.t.end);
      } else {
        n2 = 'No more lectures this week';
      }
    }

    const card = (icon, label, v, sub) =>
      '<div class="t-card t-stat">' +
      '<b>' + v + '</b>' +
      '<span>' +
      ic(icon) +
      ' ' +
      label +
      (sub ? ' · ' + sub : '') +
      '</span>' +
      '</div>';

    return (
      '<div class="t-stats">' +

      card(
        'fa-regular fa-calendar-days',
        'Lectures',
        a,
        'this week'
      ) +

      card(
        'fa-regular fa-clock',
        'Teaching time',
        b,
        'this week'
      ) +

      card(
        'fa-solid fa-book',
        'Subjects',
        c,
        'this week'
      ) +

      '<div class="t-card t-stat">' +
      '<b style="font-size:1.05rem">' +
      n1 +
      '</b>' +

      '<span>' +
      ic('fa-solid fa-arrow-right') +
      ' Next lecture · ' +
      n2 +
      '</span>' +
      '</div>' +

      '</div>'
    );
  }


  function ttToolbar() {
    const end = addDays(tt.weekStart, 4);

    const has = visible().length > 0;

    const tab = (v, l) =>
      '<button type="button" role="tab" ' +
      'class="tt-tab" ' +
      'data-tt-action="tt-view" ' +
      'data-v="' + v + '" ' +
      'aria-selected="' + (tt.view === v) + '">' +
      l +
      '</button>';

    return (
      '<div class="tt-bar tt-noprint">' +

      '<div class="tt-seg">' +

      '<button type="button" class="tt-ib" ' +
      'data-tt-action="tt-prev" ' +
      'aria-label="Previous week">' +
      ic('fa-solid fa-chevron-left') +
      '</button>' +

      '<span class="tt-wk">' +

      '<span>' +
      fmtDM(tt.weekStart) +
      ' – ' +
      fmtDM(end) +
      ' ' +
      end.getFullYear() +
      '</span>' +

      (
        isThisWeek()
          ? '<span class="tt-pill">This week</span>'
          : ''
      ) +

      '</span>' +

      '<button type="button" class="tt-ib" ' +
      'data-tt-action="tt-next" ' +
      'aria-label="Next week">' +
      ic('fa-solid fa-chevron-right') +
      '</button>' +

      '</div>' +

      '<button type="button" class="tt-btn" ' +
      'data-tt-action="tt-today">' +
      'Today' +
      '</button>' +

      '<div class="tt-tabs" role="tablist" aria-label="View">' +
      tab('week', 'Week') +
      tab('day', 'Day') +
      tab('list', 'List') +
      '</div>' +

      '<div class="tt-spacer">' +

      '<button type="button" class="tt-btn" ' +
      'data-tt-action="tt-ics"' +
      (has ? '' : ' disabled') +
      ' title="Download as a calendar file (.ics)">' +

      ic('fa-regular fa-calendar-plus') +
      ' Calendar file' +

      '</button>' +

      '<button type="button" class="tt-btn" ' +
      'data-tt-action="tt-print"' +
      (has ? '' : ' disabled') +
      '>' +

      ic('fa-solid fa-print') +
      ' Print' +

      '</button>' +

      '</div>' +

      '</div>'
    );
  }


  function ttLegend() {
    const subs = tt.data.subjects;

    if (!subs.length) return '';

    return (
      '<div class="tt-legend tt-noprint" aria-label="Subjects">' +

      subs.map((s) => {
        const k = String(s.id);

        return (
          '<button type="button" ' +
          'class="tt-chip tt-c-' + tt.subj[k].color + '" ' +
          'data-tt-action="tt-subj" ' +
          'data-id="' + e_(s.id) + '" ' +
          'aria-pressed="' + !tt.hidden[k] + '">' +

          '<i class="tt-dot"></i>' +
          e_(s.name) +

          '</button>'
        );
      }).join('') +

      '</div>'
    );
  }


  function weekCard(e) {
    const s = subjOf(e);
    const inf = info(e);
    const t = inf.t;

    const range = fmtR(t.start, t.end);

    return (
      '<button type="button" ' +
      'class="tt-card tt-c-' + s.color +
      (inf.past ? ' past' : '') + '" ' +
      'data-tt-action="tt-open" ' +
      'data-id="' + e_(e.id) + '" ' +
      'aria-label="' +
      e_(s.name + ', ' + TT_DF[e.day] + ', ' + range) +
      '">' +

      '<div class="tm">' +

      '<span>' +
      range +

      (
        t.custom
          ? ' <span title="Custom time">' +
          ic('fa-solid fa-pen') +
          '</span>'
          : ''
      ) +

      '</span>' +

      '<span>' +
      (
        e.pinned
          ? '<span title="Pinned">' +
          ic('fa-solid fa-thumbtack') +
          '</span>'
          : ''
      ) +
      '</span>' +

      '</div>' +

      '<p class="nm">' +
      e_(s.name) +
      '</p>' +

      (
        classLine(e)
          ? '<p class="sm">' +
          e_(classLine(e)) +
          '</p>'
          : ''
      ) +

      (
        e.nextTopic
          ? '<p class="tp">' +
          ic('fa-solid fa-book-open') +
          ' ' +
          e_(e.nextTopic) +
          '</p>'
          : ''
      ) +

      '<div class="tt-badges">' +
      badges(e, inf) +
      '</div>' +

      '</button>'
    );
  }


  function ttWeek() {
    const sl = slots();
    const br = tt.data.timing.breaks || [];

    const hol = holMap();
    const td = todayIdx();

    const list = visible();

    let h =
      '<div class="tt-scroll">' +
      '<div class="tt-grid">' +
      '<div class="tt-head"></div>';

    // Week headings
    for (let d = 0; d < 5; d++) {
      h +=
        '<div class="tt-head' +
        (d === td ? ' today' : '') +
        '">' +

        '<b>' +
        TT_D[d] +
        (d === td ? ' · Today' : '') +
        '</b>' +

        '<span>' +
        fmtDM(dayDate(d)) +
        '</span>' +

        (
          hol[d]
            ? '<div style="margin-top:.2rem">' +
            badge(
              'tt-b-up',
              'fa-solid fa-umbrella-beach',
              hol[d].label || 'Holiday'
            ) +
            '</div>'
            : ''
        ) +

        '</div>';
    }

    // Lecture slots
    sl.forEach((s, i) => {
      h +=
        '<div class="tt-slot">' +

        '<b>' +
        e_(s.label || 'Lecture ' + (i + 1)) +
        '</b>' +

        '<span>' +
        fmtT(s.start).replace(/ [AP]M$/, '') +
        '<br>' +
        fmtT(s.end) +
        '</span>' +

        '</div>';

      // Days inside each slot
      for (let d = 0; d < 5; d++) {

        if (hol[d]) {
          h +=
            '<div class="tt-off">' +
            ic('fa-solid fa-umbrella-beach') +
            ' ' +
            e_(hol[d].label || 'Holiday') +
            '</div>';

          continue;
        }

        const here = sortE(
          list.filter((e) =>
            e.day === d &&
            e.slot === i
          )
        );

        h +=
          '<div class="tt-cell' +
          (d === td ? ' today' : '') +
          '">' +

          (
            here.length
              ? here.map(weekCard).join('')
              : '<div class="tt-free">Free</div>'
          ) +

          '</div>';
      }

      // Breaks
      br
        .filter((b) => b.after === i)
        .forEach((b) => {
          h +=
            '<div class="tt-break">' +
            ic('fa-solid fa-mug-hot') +
            ' Break · ' +
            fmtR(b.start, b.end) +
            '</div>';
        });
    });

    return h + '</div></div>';
  }


  /* ---------- buttons and links ---------- */

  const actBtn = (a, e, text) =>
    '<button type="button" class="tt-btn" ' +
    'data-tt-action="' + a + '" ' +
    'data-id="' + e_(e.id) + '">' +
    text +
    '</button>';

  const linkBtn = (kind, e, icon, text) =>
    '<a class="tt-btn" href="' +
    e_(linkHref(kind, e)) +
    '">' +
    ic(icon) +
    ' ' +
    text +
    '</a>';


  /* ---------- day view ---------- */

  function ttDay() {
    const td = todayIdx();

    const hol = holMap();
    const all = visible();

    let h =
      '<div class="tt-days tt-noprint" ' +
      'role="tablist" aria-label="Day">';

    // Day tabs
    for (let d = 0; d < 5; d++) {
      const n = all.filter(
        (e) => e.day === d
      ).length;

      h +=
        '<button type="button" role="tab" ' +
        'class="tt-dtab" ' +
        'data-tt-action="tt-day" ' +
        'data-d="' + d + '" ' +
        'aria-selected="' + (d === tt.day) + '">' +

        '<b>' + TT_D[d] + '</b>' +

        '<span>' +
        fmtDM(dayDate(d)) +
        '</span>' +

        '<span>' +
        (n ? '●' : '&nbsp;') +
        '</span>' +

        '</button>';
    }

    h += '</div>';

    const list = sortE(
      all.filter((e) => e.day === tt.day)
    );

    if (hol[tt.day]) {
      h +=
        '<div class="tt-msg">' +
        ic('fa-solid fa-umbrella-beach') +
        ' ' +
        e_(hol[tt.day].label || 'Holiday') +
        '</div>';
    } else if (!list.length) {
      h +=
        '<div class="tt-msg">' +
        'No lectures on this day.' +
        '</div>';
    }

    // Display lectures
    list.forEach((e) => {
      const s = subjOf(e);
      const inf = info(e);
      const t = inf.t;

      h +=
        '<article class="tt-day tt-c-' + s.color +
        (inf.past ? ' past' : '') + '">' +

        '<div class="top">' +

        '<div class="when">' +

        '<b>' +
        fmtR(t.start, t.end) +
        (t.custom
          ? ' ' + ic('fa-solid fa-pen')
          : '') +
        '</b>' +

        '<small>' +
        e_(slotLabel(e.slot)) +
        '</small>' +

        '</div>' +

        '<div class="what">' +

        '<strong>' +
        e_(s.name) +
        '</strong>' +

        (
          e.pinned
            ? ' ' + ic('fa-solid fa-thumbtack')
            : ''
        ) +

        '<p>' +
        e_(
          [
            s.code,
            classLine(e)
          ]
            .filter(Boolean)
            .join(' · ')
        ) +
        '</p>' +

        (
          e.nextTopic
            ? '<p>' +
            ic('fa-solid fa-book-open') +
            ' Next topic: <b>' +
            e_(e.nextTopic) +
            '</b></p>'
            : ''
        ) +

        '<div class="tt-badges">' +
        badges(e, inf) +
        '</div>' +

        '</div>' +

        '</div>' +

        '<div class="acts tt-noprint">' +

        actBtn(
          'tt-open',
          e,
          'Details'
        ) +

        linkBtn(
          'diary',
          e,
          'fa-solid fa-pen-to-square',
          'Diary'
        ) +

        linkBtn(
          'attendance',
          e,
          'fa-solid fa-clipboard-check',
          'Attendance'
        ) +

        '<button type="button" ' +
        'class="tt-btn tt-btn-warn" ' +
        'style="margin-left:auto" ' +
        'data-tt-action="tt-request" ' +
        'data-id="' + e_(e.id) + '">' +

        'Request change' +

        '</button>' +

        '</div>' +

        '</article>';
    });

    return h;
  }


  /* ---------- list view ---------- */

  function ttList() {
    let h =
      '<div class="tt-box">' +
      '<table class="tt-table">' +

      '<thead>' +
      '<tr>' +

      [
        'Day',
        'Time',
        'Subject',
        'Class',
        'Room',
        'Next topic',
        'Status'
      ]
        .map((x) => '<th>' + x + '</th>')
        .join('') +

      '</tr>' +
      '</thead>' +

      '<tbody>';

    sortE(visible()).forEach((e) => {
      const s = subjOf(e);
      const inf = info(e);
      const t = inf.t;

      h +=
        '<tr data-tt-action="tt-open" ' +
        'data-id="' + e_(e.id) + '" ' +
        'tabindex="0">' +

        '<td>' +
        '<b>' + TT_D[e.day] + '</b> ' +
        '<span style="opacity:.6">' +
        fmtDM(dayDate(e.day)) +
        '</span>' +
        '</td>' +

        '<td style="white-space:nowrap;font-weight:600">' +
        fmtR(t.start, t.end) +
        '</td>' +

        '<td>' +
        '<span class="tt-c-' + s.color + '" ' +
        'style="display:inline-flex;align-items:center;gap:.5rem;font-weight:600">' +

        '<i class="tt-dot"></i>' +

        e_(s.name) +

        (
          e.pinned
            ? ' ' + ic('fa-solid fa-thumbtack')
            : ''
        ) +

        '</span>' +
        '</td>' +

        '<td style="white-space:nowrap">' +
        e_(
          [
            e.dept,

            e.semester != null && e.semester !== ''
              ? 'Sem ' + e.semester
              : ''
          ]
            .filter(Boolean)
            .join(' · ')
        ) +
        '</td>' +

        '<td>' +
        e_(e.room ? 'Room ' + e.room : '') +
        '</td>' +

        '<td style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' +
        e_(e.nextTopic) +
        '</td>' +

        '<td>' +
        statusBadge(e, inf) +
        '</td>' +

        '</tr>';
    });

    return h + '</tbody></table></div>';
  }


  /* ---------- states ---------- */

  function ttState(kind) {
    const box = (icon, title, text, btns) =>
      '<div class="tt-state">' +

      '<div class="big">' +
      ic(icon) +
      '</div>' +

      '<h3>' +
      title +
      '</h3>' +

      '<p>' +
      text +
      '</p>' +

      '<div class="row">' +
      btns +
      '</div>' +

      '</div>';

    if (kind === 'loading') {
      return (
        '<div class="tt-load" aria-hidden="true">' +
        '<i></i>'.repeat(10) +
        '</div>' +

        '<span class="t-sub">' +
        'Loading your timetable…' +
        '</span>'
      );
    }

    if (kind === 'error') {
      return box(
        'fa-solid fa-triangle-exclamation',
        'Could not load your timetable',
        e_(tt.errMsg || 'Something went wrong. Please try again.'),

        '<button type="button" ' +
        'class="tt-btn tt-btn-main" ' +
        'data-tt-action="tt-retry">' +
        'Try again' +
        '</button>'
      );
    }

    if (kind === 'nosubjects') {
      return box(
        'fa-solid fa-book-open',
        'Choose your subjects first',
        'Your timetable is created after you select the subjects you will teach.',

        '<a class="tt-btn tt-btn-main" ' +
        'href="' + e_(linkHref('subjects')) + '">' +
        'Choose subjects' +
        '</a>'
      );
    }

    return box(
      'fa-regular fa-calendar-days',
      'No lectures this week',
      'There is nothing scheduled for this week. Try another week.',

      '<button type="button" class="tt-btn tt-btn-main" ' +
      'data-tt-action="tt-week" data-w="1">' +
      'Next week' +
      '</button>' +

      '<button type="button" class="tt-btn" ' +
      'data-tt-action="tt-week" data-w="0">' +
      'This week' +
      '</button>'
    );
  }


  /* ---------- dialogs ---------- */

  function ttDetail(e) {
    const s = subjOf(e);
    const inf = info(e);
    const t = inf.t;

    const rows = [
      [
        'Date',
        TT_DF[e.day] + ', ' + fmtDM(dayDate(e.day))
      ],

      [
        'Time',
        fmtR(t.start, t.end)
      ],

      [
        'Lecture',
        slotLabel(e.slot)
      ],

      [
        'Class',
        [
          e.dept,

          e.semester != null && e.semester !== ''
            ? 'Semester ' + e.semester
            : ''
        ]
          .filter(Boolean)
          .join(' · ')
      ],

      [
        'Credit hours',
        e.creditHours
      ],

      [
        'Room',
        e.room ? 'Room ' + e.room : ''
      ],

      [
        'Next topic',
        e.nextTopic
      ]

    ].filter((r) =>
      r[1] !== '' && r[1] != null
    );

    let h =
      '<div class="tt-overlay">' +

      '<div class="tt-dlg tt-c-' + s.color + '" ' +
      'role="dialog" aria-modal="true" ' +
      'aria-labelledby="ttDT">' +

      '<div style="display:flex;justify-content:space-between;gap:.75rem">' +

      '<p class="tt-eyebrow">' +
      'Lecture details' +
      '</p>' +

      '<button type="button" class="tt-x" ' +
      'data-tt-action="tt-close" ' +
      'data-autofocus ' +
      'aria-label="Close">' +

      ic('fa-solid fa-xmark') +

      '</button>' +

      '</div>' +

      '<div style="display:flex;gap:.75rem;margin-top:.5rem;align-items:flex-start">' +

      '<i class="tt-dot" ' +
      'style="width:.75rem;height:.75rem;margin-top:.45rem"></i>' +

      '<div>' +

      '<h2 id="ttDT">' +
      e_(s.name) +
      '</h2>' +

      (
        s.code
          ? '<p style="font-size:.75rem;opacity:.65">' +
          e_(s.code) +
          '</p>'
          : ''
      ) +

      '</div>' +

      '</div>' +

      '<div class="tt-badges">' +
      badges(e, inf) +
      '</div>' +

      '<dl class="tt-dl" style="margin:.75rem 0 0">' +

      rows
        .map((r) =>
          '<div>' +
          '<dt>' + r[0] + '</dt>' +
          '<dd>' + e_(r[1]) + '</dd>' +
          '</div>'
        )
        .join('') +

      '</dl>';

    // Syllabus progress
    if (e.progress && e.progress.total > 0) {
      const pct = Math.min(
        100,
        Math.round(
          e.progress.done / e.progress.total * 100
        )
      );

      h +=
        '<div style="margin-top:.75rem">' +

        '<div style="display:flex;justify-content:space-between;font-size:.75rem;font-weight:600">' +

        '<span>Syllabus progress</span>' +

        '<span>' +
        e.progress.done +
        ' / ' +
        e.progress.total +
        ' topics · ' +
        pct +
        '%' +
        '</span>' +

        '</div>' +

        '<div class="tt-bar2">' +
        '<i style="width:' + pct + '%"></i>' +
        '</div>' +

        '</div>';
    }

    return (
      h +

      '<div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem">' +

      '<a class="tt-btn tt-btn-main" ' +
      'href="' + e_(linkHref('diary', e)) + '">' +

      ic('fa-solid fa-pen-to-square') +
      ' Write diary' +

      '</a>' +

      '<a class="tt-btn" ' +
      'href="' + e_(linkHref('attendance', e)) + '">' +

      ic('fa-solid fa-clipboard-check') +
      ' Attendance' +

      '</a>' +

      '<button type="button" class="tt-btn tt-btn-warn" ' +
      'data-tt-action="tt-request" ' +
      'data-id="' + e_(e.id) + '">' +

      'Request change' +

      '</button>' +

      '</div>' +

      '</div></div>'
    );
  }


  function ttRequest(e) {
    const s = subjOf(e);
    const t = times(e);
    const hol = holMap();

    let days = '';

    for (let d = 0; d < 5; d++) {
      if (!hol[d]) {
        days +=
          '<option value="' + iso(dayDate(d)) + '"' +
          (d === e.day ? ' selected' : '') +
          '>' +

          TT_DF[d] +
          ' · ' +
          fmtDM(dayDate(d)) +

          '</option>';
      }
    }

    const sl = slots()
      .map((x, i) =>
        '<option value="' + i + '"' +
        (
          i === Math.min(
            e.slot + 1,
            slots().length - 1
          )
            ? ' selected'
            : ''
        ) +
        '>' +

        e_(x.label || 'Lecture ' + (i + 1)) +
        ' · ' +
        fmtR(x.start, x.end) +

        (i === e.slot ? ' (current)' : '') +

        '</option>'
      )
      .join('');

    return (
      '<div class="tt-overlay">' +

      '<form id="ttForm" class="tt-dlg" ' +
      'novalidate role="dialog" ' +
      'aria-modal="true" aria-labelledby="ttRT" ' +
      'data-id="' + e_(e.id) + '">' +

      '<div style="display:flex;justify-content:space-between;gap:.75rem">' +

      '<div>' +

      '<h2 id="ttRT">' +
      'Request a timetable change' +
      '</h2>' +

      '<p style="font-size:.875rem;opacity:.7;margin-top:.125rem">' +
      e_(
        s.name +
        ' · ' +
        TT_DF[e.day] +
        ' ' +
        fmtDM(dayDate(e.day)) +
        ' · ' +
        fmtR(t.start, t.end)
      ) +
      '</p>' +

      '</div>' +

      '<button type="button" class="tt-x" ' +
      'data-tt-action="tt-close" ' +
      'aria-label="Close">' +

      ic('fa-solid fa-xmark') +

      '</button>' +

      '</div>' +

      '<label class="tt-lbl" for="ttKind" style="margin-top:1rem">' +
      'What do you need?' +
      '</label>' +

      '<select id="ttKind" class="tt-in">' +

      '<option value="move">' +
      'Move this lecture to another slot' +
      '</option>' +

      '<option value="cancel">' +
      'Cancel this lecture' +
      '</option>' +

      '<option value="room">' +
      'Change the room' +
      '</option>' +

      '<option value="other">' +
      'Something else' +
      '</option>' +

      '</select>' +

      '<div id="ttMove" class="tt-grid2">' +

      '<div>' +

      '<label class="tt-lbl" for="ttDay">' +
      'Preferred day' +
      '</label>' +

      '<select id="ttDay" class="tt-in">' +
      days +
      '</select>' +

      '</div>' +

      '<div>' +

      '<label class="tt-lbl" for="ttSlot">' +
      'Preferred lecture' +
      '</label>' +

      '<select id="ttSlot" class="tt-in">' +
      sl +
      '</select>' +

      '</div>' +

      '<p id="ttMoveErr" class="tt-err" ' +
      'style="grid-column:1/-1" hidden></p>' +

      '</div>' +

      '<label class="tt-lbl" for="ttReason">' +

      'Reason ' +

      '<span style="opacity:.6;font-weight:400">' +
      '(the admin will read this)' +
      '</span>' +

      '</label>' +

      '<textarea id="ttReason" class="tt-in" ' +
      'rows="3" maxlength="500" ' +
      'placeholder="For example: I have a department meeting at that time.">' +
      '</textarea>' +

      '<div style="display:flex;justify-content:space-between;font-size:.75rem;margin-top:.25rem">' +

      '<span id="ttReasonErr" class="tt-err" hidden></span>' +

      '<span style="margin-left:auto;opacity:.6">' +
      '<span id="ttCount">0</span> / 500' +
      '</span>' +

      '</div>' +

      '<p id="ttErr" class="tt-errbox" role="alert" hidden></p>' +

      '<div class="tt-foot">' +

      '<button type="button" class="tt-btn" ' +
      'data-tt-action="tt-close">' +
      'Cancel' +
      '</button>' +

      '<button id="ttSend" type="submit" ' +
      'class="tt-btn tt-btn-main">' +
      'Send request' +
      '</button>' +

      '</div>' +

      '</form>' +

      '</div>'
    );
  }


  /* ---------- the page ---------- */

  function timetableView() {
    ttIndex();

    const hasData =
      slots().length > 0 &&
      (tt.data.entries || []).length > 0;

    let h =
      '<div class="tt">' +
      '<h2 class="t-heading">Timetable</h2>';

    h +=
      ttBanner() +
      ttSummary() +
      ttToolbar() +
      ttLegend();

    if (
      tt.state === 'loading' ||
      tt.state === 'error'
    ) {
      h += ttState(tt.state);
    }

    else if (tt.data.noSubjects) {
      h += ttState('nosubjects');
    }

    else if (!hasData) {
      h += ttState('empty');
    }

    else {
      if (tt.day == null) {
        tt.day = Math.max(todayIdx(), 0);
      }

      h +=
        tt.view === 'day'
          ? ttDay()
          : tt.view === 'list'
            ? ttList()
            : ttWeek();
    }

    // Show modal if one is open
    if (tt.modal) {
      const e = tt.byId[String(tt.modal.id)];

      if (e) {
        h +=
          tt.modal.type === 'request'
            ? ttRequest(e)
            : ttDetail(e);
      } else {
        tt.modal = null;
      }
    }

    return h + '</div>';
  }


  /* ---------- create indexes ---------- */

  function ttIndex() {
    tt.byId = {};
    tt.subj = {};

    // Create subject index
    tt.data.subjects.forEach((s, i) => {
      tt.subj[String(s.id)] = {
        id: s.id,
        name: s.name,
        code: s.code,

        color:
          TT_COL.indexOf(s.color) > -1
            ? s.color
            : TT_COL[i % TT_COL.length]
      };
    });

    // Create lecture index
    tt.data.entries.forEach((e) => {
      tt.byId[String(e.id)] = e;
    });
  }


  /* ---------- actions ---------- */

  function goWeek(ws) {
    tt.weekStart = ws;

    tt.data = emptyData();

    tt.day = null;
    tt.modal = null;

    if (ttCfg.onWeekChange) {
      tt.state = 'loading';

      render();

      ttCfg.onWeekChange(iso(ws));
    } else {
      tt.state = null;

      render();
    }
  }


  const closeModal = () => {
    if (tt.modal) {
      tt.focusBack = tt.modal.id;
    }

    tt.modal = null;

    render();
  };


  function ttAction(el) {
    const a = el.dataset.ttAction;
    const id = el.dataset.id;

    if (a === 'tt-prev') {
      goWeek(
        addDays(tt.weekStart, -7)
      );
    }

    else if (a === 'tt-next') {
      goWeek(
        addDays(tt.weekStart, 7)
      );
    }

    else if (a === 'tt-today') {
      goWeek(
        mondayOf(new Date())
      );
    }

    else if (a === 'tt-week') {
      goWeek(
        el.dataset.w === '1'
          ? addDays(tt.weekStart, 7)
          : mondayOf(new Date())
      );
    }

    else if (a === 'tt-view') {
      tt.view = el.dataset.v;

      render();
    }

    else if (a === 'tt-day') {
      tt.day = +el.dataset.d;

      render();
    }

    else if (a === 'tt-subj') {
      tt.hidden[id] = !tt.hidden[id];

      render();
    }

    else if (a === 'tt-open') {
      tt.modal = {
        type: 'detail',
        id
      };

      render();
    }

    else if (a === 'tt-request') {
      tt.modal = {
        type: 'request',
        id
      };

      render();
    }

    else if (a === 'tt-close') {
      closeModal();
    }

    else if (a === 'tt-ics') {
      exportIcs();
    }

    else if (a === 'tt-print') {
      window.print();
    }

    else if (a === 'tt-retry') {
      ttCfg.onRetry
        ? ttCfg.onRetry()
        : goWeek(tt.weekStart);
    }
  }


  /* ---------- submit change request ---------- */

  function submitRequest(form) {
    const send = document.getElementById('ttSend');

    const e = tt.byId[String(form.dataset.id)];

    if (!e || send.disabled) return;

    const $ = (x) =>
      document.getElementById(x);

    const show = (x, m) => {
      $(x).textContent = m;
      $(x).hidden = false;
    };

    // Hide previous errors
    [
      'ttMoveErr',
      'ttReasonErr',
      'ttErr'
    ].forEach((x) => {
      $(x).hidden = true;
    });

    const kind = $('ttKind').value;
    const reason = $('ttReason').value.trim();

    const payload = {
      entryId: e.id,
      kind,
      reason
    };

    let ok = true;

    if (kind === 'move') {
      payload.day = $('ttDay').value;
      payload.slot = +$('ttSlot').value;

      if (
        payload.day === iso(dayDate(e.day)) &&
        payload.slot === e.slot
      ) {
        show(
          'ttMoveErr',
          'Choose a different day or lecture.'
        );

        ok = false;
      }
    }

    if (!reason) {
      show(
        'ttReasonErr',
        'Please write a reason.'
      );

      ok = false;
    }

    if (!ok) return;

    if (!ttCfg.onRequestSubmit) {
      show(
        'ttErr',
        'The backend is not connected yet.'
      );

      return;
    }

    send.disabled = true;
    send.textContent = 'Sending…';

    Promise.resolve()

      .then(() =>
        ttCfg.onRequestSubmit(payload)
      )

      .then(() => {
        e.changeRequested = true;

        closeModal();
      })

      .catch((err) => {
        send.disabled = false;
        send.textContent = 'Send request';

        show(
          'ttErr',
          (err && err.message) ||
          'Could not send the request.'
        );
      });
  }


  /* ---------- export calendar file ---------- */

  function exportIcs() {
    if (ttCfg.onIcsExport) {
      ttCfg.onIcsExport(tt.data);

      return;
    }

    const list = visible();

    if (!list.length) return;

    const x = (s) =>
      String(s || '')
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n');

    const dt = (d, t) =>
      iso(d).replace(/-/g, '') +
      'T' +
      t.replace(':', '') +
      '00';

    const stamp = new Date()
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');

    const L = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//FAST//Timetable//EN',
      'CALSCALE:GREGORIAN'
    ];

    list.forEach((e) => {
      const t = times(e);
      const d = dayDate(e.day);

      L.push(
        'BEGIN:VEVENT',

        'UID:' +
        e.id +
        '-' +
        iso(d) +
        '@fast-timetable',

        'DTSTAMP:' + stamp,

        'DTSTART:' + dt(d, t.start),

        'DTEND:' + dt(d, t.end),

        'SUMMARY:' + x(subjOf(e).name),

        'LOCATION:' +
        x(e.room ? 'Room ' + e.room : ''),

        'END:VEVENT'
      );
    });

    L.push('END:VCALENDAR');

    const a = document.createElement('a');

    a.href = URL.createObjectURL(
      new Blob(
        [L.join('\r\n')],
        {
          type: 'text/calendar'
        }
      )
    );

    a.download =
      'timetable-' +
      iso(tt.weekStart) +
      '.ics';

    document.body.appendChild(a);

    a.click();

    a.remove();

    setTimeout(
      () => URL.revokeObjectURL(a.href),
      1000
    );
  }


  /* ---------- public API (used by backend code) ---------- */

  window.Timetable = {

    configure: (o) => {
      Object.keys(o || {}).forEach((k) => {

        if (k === 'links') {
          Object.assign(ttCfg.links, o.links);
        } else {
          ttCfg[k] = o[k];
        }

      });
    },


    setData: (data) => {
      data = data || {};

      if (data.weekStart) {
        tt.weekStart = mondayOf(
          parseIso(data.weekStart)
        );
      }

      tt.data = {
        weekStart: iso(tt.weekStart),

        timing: data.timing || {
          title: '',
          slots: [],
          breaks: []
        },

        subjects: data.subjects || [],
        entries: data.entries || [],
        holidays: data.holidays || [],

        noSubjects: !!data.noSubjects
      };

      tt.data.timing.slots =
        tt.data.timing.slots || [];

      tt.state = null;
      tt.day = null;

      if (currentId() === 'timetable') {
        render();
      }
    },


    setState: (name, o) => {
      tt.state =
        name === 'empty'
          ? null
          : name;

      tt.errMsg =
        (o && o.message) || '';

      if (name === 'empty') {
        tt.data = emptyData();
      }

      if (currentId() === 'timetable') {
        render();
      }
    },


    getWeekStart: () =>
      iso(tt.weekStart)

  };


  /* ---------- draw the page ---------- */

  let locked = false;

  // true while a dialog is open
  // and the page behind it must not scroll

  const unlock = () => {
    if (locked) {
      document.body.classList.remove('overflow-hidden');

      locked = false;
    }
  };


  function render() {

    // Do nothing if user is not on timetable page
    if (currentId() !== 'timetable') {
      ttStarted = false;

      unlock();

      return;
    }


    // First time the page opens:
    // ask backend for this week's timetable

    if (!ttStarted) {
      ttStarted = true;

      if (ttCfg.onWeekChange) {
        tt.state = 'loading';

        setTimeout(
          () => ttCfg.onWeekChange(iso(tt.weekStart)),
          0
        );
      }
    }


    // Insert timetable HTML
    view.innerHTML =
      '<div class="t-view">' +
      timetableView() +
      '</div>';


    // Lock page scrolling when modal is open
    if (view.querySelector('.tt-overlay')) {
      document.body.classList.add('overflow-hidden');

      locked = true;
    } else {
      unlock();
    }


    // Focus inside modal
    if (tt.modal) {
      const f =
        view.querySelector('[data-autofocus]') ||
        view.querySelector(
          '.tt-dlg select, .tt-dlg button, .tt-dlg a'
        );

      if (f) {
        f.focus();
      }
    }

    // Return focus to previous lecture button
    else if (tt.focusBack != null) {
      const b = view.querySelector(
        '[data-tt-action="tt-open"][data-id="' +
        String(tt.focusBack).replace(/"/g, '') +
        '"]'
      );

      if (b) {
        b.focus();
      }

      tt.focusBack = null;
    }
  }


  /* ---------- events ---------- */


  // Click events
  view.addEventListener('click', (e) => {

    if (currentId() !== 'timetable') return;


    // Click on dark overlay area closes modal
    if (
      e.target.classList &&
      e.target.classList.contains('tt-overlay')
    ) {
      closeModal();

      return;
    }


    const el = e.target.closest(
      '[data-tt-action]'
    );

    if (el) {
      ttAction(el);
    }

  });


  // Form submission
  view.addEventListener('submit', (e) => {

    if (e.target.id === 'ttForm') {
      e.preventDefault();

      submitRequest(e.target);
    }

  });


  // Change events
  view.addEventListener('change', (e) => {

    if (e.target.id === 'ttKind') {
      document.getElementById('ttMove').hidden =
        e.target.value !== 'move';
    }

  });


  // Input events
  view.addEventListener('input', (e) => {

    if (e.target.id === 'ttReason') {
      document.getElementById('ttCount').textContent =
        e.target.value.length;
    }

  });


  // Keyboard events
  view.addEventListener('keydown', (e) => {

    // Open lecture details using Enter or Space
    if (
      (e.key === 'Enter' || e.key === ' ') &&
      e.target.matches &&
      e.target.matches('tr[data-tt-action^="tt-"]')
    ) {
      e.preventDefault();

      ttAction(e.target);

      return;
    }


    // Keep Tab inside the dialog
    if (e.key === 'Tab' && tt.modal) {

      const f = Array.prototype.slice.call(
        view.querySelectorAll(
          '.tt-dlg button:not([disabled]), ' +
          '.tt-dlg a[href], ' +
          '.tt-dlg select, ' +
          '.tt-dlg textarea'
        )
      );

      if (!f.length) return;

      const first = f[0];
      const last = f[f.length - 1];


      // Shift + Tab from first element
      if (
        e.shiftKey &&
        document.activeElement === first
      ) {
        e.preventDefault();

        last.focus();
      }

      // Tab from last element
      else if (
        !e.shiftKey &&
        document.activeElement === last
      ) {
        e.preventDefault();

        first.focus();
      }

    }

  });


  // Escape key closes modal
  document.addEventListener('keydown', (e) => {

    if (
      e.key === 'Escape' &&
      tt.modal &&
      currentId() === 'timetable'
    ) {
      closeModal();
    }

  });


  /* ---------- keep timetable updated ---------- */

  // Keep the "Now" badge and next-lecture card fresh

  setInterval(() => {

    const a = document.activeElement;

    if (
      currentId() === 'timetable' &&
      !tt.modal &&
      tt.data.entries.length &&
      !(
        a &&
        /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName)
      )
    ) {
      render();
    }

  }, 60000);


  /* ---------- work together with teacher-pages.js ---------- */

  /*
     The router redraws #view on every hash change.

     When the current page is #timetable:
         Draw timetable again.

     When the teacher leaves:
         Close dialogs and unlock scrolling.
  */

  new MutationObserver(() => {

    if (currentId() === 'timetable') {

      if (!view.querySelector('.tt')) {
        render();
      }

    } else {

      tt.modal = null;
      ttStarted = false;

      unlock();
    }

  }).observe(view, {
    childList: true
  });


  // Handle page navigation
  addEventListener('hashchange', () => {

    tt.modal = null;

    setTimeout(() => {

      if (currentId() === 'timetable') {

        if (!view.querySelector('.tt')) {
          render();
        }

      } else {

        ttStarted = false;

        unlock();
      }

    }, 0);

  });


  /* ---------- initial render ---------- */

  render();

})();