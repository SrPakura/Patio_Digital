document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('duckGone') === 'true') {
        const duck = document.getElementById('the-duck');
        if (duck) duck.style.display = 'none';
        return; 
    }

    const duck = document.getElementById('the-duck');
    let currentFrame = 1;
    const totalFrames = 8;
    let duckInterval;
    let clickCount = 0;
    let clickTimer;
    const audioCuac = new Audio('assets/audio/cuac.mp3');
    const audioMalaje = new Audio('assets/audio/malaje.mp3');

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

    duck.addEventListener('click', () => {
        clickCount++;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { clickCount = 0; }, 2000);

        if (clickCount < 5) {
            audioCuac.currentTime = 0;
            audioCuac.play();
            duck.style.transform = "scale(1.2)";
            setTimeout(() => duck.style.transform = "scale(1)", 100);
        } else {
            audioMalaje.play();
            clearInterval(duckInterval);
            duck.style.animationPlayState = 'paused';
            duck.style.pointerEvents = 'none'; 
            setTimeout(() => {
                duck.classList.remove('duck-walking');
                duck.classList.add('duck-running');
                duckInterval = setInterval(animateDuck, 50); 
                localStorage.setItem('duckGone', 'true');
                setTimeout(() => { duck.remove(); }, 3000);
            }, 1000);
        }
    });
});
