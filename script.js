let currentColor = 'red';
let heartCount = 1;
let scene, camera, renderer, jersey3DModel, stadiumScene, stadiumCamera, stadiumRenderer;
let stadiumRotation = 0;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔴🟡 Club Atlético Grau - Website Loaded! 🔴🟡');
    
    if (document.getElementById('jersey3D')) {
        initHeroJersey3D();
    }
    
    if (document.getElementById('stadium3D')) {
        initStadium3D();
    }
 
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    preloadImages();
});

function preloadImages() {
    const imagesToPreload = [
        'img/camiseta-grau-roja.png',
        'img/nueva-camiseta-blanca.jpg',
        'img/estadio-miguel-grau-real.jpg',
        'img/estadio/estado-actual-2026.jpg',
        'img/estadio/render-3d-proyecto.jpg',
        'img/escudos/atletico-grau.png',
        'img/escudos/alianza-lima.png'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

function initHeroJersey3D() {
    const canvas = document.getElementById('jersey3D');
    if (!canvas) return;
    
    try {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(canvas.width, canvas.height);
        
        const jerseyGroup = createJerseyMesh();
        scene.add(jerseyGroup);
 
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        
        camera.position.z = 8;
        camera.position.y = 2;
  
        function animateHeroJersey() {
            requestAnimationFrame(animateHeroJersey);
            jerseyGroup.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        animateHeroJersey();
    } catch (error) {
        console.warn('3D Jersey not available, showing fallback image');
        showJerseyFallback();
    }
}

function showJerseyFallback() {
    const container = document.querySelector('.hero-jersey');
    if (container) {
        const canvas = document.getElementById('jersey3D');
        if (canvas) canvas.style.display = 'none';
        
        const img = document.createElement('img');
        img.src = 'img/camiseta-grau-real.png';
        img.alt = 'Camiseta oficial del Club Atlético Grau';
        img.className = 'jersey-real-image';
        container.appendChild(img);
    }
}

function createJerseyMesh() {
    const jerseyGroup = new THREE.Group();

    const bodyGeometry = new THREE.BoxGeometry(3, 4, 0.3);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    jerseyGroup.add(body);

    const stripeGeometry = new THREE.BoxGeometry(0.6, 4, 0.31);
    const redMaterial = new THREE.MeshPhongMaterial({ color: 0xC8102E });
    
    for (let i = -1; i <= 1; i++) {
        if (i === 0) continue; 
        const stripe = new THREE.Mesh(stripeGeometry, redMaterial);
        stripe.position.x = i * 1.2;
        jerseyGroup.add(stripe);
    }

    const yellowMaterial = new THREE.MeshPhongMaterial({ color: 0xFDB913 });
    for (let i = -0.5; i <= 0.5; i++) {
        const stripe = new THREE.Mesh(stripeGeometry, yellowMaterial);
        stripe.position.x = i * 2.4;
        jerseyGroup.add(stripe);
    }

    const collarGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.3, 32);
    const collarMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const collar = new THREE.Mesh(collarGeometry, collarMaterial);
    collar.position.y = 2.2;
    collar.rotation.x = Math.PI / 2;
    jerseyGroup.add(collar);

    const numberGeometry = new THREE.PlaneGeometry(1.5, 2);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#C8102E';
    ctx.font = 'bold 200px "Bebas Neue", Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('10', 128, 128);
    
    const texture = new THREE.CanvasTexture(canvas);
    const numberMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
    const number = new THREE.Mesh(numberGeometry, numberMaterial);
    number.position.z = 0.16;
    number.position.y = 0.3;
    jerseyGroup.add(number);
    
    return jerseyGroup;
}

// === FUNCIONES DEL ESTADIO 3D (INTACTAS) ===
function initStadium3D() {
    const canvas = document.getElementById('stadium3D');
    if (!canvas) return;
    
    try {
        stadiumScene = new THREE.Scene();
        stadiumScene.background = new THREE.Color(0x1a1a1a);
        
        stadiumCamera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
        stadiumRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        stadiumRenderer.setSize(canvas.width, canvas.height);
        
        const stadium = createStadiumMesh();
        stadiumScene.add(stadium);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        stadiumScene.add(ambientLight);
        
        const spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(0, 20, 0);
        stadiumScene.add(spotLight);
        
        stadiumCamera.position.set(15, 10, 15);
        stadiumCamera.lookAt(0, 0, 0);

        function animateStadium() {
            requestAnimationFrame(animateStadium);
            stadium.rotation.y = stadiumRotation;
            stadiumRenderer.render(stadiumScene, stadiumCamera);
        }
        animateStadium();
    } catch (error) {
        console.warn('3D Stadium not available, showing fallback image');
        showStadiumFallback();
    }
}

function showStadiumFallback() {
    const container = document.querySelector('.stadium-viewer');
    if (container) {
        const canvas = document.getElementById('stadium3D');
        if (canvas) canvas.style.display = 'none';
        
        const fallbackImg = document.querySelector('.stadium-fallback-img');
        if (fallbackImg) {
            fallbackImg.style.display = 'block';
            fallbackImg.src = 'img/estadio/estadio-3d-fallback.jpg';
        }
    }
}

function createStadiumMesh() {
    const stadiumGroup = new THREE.Group();

    const fieldGeometry = new THREE.PlaneGeometry(10, 15);
    const fieldMaterial = new THREE.MeshPhongMaterial({ color: 0x2d5016, side: THREE.DoubleSide });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.rotation.x = -Math.PI / 2;
    stadiumGroup.add(field);
 
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    const points = [
        new THREE.Vector3(-5, 0.01, 0),
        new THREE.Vector3(5, 0.01, 0)
    ];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const centerLine = new THREE.Line(lineGeometry, lineMaterial);
    stadiumGroup.add(centerLine);

    const circlePoints = [];
    const radius = 2;
    for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        circlePoints.push(new THREE.Vector3(Math.cos(angle) * radius, 0.01, Math.sin(angle) * radius));
    }
    const circleGeometry = new THREE.BufferGeometry().setFromPoints(circlePoints);
    const circle = new THREE.LineLoop(circleGeometry, lineMaterial);
    stadiumGroup.add(circle);

    const standMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });

    const northStand = new THREE.Mesh(new THREE.BoxGeometry(12, 3, 2), standMaterial);
    northStand.position.set(0, 1.5, -8);
    stadiumGroup.add(northStand);

    const southStand = new THREE.Mesh(new THREE.BoxGeometry(12, 3, 2), standMaterial);
    southStand.position.set(0, 1.5, 8);
    stadiumGroup.add(southStand);

    const eastStand = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 15), standMaterial);
    eastStand.position.set(6, 1.5, 0);
    stadiumGroup.add(eastStand);

    const westStand = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 15), standMaterial);
    westStand.position.set(-6, 1.5, 0);
    stadiumGroup.add(westStand);

    const accentGeometry = new THREE.BoxGeometry(12, 0.3, 2);
    const accentMaterial = new THREE.MeshPhongMaterial({ color: 0xC8102E });
    const accent = new THREE.Mesh(accentGeometry, accentMaterial);
    accent.position.set(0, 3, -8);
    stadiumGroup.add(accent);

    const yellowAccent = new THREE.Mesh(accentGeometry, new THREE.MeshPhongMaterial({ color: 0xFDB913 }));
    yellowAccent.position.set(0, 0.3, -8);
    stadiumGroup.add(yellowAccent);

    const postGeometry = new THREE.CylinderGeometry(0.1, 0.1, 6, 8);
    const postMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    
    const positions = [
        { x: 7, z: -9 },
        { x: -7, z: -9 },
        { x: 7, z: 9 },
        { x: -7, z: 9 }
    ];
    
    positions.forEach(pos => {
        const post = new THREE.Mesh(postGeometry, postMaterial);
        post.position.set(pos.x, 3, pos.z);
        stadiumGroup.add(post);

        const lightGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xFDB913, emissive: 0x332200 });
        const lightFixture = new THREE.Mesh(lightGeometry, lightMaterial);
        lightFixture.position.set(pos.x, 6, pos.z);
        stadiumGroup.add(lightFixture);
    });
    
    return stadiumGroup;
}

function rotateStadium(direction) {
    const step = 0.2;
    if (direction === 'left') {
        stadiumRotation -= step;
    } else if (direction === 'right') {
        stadiumRotation += step;
    }
}

function resetStadiumView() {
    stadiumRotation = 0;
}

// === NUEVO PERSONALIZADOR 2D (solo esto cambia) ===
function openCustomizer() {
    const modal = document.getElementById('customizerModal');
    if (!modal) return;
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Actualizar la vista previa 2D
    setTimeout(() => {
        updateJerseyPreview();
    }, 100);
}

function closeCustomizer() {
    const modal = document.getElementById('customizerModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}

function updateJerseyPreview() {
    const previewCanvas = document.getElementById('customJerseyPreview');
    if (!previewCanvas) return;
    
    const ctx = previewCanvas.getContext('2d');
    const width = previewCanvas.width;
    const height = previewCanvas.height;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Dibujar fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Dibujar forma básica de camiseta
    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.moveTo(width * 0.2, 0);
    ctx.lineTo(width * 0.8, 0);
    ctx.lineTo(width * 0.9, height);
    ctx.lineTo(width * 0.1, height);
    ctx.closePath();
    ctx.fill();
    
    // Dibujar franjas del equipo
    ctx.fillStyle = '#C8102E'; // Rojo
    ctx.fillRect(width * 0.45, height * 0.1, width * 0.1, height * 0.7);
    
    ctx.fillStyle = '#FDB913'; // Amarillo
    ctx.fillRect(width * 0.3, height * 0.1, width * 0.1, height * 0.7);
    ctx.fillRect(width * 0.6, height * 0.1, width * 0.1, height * 0.7);
    
    // Obtener valores actuales
    const name = document.getElementById('nameInput')?.value || 'TU NOMBRE';
    const number = document.getElementById('numberInput')?.value || '10';
    const color = getColorCode(currentColor);
    
    // Dibujar número (grande)
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = color;
    ctx.font = 'bold 140px "Bebas Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number, width / 2, height * 0.45);
    ctx.restore();
    
    // Dibujar nombre (abajo)
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = color;
    ctx.font = 'bold 40px "Bebas Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (name.length > 10) {
        ctx.font = 'bold 30px "Bebas Neue", Arial, sans-serif';
    }
    
    ctx.fillText(name.toUpperCase(), width / 2, height * 0.75);
    ctx.restore();
}

function getColorCode(color) {
    switch(color) {
        case 'red': return '#C8102E';
        case 'yellow': return '#FDB913';
        case 'white': return '#FFFFFF';
        case 'black': return '#1a1a1a';
        default: return '#C8102E';
    }
}

function updateName(value) {
    updateJerseyPreview();
}

function updateNumber(value) {
    let num = parseInt(value) || 10;
    if (num > 99) {
        num = 99;
        document.getElementById('numberInput').value = 99;
    }
    if (num < 0) {
        num = 0;
        document.getElementById('numberInput').value = 0;
    }
    
    updateJerseyPreview();
}

function changeColor(color) {
    currentColor = color;

    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-checked', 'false');
    });

    const clickedBtn = document.querySelector(`.color-btn.${color}`);
    if (clickedBtn) {
        clickedBtn.classList.add('active');
        clickedBtn.setAttribute('aria-checked', 'true');
    }

    updateJerseyPreview();
}

// === FUNCIONES DEL MODAL DEL ESTADIO ===
function openStadiumTracker() {
    const modal = document.getElementById('stadiumModal');
    if (!modal) return;
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  
    setTimeout(() => {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.value = 68;
        }
    }, 300);
}

function closeStadiumTracker() {
    const modal = document.getElementById('stadiumModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}

// === RESTO DE FUNCIONES SIN CAMBIOS ===
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        const nav = document.querySelector('.main-nav');
        nav.classList.toggle('active');
  
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
    });
}

function openNews(newsId) {
    console.log('Abrir noticia:', newsId);
}

function closeNews() {
    const modal = document.getElementById('newsModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCustomizer();
        closeStadiumTracker();
        closeNews();
    }
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
        closeCustomizer();
        closeStadiumTracker();
        closeNews();
    });
});

function addHeart() {
    if (heartCount >= 5) {
        return;
    }
    
    heartCount++;
    updateHeartCounter();
}

function removeHeart() {
    if (heartCount <= 0) {
        return;
    }
    
    heartCount--;
    updateHeartCounter();
}

function updateHeartCounter() {
    const counter = document.querySelector('#heartCount span');
    if (counter) {
        counter.textContent = heartCount;
    }
}

function purchaseJersey() {
    const name = document.getElementById('nameInput')?.value || 'TU NOMBRE';
    const number = document.getElementById('numberInput')?.value || '10';

    if (!name || name === '') {
        return;
    }
    
    if (!number || number === '') {
        return;
    }
 
    console.log('Purchase initiated:', { name, number, color: currentColor, hearts: heartCount });
}

function showNewJersey() {
    openCustomizer();
}

function buyTickets() {
    console.log('Ticket purchase initiated');
}

function showPlayerDetails(number) {
    const players = {
        1: { 
            name: 'Patricio Álvarez', 
            position: 'Portero', 
            age: 32, 
            nationality: 'Peruano'
        },
        10: { 
            name: 'Paulo de la Cruz', 
            position: 'Extremo Derecho', 
            age: 26, 
            nationality: 'Peruano'
        },
        9: { 
            name: 'Raul Ruidíaz', 
            position: 'Delantero', 
            age: 35, 
            nationality: 'Peruano'
        },
        22: { 
            name: 'Cristian Neira', 
            position: 'Mediocampista', 
            age: 25, 
            nationality: 'Peruano'
        }
    };
    
    const player = players[number];
    if (player) {
        console.log('Perfil del Jugador:', player);
    }
}

function showFullTeam() {
    console.log('Mostrar plantel completo');
}

function showContact() {
    console.log('Mostrar información de contacto');
}

function showStore() {
    console.log('Mostrar tienda oficial');
}

function showMembership() {
    console.log('Mostrar información de socios');
}

function showPrivacy() {
    console.log('Mostrar política de privacidad');
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .news-card, .player-card, .history-gallery picture').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

window.addEventListener('resize', () => {
    if (renderer && camera) {
        const canvas = document.getElementById('jersey3D');
        if (canvas && canvas.width > 0 && canvas.height > 0) {
            camera.aspect = canvas.width / canvas.height;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.width, canvas.height);
        }
    }
    
    if (stadiumRenderer && stadiumCamera) {
        const canvas = document.getElementById('stadium3D');
        if (canvas && canvas.width > 0 && canvas.height > 0) {
            stadiumCamera.aspect = canvas.width / canvas.height;
            stadiumCamera.updateProjectionMatrix();
            stadiumRenderer.setSize(canvas.width, canvas.height);
        }
    }
});

window.addEventListener('error', (e) => {
    console.log('Error cargando recurso:', e.target.src);
    if (e.target.tagName === 'IMG') {
        e.target.src = 'img/placeholder.jpg';
    }
});

if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}