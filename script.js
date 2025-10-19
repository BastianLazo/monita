// Música y mensaje
const boton = document.getElementById("btnIniciar");
const mensaje = document.getElementById("mensaje");
const musica = document.getElementById("bg-music");

boton.addEventListener("click", () => {
  boton.style.display = "none";
  mensaje.classList.remove("oculto");
  musica.play();
});

// Corazones animados
const canvas = document.getElementById("corazones");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let corazones = [];

class Corazon {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.moveTo(this.x, this.y);
    ctx.bezierCurveTo(this.x + this.size / 2, this.y - this.size / 2,
                      this.x + this.size * 1.5, this.y + this.size / 3,
                      this.x, this.y + this.size);
    ctx.bezierCurveTo(this.x - this.size * 1.5, this.y + this.size / 3,
                      this.x - this.size / 2, this.y - this.size / 2,
                      this.x, this.y);
    ctx.fill();
  }

  update() {
    this.y -= this.speed;
    if (this.y < -10) {
      this.y = canvas.height + 10;
      this.x = Math.random() * canvas.width;
    }
    this.draw();
  }
}

for (let i = 0; i < 40; i++) {
  corazones.push(
    new Corazon(Math.random() * canvas.width, Math.random() * canvas.height, 20 + Math.random() * 10, 0.5 + Math.random())
  );
}

function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  corazones.forEach(c => c.update());
  requestAnimationFrame(animar);
}

animar();
