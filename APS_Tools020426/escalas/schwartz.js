document.addEventListener("DOMContentLoaded", () => {
    const btnSchwartz = document.getElementById('btn-calcular-schwartz');
    
    if (btnSchwartz) {
        btnSchwartz.addEventListener('click', () => {
            const idade = document.getElementById('schwartz-idade').value;
            const estatura = parseFloat(document.getElementById('schwartz-estatura').value);
            const cr = parseFloat(document.getElementById('schwartz-cr').value);

            // Validação de segurança
            if (!idade || isNaN(estatura) || isNaN(cr)) {
                alert("Por favor, preencha todos os campos obrigatórios (Idade, Estatura e Creatinina) com valores numéricos válidos.");
                return;
            }

            // Alerta clínico sobre faixa etária validada (não bloqueia o cálculo)
            if (idade < 1 || idade > 18) {
                alert("Atenção: A equação Bedside Schwartz possui alta precisão validada especificamente para pacientes pediátricos entre 1 e 18 anos.");
            }

            // Cálculo da TFG pela equação Bedside Schwartz (Constante 0.413)
            const eGFR = (0.413 * estatura) / cr;

            // Renderização e Feedback Visual Clínico
            const resDiv = document.getElementById('resultado-schwartz');
            let corDeFundo = "";
            let corDoTexto = "#ffffff";
            let alertaClinico = "";

            if (eGFR >= 90) {
                corDeFundo = "#28a745"; // Verde (Normal/Baixo Risco)
                alertaClinico = "TFG Normal ou Elevada";
            } else if (eGFR >= 60) {
                corDeFundo = "#ff9800"; // Laranja (Alerta)
                alertaClinico = "Redução Leve da TFG";
            } else if (eGFR >= 30) {
                corDeFundo = "#ff9800"; // Laranja (Alerta)
                alertaClinico = "Redução Moderada a Grave da TFG";
            } else {
                corDeFundo = "#dc3545"; // Vermelho (Emergência/Alto Risco)
                alertaClinico = "Redução Grave da TFG ou Falência Renal";
            }

            resDiv.style.display = "block";
            resDiv.style.backgroundColor = corDeFundo;
            resDiv.style.color = corDoTexto;

            resDiv.innerHTML = `
                <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">TFG Estimada</div>
                <div style="font-size: 3.5rem; font-weight: 800; line-height: 1.2; margin: 10px 0;">${eGFR.toFixed(1)}</div>
                <div style="font-size: 1rem; font-weight: 600; margin-bottom: 10px;">mL/min/1.73m²</div>
                <h3 style="margin-top: 10px; font-size: 1.3rem;">${alertaClinico}</h3>
                <p style="font-size: 0.8rem; color: rgba(255,255,255,0.85); margin-top: 15px; text-align: left; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.3);">
                    <strong>Referências Científicas:</strong><br>
                    1. Schwartz GJ, Muñoz A, Schneider MF, et al. New equations to estimate GFR in children with CKD. J Am Soc Nephrol. 2009;20(3):629-37.<br>
                    2. Staples AO, Levey AS, Saland JM, et al. Validation of the revised Schwartz estimating equation in a predominantly non-CKD population. Pediatr Nephrol. 2010;25(11):2321-2326.
                </p>
            `;
        });
    }
});