//playing with noise.js from Joseph Gentle
//https://github.com/josephg/noisejs

const randomBetween = (min, max) => ~~(Math.random() * (max - min + 1)) + min;
const canvas_parent = document.querySelector(".calculator_output");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const PI2 = Math.PI * 2;

// all set in `setStage`
let canvasWidth;
let canvasHeight;
let canvasMidX;
let canvasMidY;

let particles = [];

let rafId = null;
let timeoutId = null;
let automate = true;
let tick = 0;
let frame = 0;

noise.seed(Math.random());

class Particle {
  constructor(options) {
    const defaults = {
      x: 0,
      y: 0,
      radius: 10,
      direction: 0,
      velocity: 0,
      explode: false,
    };

    Object.assign(this, defaults, options);

    this.velX = Math.cos(this.direction) * this.velocity;
    this.velY = Math.sin(this.direction) * this.velocity;

    this.friction = 0.9;
    this.decay = randomBetween(90, 91) * 0.01;
    this.gravity = this.radius * 0.01;
  }

  update() {
    this.x += this.velX;
    this.y += this.velY;

    this.velX *= this.friction;
    this.velY *= this.friction;
    this.velocity *= this.friction;

    // uncomment for a gravity like effect
    // this.velY += this.gravity;

    this.radius *= this.decay;
    this.gravity += 0.05;
  }
}

const clear = () => {
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "hsla(0, 0%, 0%, 0.5)";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalCompositeOperation = "lighter";
};

const setStage = () => {
  clear();

  canvasWidth = canvas.getBoundingClientRect().width;
  canvasHeight = canvas.getBoundingClientRect().height;
  midX = canvasWidth >> 1;
  midY = canvasHeight >> 1;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
};

const createRandomParticles = () => {
  const margin = 0;
  const x = randomBetween(margin, canvasWidth - margin);
  const y = randomBetween(margin, canvasHeight - margin);
  createParticles(x, y);
};

const boom = (e) => {
  if (e.target.tagName !== "CANVAS") {
    const box = document
      .querySelector(".current_operand")
      .getBoundingClientRect();
    const parent_box = canvas_parent.getBoundingClientRect();
    createParticles(
      parent_box.width,
      box.top - parent_box.top + box.height * (1 / 2)
    );
    return;
  }
  const box = e.target.getBoundingClientRect();
  const x = e.pageX - box.left;
  const y = e.clientY - box.top;
  createParticles(x, y);
};

const createParticles = (x, y) => {
  let numParticles = 50;

  while (numParticles--) {
    const direction = Math.random() * PI2;
    const velocity = randomBetween(10, 20);
    const radius = 5 + Math.random() * 5;
    const explode = true;
    const particle = new Particle({
      x,
      y,
      direction,
      velocity,
      radius,
      explode,
    });

    particles.push(particle);
  }
};

const loop = () => {
  clear();

  if (automate && frame % 75 === 0) {
    // createRandomParticles();
  }

  particles.forEach((particle, index) => {
    // determine color
    const hue = noise.perlin2(tick, tick) * 360;
    const fill = `hsl(${hue}, 80%, 50%)`;

    // draw and update every existing particle
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.arc(particle.x, particle.y, particle.radius, 0, PI2);
    ctx.fill();
    ctx.closePath();

    // update particle's properties
    particle.update();

    // check if particle should explode and create new particles
    if (Math.abs(particle.radius) <= 2 && particle.explode) {
      particle.explode = false;
      let children = 1;

      while (children--) {
        particles.push(
          new Particle({
            x: particle.x,
            y: particle.y,
            radius: particle.radius * 1,
            direction: Math.random() * PI2,
            velocity: particle.velocity * randomBetween(1, 10),
            explode: false,
          })
        );
      }
    }

    if (particle.radius <= 0.1 || particle.velocity <= 0.1) {
      particles.splice(particles.indexOf(particle), 1);
    }
  });

  tick += 0.01;

  frame++;
  rafId = requestAnimationFrame(loop);
};
function isMobile() {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
}
if (isMobile()) {
  canvas.addEventListener("mousedown", boom);
} else {
  canvas.addEventListener("touchstart", boom);
}

window.addEventListener("resize", setStage);

canvas_parent.appendChild(canvas);

setStage();
// createRandomParticles();
loop();
