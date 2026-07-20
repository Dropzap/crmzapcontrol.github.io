const header = document.querySelector("#siteHeader");
const mobileToggle = document.querySelector(".mobile-toggle");
const navLinks = document.querySelectorAll(".nav-menu a");
const revealItems = document.querySelectorAll(".reveal");
const form = document.querySelector("#contactForm");
const formMessage = document.querySelector(".form-message");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

mobileToggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-open");
  mobileToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("menu-open");
    mobileToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => revealObserver.observe(item));

document.querySelectorAll(".faq-list details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll(".faq-list details").forEach((item) => {
      if (item !== detail) item.removeAttribute("open");
    });
  });
});

const slider = document.querySelector("[data-slider]");
const slides = slider ? Array.from(slider.querySelectorAll(".slide")) : [];
const dotsContainer = slider?.querySelector(".slider-dots");
const prevButton = document.querySelector("[data-prev]");
const nextButton = document.querySelector("[data-next]");
const playButton = document.querySelector("[data-play]");
let currentSlide = 0;
let slideTimer = null;

const setSlide = (index) => {
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === currentSlide);
  });
  dotsContainer?.querySelectorAll("button").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentSlide);
  });
};

const stopSlides = () => {
  clearInterval(slideTimer);
  slideTimer = null;
  if (playButton) playButton.textContent = "Reproduzir";
};

const playSlides = () => {
  if (slideTimer) {
    stopSlides();
    return;
  }
  if (playButton) playButton.textContent = "Pausar";
  slideTimer = setInterval(() => setSlide(currentSlide + 1), 2800);
};

slides.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Ir para o slide ${index + 1}`);
  dot.addEventListener("click", () => {
    stopSlides();
    setSlide(index);
  });
  dotsContainer?.appendChild(dot);
});

prevButton?.addEventListener("click", () => {
  stopSlides();
  setSlide(currentSlide - 1);
});

nextButton?.addEventListener("click", () => {
  stopSlides();
  setSlide(currentSlide + 1);
});

playButton?.addEventListener("click", playSlides);
setSlide(0);

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const requiredFields = ["nome", "empresa", "email", "telefone", "atendentes", "mensagem"];
  const hasEmpty = requiredFields.some((field) => !String(data.get(field) || "").trim());
  const email = String(data.get("email") || "");
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  formMessage.className = "form-message";

  if (hasEmpty) {
    formMessage.classList.add("error");
    formMessage.textContent = "Preencha todos os campos para enviar sua solicitação.";
    return;
  }

  if (!validEmail) {
    formMessage.classList.add("error");
    formMessage.textContent = "Informe um e-mail válido para nossa equipe retornar.";
    return;
  }

  const whatsappText = encodeURIComponent(
    `Olá! Vim pelo site do Zap Control e gostaria de uma demonstração.\n\nNome: ${data.get("nome")}\nEmpresa: ${data.get("empresa")}\nE-mail: ${data.get("email")}\nTelefone: ${data.get("telefone")}\nQuantidade de atendentes: ${data.get("atendentes")}\nMensagem: ${data.get("mensagem")}`
  );

  formMessage.classList.add("success");
  formMessage.textContent = "Tudo certo. Vamos abrir o WhatsApp com sua solicitação preenchida.";
  window.open(`https://wa.me/5527989001165?text=${whatsappText}`, "_blank", "noopener,noreferrer");
  form.reset();
});
