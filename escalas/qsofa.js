document.addEventListener("DOMContentLoaded", () => {
    const btnCalcQsofa = document.getElementById("btn-calc-qsofa");

    if (btnCalcQsofa) {
        btnCalcQsofa.addEventListener("click", () => {
            const fr = parseInt(document.querySelector('input[name="qsofa_fr"]:checked').value);
            const mental = parseInt(document.querySelector('input[name="qsofa_mental"]:checked').value);
            const pas = parseInt(document.querySelector('input[name="qsofa_pas"]:checked').value);

            const score = fr + mental + pas;

            let classificacao = "";
            let corHex = "";
            let bgTint = "";
            let conduta = "";

            if (score === 0 || score === 1) {
                classificacao = "Baixo Risco (Pelo qSOFA)";
                corHex = "#28a745"; // Verde
                bgTint = "#e8f5e9";
                conduta = "O paciente não apresenta alto risco de piora clínica pelo escore qSOFA. Contudo, se houver forte suspeita clínica de infecção, a avaliação de disfunção orgânica (ex: exames laboratoriais, SOFA completo) e a reavaliação contínua não devem ser postergadas.";
            } else { // 2 ou 3
                classificacao = "Alto Risco / Alerta para Sepse";
                corHex = "#dc3545"; // Vermelho
                bgTint = "#ffebee";
                conduta = "Aumento considerável do risco de evolução fatal ou necessidade de internação em UTI (3-14 vezes maior). Sugere-se investigação laboratorial imediata de disfunção orgânica (calcular SOFA), tratamento rápido e avaliação de internação em unidade monitorizada.";
            }

            const resDiv = document.getElementById("res-qsofa");
            resDiv.innerHTML = `
                <div style="background-color: ${corHex}; color: #FFFFFF; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Escore qSOFA</div>
                    <div style="font-size: 4rem; font-weight: 800; line-height: 1.1;">${score} <span style="font-size: 1.5rem; font-weight: 500;">pontos</span></div>
                    <div style="font-size: 1.3rem; font-weight: 700; background-color: rgba(255,255,255,0.3); display: inline-block; padding: 4px 12px; border-radius: 20px; margin-top: 8px;">${classificacao}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: ${bgTint}; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <div style="font-size: 0.9rem; color: #555; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; font-weight: bold; text-align: center;">Conduta Recomendada</div>
                    <p style="font-size: 1.1rem; color: #333; line-height: 1.5; margin-bottom: 0; text-align: center;">${conduta}</p>
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
