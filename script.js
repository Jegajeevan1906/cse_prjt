// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
document.querySelector('.mobile-menu').addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = 'var(--nav-height)';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'rgba(3, 7, 18, 0.95)';
        navLinks.style.padding = '2rem';
    }
});

// 1. Anti-Gravity Floating Animation for Hero Shapes
const floatingShapes = document.querySelectorAll('.floating-shape');

floatingShapes.forEach((shape, index) => {
    let randomDuration = 4 + Math.random() * 4; 
    let randomY = 40 + Math.random() * 60;
    let randomX = 40 + Math.random() * 60;
    let rotation = Math.random() * 360;

    gsap.to(shape, {
        y: randomY,
        x: randomX,
        rotation: rotation,
        duration: randomDuration,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: index * 0.5
    });
});

// Subtle float for hero content to match anti-gravity physics feel
gsap.to('.hero-content', {
    y: -15,
    duration: 3,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
});

// 2. Initial Page Load Animation
let tl = gsap.timeline();
tl.from('.navbar', { y: -100, opacity: 0, duration: 1, ease: "power3.out" })
  .from('.hero-title', { y: 50, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.5")
  .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.6")
  .from('.hero-features', { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.5")
  .from('.hero-buttons', { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.4");

// 3. ScrollTrigger Animations for Sections
// About Section
gsap.from('.about-text', {
    scrollTrigger: {
        trigger: '.about',
        start: 'top 80%',
    },
    x: -50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});

gsap.from('.stat-box', {
    scrollTrigger: {
        trigger: '.about',
        start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "back.out(1.7)"
});

// Courses Section
gsap.from('.courses-grid .course-card', {
    scrollTrigger: {
        trigger: '.courses',
        start: 'top 85%',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2
});

// Contact Section
gsap.from('.contact-info', {
    scrollTrigger: {
        trigger: '.contact',
        start: 'top 75%',
    },
    x: -50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});

gsap.from('.contact-form', {
    scrollTrigger: {
        trigger: '.contact',
        start: 'top 75%',
    },
    x: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});

// Login UI Function
document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById("emailInput");
    if (emailInput) {
        emailInput.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                checkEmail();
            }
        });
    }
});

function checkEmail() {
  const email = document.getElementById("emailInput").value;

  if (!email) {
    alert("Please enter your email!");
    return;
  }

  if (email.endsWith("@gmail.com") || email.endsWith("@rrase.edu.in") || email.endsWith("@rrase.org")) {
    gsap.to('#loginScreen', {
      opacity: 0, 
      duration: 0.5, 
      onComplete: () => {
        document.getElementById("loginScreen").style.display = "none";
      }
    });

    sendToServer(email);
  } else {
    alert("Please enter a valid institution or standard Gmail to continue.");
  }
}

// Mailer Placeholder
function sendToServer(email) {
  // Mock logic - ensuring the UI doesn't break if emailjs fails locally in a dev env
  try {
    if (typeof emailjs !== 'undefined') {
      emailjs.send("Gmail", "service_l7qvo5l", { user_email: email })
        .then(function(response) {
          console.log("SUCCESS", response);
        }, function(error) {
          console.log("FAILED", error);
        });
    }
  } catch (e) {
    console.error(e);
  }
}
