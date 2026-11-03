 
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
        console.log("Unable to save the theme preference");
    }

});

 (function () {
    const el = document.getElementById('fit'), box = el.parentElement;
    function fit() {
      el.style.transform = '';
      const cs = getComputedStyle(box);
      const availH = box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const availW = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const s = Math.min(1, availH / el.offsetHeight, availW / el.offsetWidth);
      box.style.overflowY = ''; box.style.alignItems = '';
      el.style.transformOrigin = 'center';
      if (s >= 0.7) {
        el.style.transform = s < 1 ? 'scale(' + s + ')' : '';
      } else {
        // Too small to shrink any further: keep the text readable and let only this area scroll
        el.style.transform = '';
        box.style.overflowY = 'auto'; box.style.alignItems = 'flex-start';
      }
    }
    addEventListener('resize', fit); addEventListener('load', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    fit();
  })();

