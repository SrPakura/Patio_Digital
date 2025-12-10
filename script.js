document.addEventListener('DOMContentLoaded', () => {
    
    /* 
       COMENTADO: Lógica de persistencia.
       Si quieres que el pato NO vuelva tras recargar, descomenta esto.
       Para desarrollo, mejor dejarlo comentado.
    */
    /*
    if (localStorage.getItem('duckGone') === 'true') {
        const duck = document.getElementById('the-duck');
        if (duck) duck.style.display = 'none';
        return; 
    }
    */

    const duck = document.getElementById('the-duck');
    if (!duck) return;

    let currentFrame = 1;
    const totalFrames = 8;
    let duckInterval;
    
    // Variables para lógica de clicks rabiosos
    let clickCount = 0;
    let clickTimer;
    
    // AUDIOS
    const audioCuac = new Audio('assets/audio/cuac.mp3');
    const audioMalaje = new Audio('assets/audio/malaje.mp3');

    // Función segura para reproducir audio (por si no existe el archivo aún)
    function playSound(audioObj) {
        audioObj.currentTime = 0;
        audioObj.play().catch(error => {
            console.warn("Audio no encontrado o bloqueado:", error);
        });
    }

    function animateDuck() {
        currentFrame++;
        if (currentFrame > totalFrames) currentFrame = 1;
        const frameString = currentFrame.toString().padStart(4, '0'); 
        duck.src = `assets/duck/frame_${frameString}.png`;
    }

    function startWalking() {
        // Solo camina si no está corriendo huyendo
        if (!duck.classList.contains('duck-running')) {
            // Limpiamos intervalo previo por seguridad
            clearInterval(duckInterval);
            duckInterval = setInterval(animateDuck, 100);
            duck.style.animationPlayState = 'running';
        }
    }

    function stopWalking() {
        if (!duck.classList.contains('duck-running')) {
            clearInterval(duckInterval);
            duck.style.animationPlayState = 'paused';
        }
    }

    // Iniciar caminata
    startWalking();

    // Eventos de Hover (parar/seguir)
    duck.addEventListener('mouseenter', stopWalking);
    duck.addEventListener('mouseleave', startWalking);

    // Evento de Click (La mecánica principal)
    duck.addEventListener('click', () => {
        clickCount++;
        
        // Reiniciar contador de clicks si pasa mucho tiempo (2 segundos)
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { 
            clickCount = 0; 
        }, 2000);

        if (clickCount < 5) {
            // Comportamiento normal: CUAC + Saltito
            playSound(audioCuac);
            
            // Pequeña animación visual de click
            duck.style.transform = "scale(1.2)";
            setTimeout(() => {
                // Verificamos que siga existiendo y no esté corriendo
                if(duck && !duck.classList.contains('duck-running')) {
                     duck.style.transform = "scale(1)";
                }
            }, 100);

        } else {
            // Comportamiento MALAJE (5 clicks rápidos)
            console.log("¡Pato enfadado!");
            playSound(audioMalaje);
            
            // 1. Quitar eventos para que no se le pueda clickar más
            duck.style.pointerEvents = 'none'; 
            
            // 2. Parar animación de caminar tranquila
            clearInterval(duckInterval);
            
            // 3. Activar modo huida
            duck.classList.remove('duck-walking');
            duck.classList.add('duck-running'); // Esta clase activa la animación CSS rápida
            
            // 4. Animar los frames más rápido (patitas a toda leche)
            duckInterval = setInterval(animateDuck, 50); 
            
            // 5. Eliminar del DOM al terminar
            setTimeout(() => { 
                duck.remove(); 
                // Opcional: localStorage.setItem('duckGone', 'true'); // Si decides activarlo
            }, 2000); // Tiempo que tarda en salir de pantalla aprox
        }
    });
});
