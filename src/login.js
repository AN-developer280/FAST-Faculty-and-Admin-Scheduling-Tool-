
// Display the current year
document.getElementById('yr').textContent = new Date().getFullYear();

// Theme button
document.getElementById('themeBtn').addEventListener('click', () => {
    // Toggle dark mode
    const dark = document.documentElement.classList.toggle('dark');

    // Save the theme preference
    try {
        localStorage.setItem('fast-theme', dark ? 'dark' : 'light');
    } catch (e) {
        console.log('Unable to save the theme preference');
    }
});

// Password show / hide
const pw = document.getElementById('password');

document.getElementById('togglePw').addEventListener('click', () => {
    const show = pw.type === 'password';

    pw.type = show ? 'text' : 'password';

    document.getElementById('eyeOn').classList.toggle('hidden', show);
    document.getElementById('eyeOff').classList.toggle('hidden', !show);
});

// Login form validation
const form = document.getElementById('loginForm');
const msg = document.getElementById('formMsg');

form.addEventListener('submit', (e) => {
    // Prevent page reload
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = pw.value;

    // Email format pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check empty fields
    if (!email || !password) {
        msg.textContent = 'Please enter your email and password.';
        msg.classList.remove('hidden');

        form.classList.remove('shake');
        void form.offsetWidth;
        form.classList.add('shake');

        return;
    }

    // Check email format
    if (!emailRegex.test(email)) {
        msg.textContent = 'Please enter a valid email address.';
        msg.classList.remove('hidden');

        form.classList.remove('shake');
        void form.offsetWidth;
        form.classList.add('shake');

        return;
    }

    // Hide error message if validation passes
    msg.classList.add('hidden');

    // TODO: Connect with backend authentication
    console.log('Login attempt:', email);
});

// Fit-to-screen
(function () {
    const el = document.getElementById('fit');
    const box = el.parentElement;

    function fit() {
        el.style.transform = '';

        const cs = getComputedStyle(box);

        const availH = box.clientHeight -
            parseFloat(cs.paddingTop) -
            parseFloat(cs.paddingBottom);

        const availW = box.clientWidth -
            parseFloat(cs.paddingLeft) -
            parseFloat(cs.paddingRight);

        const s = Math.min(
            1,
            availH / el.offsetHeight,
            availW / el.offsetWidth
        );

        box.style.overflowY = '';
        box.style.alignItems = '';

        el.style.transformOrigin = 'center';

        if (s >= 0.7) {
            el.style.transform = s < 1 ? 'scale(' + s + ')' : '';
        } else {
            // Keep text readable and allow scrolling
            el.style.transform = '';
            box.style.overflowY = 'auto';
            box.style.alignItems = 'flex-start';
        }
    }

    addEventListener('resize', fit);
    addEventListener('load', fit);

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(fit);
    }

    fit();
})();
