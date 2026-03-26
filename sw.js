<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Palabra del Padre</title>

<!-- Bootstrap Icons -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">

<!-- Manifest -->
<link rel="manifest" href="manifest.json">

<style>
body{
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(to right, #f5f7fa, #c3cfe2);
  margin:0;
  padding:0;
}

/* Botones premium y donar */
.top-bar, .bottom-bar{
  display:flex;
  justify-content: center;
  gap:10px;
  padding:10px;
}
.top-bar button, .bottom-bar button{
  padding:10px 20px;
  border:none;
  border-radius:20px;
  cursor:pointer;
  font-weight:bold;
  color:white;
}
.top-bar button{background:#4f46e5;}
.bottom-bar button{background:#f59e0b;}

/* Cards container */
#cardsContainer{
  display:grid;
  grid-template-columns: repeat(auto-fit,minmax(250px,1fr));
  gap:15px;
  padding:15px;
}

/* Cards */
.card{
  background: rgba(255,255,255,0.05);
  padding:20px;
  border-radius:20px;
  backdrop-filter: blur(10px);
  box-shadow:0 10px 20px rgba(0,0,0,0.3);
  cursor:pointer;
  transition: transform 0.4s ease, box-shadow 0.4s ease, background 0.4s ease;
  position:relative;
  overflow:hidden;
}

.card.expanded{
  transform: scale(1.05);
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
  z-index:10;
}

/* Card content */
.card h3{margin-top:0;}
.card .versiculo{
  font-style:italic;
  margin-bottom:5px;
  font-weight:bold;
}
.card .reflexion{margin-bottom:10px;}

/* Card actions horizontal */
.card-actions{
  display:none;
  gap:10px;
  margin-top:10px;
  opacity:0;
  transition: opacity 0.4s ease;
  flex-direction:row;
}

.card.expanded .card-actions{
  display:flex;
  opacity:1;
}

.card-actions a{
  width:40px;
  height:40px;
  display:flex;
  justify-content:center;
  align-items:center;
  border-radius:50%;
  background: rgba(0,0,0,0.4);
  color:white;
  font-size:20px;
  transition: transform 0.3s ease, background 0.3s ease;
}

.card-actions a:hover{
  transform: scale(1.2);
  background: rgba(0,0,0,0.7);
}

/* Categorías */
.ansiedad{ background: rgba(59,130,246,0.3);}
.tentacion{ background: rgba(239,68,68,0.3);}
.motivacion{ background: rgba(16,185,129,0.3);}
.caridad{ background: rgba(234,179,8,0.3);}
.confianza{ background: rgba(139,92,246,0.3);}
</style>
</head>
<body>

<!-- Top Premium Button -->
<div class="top-bar">
  <button onclick="window.location.href='https://m.me/tuPaginaMessenger'">Premium</button>
</div>

<!-- Cards -->
<div id="cardsContainer"></div>

<!-- Bottom Donate Button -->
<div class="bottom-bar">
  <button onclick="window.open('https://www.paypal.com/donate?hosted_button_id=XXXXX','_blank')">Donar</button>
</div>

<!-- Install Button -->
<div style="position:fixed;bottom:80px;right:20px;">
  <button id="installBtn" style="padding:10px 20px;border:none;border-radius:20px;background:#10b981;color:white;cursor:pointer;">Instalar App</button>
</div>

<script>
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt',(e)=>{
  e.preventDefault();
  deferredPrompt=e;
  installBtn.style.display='block';
});

installBtn.addEventListener('click', async ()=>{
  if(deferredPrompt){
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if(choice.outcome==='accepted'){
      console.log('App instalada');
    }
    deferredPrompt=null;
    installBtn.style.display='none';
  }
});

// Cards container
const cardsContainer=document.getElementById('cardsContainer');

// Ejemplo de contenido
const contenido=[
  {
    categoria:'ansiedad',
    titulo:'No tengas miedo',
    versiculo:'Filipenses 4:6-7',
    cita:'No se inquieten por nada; más bien, en toda ocasión, con oración y ruego, presenten sus peticiones a Dios y denle gracias.',
    reflexion:'Confía en Dios y deja tus preocupaciones en sus manos.'
  },
  {
    categoria:'tentacion',
    titulo:'Resiste la tentación',
    versiculo:'1 Corintios 10:13',
    cita:'No les ha sobrevenido ninguna tentación que no sea humana; pero fiel es Dios, que no permitirá que ustedes sean tentados más allá de lo que puedan resistir.',
    reflexion:'Recuerda que Dios te da la fuerza para superar cualquier tentación.'
  },
  {
    categoria:'motivacion',
    titulo:'Actúa con bondad',
    versiculo:'Gálatas 6:9',
    cita:'No nos cansemos de hacer el bien, porque a su debido tiempo cosecharemos si no nos damos por vencidos.',
    reflexion:'Cada acto de bondad te acerca más a Dios y ayuda a los demás.'
  },
  {
    categoria:'caridad',
    titulo:'Ayuda a otros',
    versiculo:'Mateo 25:40',
    cita:'De cierto les digo que todo lo que hicieron por uno de estos mis hermanos más pequeños, a mí me lo hicieron.',
    reflexion:'Hacer caridad es servir a Dios directamente.'
  },
  {
    categoria:'confianza',
    titulo:'Confía en el Señor',
    versiculo:'Proverbios 3:5-6',
    cita:'Confía en el Señor con todo tu corazón y no te apoyes en tu propia prudencia.',
    reflexion:'Ríndete a Dios y Él guiará tus caminos.'
  }
];

// Mostrar cards
function mostrarCards(items){
  cardsContainer.innerHTML='';
  items.forEach(c=>{
    const div=document.createElement('div');
    div.className=`card ${c.categoria}`;
    div.innerHTML=`
      <h3>${c.titulo}</h3>
      <div class="versiculo">${c.versiculo}</div>
      <div class="cita">${c.cita}</div>
      <div class="reflexion">${c.reflexion}</div>
      <div class="card-actions">
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}" target="_blank" title="Compartir en Facebook"><i class="bi bi-facebook"></i></a>
        <a href="https://www.instagram.com/" target="_blank" title="Compartir en Instagram"><i class="bi bi-instagram"></i></a>
        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(c.cita+' - '+c.reflexion)}" target="_blank" title="Compartir en WhatsApp"><i class="bi bi-whatsapp"></i></a>
      </div>
    `;
    div.addEventListener('click', ()=>{
      document.querySelectorAll('.card').forEach(c=>c.classList.remove('expanded'));
      div.classList.toggle('expanded');
    });
    cardsContainer.appendChild(div);
  });
}

mostrarCards(contenido);

// Registrar Service Worker
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./sw.js')
  .then(()=>console.log('SW registrado'))
  .catch(e=>console.log('Error SW:', e));
}
</script>
</body>
</html>
