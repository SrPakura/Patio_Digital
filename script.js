document.addEventListener('DOMContentLoaded', () => {

    const duck = document.getElementById('the-duck');
    
    // 1. SI NO HAY PATO, NOS VAMOS (Seguridad)
    if (!duck) return;

    // 2. CHECK DE ACCESIBILIDAD (GORLOCK APPROVES)
    // Si el usuario prefiere movimiento reducido, el pato se queda quieto.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        console.log("Modo Accesible: Pato Estático");
        duck.style.animation = 'none';
        duck.style.left = '50%'; // Lo centramos en su pista
        duck.style.transform = 'translateX(-50%)';
        duck.title = "Pato Guardián (Estático por preferencias de movimiento)";
        return; // Cortamos aquí, no animamos sprites ni caminata.
    }

    // ============================================
    // LÓGICA DEL PATO (SI HAY MOVIMIENTO)
    // ============================================

    let currentFrame = 1;
    const totalFrames = 8;
    let duckInterval;
    
    // Variables para lógica de clicks rabiosos
    let clickCount = 0;
    let clickTimer;
    
    // AUDIOS
    // Nota: El navegador puede bloquear la reproducción de audio si no hay interacción previa.
    const audioCuac = new Audio('assets/audio/cuac.mp3');
    const audioMalaje = new Audio('assets/audio/malaje.mp3');

    // Función segura para reproducir audio
    function playSound(audioObj) {
        audioObj.currentTime = 0;
        audioObj.play().catch(error => {
            // Ignoramos errores si el navegador bloquea el autoplay
            console.warn("Audio bloqueado o no encontrado"); 
        });
    }

    // Animación del Sprite (el caminado interno)
    function animateSprite() {
        currentFrame++;
        if (currentFrame > totalFrames) currentFrame = 1;
        const frameString = currentFrame.toString().padStart(4, '0'); 
        duck.src = `assets/duck/frame_${frameString}.png`;
    }

    function startWalking() {
        if (!duck.classList.contains('duck-malaje')) { // Solo camina si no está en modo malaje
            clearInterval(duckInterval);
            duckInterval = setInterval(animateSprite, 100); // 10FPS
            duck.style.animationPlayState = 'running'; // CSS Animation (desplazamiento)
        }
    }

    function stopWalking() {
        clearInterval(duckInterval);
        duck.style.animationPlayState = 'paused'; // CSS Animation
        // Ponemos frame estático para que no se quede con la pata levantada
        duck.src = `assets/duck/frame_0001.png`; 
    }

    // Iniciar
    startWalking();

    // Eventos de Hover (parar/seguir)
    duck.addEventListener('mouseenter', stopWalking);
    duck.addEventListener('mouseleave', startWalking);

    // ACCESIBILIDAD TECLADO: Hacer el pato focusable y clickable con Enter
    duck.setAttribute('tabindex', '0');
    duck.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); // Evitar scroll con espacio
            triggerDuckAction();
        }
    });

    // Evento de Click (Ratón)
    duck.addEventListener('click', triggerDuckAction);

    // LA LÓGICA MAESTRA DEL CLICK
    function triggerDuckAction() {
        clickCount++;
        
        // Reiniciar contador de clicks si pasa mucho tiempo
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { 
            clickCount = 0; 
        }, 2000);

        if (clickCount < 5) {
            // --- MODO NORMAL ---
            playSound(audioCuac);
            
            // Animación visual de "apretujar"
            duck.style.transform = "scale(0.9)";
            setTimeout(() => {
                 duck.style.transform = "scale(1)";
            }, 100);

        } else {
            // --- MODO MALAJE (5 clicks rápidos) ---
            console.log("¡Pato enfadado!");
            
            playSound(audioMalaje);
            
            // Le ponemos clase para identificar estado
            duck.classList.add('duck-malaje');

            // Efecto visual: Se pone gris y pasa de ti
            duck.style.filter = "grayscale(100%) contrast(1.2)";
            duck.style.opacity = "0.8";
            duck.style.cursor = "not-allowed"; // Cursor de prohibido

            // Desactivar interacciones futuras
            duck.style.pointerEvents = 'none'; 
            
            // Opcional: Que salga corriendo (si quieres conservar la animación de huida)
            // duck.classList.add('duck-running'); 
            // Pero como ahora está en una pista confinada, mejor que siga caminando enfadado.
        }
    }
});
