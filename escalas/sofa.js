document.addEventListener("DOMContentLoaded", () => {
    const btnCalcSofa = document.getElementById("btn-calc-sofa");

    if (btnCalcSofa) {
        btnCalcSofa.addEventListener("click", () => {
            const resp = parseInt(document.getElementById("sofa-resp").value);
            const coag = parseInt(document.getElementById("sofa-coag").value);
            const figado = parseInt(document.getElementById("sofa-figado").value);
            const cardio = parseInt(document.getElementById("sofa-cardio").value);
            const neuro = parseInt(document.getElementById("sofa-neuro").value);
            const renal = parseInt(document.getElementById("sofa-renal").value);

            const score = resp + coag + figado + cardio + neuro + renal;

            let classificacao = "";
            let corHex = "";
            let bgTint = "";
            let conduta = "";

            if (score === 0) {
                classificacao = "Mortalidade estimada: < 10%";
                corHex = "#28a745"; // Verde
                bgTint = "#e8f5e9";
                conduta = "Sem disfunção orgânica significativa segundo o SOFA.";
            } else if (score >= 1 && score <= 6) {
                classificacao = "Mortalidade estimada: ~10-20%";
                corHex = "#fbc02d"; // Amarelo
                bgTint = "#fff9c4";
                conduta = "Disfunção orgânica leve a moderada. Necessita de monitoramento rigoroso.";
            } else if (score >= 7 && score <= 9) {
                classificacao = "Mortalidade estimada: ~15-20%";
                corHex = "#f57c00"; // Laranja
                bgTint = "#fff3e0";
                conduta = "Disfunção orgânica considerável. Manejo em UTI frequentemente necessário.";
            } else if (score >= 10 && score <= 12) {
                classificacao = "Mortalidade estimada: ~40-50%";
                corHex = "#e64a19"; // Laranja escuro
                bgTint = "#fbe9e7";
                conduta = "Disfunção multiorgânica severa. Alto risco de mortalidade.";
            } else if (score >= 13 && score <= 14) {
                classificacao = "Mortalidade estimada: ~50-60%";
                corHex = "#dc3545"; // Vermelho
                bgTint = "#ffebee";
                conduta = "Disfunção multiorgânica crítica. Prognóstico reservado.";
            } else {
                classificacao = "Mortalidade estimada: > 80%";
                corHex = "#8b0000"; // Vermelho escuro
                bgTint = "#f8d7da";
                conduta = "Falência multiorgânica muito grave. Altíssimo risco de mortalidade.";
            }

            const resDiv = document.getElementById("res-sofa");
            resDiv.innerHTML = `
                <div style="background-color: ${corHex}; color: ${corHex === '#fbc02d' ? '#333' : '#FFFFFF'}; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Escore SOFA</div>
                    <div style="font-size: 4rem; font-weight: 800; line-height: 1.1;">${score} <span style="font-size: 1.5rem; font-weight: 500;">pontos</span></div>
                    <div style="font-size: 1.3rem; font-weight: 700; background-color: rgba(255,255,255,0.3); display: inline-block; padding: 4px 12px; border-radius: 20px; margin-top: 8px;">${classificacao}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: ${bgTint}; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <div style="font-size: 0.9rem; color: #555; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; font-weight: bold; text-align: center;">Considerações</div>
                    <p style="font-size: 1.1rem; color: #333; line-height: 1.5; margin-bottom: 0; text-align: center;">${conduta}</p>
                    <div style="margin-top: 15px; font-size: 0.85rem; color: #666; text-align: center;">
                        Lembre-se: Um <strong>aumento de ≥ 2 pontos</strong> em relação ao basal do paciente indica disfunção de órgãos e está associado a uma mortalidade em torno de 10% na população geral com suspeita de infecção.
                    </div>
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
