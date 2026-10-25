 
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

