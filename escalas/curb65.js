document.addEventListener("DOMContentLoaded", () => {
    const inputUreia = document.getElementById("curb-ureia");
    const tituloCurb = document.getElementById("titulo-curb");
    const btnCalc = document.getElementById("btn-calc-curb65");
    const resDiv = document.getElementById("res-curb65");

    if (inputUreia && tituloCurb) {
        inputUreia.addEventListener("input", () => {
            if (inputUreia.value.trim() !== "") {
                tituloCurb.innerText = "Escore CURB-65";
            } else {
                tituloCurb.innerText = "Escore CRB-65";
            }
        });
    }

    if (btnCalc) {
        btnCalc.addEventListener("click", () => {
            const vIdade = document.getElementById("curb-idade").value;
            const vFr = document.getElementById("curb-fr").value;
            const vPas = document.getElementById("curb-pas").value;
            const vPad = document.getElementById("curb-pad").value;
            const isConfuso = document.querySelector('input[name="curb_conf"]:checked').value === "sim";
            const vUreia = document.getElementById("curb-ureia").value;

            if (!vIdade || !vFr || !vPas || !vPad) {
                alert("Por favor, preencha todos os campos obrigatórios (Idade, Frequência Respiratória, PAS e PAD) para calcular o escore.");
                return;
            }

            const idade = parseFloat(vIdade);
            const fr = parseFloat(vFr);
            const pas = parseFloat(vPas);
            const pad = parseFloat(vPad);

            let score = 0;
            let temUreia = false;

            // C - Confusão
            if (isConfuso) score++;
            
            // U - Ureia
            if (vUreia.trim() !== "") {
                temUreia = true;
                const ureia = parseFloat(vUreia);
                if (ureia > 43) score++;
            }

            // R - Frequência Respiratória
            if (fr >= 30) score++;

            // B - Blood Pressure (Pressão)
            if (pas < 90 || pad <= 60) score++;

            // 65 - Idade
            if (idade >= 65) score++;

            let classificacao = "";
            let conduta = "";
            let corHex = "";
            let bgTint = "";

            if (!temUreia) {
                // CRB-65 Logic
                if (score === 0) {
                    classificacao = "Risco Baixo";
                    corHex = "#28a745"; // Verde
                    bgTint = "#e8f5e9";
                    conduta = "Tratamento ambulatorial (Mortalidade ~1,2%)";
                } else if (score === 1 || score === 2) {
                    classificacao = "Risco Intermediário";
                    corHex = "#fbc02d"; // Amarelo
                    bgTint = "#fff9c4";
                    conduta = "Considerar avaliação hospitalar / internação em enfermaria (Mortalidade ~8,1%)";
                } else { // 3 ou 4
                    classificacao = "Risco Alto";
                    corHex = "#dc3545"; // Vermelho
                    bgTint = "#ffebee";
                    conduta = "Internação hospitalar urgente (Mortalidade ~31%)";
                }
            } else {
                // CURB-65 Logic
                if (score === 0 || score === 1) {
                    classificacao = "Risco Baixo";
                    corHex = "#28a745"; // Verde
                    bgTint = "#e8f5e9";
                    conduta = "Tratamento ambulatorial (Mortalidade < 1,5%)";
                } else if (score === 2) {
                    classificacao = "Risco Intermediário";
                    corHex = "#fbc02d"; // Amarelo
                    bgTint = "#fff9c4";
                    conduta = "Internação hospitalar breve ou tratamento ambulatorial supervisionado (Mortalidade ~9,2%)";
                } else if (score === 3) {
                    classificacao = "Risco Alto";
                    corHex = "#dc3545"; // Vermelho
                    bgTint = "#ffebee";
                    conduta = "Internação hospitalar em enfermaria (Mortalidade ~22%)";
                } else { // 4 ou 5
                    classificacao = "Risco Muito Alto";
                    corHex = "#8b0000"; // Vermelho Escuro
                    bgTint = "#f8d7da";
                    conduta = "Internação hospitalar com avaliação para UTI (Mortalidade superior a 30%)";
                }
            }

            const tituloResultado = temUreia ? "Resultado CURB-65" : "Resultado CRB-65";

            resDiv.innerHTML = `
                <div style="background-color: ${corHex}; color: ${corHex === '#fbc02d' ? '#333' : '#FFFFFF'}; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">${tituloResultado}</div>
                    <div style="font-size: 4rem; font-weight: 800; line-height: 1.1;">${score} <span style="font-size: 1.5rem; font-weight: 500;">pontos</span></div>
                    <div style="font-size: 1.3rem; font-weight: 700; background-color: rgba(255,255,255,0.3); display: inline-block; padding: 4px 12px; border-radius: 20px; margin-top: 8px;">${classificacao}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: ${bgTint}; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <div style="font-size: 0.9rem; color: #555; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; font-weight: bold; text-align: center;">Conduta Recomendada</div>
                    <p style="font-size: 1.1rem; color: #333; font-weight: bold; line-height: 1.5; margin-bottom: 0; text-align: center;">${conduta}</p>
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
