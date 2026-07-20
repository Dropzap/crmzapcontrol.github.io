const sliders = document.querySelectorAll("[data-slider]");

sliders.forEach((slider) => {
  const slides = Array.from(slider.querySelectorAll(".slide-card"));
  const dots = Array.from(slider.querySelectorAll("[data-slide-dot]"));
  const prev = slider.querySelector("[data-slide-prev]");
  const next = slider.querySelector("[data-slide-next]");
  const play = slider.querySelector("[data-slide-play]");
  const playLabel = slider.querySelector("[data-slide-play-label]");
  let current = 0;
  let playing = true;
  let timer;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === current);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  };

  const stopTimer = () => {
    if (timer) {
      window.clearInterval(timer);
    }
  };

  const startTimer = () => {
    stopTimer();
    timer = window.setInterval(() => showSlide(current + 1), 3600);
  };

  const setPlaying = (value) => {
    playing = value;
    slider.classList.toggle("is-playing", playing);
    if (play) {
      play.setAttribute("aria-label", playing ? "Pausar apresentação" : "Reproduzir apresentação");
    }
    if (playLabel) {
      playLabel.textContent = playing ? "Pausar" : "Reproduzir";
    }
    if (playing) {
      startTimer();
    } else {
      stopTimer();
    }
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      if (playing) startTimer();
    });
  });

  prev?.addEventListener("click", () => {
    showSlide(current - 1);
    if (playing) startTimer();
  });

  next?.addEventListener("click", () => {
    showSlide(current + 1);
    if (playing) startTimer();
  });

  play?.addEventListener("click", () => setPlaying(!playing));

  showSlide(0);
  setPlaying(true);
});
