// script.js

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // --- Theme Toggle Handler ---
    
    // Check local storage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.remove('light-theme', 'dark-theme');
        body.classList.add(savedTheme);
        themeToggleBtn.textContent = savedTheme === 'dark-theme' ? '☀️' : '🌙';
    }

    // Event listener for theme button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let newTheme;
            if (body.classList.contains('light-theme')) {
                body.classList.replace('light-theme', 'dark-theme');
                themeToggleBtn.textContent = '☀️';
                newTheme = 'dark-theme';
            } else {
                body.classList.replace('dark-theme', 'light-theme');
                themeToggleBtn.textContent = '🌙';
                newTheme = 'light-theme';
            }
            // Save preference
            localStorage.setItem('theme', newTheme);
        });
    }

    // --- Scroll Animation (IntersectionObserver) ---
    
    const observerOptions = { threshold: 0.1 };
    
    // Callback function to add 'visible' class when element enters viewport
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible
                // obs.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Elements to animate on scroll
    const elementsToAnimate = [
        ...document.querySelectorAll('.timeline-event'),
        ...document.querySelectorAll('.card'),
        ...document.querySelectorAll('.testimonial-cards blockquote'),
        ...document.querySelectorAll('.gallery-images img')
    ];

    elementsToAnimate.forEach(el => observer.observe(el));

    // --- SVG Timeline Line Drawing Effect ---
    
    const timelineLine = document.querySelector('.timeline-line');
    
    // Check if the SVG element exists and has the required method
    if (timelineLine && typeof timelineLine.getTotalLength === 'function') {
        const length = timelineLine.getTotalLength();
        // Initialize line to be fully hidden
        timelineLine.style.strokeDasharray = length;
        timelineLine.style.strokeDashoffset = length;

        window.addEventListener('scroll', () => {
            const timelineSection = document.querySelector('.timeline-section');
            if (!timelineSection) return;

            const rect = timelineSection.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;

            // Check if the timeline section is in or near the viewport
            if (rect.top <= windowHeight && rect.bottom >= 0) {
                // Calculate scroll progress: 0 when element bottom hits viewport bottom, 1 when element top hits viewport top
                const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
                
                // Clamp the progress between 0 and 1
                const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);
                
                // Calculate the length to draw
                const drawLength = length * clampedProgress;
                
                // Set the dash offset to make the line appear
                timelineLine.style.strokeDashoffset = length - drawLength;
            }
        });
    }
});