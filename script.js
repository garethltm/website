const data = window.portfolioData;

if (!data) {
  throw new Error("Portfolio content is missing. Check portfolio-data.js.");
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function makeLink(label, url, className, external = true) {
  const link = makeElement("a", className, label);
  link.href = url;
  if (external) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  return link;
}

function renderHero() {
  document.title = `${data.name} — Cybersecurity & delivery`;
  document.querySelector(".brand span:last-child").textContent = data.name;
  document.querySelector(".brand").setAttribute("aria-label", `${data.name}, home`);
  document.querySelector(".note-index").textContent = data.location.toUpperCase();
  document.querySelector(".note-topline span:last-child").textContent =
    `01 / ${String(data.projects.length).padStart(2, "0")}`;
  document.querySelector("#hero-title").textContent = data.headline;
  document.querySelector("#hero-intro").textContent = data.intro;
  document.querySelector("#hero-note").textContent = data.note;

  const actions = document.querySelector("#hero-actions");
  const experienceLink = makeElement("a", "button button-primary", "Explore my experience");
  experienceLink.href = "#experience";
  actions.append(experienceLink);
  actions.append(makeLink("Connect on LinkedIn ↗", data.links.linkedin, "button button-quiet"));

  const socials = document.querySelector("#hero-socials");
  socials.append(makeLink("LinkedIn ↗", data.links.linkedin, "social-link"));
}

function renderExperience() {
  const list = document.querySelector("#experience-list");
  data.experiences.forEach((experience, index) => {
    const details = makeElement("details", "experience-entry");
    if (index === 0) details.open = true;

    const summary = makeElement("summary", "experience-summary");
    const title = makeElement("span", "experience-title");
    title.append(makeElement("span", "experience-role", experience.role));
    title.append(makeElement("span", "experience-company", experience.company));
    summary.append(title);
    summary.append(makeElement("span", "experience-category", experience.category));
    summary.append(makeElement("span", "experience-dates", experience.dates));
    const expandIcon = makeElement("span", "expand-icon");
    expandIcon.setAttribute("aria-hidden", "true");
    summary.append(expandIcon);
    details.append(summary);

    const content = makeElement("div", "experience-content");
    content.append(makeElement("p", "experience-summary-text", experience.summary));
    const highlights = makeElement("ul", "experience-highlights");
    experience.highlights.forEach((highlight) => {
      highlights.append(makeElement("li", "", highlight));
    });
    content.append(highlights);
    details.append(content);
    list.append(details);
  });

  const educationList = document.querySelector("#education-list");
  data.education.forEach((education) => {
    const item = makeElement("article", "education-item");
    item.append(makeElement("h4", "", education.qualification));
    item.append(makeElement("p", "education-institution", education.institution));
    item.append(makeElement("p", "education-focus", education.focus));
    educationList.append(item);
  });

  const certificationList = document.querySelector("#certification-list");
  data.certifications.forEach((certification) => {
    certificationList.append(makeElement("span", "credential-pill", certification));
  });
}

function renderProjects() {
  const list = document.querySelector("#project-list");
  const filters = document.querySelector("#project-filters");
  const categories = ["All", ...new Set(data.projects.map((project) => project.filter))];
  list.dataset.activeFilter = "All";

  categories.forEach((category, index) => {
    const button = makeElement("button", "filter-button", category);
    button.type = "button";
    button.dataset.filter = category;
    button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
    filters.append(button);
  });

  data.projects.forEach((project, index) => {
    const card = makeElement("article", `project-card project-${index + 1}`);
    card.dataset.category = project.filter;
    const visual = makeElement("div", `project-visual ${project.accent}`);
    visual.append(makeElement("span", "project-mark", project.mark));
    visual.append(makeElement("span", "project-number", `0${index + 1}`));
    card.append(visual);

    const copy = makeElement("div", "project-copy");
    copy.append(makeElement("p", "project-category", project.category));
    copy.append(makeElement("h3", "", project.name));
    copy.append(makeElement("p", "project-description", project.description));

    const projectLinks = makeElement("div", "project-links");
    if (project.url) {
      projectLinks.append(makeLink("Visit project ↗", project.url, "text-link"));
    }
    if (project.repoUrl) {
      projectLinks.append(makeLink("GitHub repo ↗", project.repoUrl, "text-link"));
    }
    if (projectLinks.childElementCount > 0) copy.append(projectLinks);

    const details = makeElement("details", "project-details");
    details.append(makeElement("summary", "", "My part in it"));
    details.append(makeElement("p", "", project.role));
    copy.append(details);
    card.append(copy);
    list.append(card);
  });

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;

    const activeFilter = button.dataset.filter;
    list.dataset.activeFilter = activeFilter;
    filters.querySelectorAll("button").forEach((filterButton) => {
      filterButton.setAttribute(
        "aria-pressed",
        filterButton === button ? "true" : "false",
      );
    });
    list.querySelectorAll(".project-card").forEach((card) => {
      const isVisible = activeFilter === "All" || card.dataset.category === activeFilter;
      card.hidden = !isVisible;
    });
  });
}

function renderAbout() {
  document.querySelector("#about-description").textContent = data.about;
  const skills = document.querySelector("#interest-list");
  data.skills.forEach((skill) => {
    skills.append(makeElement("span", "interest-pill", skill));
  });
  document.querySelector("#contact-link").href = data.links.linkedin;
  document.querySelector("#contact-link").target = "_blank";
  document.querySelector("#contact-link").rel = "noopener noreferrer";
  document.querySelector("#current-year").textContent = new Date().getFullYear();
}

function setupThemeToggle() {
  const button = document.querySelector("#theme-toggle");
  const icon = button.querySelector(".theme-icon");
  const label = button.querySelector(".theme-label");

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = isDark
      ? "#20221f"
      : "#f6f5f0";
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
    button.title = `Switch to ${isDark ? "light" : "dark"} mode`;
    icon.textContent = isDark ? "☀" : "☾";
    label.textContent = isDark ? "Light mode" : "Dark mode";
  }

  applyTheme(document.documentElement.dataset.theme || "light");
  button.addEventListener("click", () => {
    const nextTheme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try {
      localStorage.setItem("gareth-theme", nextTheme);
    } catch (error) {
      console.warn("Could not save the color theme preference.", error);
    }
  });
}

function setupScrollReveal() {
  if (!("IntersectionObserver" in window)) return;
  const elements = document.querySelectorAll(
    ".experience-entry, .resume-column, .project-card, .about, .contact",
  );
  elements.forEach((element) => element.classList.add("reveal"));
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  elements.forEach((element) => observer.observe(element));
}

function setupSectionNavigation() {
  if (!("IntersectionObserver" in window)) return;
  const links = document.querySelectorAll(".site-nav a");
  const sections = [...links]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const isCurrent = link.hash === `#${entry.target.id}`;
          if (isCurrent) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-30% 0px -60% 0px" },
  );
  sections.forEach((section) => observer.observe(section));
}

renderHero();
renderExperience();
renderProjects();
renderAbout();
setupThemeToggle();
setupScrollReveal();
setupSectionNavigation();
