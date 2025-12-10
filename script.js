document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Revisar si el pato ya se fue (LocalStorage)
    if (localStorage.getItem('duckGone') === 'true') {
        const duck = document.getElementById('the-duck');
        if (duck) duck.style.display = 'none';
        // Si el pato se fue, no ejecutamos nada más
        return; 
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

    // Animación de Sprites
    function animateDuck() {
        currentFrame++;
        if (currentFrame > totalFrames) currentFrame = 1;
        const frameString = currentFrame.toString().padStart(4, '0'); 
        duck.src = `assets/duck/frame_${frameString}.png`;
    }

    function startWalking() {
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

    startWalking();

    duck.addEventListener('mouseenter', stopWalking);
    duck.addEventListener('mouseleave', startWalking);

    // CLICK LOGIC
    duck.addEventListener('click', () => {
        clickCount++;
        
        // Reiniciar contador si pasan 2 segundos sin clicks
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { clickCount = 0; }, 2000);

        if (clickCount < 5) { // Antes era 4, ahora < 5 permite 4 clicks normales
            audioCuac.currentTime = 0;
            audioCuac.play();
            duck.style.transform = "scale(1.2)";
            setTimeout(() => duck.style.transform = "scale(1)", 100);
        } else {
            // MALAJE MODE (5º Click)
            audioMalaje.play();
            
            // Congelar
            clearInterval(duckInterval);
            duck.style.animationPlayState = 'paused';
            duck.style.pointerEvents = 'none'; 

            // Esperar y correr
            setTimeout(() => {
                duck.classList.remove('duck-walking');
                duck.classList.add('duck-running');
                duckInterval = setInterval(animateDuck, 50); // Correr rápido
                
                // Guardar que se fue
                localStorage.setItem('duckGone', 'true');
                
                setTimeout(() => { duck.remove(); }, 3000);
            }, 1000);
        }
    });
});
