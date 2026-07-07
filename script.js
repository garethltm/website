// Cache DOM elements and configuration data at the top level
const orbitInfo = {
  orbit1: {
    header: "Technical Skills",
    body: "<strong>Languages & Tools</strong><br>Python, Java, JavaScript, React.js, HTML, CSS, SQL, C, Figma<br><br><strong>Security & Cloud</strong><br>Cybersecurity, Cloud Security, Microsoft Entra ID, Azure Active Directory, Identity & Access Management (IAM), Conditional Access, Endpoint Security, Microsoft Intune, Data Loss Prevention (DLP), Microsoft Purview, Zero Trust, Hybrid Cloud<br><br><strong>AI Productivity</strong><br>OpenAI ChatGPT, Claude, Google Gemini, GitHub Copilot",
  },
  orbit2: {
    header: "Professional Experience",
    body: "<strong>Delivery Engineer, Noventiq Malaysia</strong> (Dec 2025–Present) — Intune endpoint management & security baselines.<br><br><strong>Cybersecurity Engineer, Kloudynet Technologies</strong> (Dec 2024–Nov 2025) — Purview DLP, Entra ID admin, Conditional Access/Zero Trust.<br><br><strong>Faculty of Engineering, University of Auckland</strong> (Dec 2022–Jul 2024) — Professional casual staff.<br><br><strong>Marketing Associate, Gain Secure</strong> (Mar–Jun 2022) — Windows Server → Azure SQL migration.<br><br><strong>Enfrasys Consulting</strong> (Mar 2020–Feb 2021) — Cloud integration consulting.",
  },
  orbit3: {
    header: "Education",
    body: "<strong>Bachelor of Science, University of Auckland</strong><br>Major: Computer Science (AI & ML)<br>Module: Software Development<br><br><strong>American Degree Transfer Programme, Sunway University</strong><br>Major: Computer Science<br><br>Continuous learner committed to staying current with emerging technologies and industry trends.",
  },
  orbit4: {
    header: "Certifications",
    body: "<strong>Microsoft Certified</strong><br><br>AZ-900: Azure Fundamentals<br>DP-900: Azure Data Fundamentals<br>SC-900: Security Fundamentals<br>MD-102: Endpoint Administrator Associate<br>SC-300: Identity and Access Administrator Associate",
  },
  orbit5: {
    header: "Projects",
    body: '<strong><a href="https://github.com/garethltm/this-project-is-in-jeopardy-v2" target="_blank">UMSA Jeopardy Game</a></strong> — Malaysian-themed full-stack trivia game<br><br><strong><a href="https://github.com/uoa-compsci399-s1-2024/capstone-project-2024-s1-team-5-pollination" target="_blank">AAPC Website</a></strong> — Project Manager & full-stack developer for an external client<br><br><strong><a href="https://github.com/garethltm/235project" target="_blank">Game Library</a></strong> — Team full-stack project<br><br><strong><a href="https://github.com/garethltm/victoryroyale" target="_blank">Victory Royale</a></strong> — Front-end build, 2023 SESA Hackathon<br><br><strong><a href="https://scheap.vercel.app" target="_blank">Scheap</a></strong> — Wishlist/shopping price tracker (in development)<br><br><strong><a href="https://github.com/garethltm/website" target="_blank">Portfolio Website</a></strong> — This interactive site',
  },
};

// Orbit sizes will be set dynamically
const orbitSizes = {
  orbit5: 0,
  orbit4: 0,
  orbit3: 0,
  orbit2: 0,
  orbit1: 0,
};

// Function to update orbit sizes based on current dimensions
function updateOrbitSizes() {
  // Get actual computed sizes of orbits
  const orbit1Element = document.querySelector(".orbit1");
  const orbit2Element = document.querySelector(".orbit2");
  const orbit3Element = document.querySelector(".orbit3");
  const orbit4Element = document.querySelector(".orbit4");
  const orbit5Element = document.querySelector(".orbit5");

  if (
    orbit1Element &&
    orbit2Element &&
    orbit3Element &&
    orbit4Element &&
    orbit5Element
  ) {
    const orbit1Rect = orbit1Element.getBoundingClientRect();
    const orbit2Rect = orbit2Element.getBoundingClientRect();
    const orbit3Rect = orbit3Element.getBoundingClientRect();
    const orbit4Rect = orbit4Element.getBoundingClientRect();
    const orbit5Rect = orbit5Element.getBoundingClientRect();

    // Set sizes based on the actual rendered elements (half the width is the radius)
    orbitSizes.orbit1 = orbit1Rect.width / 2;
    orbitSizes.orbit2 = orbit2Rect.width / 2;
    orbitSizes.orbit3 = orbit3Rect.width / 2;
    orbitSizes.orbit4 = orbit4Rect.width / 2;
    orbitSizes.orbit5 = orbit5Rect.width / 2;

    console.log("Updated orbit sizes:", orbitSizes);
  }
}

// Helper function to check if we're on a touch device
function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

// Helper function to check if we're on a mobile device
function isMobileDevice() {
  return window.innerWidth <= 768;
}

document.addEventListener("DOMContentLoaded", function () {
  // Cache DOM elements once
  const dots = document.querySelectorAll(".dot");
  const tooltip = document.getElementById("tooltip");
  const infoBox = document.getElementById("infoBox");
  const orbits = document.querySelectorAll(".orbit");
  const centerElement = document.querySelector(".center");
  const orbitContainer = document.querySelector(".orbit-container");

  // Update orbit sizes initially
  updateOrbitSizes();

  initializeOrbitInteractions();
  initializeThemeToggle();

  if (isTouchDevice()) {
    initializeTouchInteractions();
  }

  // Add additional styles
  addExtraStyles();

  // Handle window resizing consistently
  window.addEventListener("resize", function () {
    handleResize();
    updateOrbitSizes();
  });

  window.addEventListener("orientationchange", function () {
    handleOrientationChange();
    setTimeout(updateOrbitSizes, 300); // Update after orientation change completes
  });

  // Initialize orbit interactions
  function initializeOrbitInteractions() {
    // Function to show info for a specific orbit
    function showOrbitInfo(orbitKey) {
      if (orbitKey && orbitInfo[orbitKey]) {
        const { header, body } = orbitInfo[orbitKey];
        infoBox.innerHTML = `<h3>${header}</h3><p>${body}</p>`;
        infoBox.classList.add("show");
      }
    }

    // Calculate which orbit the mouse is in based on distance from center
    function determineActiveOrbit(distanceFromCenter) {
      // Sort orbit sizes from largest to smallest
      const sortedOrbits = Object.keys(orbitSizes).sort(
        (a, b) => orbitSizes[b] - orbitSizes[a],
      );

      // Find the smallest orbit that contains the point
      for (let i = sortedOrbits.length - 1; i >= 0; i--) {
        if (distanceFromCenter <= orbitSizes[sortedOrbits[i]]) {
          return sortedOrbits[i];
        }
      }

      return null;
    }

    // Get the center point accounting for mobile layout adjustments
    function getOrbitCenter() {
      // For desktop, use the orbit container center
      const containerRect = orbitContainer.getBoundingClientRect();

      // For mobile, we need to adjust based on where "Gareth" is positioned
      if (isMobileDevice()) {
        const centerRect = centerElement.getBoundingClientRect();
        // On mobile, the center of orbits is below the name
        return {
          x: containerRect.left + containerRect.width / 2,
          y: window.innerHeight / 2, // Use middle of screen height as center point for mobile
        };
      } else {
        return {
          x: containerRect.left + containerRect.width / 2,
          y: containerRect.top + containerRect.height / 2,
        };
      }
    }

    // Setup click and hover detection for the entire orbit container
    orbitContainer.addEventListener("click", function (event) {
      const center = getOrbitCenter();

      const distanceFromCenter = Math.sqrt(
        Math.pow(event.clientX - center.x, 2) +
          Math.pow(event.clientY - center.y, 2),
      );

      console.log("Click distance from center:", distanceFromCenter);
      console.log("Orbit sizes:", orbitSizes);

      const activeOrbit = determineActiveOrbit(distanceFromCenter);
      if (activeOrbit) {
        showOrbitInfo(activeOrbit);

        // Add visual feedback for the clicked orbit
        document.querySelector(`.${activeOrbit}`).classList.add("highlight");
        setTimeout(() => {
          document
            .querySelector(`.${activeOrbit}`)
            .classList.remove("highlight");
        }, 300);
      } else if (distanceFromCenter <= orbitSizes.orbit1 / 2) {
        // If near the center, show skills
        showOrbitInfo("orbit1");
      }
    });

    // Setup hover/mousemove detection for the entire orbit container
    orbitContainer.addEventListener("mousemove", function (event) {
      const center = getOrbitCenter();

      const distanceFromCenter = Math.sqrt(
        Math.pow(event.clientX - center.x, 2) +
          Math.pow(event.clientY - center.y, 2),
      );

      const activeOrbit = determineActiveOrbit(distanceFromCenter);
      if (activeOrbit) {
        showOrbitInfo(activeOrbit);
      } else if (distanceFromCenter <= orbitSizes.orbit1 / 2) {
        // If near the center, show skills
        showOrbitInfo("orbit1");
      }
    });

    // Handle mouseout event for the container
    orbitContainer.addEventListener("mouseout", function () {
      infoBox.classList.remove("show");
    });

    // Additional hover for the center element
    if (centerElement) {
      centerElement.addEventListener("mouseover", function () {
        showOrbitInfo("orbit1"); // Show skills when hovering over center
      });

      centerElement.addEventListener("mouseout", function (event) {
        // Only hide if not moving to orbit container
        if (!orbitContainer.contains(event.relatedTarget)) {
          infoBox.classList.remove("show");
        }
      });
    }

    // Set up dot animations and interactions
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
  }

  // Handle theme toggle
  function initializeThemeToggle() {
    // Create theme toggle with better icons
    const themeToggle = document.createElement("button");
    themeToggle.id = "theme-toggle";
    themeToggle.innerHTML = `
      <svg class="sun-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
        <path d="M12 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 20V22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M4 12L2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M22 12L20 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M19.778 4.22183L17.6569 6.34315" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M6.34309 17.6569L4.22183 19.7782" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M19.778 19.7782L17.6569 17.6569" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M6.34309 6.34315L4.22183 4.22183" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <svg class="moon-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    document.body.appendChild(themeToggle);

    function setTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);

      // Update background gradient and animations
      document.body.style.background = "var(--bg-gradient)";
      document.body.style.backgroundSize = "400% 400%";
      document.body.style.animation = "gradientAnimation 10s ease infinite";

      if (theme === "dark") {
        themeToggle.classList.remove("light-mode");
        themeToggle.classList.add("dark-mode");
      } else {
        themeToggle.classList.remove("dark-mode");
        themeToggle.classList.add("light-mode");
      }
    }

    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    });

    // Load saved theme preference
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
  }

  // Handle touch interactions for mobile - UPDATED FROM PASTE.TXT
  function initializeTouchInteractions() {
    // Add a class to the body for better styling control
    document.body.classList.add("touch-device");

    // Store the currently active orbit
    let activeOrbitElement = null;

    // Function to show info box with animation and highlight the active orbit
    function showMobileInfo(orbitKey) {
      if (orbitKey && orbitInfo[orbitKey]) {
        const { header, body } = orbitInfo[orbitKey];
        infoBox.innerHTML = `<h3>${header}</h3><p>${body}</p>`;
        infoBox.classList.add("show");

        // Remove active class from previous orbit if exists
        if (activeOrbitElement) {
          activeOrbitElement.classList.remove("active");
        }

        // Add active class to current orbit
        activeOrbitElement = document.querySelector(`.${orbitKey}`);
        if (activeOrbitElement) {
          activeOrbitElement.classList.add("active");
        }

        // Add subtle haptic feedback if supported
        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(40); // Subtle vibration
        }
      }
    }

    // Get the center point accounting for mobile layout adjustments
    function getMobileTouchCenter() {
      // For mobile, we need different center points
      if (isMobileDevice()) {
        return {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2 + 20, // Adjusted to account for visual center
        };
      } else {
        const containerRect = orbitContainer.getBoundingClientRect();
        return {
          x: containerRect.left + containerRect.width / 2,
          y: containerRect.top + containerRect.height / 2,
        };
      }
    }

    // Add touch event listener for the entire orbit container
    document.addEventListener("touchstart", function (e) {
      // Skip if we're touching inside the info box (to allow scrolling)
      if (infoBox.contains(e.target)) {
        return;
      }

      const touch = e.touches[0];
      const center = getMobileTouchCenter();

      const distanceFromCenter = Math.sqrt(
        Math.pow(touch.clientX - center.x, 2) +
          Math.pow(touch.clientY - center.y, 2),
      );

      // Find which orbit was touched
      let activeOrbit = null;
      if (distanceFromCenter <= orbitSizes.orbit1) {
        activeOrbit = "orbit1";
      } else if (distanceFromCenter <= orbitSizes.orbit2) {
        activeOrbit = "orbit2";
      } else if (distanceFromCenter <= orbitSizes.orbit3) {
        activeOrbit = "orbit3";
      } else if (distanceFromCenter <= orbitSizes.orbit4) {
        activeOrbit = "orbit4";
      } else if (distanceFromCenter <= orbitSizes.orbit5) {
        activeOrbit = "orbit5";
      }

      if (activeOrbit) {
        e.preventDefault(); // Prevent default touch behavior
        showMobileInfo(activeOrbit);
      } else if (!infoBox.contains(e.target)) {
        // If touching outside orbits and not in info box, close the info box
        infoBox.classList.remove("show");

        // Remove active class from any orbits
        if (activeOrbitElement) {
          activeOrbitElement.classList.remove("active");
          activeOrbitElement = null;
        }
      }
    });

    // Touch event for center element
    if (centerElement) {
      centerElement.addEventListener("touchstart", function (e) {
        e.preventDefault();
        showMobileInfo("orbit1"); // Show skills when touching the center
      });
    }

    // Create a swipe detector for the info box
    let touchStartY;
    let touchStartX;

    infoBox.addEventListener("touchstart", function (e) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    });

    infoBox.addEventListener("touchmove", function (e) {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      const diffY = touchStartY - touchY;
      const diffX = Math.abs(touchStartX - touchX);

      // If swiping down (and not significantly horizontally), close the info box
      if (diffY < -30 && diffX < 50) {
        infoBox.classList.remove("show");
        touchStartY = null;

        // Remove active class from any orbits
        if (activeOrbitElement) {
          activeOrbitElement.classList.remove("active");
          activeOrbitElement = null;
        }
      }
    });

    infoBox.addEventListener("touchend", function () {
      touchStartY = null;
      touchStartX = null;
    });

    // Add a tap-to-dismiss button to the info box
    const dismissButton = document.createElement("div");
    dismissButton.className = "info-dismiss";
    dismissButton.innerHTML = "✕";
    infoBox.appendChild(dismissButton);

    dismissButton.addEventListener("click", function () {
      infoBox.classList.remove("show");

      // Remove active class from any orbits
      if (activeOrbitElement) {
        activeOrbitElement.classList.remove("active");
        activeOrbitElement = null;
      }
    });

    // Add visual indication for touch interactions
    addTouchVisualIndicators();
  }

  // Add extra styles function - NEW FROM PASTE.TXT
  function addExtraStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .info-dismiss {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .info-dismiss:hover, .info-dismiss:active {
        background: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.9);
      }
      
      @media (max-width: 768px) {
        /* Add slight fade at bottom of info box to indicate scrollable content */
        .info-box:after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 20px;
          background: linear-gradient(to top, rgba(30, 30, 40, 0.8), transparent);
          pointer-events: none;
          opacity: 0.8;
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function addTouchVisualIndicators() {
    // Create a permanent indicator to be placed below the orbit
    const touchIndicator = document.createElement("div");
    touchIndicator.className = "permanent-touch-indicator";
    touchIndicator.innerHTML = "<span>Tap the orbital rings to explore</span>";

    // Insert it after the orbit container instead of the center element
    const orbitContainer = document.querySelector(".orbit-container");
    if (orbitContainer) {
      // Insert after the orbit container
      orbitContainer.parentNode.insertBefore(
        touchIndicator,
        orbitContainer.nextSibling,
      );
    }

    // Add orbital highlighting animation to draw attention
    const orbits = document.querySelectorAll(".orbit");
    orbits.forEach((orbit, index) => {
      setTimeout(
        () => {
          orbit.classList.add("highlight");
          setTimeout(() => {
            orbit.classList.remove("highlight");
          }, 800);
        },
        2500 + index * 300,
      );
    });

    // Add CSS for permanent touch indicator
    addTouchIndicatorStyles();
  }

  function addTouchIndicatorStyles() {
    // Only add these styles if they don't already exist
    if (!document.getElementById("touch-indicator-styles")) {
      const style = document.createElement("style");
      style.id = "touch-indicator-styles";
      style.textContent = `
        .permanent-touch-indicator {
          position: absolute;
          top: calc(50% + clamp(200px, 45vmin, 550px) + 40px);
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 6px 14px;
          color: white;
          font-size: 0.9rem;
          z-index: 10;
          text-align: center;
          white-space: nowrap;
          display: inline-block;
        }
        
        .permanent-touch-indicator span {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .permanent-touch-indicator span:before {
          content: "👆";
          margin-right: 8px;
        }
        
        @media (max-width: 768px) {
          .permanent-touch-indicator {
            font-size: 0.8rem;
            padding: 5px 12px;
          }
        }
        
        @keyframes highlightOrbit {
          0% { border-color: rgba(255, 255, 255, 0.5); }
          50% { border-color: rgba(255, 255, 255, 1); box-shadow: 0 0 15px rgba(255, 255, 255, 0.5); }
          100% { border-color: rgba(255, 255, 255, 0.5); }
        }
        
        .orbit.highlight {
          animation: highlightOrbit 0.8s ease-in-out;
        }
        
        /* Animation for the indicator */
        @keyframes fadeInPulse {
          0% { opacity: 0; transform: translateX(-50%) scale(0.95); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }
        
        .permanent-touch-indicator {
          animation: fadeInPulse 0.6s ease-out forwards;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Handle window resize
  function handleResize() {
    if (tooltip.classList.contains("show")) {
      tooltip.classList.remove("show");
    }

    // Update orbit sizes when the window resizes
    updateOrbitSizes();
  }

  // Handle orientation change
  function handleOrientationChange() {
    // Hide the info box when orientation changes
    infoBox.classList.remove("show");

    // Reposition elements after orientation change
    setTimeout(() => {
      // Force redraw of orbits
      orbits.forEach((orbit) => {
        orbit.style.display = "none";
        setTimeout(() => {
          orbit.style.display = "";
        }, 10);
      });

      // Update orbit sizes after redraw
      updateOrbitSizes();
    }, 300);
  }
});
