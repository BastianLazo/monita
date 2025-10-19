/* ------------- Contenido / Mensajes ------------- */
const textoBreve = "Desde que llegaste a mi vida todo tiene más color. Gracias por ser mi inspiración, mi refugio y mi fuerza. Te amo cada día más.";
const textoMedio  = "Amor, en estos tres años vivimos tanto que a veces parece un sueño. Me cambiaste la vida: me empujaste a mejorar, a creer en mí y a disfrutar cada pequeño momento. Cada día doy gracias por seguir a tu lado. Eres mi inspiración, mi calma y la aventura que elijo siempre. Gracias por hacerme sentir vivo.";
const textoLargo  = "Miamorsito, desde que entraste en mi mundo todo se transformó. Compartimos risas, momentos dificiles, besos, abrazos y un sin fin de emociones. Me enseñaste a ser mejor persona, a intentar aún cuando duela, y a valorar las pequeñas cosas que nos da la vida. Cada mañana doy gracias por tenerte; cada noche me duermo con el corazón tranquilo porque sé que estamos juntos, y para mi no hay nada más valioso que eso. Eres mi amorsito, mi esposita, mi tonota y mi mundo entero. Gracias por estos tres años y por cada día que viene. Te amito mas que a nada en el universo entero!.";

// por defecto uso el texto largo en la carta
document.addEventListener('DOMContentLoaded', () => {
  const p = document.getElementById('textoPrincipal');
  if(p) p.textContent = ''; // empieza vacío para efecto máquina de escribir
});

/* ------------- Carta animada ------------- */
const btnAbrir = document.getElementById('btnAbrir');
const cuerpo = document.getElementById('cuerpoCarta');
const carta = document.getElementById('carta');
const textoPrincipal = document.getElementById('textoPrincipal');

btnAbrir?.addEventListener('click', () => {
  btnAbrir.style.display = 'none';
  cuerpo.classList.remove('oculto');
  cuerpo.setAttribute('aria-hidden', 'false');

  // animación de leve apertura
  carta.style.transform = 'rotateY(5deg) translateY(-8px)';
  setTimeout(()=> carta.style.transform = 'none', 900);

  // efecto máquina de escribir
  let i = 0;
  function escribir() {
    if(i < textoLargo.length) {
      textoPrincipal.textContent += textoLargo[i];
      i++;
      setTimeout(escribir, 35); // velocidad letra por letra
    }
  }
  escribir();
});

/* ------------- Carrusel automático infinito ------------- */
const galeria = document.getElementById('galeria');
if (galeria) {
  // 1️⃣ Crear un track interno
  const track = document.createElement('div');
  track.classList.add('galeria-track');
  track.style.display = 'flex';
  track.style.gap = '14px';
  track.style.willChange = 'transform';

  // 2️⃣ Mover todas las fotos al track
  const fotosOriginales = Array.from(galeria.children);
  fotosOriginales.forEach(f => track.appendChild(f));

  // 3️⃣ Duplicar las fotos para efecto infinito
  fotosOriginales.forEach(f => track.appendChild(f.cloneNode(true)));

  // 4️⃣ Agregar track al contenedor
  galeria.innerHTML = '';
  galeria.appendChild(track);

  let pos = 0;
  const velocidad = 0.5; // px por frame

  function animCarrusel() {
    pos -= velocidad;
    const anchoTotal = track.scrollWidth / 2; // mitad porque duplicamos
    if (Math.abs(pos) >= anchoTotal) pos = 0;
    track.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(animCarrusel);
  }

  animCarrusel();
}

/* ------------- Botón sorpresa ------------- */
const btnSorpresa = document.getElementById('btnSorpresa');
const mensajeSorpresa = document.getElementById('mensajeSorpresa');

btnSorpresa?.addEventListener('click', () => {
  btnSorpresa.disabled = true;
  mensajeSorpresa.classList.remove('oculto');
  mensajeSorpresa.setAttribute('aria-hidden','false');

  // confetti
  lanzarConfetti(120);

  // vibración suave visual
  setTimeout(()=> {
    mensajeSorpresa.style.transform = 'scale(1.02)';
    setTimeout(()=> mensajeSorpresa.style.transform = 'none', 420);
  }, 160);
});

/* ------------- Canvas: corazones + confetti + gatos ------------- */
const canvas = document.getElementById('efectos');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });

// Partícula genérica
class Part {
  constructor(x,y,vx,vy,size,shape,life,color,rot=0){
    this.x=x;this.y=y;this.vx=vx;this.vy=vy;this.size=size;this.shape=shape;this.life=life;this.color=color;this.rot=rot;
  }
  step(){
    this.x += this.vx; this.y += this.vy;
    this.vy += 0.01;
    this.rot += 0.04;
    this.life -= 1;
    if(this.y > H + 80) this.life = 0;
  }
  draw(ctx){
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    if(this.shape === 'heart'){
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.moveTo(0, -this.size/2);
      ctx.bezierCurveTo(this.size/2, -this.size*1.1, this.size*1.2, this.size/3, 0, this.size);
      ctx.bezierCurveTo(-this.size*1.2, this.size/3, -this.size/2, -this.size*1.1, 0, -this.size/2);
      ctx.fill();
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size*1.2);
    }
    ctx.restore();
  }
}

let parts = [];

// corazones flotando
for(let i=0;i<36;i++){
  parts.push(new Part(Math.random()*W, H + Math.random()*H, (Math.random()-0.5)*0.4, - (0.4 + Math.random()*1.2), 8 + Math.random()*10, 'heart', 999, 'rgba(255,255,255,0.9)', Math.random()*0.6));
}

// pequeños gatos ornamentales
function crearGatos(count=6){
  for(let i=0;i<count;i++){
    parts.push(new Part(Math.random()*W, H + Math.random()*H, (Math.random()-0.5)*0.25, - (0.2 + Math.random()*0.5), 10 + Math.random()*10, 'heart', 999, 'rgba(255,255,255,0.85)', Math.random()*0.6));
  }
}
crearGatos(6);

function anim(){
  ctx.clearRect(0,0,W,H);
  for(let i=parts.length-1;i>=0;i--){
    const p = parts[i];
    p.step();
    p.draw(ctx);
    if(p.life <= 0) parts.splice(i,1);
  }
  requestAnimationFrame(anim);
}
anim();

function lanzarConfetti(count=80){
  const colors = ['#d97198','#ffd166','#9ad1ff','#caa2ff','#ffffff'];
  for(let i=0;i<count;i++){
    const x = W/2 + (Math.random()-0.5)*300;
    const y = H/2 + (Math.random()-0.5)*200;
    const vx = (Math.random()-0.5)*6;
    const vy = - (2 + Math.random()*6);
    const size = 6 + Math.random()*12;
    const color = colors[Math.floor(Math.random()*colors.length)];
    parts.push(new Part(x,y,vx,vy,size,'rect', 160 + Math.random()*120, color, Math.random()*1.2));
  }
}

/* fin de script */
