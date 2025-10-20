/* ------------- Contenido / Mensajes ------------- */
const textoLargo  = "Miamorsito, desde que entraste en mi mundo todo se transformó. Compartimos risas, momentos difíciles, besos, abrazos y un sin fin de emociones. Me enseñaste a ser mejor persona, a intentar aún cuando duela, y a valorar las pequeñas cosas que nos da la vida. Cada mañana doy gracias por tenerte; cada noche me duermo con el corazón tranquilo porque sé que estamos juntos, y para mí no hay nada más valioso que eso. Eres mi amorsito, mi esposita, mi tonota y mi mundo entero. Gracias por estos tres años y por cada día que viene. ¡Te amito más que a nada en el universo entero!.";

/* ------------- Carta animada ------------- */
const btnAbrir = document.getElementById('btnAbrir');
const cuerpo = document.getElementById('cuerpoCarta');
const carta = document.getElementById('carta');
const textoPrincipal = document.getElementById('textoPrincipal');

btnAbrir?.addEventListener('click', () => {
  btnAbrir.style.display = 'none';
  cuerpo.classList.remove('oculto');
  cuerpo.setAttribute('aria-hidden', 'false');
  carta.style.transform = 'rotateY(5deg) translateY(-8px)';
  setTimeout(()=> carta.style.transform = 'none', 900);

  // efecto máquina de escribir
  let i = 0;
  function escribir() {
    if(i < textoLargo.length) {
      textoPrincipal.textContent += textoLargo[i];
      i++;
      setTimeout(escribir, 35);
    }
  }
  escribir();
});

/* ------------- Carrusel automático infinito ------------- */
const galeria = document.getElementById('galeria');
if (galeria) {
  const track = document.createElement('div');
  track.classList.add('galeria-track');
  track.style.display = 'flex';
  track.style.gap = '14px';
  track.style.willChange = 'transform';

  const fotosOriginales = Array.from(galeria.children);
  fotosOriginales.forEach(f => track.appendChild(f));
  fotosOriginales.forEach(f => track.appendChild(f.cloneNode(true)));

  galeria.innerHTML = '';
  galeria.appendChild(track);

  let pos = 0;
  const velocidad = 0.4;

  function animCarrusel() {
    pos -= velocidad;
    const anchoTotal = track.scrollWidth / 2;
    if (Math.abs(pos) >= anchoTotal) pos = 0;
    track.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(animCarrusel);
  }
  animCarrusel();
}

/* ------------- Botón sorpresa con imagen y poemas animados ------------- */
btnSorpresa?.addEventListener('click', () => {
  btnSorpresa.disabled = true;

  mensajeSorpresa.classList.remove('oculto');
  mensajeSorpresa.setAttribute('aria-hidden','false');

  mensajeSorpresa.innerHTML = `
    <div class="sorpresa-contenido" style="opacity:0; transform:scale(0.9); transition:all 0.4s ease;">
      <div class="silueta"></div>
      <h2 class="mensaje-central">“No importa cuántas vidas pasen, siempre te elegiría a ti.”</h2>
      <img src="assets/foto12.jpg" alt="Sorpresa ❤️" style="max-width:100%; border-radius:16px; margin-top:14px; box-shadow:0 8px 30px rgba(255,255,255,0.4);" />
      <div class="poemas" style="margin-top:12px; font-size:1.05rem; opacity:0; transition:opacity 0.5s;"></div>
      <button id="btnCerrarSorpresa" class="btn-cerrar-sorpresa" style="margin-top:12px;">Cerrar 💖</button>
    </div>
  `;

  const contenido = mensajeSorpresa.querySelector('.sorpresa-contenido');

  // Animación de aparición suave del contenedor
  setTimeout(() => {
    contenido.style.opacity = 1;
    contenido.style.transform = 'scale(1)';

    // Llamar a la función de poemas **después de que el contenedor exista**
    mostrarPoemasSecuencia();
  }, 50);

  lanzarCorazones(80);

  // Botón cerrar
  const btnCerrar = document.getElementById('btnCerrarSorpresa');
  btnCerrar.addEventListener('click', () => {
    mensajeSorpresa.classList.add('oculto');
    mensajeSorpresa.setAttribute('aria-hidden','true');
    btnSorpresa.disabled = false;
  });
});

/* ------------- Poemas dinámicos con fade-in/fade-out ------------- */
const poemas = [
  "Eres mi refugio cuando todo se apaga, mi calma en medio del ruido.",
  "Tu risa es la melodía que no quiero dejar de escuchar.",
  "En tus ojos encuentro todos mis destinos posibles.",
  "Cada abrazo tuyo me recuerda que el amor sí existe.",
  "Si alguna vez renazco, que sea para volver a encontrarte."
];

function mostrarPoemasSecuencia(){
  const contenedor = document.querySelector('.poemas');
  if(!contenedor) return;
  let index = 0;

  function mostrar(){
    // Fade-out del poema anterior
    contenedor.style.opacity = 0;

    setTimeout(() => {
      // Cambiar texto y fade-in
      contenedor.textContent = poemas[index];
      contenedor.style.opacity = 1;

      index = (index + 1) % poemas.length;

      // Espera antes de mostrar siguiente
      setTimeout(mostrar, 3500); // 3.5 segundos por poema
    }, 500); // duración del fade-out
  }

  mostrar();
}




/* ------------- Canvas y corazones ------------- */
const canvas = document.getElementById('efectos');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', () => { 
  W = canvas.width = window.innerWidth; 
  H = canvas.height = window.innerHeight; 
});

class Part {
  constructor(x,y,vx,vy,size,shape,life,color,rot=0){
    this.x=x;this.y=y;this.vx=vx;this.vy=vy;
    this.size=size;this.shape=shape;this.life=life;
    this.color=color;this.rot=rot;
  }
  step(){
    this.x += this.vx; this.y += this.vy;
    this.vy += 0.01; this.rot += 0.04; this.life -= 1;
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

function lanzarCorazones(cantidad=60){
  for(let i=0;i<cantidad;i++){
    parts.push(new Part(
      Math.random()*W, H + Math.random()*H, 
      (Math.random()-0.5)*0.6, - (0.6 + Math.random()*1.8), 
      10 + Math.random()*10, 'heart', 900, 
      'rgba(255,192,203,0.9)', Math.random()*0.6)
    );
  }
}

function anim(){
  ctx.clearRect(0,0,W,H);
  for(let i=parts.length-1;i>=0;i--){
    const p = parts[i];
    p.step(); p.draw(ctx);
    if(p.life <= 0) parts.splice(i,1);
  }
  requestAnimationFrame(anim);
}
anim();


/* fin de script */
