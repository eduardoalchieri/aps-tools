document.addEventListener("DOMContentLoaded", () => {
    // Elementos do DOM
    const displayTime = document.getElementById("chrono-time");
    const displayStatus = document.getElementById("chrono-status");
    const displayContainer = document.getElementById("chrono-display-container");
    const btnStart = document.getElementById("btn-chrono-start");
    const btnStop = document.getElementById("btn-chrono-stop");
    const btnReset = document.getElementById("btn-chrono-reset");
    const btnTap = document.getElementById("btn-chrono-tap");
    const displayTap = document.getElementById("tap-result-display");
    const btnCopyTap = document.getElementById("btn-copy-tap");
    const presets = document.querySelectorAll(".chrono-preset");

    // Variáveis de Estado
    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval = null;
    let isRunning = false;
    let isCountdown = false;
    let countdownTarget = 0;

    // Variáveis do Tap Counter
    let tapTimes = [];
    let lastCalculatedRate = 0;

    // Função para sintetizar um Bipe (Sem necessidade de arquivos MP3 externos)
    function playBeep() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.type = 'sine';
            oscillator.frequency.value = 880; // Frequência do bipe (A5)
            gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.5);
        } catch (e) {
            console.log("Áudio não suportado ou bloqueado pelo navegador.");
        }
    }

    // Formatação do Tempo (MM:SS.ms)
    function formatTime(ms) {
        if (ms < 0) ms = 0;
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const deciseconds = Math.floor((ms % 1000) / 100);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${deciseconds}`;
    }

    // Atualização da Tela
    function updateDisplay() {
        let displayMs = elapsedTime;
        
        if (isCountdown) {
            displayMs = countdownTarget - elapsedTime;
            if (displayMs <= 0) {
                displayMs = 0;
                stopChrono();
                displayContainer.style.backgroundColor = "#dc3545"; // Vermelho
                displayStatus.innerText = "TEMPO ESGOTADO";
                playBeep();
                
                // Repete o bipe 3 vezes
                setTimeout(playBeep, 600);
                setTimeout(playBeep, 1200);
            }
        } else {
            // Feedback Visual para o Teste TUG (Avisa se passar de 12 e 20 segundos)
            if (elapsedTime >= 20000) {
                displayContainer.style.backgroundColor = "#dc3545"; // Risco Alto (Vermelho)
            } else if (elapsedTime >= 12000) {
                displayContainer.style.backgroundColor = "#ff9800"; // Risco Moderado (Laranja)
            }
        }
        
        displayTime.innerText = formatTime(displayMs);
    }

    // Lógica do Relógio
    function startChrono() {
        if (isRunning) return;
        isRunning = true;
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateDisplay();
        }, 50); // Atualiza a cada 50ms para fluidez
        
        btnStart.style.display = "none";
        btnStop.style.display = "block";
        if (displayStatus.innerText === "Pronto") {
            displayStatus.innerText = isCountdown ? "Temporizador Ativo" : "Cronômetro Ativo";
        }
    }

    function stopChrono() {
        if (!isRunning) return;
        isRunning = false;
        clearInterval(timerInterval);
        btnStart.style.display = "block";
        btnStop.style.display = "none";
        if (displayStatus.innerText !== "TEMPO ESGOTADO") {
            displayStatus.innerText = "Pausado";
        }
    }

    function resetChrono() {
        stopChrono();
        elapsedTime = 0;
        isCountdown = false;
        countdownTarget = 0;
        displayContainer.style.backgroundColor = "#0b5ed7"; // Azul original
        displayStatus.innerText = "Pronto";
        updateDisplay();
        
        // Reseta o Tap também
        tapTimes = [];
        lastCalculatedRate = 0;
        displayTap.innerHTML = `-- <span style="font-size: 0.9rem; font-weight: normal; color: #666;">BPM/irpm</span>`;
    }

    // Eventos dos Controles Principais
    if (btnStart) btnStart.addEventListener("click", startChrono);
    if (btnStop) btnStop.addEventListener("click", stopChrono);
    if (btnReset) btnReset.addEventListener("click", resetChrono);

    // Eventos dos Atalhos (Presets)
    presets.forEach(btn => {
        btn.addEventListener("click", (e) => {
            resetChrono();
            const secs = parseInt(e.target.getAttribute("data-time"));
            isCountdown = true;
            countdownTarget = secs * 1000;
            displayStatus.innerText = `Temporizador: ${secs >= 60 ? secs/60 + ' min' : secs + ' seg'}`;
            updateDisplay();
            startChrono();
        });
    });

    // Lógica do Contador (Tap)
    if (btnTap) {
        btnTap.addEventListener("click", () => {
            // Efeito de clique visual
            btnTap.style.backgroundColor = "#bbdefb";
            setTimeout(() => { btnTap.style.backgroundColor = "#e3f2fd"; }, 100);

            const now = Date.now();
            
            // Se demorar mais de 15 segundos entre os toques, reseta a contagem para iniciar uma nova (permite aferir frequências respiratórias baixas)
            if (tapTimes.length > 0 && (now - tapTimes[tapTimes.length - 1]) > 15000) {
                tapTimes = [];
            }
            
            tapTimes.push(now);

            // Precisa de pelo menos 2 toques para calcular o intervalo
            if (tapTimes.length >= 2) {
                const durationMs = tapTimes[tapTimes.length - 1] - tapTimes[0];
                const intervals = tapTimes.length - 1;
                
                // Converte para Frequência por Minuto
                const ratePerMinute = Math.round((intervals / durationMs) * 60000);
                lastCalculatedRate = ratePerMinute;
                
                displayTap.innerHTML = `${ratePerMinute} <span style="font-size: 0.9rem; font-weight: normal; color: #666;">BPM/irpm</span>`;
            } else {
                displayTap.innerHTML = `Calculando...`;
            }
        });
    }

    // Lógica para Copiar o Resultado do Tap
    if (btnCopyTap) {
        btnCopyTap.addEventListener("click", () => {
            if (lastCalculatedRate > 0) {
                const textToCopy = `Freq: ${lastCalculatedRate} bpm/irpm`;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalHtml = btnCopyTap.innerHTML;
                    btnCopyTap.innerHTML = `<span class="material-symbols-outlined" style="font-size: 1rem; vertical-align: middle;">check</span> Copiado!`;
                    btnCopyTap.classList.remove("btn-outline-sc");
                    btnCopyTap.classList.add("btn-action-sc");
                    setTimeout(() => {
                        btnCopyTap.innerHTML = originalHtml;
                        btnCopyTap.classList.remove("btn-action-sc");
                        btnCopyTap.classList.add("btn-outline-sc");
                    }, 2000);
                });
            } else {
                alert("Nenhuma frequência calculada ainda. Faça a contagem usando o botão TAP primeiro.");
            }
        });
    }
});