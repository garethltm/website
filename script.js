const orbits = document.querySelectorAll(".orbit");
const dots = document.querySelectorAll(".dot");
const textbox = document.createElement("div");
textbox.classList.add("textbox");
document.body.appendChild(textbox);

dots.forEach((dot) => {
  dot.addEventListener("mouseenter", function (event) {
    // Pause all animations
    orbits.forEach((orbit) => orbit.classList.add("pause-animation"));

    // Show and position the textbox
    const rect = this.getBoundingClientRect();
    textbox.style.left = `${event.clientX + 20}px`;
    textbox.style.top = `${event.clientY + 20}px`;
    textbox.textContent = this.getAttribute("data-description");
    textbox.style.display = "block";
  });

  dot.addEventListener("mouseleave", function () {
    // Resume all animations
    orbits.forEach((orbit) => orbit.classList.remove("pause-animation"));

    // Hide the textbox
    textbox.style.display = "none";
  });
});
