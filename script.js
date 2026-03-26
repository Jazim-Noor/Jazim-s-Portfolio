const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
const cursorGlow = document.querySelector(".cursor-glow");
const yearEl = document.getElementById("year");

let width = 0;
let height = 0;
let stars = [];
let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

const createStars = () => {
  stars = Array.from({ length: Math.max(100, Math.floor(width * 0.08)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    z: Math.random() * 1.2 + 0.2,
    radius: Math.random() * 1.8 + 0.5,
  }));
};

const resize = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  createStars();
};

const draw = () => {
  ctx.clearRect(0, 0, width, height);

  for (const star of stars) {
    const driftX = ((pointer.x - width / 2) / width) * 18 * star.z;
    const driftY = ((pointer.y - height / 2) / height) * 18 * star.z;

    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${0.25 + star.z * 0.45})`;
    ctx.arc(star.x + driftX, star.y + driftY, star.radius * star.z, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
};

const move3DSections = () => {
  const sections = document.querySelectorAll(".section-3d");
  const cx = (pointer.x - width / 2) / width;
  const cy = (pointer.y - height / 2) / height;

  sections.forEach((section) => {
    const depth = Number(section.dataset.depth || 6);
    const tx = cx * depth;
    const ty = cy * depth;
    section.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
  });
};

const setupTiltCards = () => {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const rx = ((event.clientY - rect.top) / rect.height - 0.5) * -10;
      const ry = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    });
  });
};

window.addEventListener("pointermove", (event) => {
  pointer = { x: event.clientX, y: event.clientY };
  cursorGlow.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
  move3DSections();
});

window.addEventListener("resize", resize);

yearEl.textContent = new Date().getFullYear();
setupTiltCards();
resize();
draw();
