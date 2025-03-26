document.addEventListener("DOMContentLoaded", function () {
  const dots = document.querySelectorAll(".dot");
  const tooltip = document.getElementById("tooltip");
  const infoBox = document.getElementById("infoBox");
  const orbits = document.querySelectorAll(".orbit");
  const centerElement = document.querySelector(".center");

  // Detailed information for each orbit based on LinkedIn profile
  const orbitInfo = {
    orbit1: {
      header: "Technical Skills",
      body: "Web Development, JavaScript, React, Python, Data Analysis, Machine Learning, Full-Stack Development. Proficient in creating innovative, user-centric digital solutions.",
    },
    orbit2: {
      header: "Professional Experience",
      body: "Diverse background in software engineering and data science. Worked on impactful projects spanning multiple industries, demonstrating strong problem-solving and collaborative skills. Expertise in developing scalable web applications and data-driven solutions.",
    },
    orbit3: {
      header: "Education",
      body: "Bachelor's degree in Computer Science from the University of Auckland with a background on Artificial Intelligence, Machine Learning and Software Development. Continuous learner committed to professional development, staying updated with emerging technologies and industry trends.",
    },
  };

  // Orbit sizes for precise detection
  const orbitSizes = {
    orbit3: 302, // Outer orbit radius
    orbit2: 202, // Middle orbit radius
    orbit1: 102, // Inner orbit radius
  };

  // Function to show info for a specific orbit
  function showOrbitInfo(orbitKey) {
    if (orbitKey && orbitInfo[orbitKey]) {
      const { header, body } = orbitInfo[orbitKey];
      infoBox.innerHTML = `<h3>${header}</h3><p>${body}</p>`;
      infoBox.classList.add("show");
    }
  }

  // Comprehensive hover detection for orbits and center
  function setupOrbitHoverDetection(element) {
    element.addEventListener("mousemove", function (event) {
      // Get the bounding rectangle of the entire orbit/center
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center
      const distanceFromCenter = Math.sqrt(
        Math.pow(event.clientX - centerX, 2) +
          Math.pow(event.clientY - centerY, 2)
      );

      // Determine which orbit the mouse is in
      let activeOrbit = null;
      Object.keys(orbitSizes)
        .sort((a, b) => orbitSizes[b] - orbitSizes[a]) // Sort from largest to smallest
        .forEach((orbit) => {
          if (distanceFromCenter <= orbitSizes[orbit]) {
            activeOrbit = orbit;
          }
        });

      // Show info for the detected orbit or center
      if (activeOrbit) {
        showOrbitInfo(activeOrbit);
      } else if (element.classList.contains("center")) {
        // If in the center, show orbit1 info
        showOrbitInfo("orbit1");
      }
    });
  }

  // Setup hover detection for orbits
  orbits.forEach(setupOrbitHoverDetection);

  // Also setup hover detection for center if it exists
  if (centerElement) {
    setupOrbitHoverDetection(centerElement);
  }

  // Modify mouseout event to be less aggressive about hiding
  const allElements = [...orbits, centerElement].filter(Boolean);
  allElements.forEach((element) => {
    element.addEventListener("mouseout", function (event) {
      const relatedTarget = event.relatedTarget;
      const isStillInElements = allElements.some(
        (el) => relatedTarget && el.contains(relatedTarget)
      );

      if (!isStillInElements) {
        infoBox.classList.remove("show");
      }
    });
  });

  // Existing dot interactions remain the same
  dots.forEach((dot, index) => {
    dot.style.animation = `orbit-rotate${index + 1} ${
      20 + index * 10
    }s linear infinite`;

    dot.addEventListener("mouseenter", function () {
      tooltip.textContent = dot.getAttribute("data-description");
      tooltip.style.left = `${dot.getBoundingClientRect().left + 20}px`;
      tooltip.style.top = `${dot.getBoundingClientRect().top + 20}px`;
      tooltip.classList.add("show");
    });

    dot.addEventListener("mouseleave", function () {
      tooltip.classList.remove("show");
    });
  });

  window.addEventListener("resize", () => {
    if (tooltip.classList.contains("show")) {
      tooltip.classList.remove("show");
    }
  });
});
