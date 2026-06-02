document.addEventListener("DOMContentLoaded", () => {
    const btnStart = document.getElementById("btn-tug-start");
    const btnStop = document.getElementById("btn-tug-stop");
    const btnReset = document.getElementById("btn-tug-reset");
    const display = document.getElementById("tug-display");
    const inputTempo = document.getElementById("tug-tempo");
    const resDiv = document.getElementById("res-tug");

    let timerInterval = null;
    let startTime = 0;
    let elapsedTime = 0;
    let isRunning = false;

    function formatTime(ms) {
        const totalSeconds = (ms / 1000).toFixed(1);
        return totalSeconds < 10 ? `0${totalSeconds}s` : `${totalSeconds}s`;
    }

    function updateDisplay() {
        const now = Date.now();
        const currentElapsed = elapsedTime + (now - startTime);
        display.innerText = formatTime(currentElapsed);
    }

    if (btnStart && btnStop && btnReset) {
        btnStart.addEventListener("click", () => {
            if (!isRunning) {
                startTime = Date.now();
                timerInterval = setInterval(updateDisplay, 100);
                isRunning = true;
                btnStart.style.display = "none";
                btnStop.style.display = "inline-block";
                resDiv.style.display = "none";
            }
        });

        btnStop.addEventListener("click", () => {
            if (isRunning) {
                clearInterval(timerInterval);
                elapsedTime += Date.now() - startTime;
                isRunning = false;
                
                btnStop.style.display = "none";
                btnStart.style.display = "inline-block";
                
                const finalSeconds = (elapsedTime / 1000).toFixed(1);
                inputTempo.value = finalSeconds;
                
                // Dispara o evento de input para calcular automaticamente
                inputTempo.dispatchEvent(new Event("input"));
            }
        });

        btnReset.addEventListener("click", () => {
            clearInterval(timerInterval);
            isRunning = false;
            elapsedTime = 0;
            display.innerText = "00.0s";
            inputTempo.value = "";
            btnStop.style.display = "none";
            btnStart.style.display = "inline-block";
            resDiv.style.display = "none";
        });
    }

    if (inputTempo) {
        inputTempo.addEventListener("input", () => {
            const val = parseFloat(inputTempo.value);
            
            if (isNaN(val) || val <= 0) {
                resDiv.style.display = "none";
                return;
            }

            let classificacao = "";
            let info = "";
            let corHex = "";
            let bgTint = "";

            if (val <= 10) {
                classificacao = "Mobilidade Normal";
                corHex = "#28a745"; // Verde
                bgTint = "#e8f5e9";
                info = "Independência preservada e baixo risco de quedas.";
            } else if (val > 10 && val < 20) {
                classificacao = "Mobilidade Intermediária";
                corHex = "#fbc02d"; // Amarelo
                bgTint = "#fff9c4";
                info = "Independência básica, mas risco moderado de quedas. <strong>Nota:</strong> A diretriz STEADI do CDC considera tempos ≥ 12 segundos como um alerta para alto risco de quedas.";
            } else if (val >= 20 && val < 30) {
                classificacao = "Mobilidade Comprometida";
                corHex = "#ff9800"; // Laranja
                bgTint = "#fff3e0";
                info = "Risco alto de quedas. O paciente frequentemente requer dispositivo de auxílio à marcha ou supervisão.";
            } else { // >= 30
                classificacao = "Dependência Severa";
                corHex = "#dc3545"; // Vermelho
                bgTint = "#ffebee";
                info = "Altíssimo risco de quedas e mobilidade gravemente prejudicada. Indicativo de dependência para a maioria das atividades.";
            }

            resDiv.innerHTML = `
                <div style="background-color: ${corHex}; color: ${val > 10 && val < 20 ? '#333' : '#FFFFFF'}; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Classificação</div>
                    <div style="font-size: 2rem; font-weight: 800; line-height: 1.2; margin-bottom: 5px;">${classificacao}</div>
                    <div style="font-size: 1.1rem; font-weight: 600; background-color: rgba(255,255,255,0.3); display: inline-block; padding: 4px 12px; border-radius: 20px;">Tempo: ${val}s</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: ${bgTint}; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <p style="font-size: 1.05rem; color: #444; line-height: 1.5; margin-bottom: 0; text-align: center;">${info}</p>
                </div>
            `;
            
            resDiv.style.display = "block";
            // Opcional: rolar suavemente para o resultado, mas como é instantâneo no input,
            // pode ser agressivo. Comentado intencionalmente.
            // resDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }
});
