document.addEventListener("DOMContentLoaded", () => {
    const btnCalcMeldNa = document.getElementById("btn-calc-meldna");

    if (btnCalcMeldNa) {
        btnCalcMeldNa.addEventListener("click", () => {
            const inputBilirrubina = document.getElementById("meld-bilirrubina").value;
            const inputInr = document.getElementById("meld-inr").value;
            const inputCreatinina = document.getElementById("meld-creatinina").value;
            const inputSodio = document.getElementById("meld-sodio").value;
            const inputDialise = document.querySelector('input[name="meld_dialise"]:checked');

            if (!inputBilirrubina || !inputInr || !inputCreatinina || !inputSodio || !inputDialise) {
                alert("Por favor, preencha todos os campos obrigatórios.");
                return;
            }

            let bilirrubina = parseFloat(inputBilirrubina);
            let inr = parseFloat(inputInr);
            let creatinina = parseFloat(inputCreatinina);
            let sodio = parseFloat(inputSodio);
            const dialise = parseInt(inputDialise.value);

            // Etapa 1: Ajuste de limites inferiores (< 1.0 vira 1.0)
            if (bilirrubina < 1.0) bilirrubina = 1.0;
            if (inr < 1.0) inr = 1.0;
            if (creatinina < 1.0) creatinina = 1.0;

            // Ajuste máximo da creatinina ou paciente em diálise
            if (creatinina > 4.0 || dialise === 1) {
                creatinina = 4.0;
            }

            // Ajuste dos limites do Sódio
            if (sodio < 125) sodio = 125;
            if (sodio > 137) sodio = 137;

            // Etapa 2: MELD Inicial
            let meld_i = (0.957 * Math.log(creatinina) + 0.378 * Math.log(bilirrubina) + 1.120 * Math.log(inr) + 0.643) * 10;
            meld_i = Math.round(meld_i);
            
            if (meld_i > 40) {
                meld_i = 40;
            }

            // Etapa 3: MELD-Na
            let meld_na = meld_i;
            if (meld_i > 11) {
                meld_na = meld_i + 1.32 * (137 - sodio) - (0.033 * meld_i * (137 - sodio));
                meld_na = Math.round(meld_na);
            }

            if (meld_na > 40) {
                meld_na = 40;
            }

            // Determinar a faixa de risco e cores
            let mortalidade = "";
            let corHex = "";
            let bgTint = "";

            if (meld_na <= 9) {
                mortalidade = "~1.9%";
                corHex = "#28a745"; // Verde
                bgTint = "#e8f5e9";
            } else if (meld_na >= 10 && meld_na <= 19) {
                mortalidade = "~6.0%";
                corHex = "#fbc02d"; // Amarelo
                bgTint = "#fff9c4";
            } else if (meld_na >= 20 && meld_na <= 29) {
                mortalidade = "~19.6%";
                corHex = "#ff9800"; // Laranja
                bgTint = "#fff3e0";
            } else if (meld_na >= 30 && meld_na <= 39) {
                mortalidade = "~52.6%";
                corHex = "#f44336"; // Vermelho
                bgTint = "#ffebee";
            } else if (meld_na >= 40) {
                mortalidade = "~71.3%";
                corHex = "#b71c1c"; // Vermelho escuro
                bgTint = "#ffcdd2";
            }

            // Estrutura HTML para renderização
            const faixasRisco = [
                { titulo: "MELD-Na ≤ 9", min: 0, max: 9, cor: "#28a745", bg: "#e8f5e9", mort: "~1.9%" },
                { titulo: "MELD-Na 10 a 19", min: 10, max: 19, cor: "#fbc02d", bg: "#fff9c4", mort: "~6.0%" },
                { titulo: "MELD-Na 20 a 29", min: 20, max: 29, cor: "#ff9800", bg: "#fff3e0", mort: "~19.6%" },
                { titulo: "MELD-Na 30 a 39", min: 30, max: 39, cor: "#f44336", bg: "#ffebee", mort: "~52.6%" },
                { titulo: "MELD-Na ≥ 40", min: 40, max: 999, cor: "#b71c1c", bg: "#ffcdd2", mort: "~71.3%" }
            ];

            let htmlTabela = `<div style="margin-top: 1.5rem; margin-bottom: 0;">
                <h4 style="color: #0b5ed7; margin-bottom: 10px; font-size: 1.05rem;">Mortalidade Estimada em 90 Dias</h4>`;

            faixasRisco.forEach(faixa => {
                let ativo = (meld_na >= faixa.min && meld_na <= faixa.max);
                if (ativo) {
                    htmlTabela += `
                        <div style="border: 2px solid ${faixa.cor}; background-color: ${faixa.bg}; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: ${faixa.cor}; font-size: 1rem;">${faixa.titulo}</strong>
                                <div style="font-size: 0.85rem; color: #444; margin-top: 3px;">Mortalidade: <strong>${faixa.mort}</strong></div>
                            </div>
                            <span style="background-color: ${faixa.cor}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">PACIENTE</span>
                        </div>`;
                } else {
                    htmlTabela += `
                        <div style="border: 1px solid #ddd; background-color: #fafafa; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; opacity: 0.6;">
                            <div>
                                <strong style="color: #666; font-size: 1rem;">${faixa.titulo}</strong>
                            </div>
                            <div style="font-size: 0.85rem; color: #888;">${faixa.mort}</div>
                        </div>`;
                }
            });
            htmlTabela += `</div>`;

            const resDiv = document.getElementById("res-meldna");
            resDiv.innerHTML = `
                <div style="background-color: ${corHex}; color: ${meld_na >= 10 && meld_na <= 19 ? '#333' : '#FFFFFF'}; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Escore MELD-Na</div>
                    <div style="font-size: 4rem; font-weight: 800; line-height: 1.1;">${meld_na}</div>
                    <div style="font-size: 1.1rem; font-weight: 700; background-color: rgba(255,255,255,0.3); display: inline-block; padding: 4px 12px; border-radius: 20px; margin-top: 8px;">Mortalidade: ${mortalidade}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <p style="font-size: 0.85rem; color: #666; margin-bottom: 0; line-height: 1.4;">*O modelo prediz a sobrevida de 3 meses em pacientes com doença hepática terminal (≥ 12 anos). O escore inicial não ajustado ao sódio (MELD) calculado para este paciente foi <strong>${meld_i}</strong>.</p>
                    ${htmlTabela}
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
