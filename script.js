/* ===========================
   PORTFOLIO SCRIPT.JS
   Author: Arman Hasan
   Features:
   - Theme System (Dark / Light / System)
   - Auto update on system theme change
   - Mobile menu toggle + outside click close
   - Active nav link on scroll
   - Scroll reveal (optimized)
   - Back to top button
   - Typewriter effect
   - Footer year update
   - UI-only form prevention
=========================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ===========================
     YEAR AUTO UPDATE
  =========================== */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===========================
     THEME SETTINGS (DARK/LIGHT/SYSTEM)
  =========================== */
  const settingsBtn = document.getElementById("settingsBtn");
  const themeDropdown = document.getElementById("themeDropdown");
  const themeOptions = document.querySelectorAll(".theme-option");

  const THEME_KEY = "arman-theme";

  function applyTheme(theme) {
    document.body.classList.remove("light-theme");

    if (theme === "light") {
      document.body.classList.add("light-theme");
    }

    if (theme === "system") {
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      if (prefersLight) document.body.classList.add("light-theme");
    }

    themeOptions.forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`.theme-option[data-theme="${theme}"]`);
    if (activeBtn) activeBtn.classList.add("active");
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || "system";
    applyTheme(savedTheme);
  }

  function saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
  }

  if (settingsBtn && themeDropdown) {
    settingsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      themeDropdown.classList.toggle("active");
    });

    document.addEventListener("click", () => {
      themeDropdown.classList.remove("active");
    });

    themeDropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  themeOptions.forEach(btn => {
    btn.addEventListener("click", () => {
      const theme = btn.getAttribute("data-theme");
      saveTheme(theme);
      applyTheme(theme);
      themeDropdown.classList.remove("active");
    });
  });

  // Live system theme update (only if system selected)
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
    const savedTheme = localStorage.getItem(THEME_KEY) || "system";
    if (savedTheme === "system") applyTheme("system");
  });

  loadTheme();

  /* ===========================
     MOBILE MENU TOGGLE
  =========================== */
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle("show");
    });

    document.querySelectorAll(".m-link").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("show");
      });
    });

    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        mobileMenu.classList.remove("show");
      }
    });
  }

  /* ===========================
     SCROLL REVEAL (INTERSECTION OBSERVER)
  =========================== */
  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ===========================
     ACTIVE NAV LINK ON SCROLL
  =========================== */
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("#navLinks a");

  function setActiveNav() {
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", setActiveNav);
  setActiveNav();

  /* ===========================
     BACK TO TOP BUTTON
  =========================== */
  const toTopBtn = document.getElementById("toTopBtn");

  if (toTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 500) {
        toTopBtn.classList.add("active");
      } else {
        toTopBtn.classList.remove("active");
      }
    });

    toTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ===========================
     FORM SUBMIT (UI ONLY)
  =========================== */
const contactForm = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

if (contactForm && formMsg) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    formMsg.classList.remove("show", "error");
    formMsg.textContent = "Sending message...";
    formMsg.classList.add("show");

    const formData = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        formMsg.textContent = "✅ Your message has been sent successfully!";
        formMsg.classList.remove("error");
        contactForm.reset();
      } else {
        formMsg.textContent = "❌ Something went wrong. Please try again.";
        formMsg.classList.add("error");
      }
    } catch (error) {
      formMsg.textContent = "❌ Network error. Please try again later.";
      formMsg.classList.add("error");
    }
  });
}

  /* ===========================
     TYPEWRITER EFFECT
  =========================== */
  const typewriterText = document.getElementById("typewriterText");

  if (typewriterText) {
    const words = [
      "Web Developer",
      "Frontend developer",
      "Freelancer",
      "Graphic Designer",
      "Student",
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
      const currentWord = words[wordIndex];

      if (!isDeleting) {
        typewriterText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentWord.length) {
          isDeleting = true;
          setTimeout(typeWriter, 1300);
          return;
        }
      } else {
        typewriterText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }

      const speed = isDeleting ? 45 : 75;
      setTimeout(typeWriter, speed);
    }

    typeWriter();
  }
});



/* ===========================
   CONTACT FORM VALIDATION + FORMSPREE
=========================== */
const contactForm = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

if (contactForm) {
  const inputs = contactForm.querySelectorAll("input, textarea");

  function setError(input, message) {
    input.classList.add("input-error", "placeholder-error", "shake");
    input.value = "";
    input.placeholder = message;

    setTimeout(() => {
      input.classList.remove("shake");
    }, 400);
  }

  function clearError(input, originalPlaceholder) {
    input.classList.remove("input-error", "placeholder-error");
    if (input.dataset.originalPlaceholder) {
      input.placeholder = input.dataset.originalPlaceholder;
    } else {
      input.placeholder = originalPlaceholder;
    }
  }

  // Save original placeholders
  inputs.forEach((input) => {
    input.dataset.originalPlaceholder = input.placeholder;

    input.addEventListener("input", () => {
      clearError(input);
    });
  });

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let isValid = true;

    inputs.forEach((input) => {
      const value = input.value.trim();

      if (!value) {
        isValid = false;

        if (input.name === "name") setError(input, "Name Required");
        else if (input.name === "email") setError(input, "Email Required");
        else if (input.name === "number") setError(input, "Phone Required");
        else if (input.name === "message") setError(input, "Message Required");
        else setError(input, "Required");
      }
    });

    // Email format check
    const emailInput = contactForm.querySelector('input[name="email"]');
    if (emailInput && emailInput.value.trim()) {
      const emailValue = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(emailValue)) {
        isValid = false;
        setError(emailInput, "Enter Valid Email");
      }
    }

    if (!isValid) {
      formMsg.textContent = "⚠️ Please fill all required fields correctly.";
      formMsg.classList.remove("success");
      formMsg.classList.add("error");
      return;
    }

    // Send to Formspree
    try {
      formMsg.textContent = "⏳ Sending message...";
      formMsg.classList.remove("success", "error");

      const formData = new FormData(contactForm);

      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        formMsg.textContent = "✅ Message sent successfully! I will reply soon.";
        formMsg.classList.remove("error");
        formMsg.classList.add("success");

        contactForm.reset();
      } else {
        formMsg.textContent = "❌ Something went wrong. Please try again.";
        formMsg.classList.remove("success");
        formMsg.classList.add("error");
      }
    } catch (error) {
      formMsg.textContent = "❌ Network error. Please check your internet.";
      formMsg.classList.remove("success");
      formMsg.classList.add("error");
    }
  });
}

// Disable Right Click
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// Disable Common DevTools Keys
document.addEventListener("keydown", (e) => {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && e.key === "I") ||
    (e.ctrlKey && e.shiftKey && e.key === "J") ||
    (e.ctrlKey && e.shiftKey && e.key === "C") ||
    (e.ctrlKey && e.key === "U")
  ) {
    e.preventDefault();
  }
});