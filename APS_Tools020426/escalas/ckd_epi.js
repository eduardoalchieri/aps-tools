document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn-calcular-ckd");
    const resDiv = document.getElementById("resultado-ckd");

    if (btn) {
        btn.addEventListener("click", () => {
            const idade = parseFloat(document.getElementById("ckd-idade").value);
            const sexo = document.getElementById("ckd-sexo").value;
            const cr = parseFloat(document.getElementById("ckd-cr").value);

           if (isNaN(idade) || isNaN(cr) || !sexo) {
                alert("Por favor, preencha todos os campos corretamente.");
                return;
            }

            // Trava de segurança médica para idade
            if (idade < 18) {
                alert("AVISO CLÍNICO: A equação CKD-EPI 2021 é validada apenas para pacientes adultos (≥ 18 anos).\n\nPara pacientes pediátricos, utilize a equação de Schwartz.");
                return; // Interrompe o cálculo imediatamente
            }

            // Constantes da equação CKD-EPI 2021
            const kappa = sexo === 'F' ? 0.7 : 0.9;
            const alpha = sexo === 'F' ? -0.241 : -0.302;
            const multSexo = sexo === 'F' ? 1.012 : 1;

            const minCrK = Math.min(cr / kappa, 1);
            const maxCrK = Math.max(cr / kappa, 1);

            // Fórmula: 142 * min(Cr/k, 1)^a * max(Cr/k, 1)^-1.200 * 0.9938^Age * 1.012 [se mulher]
            const egfr = 142 * Math.pow(minCrK, alpha) * Math.pow(maxCrK, -1.200) * Math.pow(0.9938, idade) * multSexo;

            let estagio = "";
            let cor = "";
            let desc = "";

            if (egfr >= 90) {
                estagio = "G1"; cor = "#28a745"; desc = "Normal ou Elevada";
            } else if (egfr >= 60) {
                estagio = "G2"; cor = "#8bc34a"; desc = "Levemente Diminuída";
            } else if (egfr >= 45) {
                estagio = "G3a"; cor = "#ffc107"; desc = "Leve a Moderadamente Diminuída";
            } else if (egfr >= 30) {
                estagio = "G3b"; cor = "#fd7e14"; desc = "Moderada a Severamente Diminuída";
            } else if (egfr >= 15) {
                estagio = "G4"; cor = "#dc3545"; desc = "Severamente Diminuída";
            } else {
                estagio = "G5"; cor = "#8b0000"; desc = "Falência Renal";
            }

            document.getElementById("ckd-score-display").innerText = egfr.toFixed(1);
            document.getElementById("ckd-score-display").style.color = cor;
            
            const estagioTexto = document.getElementById("ckd-estagio");
            estagioTexto.innerText = `Estágio KDIGO: ${estagio} (${desc})`;
            estagioTexto.style.color = cor;

            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});