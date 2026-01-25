// DOM Elements
const reveals = document.querySelectorAll('.reveal');
const form = document.getElementById('enrollmentForm');

// Scroll Animation Observer
const revealOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
});

// Observe all reveal elements
reveals.forEach(element => {
    revealOnScroll.observe(element);
});

// Form Submission Handler
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const experience = document.getElementById('experience').value;

    const btn = form.querySelector('button');
    const originalText = btn.textContent;

    btn.textContent = 'Processing...';
    btn.style.opacity = '0.7';

    // Send data to server
    fetch('http://localhost:3000/enroll', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, experience })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                btn.textContent = 'Enrollment Successful!';
                btn.style.backgroundColor = '#00f2ea'; // Success color (Primary)
                btn.style.color = '#000';

                // Reset form after a delay
                setTimeout(() => {
                    form.reset();
                    btn.textContent = originalText;
                    btn.style.backgroundColor = ''; // Revert to gradient
                    btn.style.color = '';
                    btn.style.opacity = '1';

                    alert('Welcome to the workshop! Check your email for details.');
                }, 2000);
            } else {
                throw new Error(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            btn.textContent = 'Error - Try Again';
            btn.style.backgroundColor = '#ff0055'; // Error color

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
            }, 3000);
            alert('Something went wrong. Please try again.');
        });
});

// Smooth Scroll for Anchors (Optional fallback for older browsers, mainly handled by CSS)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
