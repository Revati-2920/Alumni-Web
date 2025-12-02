const mentors = [
  {
    name: "Akshay Kulkarni",
    batch: "2019",
    domain: "Software",
    company: "Google",
    location: "Bangalore, India",
    tagline: "SWE @ Google | Ex-Startups | Android & Backend mentor",
    tags: ["Android", "Backend", "System Design"],
  },
  {
    name: "Sneha Patil",
    batch: "2020",
    domain: "Data Science",
    company: "Microsoft",
    location: "Hyderabad, India",
    tagline: "Data Scientist | ML & AI | Research enthusiast",
    tags: ["Machine Learning", "Python", "Research"],
  },
  {
    name: "Rohan Deshmukh",
    batch: "2018",
    domain: "Mechanical",
    company: "Tata Motors",
    location: "Pune, India",
    tagline: "Mechanical Engineer | Design & Manufacturing",
    tags: ["Automotive", "Design", "Manufacturing"],
  },
  {
    name: "Priya Nair",
    batch: "2021",
    domain: "AIML",
    company: "TU Munich",
    location: "Munich, Germany",
    tagline: "MS in Robotics | Helps with SOPs & applications",
    tags: ["Higher Studies", "Europe", "Robotics"],
  },
  {
    name: "Aditya Sharma",
    batch: "2022",
    domain: "IT Engineering",
    company: "Startup Founder",
    location: "Remote",
    tagline: "Founder @ SaaS startup | Product & growth mentor",
    tags: ["Startup", "Product", "Growth"],
  },
  {
    name: "Neha Joshi",
    batch: "2023",
    domain: "Computer",
    company: "TCS",
    location: "Pune, India",
    tagline: "Full-stack developer | First job guidance",
    tags: ["Full Stack", "Campus to Corporate"],
  },
];

// Auth modal logic
function setupAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;

  const backdrop = modal.querySelector(".auth-backdrop");
  const closeBtn = modal.querySelector(".auth-close");
  const tabs = modal.querySelectorAll("[data-auth-tab]");
  const forms = modal.querySelectorAll("[data-auth-panel]");
  const authButtons = document.querySelectorAll(".auth-btn");
  const roleButtons = modal.querySelectorAll(".auth-role");
  const switchSignInBtn = modal.querySelector(".auth-switch-signin");

  const openModal = (mode) => {
    modal.classList.add("auth-open");
    switchMode(mode);
  };

  const closeModal = () => {
    modal.classList.remove("auth-open");
  };

  const switchMode = (mode) => {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.authTab === mode;
      tab.classList.toggle("auth-tab-active", isActive);
    });
    forms.forEach((panel) => {
      panel.classList.toggle("hidden", panel.dataset.authPanel !== mode);
    });
  };

  authButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.auth || "signin";
      openModal(mode);
    });
  });

  // Handle role toggle buttons
  roleButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      roleButtons.forEach((b) => b.classList.remove("auth-role-active"));
      btn.classList.add("auth-role-active");

      // Determine selected role: prefer data-role, fallback to button text
      const rawRole = btn.dataset.role || (btn.textContent && btn.textContent.trim().toLowerCase());
      const selectedRole = rawRole ? rawRole.toString().toLowerCase() : "student";

      const yearLabelElement = modal.querySelector("#yearLabel");
      const studentYearSelect = modal.querySelector("#studentYearSelect");
      const alumniYearSelect = modal.querySelector("#alumniYearSelect");

      if (yearLabelElement) {
        // Find first non-empty text node and update it (keeps selects intact)
        const textNode = Array.from(yearLabelElement.childNodes).find(
          (n) => n.nodeType === 3 && n.textContent.trim().length >= 0
        );
        if (textNode) {
          if (selectedRole === "alumni") {
            textNode.nodeValue = "Graduation Year";
            if (studentYearSelect) studentYearSelect.style.display = "none";
            if (alumniYearSelect) alumniYearSelect.style.display = "block";
          } else {
            textNode.nodeValue = "Year";
            if (studentYearSelect) studentYearSelect.style.display = "block";
            if (alumniYearSelect) alumniYearSelect.style.display = "none";
          }
        }
      }
    });
  });

  // Handle Sign In link in Sign Up form
  if (switchSignInBtn) {
    switchSignInBtn.addEventListener("click", () => {
      switchMode("signin");
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeModal);
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }
}

function initials(fullName) {
  return fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function renderMentors(list) {
  const container = document.getElementById("mentor-list");
  const noResults = document.getElementById("no-results");

  container.innerHTML = "";

  if (!list.length) {
    noResults.classList.remove("hidden");
    return;
  }

  noResults.classList.add("hidden");

  list.forEach((mentor) => {
    const card = document.createElement("article");
    card.className = "mentor-card";

    card.innerHTML = `
      <div class="mentor-header">
        <div class="mentor-avatar">${initials(mentor.name)}</div>
        <div>
          <div class="mentor-name">${mentor.name}</div>
          <div class="mentor-meta">${mentor.domain} • Batch ${mentor.batch}</div>
          <div class="mentor-meta">${mentor.company} • ${mentor.location}</div>
        </div>
      </div>
      <p class="mentor-tagline">${mentor.tagline}</p>
      <div class="mentor-tags">
        ${mentor.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
      </div>
      <div class="mentor-footer">
        <span>Responds in ~2–3 days</span>
        <span class="mentor-link">Request mentorship</span>
      </div>
    `;

    container.appendChild(card);
  });
}

function applyFilters() {
  const interest = document.getElementById("interest").value;
  const batch = document.getElementById("batch").value;
  const company = document.getElementById("company").value.trim().toLowerCase();

  const filtered = mentors.filter((m) => {
    const matchesInterest = !interest || m.domain === interest;
    const matchesBatch = !batch || m.batch === batch;
    const matchesCompany =
      !company ||
      m.company.toLowerCase().includes(company) ||
      m.tags.some((t) => t.toLowerCase().includes(company));

    return matchesInterest && matchesBatch && matchesCompany;
  });

  renderMentors(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("mentor-search-form");
  const yearSpan = document.getElementById("year");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      applyFilters();
    });
  }

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  if (document.getElementById("mentor-list")) {
    renderMentors(mentors);
  }

  setupAuthModal();
});