// src/slide_function.ts

export function initHomePage() {
  let idx = 0;
  let timer: number | undefined = undefined;

  // select all slides
  const slides = Array.from(
    document.querySelectorAll<HTMLElement>(".hero-slider .slide")
  );
  const dotsContainer = document.getElementById("slideDots");

  if (slides.length === 0) return () => {};

  // ==========================
  // Create dots dynamically
  // ==========================
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.addEventListener("click", () => {
        goTo(i);
        restartTimer();
      });
      if (i === 0) dot.classList.add("active");
      dotsContainer.appendChild(dot);
    });
  }

  // Initial slide activation
  slides.forEach((s, i) => s.classList.toggle("active", i === idx));

  startTimer();

  // ==========================
  // Timer functions
  // ==========================
  function startTimer() {
    stopTimer();
    timer = window.setInterval(() => {
      goTo((idx + 1) % slides.length);
    }, 4500);
  }

  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = undefined;
  }

  function restartTimer() {
    stopTimer();
    startTimer();
  }

  // ==========================
  // Go to slide
  // ==========================
  function goTo(newIndex: number) {
    if (newIndex === idx) return;

    slides[idx].classList.remove("active");
    slides[newIndex].classList.add("active");

    idx = newIndex;

    // update dots
    if (dotsContainer) {
      const dots = Array.from(dotsContainer.children);
      dots.forEach((d, i) => {
        d.classList.toggle("active", i === idx);
      });
    }
  }

  // Cleanup on unmount
  return () => stopTimer();
}
