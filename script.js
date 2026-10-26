/* ==========================================================
   BSIT DEVELOPER PORTFOLIO — script.js (Vanilla ES6+)
   Search for "EDIT:" to find the spots you should personalize.
   ========================================================== */

"use strict";

/* ---------- Small helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ==========================================================
   0. PROFILE DATA (used by the terminal widget)
   EDIT: fill in your own details here.
   ========================================================== */
const PROFILE = {
  name: "Juan Dela Cruz",
  role: "BSIT Student & Aspiring Full-Stack Developer",
  location: "Philippines",
  email: "your.email@example.com",
  github: "github.com/your-username",
  linkedin: "linkedin.com/in/your-username",
  skills: {
    Frontend: ["HTML5", "CSS3", "JavaScript (ES6+)", "Tailwind"],
    "Backend & DB": ["PHP", "Python", "Node.js", "MySQL", "MongoDB"],
    "Networking & Tools": ["Cisco / Packet Tracer", "Git", "Docker", "Linux", "AWS"],
  },
  projects: [
    "Student Enrollment Portal   (PHP, MySQL)",
    "Weather & Typhoon Tracker   (JS, REST API)",
    "Barangay Inventory Tracker  (MySQL, PWA)",
    "Campus Network Design       (Cisco, VLAN)",
  ],
};

/* Typing animation phrases (hero) — EDIT: change to your focus areas */
const TYPING_PHRASES = [
  "Web Development",
  "Database Administration",
  "Network Security",
  "Cloud Computing",
  "Problem Solving",
];

/* ==========================================================
   1. THEME TOGGLE (persists in localStorage)
   ========================================================== */
(function initTheme() {
  const root = document.documentElement;
  const btn = $("#themeToggle");
  const icon = $("#themeIcon");

  const apply = (theme) => {
    root.setAttribute("data-theme", theme);
    icon.className = theme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
    try { localStorage.setItem("theme", theme); } catch (_) { /* storage blocked */ }
  };

  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (_) { /* ignore */ }
  apply(saved || "dark"); // Dark mode by default

  btn.addEventListener("click", () => {
    apply(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });
})();

/* ==========================================================
   2. NAVBAR: mobile menu, scroll state, active link highlight
   ========================================================== */
(function initNav() {
  const navbar = $("#navbar");
  const menuBtn = $("#menuBtn");
  const navLinks = $("#navLinks");
  const links = $$(".nav-link");

  const closeMenu = () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.firstElementChild.className = "fa-solid fa-bars";
  };

  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.firstElementChild.className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  });

  links.forEach((l) => l.addEventListener("click", closeMenu));
  document.addEventListener("click", (e) => {
    if (!navbar.contains(e.target)) closeMenu();
  });

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true });

  // Highlight the link of the section currently in view
  const sections = links.map((l) => $(l.getAttribute("href"))).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => observer.observe(s));
})();

/* ==========================================================
   3. HERO TYPING ANIMATION
   ========================================================== */
(function initTyping() {
  const el = $("#typed");
  if (!el) return;

  if (prefersReducedMotion) { el.textContent = TYPING_PHRASES[0]; return; }

  let phraseIdx = 0, charIdx = 0, deleting = false;

  const tick = () => {
    const phrase = TYPING_PHRASES[phraseIdx];
    charIdx += deleting ? -1 : 1;
    el.textContent = phrase.slice(0, charIdx);

    let delay = deleting ? 40 : 85;
    if (!deleting && charIdx === phrase.length) { delay = 1600; deleting = true; }
    else if (deleting && charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % TYPING_PHRASES.length; delay = 400; }

    setTimeout(tick, delay);
  };
  tick();
})();

/* ==========================================================
   4. CURSOR GLOW + CARD SPOTLIGHT
   ========================================================== */
(function initGlow() {
  const glow = $(".cursor-glow");
  let raf = null;

  window.addEventListener("mousemove", (e) => {
    glow.classList.add("visible");
    if (raf) return;
    raf = requestAnimationFrame(() => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
      raf = null;
    });
  }, { passive: true });

  document.addEventListener("mouseleave", () => glow.classList.remove("visible"));

  // Per-card radial highlight that follows the mouse
  $$(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });
})();

/* ==========================================================
   5. IMAGE FALLBACKS (avatar + project thumbnails)
   If an image file is missing, a styled placeholder is shown.
   ========================================================== */
(function initImageFallbacks() {
  const avatar = $("#avatarImg");
  if (avatar) {
    const showFallback = () => avatar.closest(".avatar-wrap").classList.add("no-image");
    avatar.addEventListener("error", showFallback);
    if (avatar.complete && avatar.naturalWidth === 0) showFallback();
  }

  $$(".project-thumb img").forEach((img) => {
    const showFallback = () => img.closest(".project-thumb").classList.add("no-image");
    img.addEventListener("error", showFallback);
    if (img.complete && img.naturalWidth === 0) showFallback();
  });
})();

/* ==========================================================
   6. PROJECT FILTERS
   ========================================================== */
(function initFilters() {
  const buttons = $$(".filter-btn");
  const cards = $$(".project-card");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.toggle("active", b === btn));
      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hide", !match);
        card.classList.remove("fade-in");
        if (match) {
          // Re-trigger the CSS animation
          void card.offsetWidth;
          card.classList.add("fade-in");
          card.removeAttribute("data-aos"); // avoid AOS hiding re-shown cards
          card.classList.add("aos-animate");
          card.style.opacity = 1;
          card.style.transform = "";
        }
      });
    });
  });
})();

/* ==========================================================
   7. COUNTERS + PROGRESS BARS (animate when scrolled into view)
   ========================================================== */
(function initCounters() {
  const animateCount = (el) => {
    const target = Number(el.dataset.count);
    if (prefersReducedMotion) { el.textContent = `${target}+`; return; }
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(p * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = `${target}+`;
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.matches("[data-count]")) animateCount(el);
      if (el.matches("[data-progress]")) el.style.width = `${el.dataset.progress}%`;
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });

  $$("[data-count], [data-progress]").forEach((el) => io.observe(el));
})();

/* ==========================================================
   8. INTERACTIVE TERMINAL
   Commands: help, about, skills, projects, contact, whoami,
             ls, date, theme, clear, sudo hire
   ========================================================== */
(function initTerminal() {
  const output = $("#terminalOutput");
  const form = $("#terminalForm");
  const input = $("#terminalInput");
  const box = $("#terminalBox");

  const history = [];
  let historyIdx = 0;

  const escapeHTML = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const print = (html = "", cls = "") => {
    const div = document.createElement("div");
    div.className = `line ${cls}`.trim();
    div.innerHTML = html;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  };

  const commands = {
    help() {
      print(
`<span class="hl">Available commands:</span>
  help       Show this list
  about      Who am I?
  skills     Technical skills
  projects   Featured projects
  contact    How to reach me
  whoami     Quick intro
  ls         List portfolio sections
  date       Current date and time
  theme      Toggle light/dark mode
  clear      Clear the terminal
  sudo hire  ...you know you want to`);
    },

    about() {
      print(`<span class="hl">${escapeHTML(PROFILE.name)}</span> — ${escapeHTML(PROFILE.role)}
Based in ${escapeHTML(PROFILE.location)}. I love building reliable web systems,
managing databases and learning how networks stay secure.`);
    },

    whoami() { print(`guest — but you could be my next employer or teammate.`); },

    skills() {
      const rows = Object.entries(PROFILE.skills)
        .map(([group, items]) => `<span class="hl">${escapeHTML(group)}</span>\n  ${items.map(escapeHTML).join(", ")}`)
        .join("\n");
      print(rows);
    },

    projects() {
      print(`<span class="hl">Featured projects:</span>\n${PROFILE.projects.map((p) => "  • " + escapeHTML(p)).join("\n")}\n\nScroll to the Projects section for live demos.`);
    },

    contact() {
      print(
`<span class="hl">Email:</span>    ${escapeHTML(PROFILE.email)}
<span class="hl">GitHub:</span>   ${escapeHTML(PROFILE.github)}
<span class="hl">LinkedIn:</span> ${escapeHTML(PROFILE.linkedin)}
<span class="hl">Location:</span> ${escapeHTML(PROFILE.location)}`);
    },

    ls() { print("home/  about/  projects/  education/  terminal/  contact/"); },

    date() { print(new Date().toLocaleString("en-PH", { dateStyle: "full", timeStyle: "medium" })); },

    theme() { $("#themeToggle").click(); print("Theme toggled.", "ok"); },

    clear() { output.innerHTML = ""; },

    "sudo hire"() {
      print(`<span class="ok">[sudo] password for guest: ********</span>`);
      print(`<span class="ok">Permission granted. Excellent decision!</span>`);
      print(`Opening a draft email to ${escapeHTML(PROFILE.email)}...`);
      setTimeout(() => {
        window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent("Let's work together!")}&body=${encodeURIComponent("Hi " + PROFILE.name.split(" ")[0] + ",\n\nI found your portfolio and would like to talk about an opportunity.\n")}`;
      }, 1200);
    },
  };

  const run = (raw) => {
    const cmd = raw.trim().replace(/\s+/g, " ").toLowerCase();
    print(`<span class="cmd"><span class="p">guest@portfolio:~$</span> ${escapeHTML(raw)}</span>`);
    if (!cmd) return;

    if (commands[cmd]) commands[cmd]();
    else if (cmd.startsWith("sudo")) print(`<span class="err">guest is not in the sudoers file. This incident will be reported.</span> (try: sudo hire)`);
    else print(`<span class="err">command not found:</span> ${escapeHTML(cmd)}. Type <span class="hl">help</span> for options.`);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value;
    if (value.trim()) { history.push(value); historyIdx = history.length; }
    run(value);
    input.value = "";
  });

  // Up/Down arrow = command history
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      historyIdx = Math.max(0, historyIdx - 1);
      input.value = history[historyIdx];
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      historyIdx = Math.min(history.length, historyIdx + 1);
      input.value = history[historyIdx] || "";
    }
  });

  // Clicking anywhere in the terminal focuses the input
  box.addEventListener("click", () => input.focus({ preventScroll: true }));

  // Welcome message
  print(`<span class="ok">Welcome to ${escapeHTML(PROFILE.name.split(" ")[0])}'s interactive portfolio v1.0</span>`);
  print(`Type <span class="hl">help</span> to see available commands.\n`);
})();

/* ==========================================================
   9. CONTACT FORM
   Uses fetch() to post to the form's action (Formspree etc.).
   If the action still contains YOUR_FORM_ID, it falls back to mailto.
   ========================================================== */
(function initContactForm() {
  const form = $("#contactForm");
  const status = $("#formStatus");
  const submitBtn = $('button[type="submit"]', form);

  const setStatus = (msg, type = "") => {
    status.textContent = msg;
    status.className = `form-status mono ${type}`.trim();
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus("Please fill in all fields correctly.", "error");
      return;
    }

    const data = new FormData(form);

    // Fallback: no backend configured yet → open the visitor's email app
    if (form.action.includes("YOUR_FORM_ID")) {
      const subject = encodeURIComponent(data.get("subject"));
      const body = encodeURIComponent(`${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`);
      window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
      setStatus("Opening your email app...", "success");
      return;
    }

    submitBtn.disabled = true;
    setStatus("Sending...");

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      setStatus("Message sent! I'll get back to you soon.", "success");
    } catch (err) {
      setStatus("Something went wrong. Please email me directly.", "error");
    } finally {
      submitBtn.disabled = false;
    }
  });
})();

/* ==========================================================
   10. FOOTER YEAR + SCROLL ANIMATIONS (AOS)
   ========================================================== */
$("#year").textContent = new Date().getFullYear();

if (window.AOS) {
  AOS.init({
    duration: 700,
    easing: "ease-out-cubic",
    once: true,
    offset: 60,
    disable: prefersReducedMotion,
  });
}
