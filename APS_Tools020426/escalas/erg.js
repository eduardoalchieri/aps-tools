document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn-calcular-erg");
    const resDiv = document.getElementById("resultado-erg");

    if (btn) {
        btn.addEventListener("click", () => {
            const isAutoHigh = document.getElementById("erg-auto-high").value === "1";
            
            // Lógica para Alto Risco Automático
            if (isAutoHigh) {
                exibirResultadoERG("> 20.0", "Risco Alto", "#dc3545", "Paciente enquadrado diretamente em Alto Risco devido à presença de doença aterosclerótica prévia, aneurisma, DRC ou LDL muito elevado.");
                return;
            }

            const idadeRaw = document.getElementById("erg-idade").value;
            const sexo = document.getElementById("erg-sexo").value;
            const ctRaw = document.getElementById("erg-ct").value;
            const hdlRaw = document.getElementById("erg-hdl").value;
            const pasRaw = document.getElementById("erg-pas").value;
            const tratado = parseInt(document.getElementById("erg-tratado").value);
            const tabagista = parseInt(document.getElementById("erg-tabagista").value);
            const diabetes = parseInt(document.getElementById("erg-diabetes").value);

            if (!idadeRaw || !ctRaw || !hdlRaw || !pasRaw) {
                alert("Por favor, preencha todos os campos do formulário para o cálculo de Cox.");
                return;
            }

            const idade = parseFloat(idadeRaw);
            const ct = parseFloat(ctRaw);
            const hdl = parseFloat(hdlRaw);
            const pas = parseFloat(pasRaw);

            if (idade < 30 || idade > 74) {
                alert("Aviso Clínico: O modelo de Framingham global é validado apenas para indivíduos entre 30 e 74 anos de idade.");
                return;
            }

            let sumCox = 0;
            let probEvento = 0;
            let meanBetaX = 0;
            let baselineSurvival = 0;

            // Regressão de Cox (Framingham 2008 / SBC 2017)
            if (sexo === "M") {
                meanBetaX = 23.9802;
                baselineSurvival = 0.88936;

                sumCox = (3.06117 * Math.log(idade)) + 
                         (1.12370 * Math.log(ct)) - 
                         (0.93263 * Math.log(hdl)) + 
                         (tabagista * 0.65451) + 
                         (diabetes * 0.57367);
                
                if (tratado === 1) sumCox += (1.99881 * Math.log(pas));
                else sumCox += (1.93303 * Math.log(pas));

            } else {
                meanBetaX = 26.1931;
                baselineSurvival = 0.95012;

                sumCox = (2.32888 * Math.log(idade)) + 
                         (1.20904 * Math.log(ct)) - 
                         (0.70833 * Math.log(hdl)) + 
                         (tabagista * 0.52873) + 
                         (diabetes * 0.69154);
                
                if (tratado === 1) sumCox += (2.82263 * Math.log(pas));
                else sumCox += (2.76157 * Math.log(pas));
            }

            const expoente = Math.exp(sumCox - meanBetaX);
            probEvento = (1 - Math.pow(baselineSurvival, expoente)) * 100;

            // Estratificação Inicial
            let estrato = "";
            let cor = "";
            
            if (sexo === "M") {
                if (probEvento < 5) { estrato = "Risco Baixo"; cor = "#28a745"; }
                else if (probEvento >= 5 && probEvento <= 20) { estrato = "Risco Intermediário"; cor = "#ff9800"; }
                else { estrato = "Risco Alto"; cor = "#dc3545"; }
            } else {
                if (probEvento < 5) { estrato = "Risco Baixo"; cor = "#28a745"; }
                else if (probEvento >= 5 && probEvento <= 10) { estrato = "Risco Intermediário"; cor = "#ff9800"; }
                else { estrato = "Risco Alto"; cor = "#dc3545"; }
            }

            let msgReclassificacao = "";

            // Reestratificação por Agravantes (Apenas para Intermediário)
            if (estrato === "Risco Intermediário") {
                const temAgravante = document.getElementById("erg-agr-hf").checked || 
                                     document.getElementById("erg-agr-sm").checked || 
                                     document.getElementById("erg-agr-micro").checked || 
                                     document.getElementById("erg-agr-hve").checked || 
                                     document.getElementById("erg-agr-pcr").checked || 
                                     document.getElementById("erg-agr-cac").checked;
                
                if (temAgravante) {
                    estrato = "Risco Alto (Reclassificado)";
                    cor = "#dc3545";
                    msgReclassificacao = "O paciente apresentou probabilidade intermediária na fórmula, mas foi reclassificado como ALTO RISCO devido à presença de um ou mais Fatores Agravantes.";
                }
            }

            exibirResultadoERG(probEvento.toFixed(1), estrato, cor, msgReclassificacao);
        });
    }

    function exibirResultadoERG(valor, estrato, cor, notaExtra) {
        const resDiv = document.getElementById("resultado-erg");
        document.getElementById("erg-score-display").innerText = valor + "%";
        document.getElementById("erg-score-display").style.color = cor;
        
        const estagioTexto = document.getElementById("erg-estagio");
        estagioTexto.innerText = estrato;
        estagioTexto.style.color = cor;

        const notaEl = document.getElementById("erg-detalhe-reclassificacao");
        if (notaExtra !== "") {
            notaEl.innerText = notaExtra;
            notaEl.style.display = "block";
        } else {
            notaEl.style.display = "none";
        }

        resDiv.style.display = "block";
        resDiv.scrollIntoView({ behavior: 'smooth' });
    }
});