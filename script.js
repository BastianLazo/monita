// ========== Contenido dinámico (mensaje) ==========
const textoBreve = "Desde que llegaste a mi vida todo tiene más color. Gracias por ser mi inspiración, mi refugio y mi fuerza. Te amo cada día más.";
const textoMedio  = "Amor, en estos tres años vivimos tanto que a veces parece un sueño. Me cambiaste la vida: me empujaste a mejorar, a creer en mí y a disfrutar cada pequeño momento. Cada día doy gracias por seguir a tu lado. Eres mi inspiración, mi calma y la aventura que elijo siempre. Gracias por hacerme sentir vivo.";
const textoLargo  = "Amor mío, desde que entraste en mi mundo todo se transformó. Compartimos risas, desafíos, abrazos y silencios que hablan. Me enseñaste a ser mejor persona, a intentar aún cuando duela, y a valorar las pequeñas victorias. Cada mañana doy gracias por tenerte; cada noche me duermo con el corazón tranquilo porque sé que estamos juntos. Eres mi musa, mi compañera, mi hogar. Gracias por estos tres años y por cada día que viene. Te amo con todo mi ser.";

// Inserta el texto elegido (aquí pongo el texto medio por defecto; cámbialo si quieres)
document.addEventListener('DOMContentLoaded', () => {
  const p = document.getElementById('textoPrincipal');
  p.textContent = textoMedio;
});

// ========== Carta animada ==========
const btnAbrir = document.getElementById('btnAbrir');
const cuerpo = document.getElementById('cuerpoCarta');
const carta = document.getElementById('carta');

btnAbrir.addEventListener('click', () => {
  btnAbrir.style.display = 'none';
  cuerpo.classList.remove('oculto');

  // pequeño "flip" y sombra
  carta.style.transform = 'rotateY(4deg) translateY(-6px)';
  setTimeout(()=> carta.style.transform = 'none', 900);

  // reproducir spotify: no se puede forzar play en iframe; el usuario puede darle play si el navegador bloquea autoplay
});

// ========== Galería animada (simple loop) ==========
const galeria = document.getElementById('galeria');
let fotos = Array.from(galeria.children);
let index = 0;

function rotarGaleria(){
  // efecto: escala la foto central
  fotos.forEach((f,i) => {
    f.style.transform = 'scale(0.94)';
    f.style.opacity = '0.85';
  });
  const centr = fotos[index % fotos.length];
  centr.style.transform = 'scale(1.06)';
  centr.style.opacity = '1';
  index++;
}
rotarGaleria();
setInterval(rotarGaleria, 3000);

// ========== Botón sorpresa ==========
const btnSorpresa = document.getElementById('btnSorpresa');
const mensajeSorpresa = document.getElementById('mensajeSorpresa');

btnSorpresa.addEventListener('click', () => {
  btnSorpresa.disabled = true;
  mensajeSorpresa.classList.remove('oculto');

  // lanzar confetti simple
  lanzarConfetti(120);
  // pequeña vibración visual
  setTimeout(()=> {
    mensajeSorpresa.style.transform = 'scale(1.02)';
    setTimeout(()=> mensajeSorpresa.style.transform = 'none', 400);
  }, 150);
});

// ========== Canvas para corazones + confetti ==========
const canvas = document.getElementById('efectos');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

// Partículas (usadas tanto para corazones como confetti)
class Part {
  constructor(x,y,vx,vy,size,shape,life,color){
    this.x=x;this.y=y;this.vx=vx;this.vy=vy;this.size=size;this.shape=shape;this.life=life;this.color=color;
  }
  step(){
    this.x+=this.vx; this.y+=this.vy;
    this.vy += 0.01; // gravedad leve
    this.life -= 1;
    // bounds wrap
    if(this.x < -50) this.x = W+50;
    if(this.x > W+50) this.x = -50;
    if(this.y > H + 80) this.life = 0;
  }
  draw(ctx){
    ctx.save();
    ctx.translate(this.x, this.y);
    if(this.shape === 'heart'){
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.moveTo(0, -this.size/2);
      ctx.bezierCurveTo(this.size/2, -this.size*1.1, this.size*1.2, this.size/3, 0, this.size);
      ctx.bezierCurveTo(-this.size*1.2, this.size/3, -this.size/2, -this.size*1.1, 0, -this.size/2);
      ctx.fill();
    } else {
      // confetti as rectangles
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size*1.2);
    }
    ctx.restore();
  }
}

let parts = [];

// generar corazones flotando suavemente
for(let i=0;i<30;i++){
  parts.push(new Part(Math.random()*W, H + Math.random()*H, (Math.random()-0.5)*0.3, - (0.3 + Math.random()*1.2), 8 + Math.random()*10, 'heart', 999, 'rgba(255,255,255,0.9)'));
}

function anim(){
  ctx.clearRect(0,0,W,H);
  parts.forEach((p,i)=>{
    p.step();
    p.draw(ctx);
    if(p.life <= 0) parts.splice(i,1);
  });
  requestAnimationFrame(anim);
}
anim();

// Confetti launcher
function lanzarConfetti(count=80){
  const colors = ['#ff7aa2','#ffd166','#9ad1ff','#caa2ff','#ffffff'];
  for(let i=0;i<count;i++){
    const x = W/2 + (Math.random()-0.5)*200;
    const y = H/2 + (Math.random()-0.5)*80;
    const vx = (Math.random()-0.5)*6;
    const vy = - (2 + Math.random()*6);
    const size = 6 + Math.random()*10;
    const color = colors[Math.floor(Math.random()*colors.length)];
    parts.push(new Part(x,y,vx,vy,size,'rect', 160 + Math.random()*120, color));
  }
}

// pequeños gatos flotando (ornamentos)
function crearGatos(count=6){
  for(let i=0;i<count;i++){
    const x = Math.random()*W;
    const y = Math.random()*H;
    const vx = (Math.random()-0.5)*0.4;
    const vy = - (0.2 + Math.random()*0.6);
    const size = 12 + Math.random()*18;
    const color = 'rgba(255,255,255,0.85)';
    parts.push(new Part(x,y,vx,vy,size,'heart',999,color)); // reutilizo forma heart como placeholder
  }
}
crearGatos(5);

// ========== extra: prevenir comportamiento incómodo en móviles ==========
document.addEventListener('visibilitychange', () => {
  // opcional: pausar animaciones intensas si necesitamos
});
