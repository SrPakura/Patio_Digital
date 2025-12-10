/* ========================
   LÓGICA DEL PATO 🦆
   ======================== */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Revisar si el pato ya se fue (LocalStorage)
    if (localStorage.getItem('duckGone') === 'true') {
        const duck = document.getElementById('the-duck');
        if (duck) duck.style.display = 'none';
        return; // Detener script
    }

    const duck = document.getElementById('the-duck');
    let currentFrame = 1;
    const totalFrames = 8;
    let duckInterval;
    let clickCount = 0;
    let clickTimer;

    // Cargar Audios
    const audioCuac = new Audio('assets/audio/cuac.mp3');
    const audioMalaje = new Audio('assets/audio/malaje.mp3');

    // Animación de Sprites (Frames)
    function animateDuck() {
        currentFrame++;
        if (currentFrame > totalFrames) currentFrame = 1;
        const frameString = currentFrame.toString().padStart(4, '0'); 
        duck.src = `assets/duck/frame_${frameString}.png`;
    }

    function startWalking() {
        // Solo animar si no está corriendo huyendo
        if (!duck.classList.contains('duck-running')) {
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

    // Iniciar
    startWalking();

    // Hover Events (Pausar/Reanudar)
    duck.addEventListener('mouseenter', stopWalking);
    duck.addEventListener('mouseleave', startWalking);

    // CLICK LOGIC (Modo Malaje)
    duck.addEventListener('click', () => {
        clickCount++;
        
        // Reiniciar contador si pasan 2 segundos sin clicks
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { clickCount = 0; }, 2000);

        if (clickCount < 5) {
            // Comportamiento Normal
            audioCuac.currentTime = 0;
            audioCuac.play();
            // Efecto visual pequeño
            duck.style.transform = "scale(1.2)";
            setTimeout(() => duck.style.transform = "scale(1)", 100);
            
        } else {
            // MALAJE MODE ACTIVATED (5 clicks en < 2s)
            
            // 1. Reproducir audio
            audioMalaje.play();

            // 2. Congelar todo (Time Stop)
            clearInterval(duckInterval); // Pato estático en frame actual
            duck.style.animationPlayState = 'paused'; // Deja de moverse en X
            
            // 3. Quitar eventos para que no se le moleste más
            duck.style.pointerEvents = 'none'; 

            // 4. Esperar un poco y salir corriendo
            setTimeout(() => {
                duck.classList.remove('duck-walking');
                duck.classList.add('duck-running'); // Clase de CSS que corre rápido
                
                // Reanudar animación de patas muy rápido
                duckInterval = setInterval(animateDuck, 50); 
                
                // Guardar en memoria: El pato no vuelve
                localStorage.setItem('duckGone', 'true');
                
                // Eliminar del DOM cuando termine de salir (aprox 2s)
                setTimeout(() => {
                    duck.remove();
                }, 3000);

            }, 1000); // 1 segundo de "shock" antes de correr
        }
    });

});
