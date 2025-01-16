// Smooth scroll for navigation links
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
    });
});


// Theme toggle button
const themeToggle = document.getElementById('theme-toggle');

// Check user's saved theme in localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.classList.add(savedTheme);
    themeToggle.textContent = savedTheme === 'dark-mode' ? '☀️' : '🌙';
}

// Add event listener to toggle button
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Update the button text
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️'; // Light mode icon
        localStorage.setItem('theme', 'dark-mode');
    } else {
        themeToggle.textContent = '🌙'; // Dark mode icon
        localStorage.setItem('theme', '');
    }
});


// Highlight active navigation link
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 50) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
});


nav ul li a.active {
    font-weight: bold;
    color: #00bcd4;
}
