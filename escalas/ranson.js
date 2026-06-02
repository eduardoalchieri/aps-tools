document.addEventListener("DOMContentLoaded", () => {
    const etiolRadios = document.querySelectorAll('input[name="ranson_etiol"]');
    const pao2Container = document.getElementById("ranson-pao2-container");

    // Lógica para mostrar/esconder PaO2 de forma dinâmica baseada na etiologia
    etiolRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            if (e.target.value === "nao-biliar") {
                pao2Container.style.display = "flex";
            } else {
                pao2Container.style.display = "none";
                document.getElementById("ranson-pao2").value = ""; // Limpa o valor
            }
        });
    });

    const btnCalcRanson = document.getElementById("btn-calc-ranson");

    if (btnCalcRanson) {
        btnCalcRanson.addEventListener("click", () => {
            const etiol = document.querySelector('input[name="ranson_etiol"]:checked').value;
            
            // Admissão
            const iIdade = document.getElementById("ranson-idade").value;
            const iLeuco = document.getElementById("ranson-leuco").value;
            const iGlic = document.getElementById("ranson-glic").value;
            const iLdh = document.getElementById("ranson-ldh").value;
            const iAst = document.getElementById("ranson-ast").value;

            // 48 horas
            const iHt = document.getElementById("ranson-ht").value;
            const iUreia = document.getElementById("ranson-ureia").value;
            const iCalcio = document.getElementById("ranson-calcio").value;
            const iPao2 = document.getElementById("ranson-pao2").value;
            const iDeficit = document.getElementById("ranson-deficit").value;
            const iFluidos = document.getElementById("ranson-fluidos").value;

            // Validação mínima para Admissão
            if (!iIdade || !iLeuco || !iGlic || !iLdh || !iAst) {
                alert("Por favor, preencha todos os campos do Bloco 1: Avaliação na Admissão (0h).");
                return;
            }

            const idade = parseFloat(iIdade);
            const leuco = parseFloat(iLeuco);
            const glic = parseFloat(iGlic);
            const ldh = parseFloat(iLdh);
            const ast = parseFloat(iAst);

            let score = 0;

            // Admissão Points
            if (etiol === "nao-biliar") {
                if (idade > 55) score++;
                if (leuco > 16000) score++;
                if (glic > 200) score++;
                if (ldh > 350) score++;
                if (ast > 250) score++;
            } else { // biliar
                if (idade > 70) score++;
                if (leuco > 18000) score++;
                if (glic > 220) score++;
                if (ldh > 400) score++;
                if (ast > 250) score++;
            }

            // Verifica se algum campo das 48h foi preenchido
            let tem48h = false;
            let req48hAtendidos = true;

            // Se pelo menos um campo estiver preenchido, os outros obrigatórios também deverão estar
            if (iHt || iUreia || iCalcio || iDeficit || iFluidos || (etiol === "nao-biliar" && iPao2)) {
                tem48h = true;
                if (!iHt || !iUreia || !iCalcio || !iDeficit || !iFluidos || (etiol === "nao-biliar" && !iPao2)) {
                    req48hAtendidos = false;
                }
            }

            if (tem48h && !req48hAtendidos) {
                alert("Você preencheu parcialmente os dados de 48 horas. Por favor, complete todas as informações desse bloco para o Escore Final, ou apague-as para calcular apenas o Escore Parcial (0h).");
                return;
            }

            let titulo_escore = "Escore Parcial (Admissão)";

            // 48 horas Points
            if (tem48h) {
                titulo_escore = "Escore Final (48 Horas)";
                const ht = parseFloat(iHt);
                const ureia = parseFloat(iUreia);
                const calcio = parseFloat(iCalcio);
                const deficit = parseFloat(iDeficit);
                const fluidos = parseFloat(iFluidos);

                if (etiol === "nao-biliar") {
                    const pao2 = parseFloat(iPao2);
                    if (ht > 10) score++;
                    if (ureia > 5) score++;
                    if (calcio < 8.0) score++;
                    if (pao2 < 60) score++;
                    if (deficit > 4) score++;
                    if (fluidos > 6) score++;
                } else { // biliar
                    if (ht > 10) score++;
                    if (ureia > 2) score++;
                    if (calcio < 8.0) score++;
                    if (deficit > 5) score++;
                    if (fluidos > 4) score++;
                }
            }

            // Interpretação e Cores
            let interpretacao = "";
            let mortalidade = "";
            let corHex = "";
            let bgTint = "";

            if (score <= 2) {
                interpretacao = "Pancreatite Leve";
                corHex = "#28a745"; // Verde
                bgTint = "#e8f5e9";
                mortalidade = "Mortalidade estimada: < 1%";
            } else if (score >= 3 && score <= 4) {
                interpretacao = "Pancreatite Grave";
                corHex = "#fbc02d"; // Amarelo
                bgTint = "#fff9c4";
                mortalidade = "Mortalidade estimada: ~15%";
            } else if (score >= 5 && score <= 6) {
                interpretacao = "Pancreatite Grave";
                corHex = "#ff9800"; // Laranja
                bgTint = "#fff3e0";
                mortalidade = "Mortalidade estimada: ~40%";
            } else { // > 6
                interpretacao = "Pancreatite Grave";
                corHex = "#dc3545"; // Vermelho
                bgTint = "#ffebee";
                mortalidade = "Mortalidade estimada: próxima a 100%";
            }

            const faixasRisco = [
                { titulo: "0 a 2 pontos", min: 0, max: 2, mort: "< 1%", cor: "#28a745", bg: "#e8f5e9" },
                { titulo: "3 a 4 pontos", min: 3, max: 4, mort: "~15%", cor: "#fbc02d", bg: "#fff9c4" },
                { titulo: "5 a 6 pontos", min: 5, max: 6, mort: "~40%", cor: "#ff9800", bg: "#fff3e0" },
                { titulo: "> 6 pontos", min: 7, max: 11, mort: "próxima a 100%", cor: "#dc3545", bg: "#ffebee" }
            ];

            let htmlTabela = `<div style="margin-top: 1.5rem; margin-bottom: 0;">
                <h4 style="color: #0b5ed7; margin-bottom: 10px; font-size: 1.05rem;">Mortalidade vs Pontuação</h4>`;

            faixasRisco.forEach(faixa => {
                let ativo = (score >= faixa.min && score <= faixa.max);
                if (ativo) {
                    htmlTabela += `
                        <div style="border: 2px solid ${faixa.cor}; background-color: ${faixa.bg}; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: ${faixa.cor}; font-size: 1rem;">${faixa.titulo}</strong>
                                <div style="font-size: 0.85rem; color: #444; margin-top: 3px;">${faixa.mort}</div>
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

            const resDiv = document.getElementById("res-ranson");
            resDiv.innerHTML = `
                <div style="background-color: ${corHex}; color: ${score >= 3 && score <= 4 ? '#333' : '#FFFFFF'}; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">${titulo_escore}</div>
                    <div style="font-size: 4rem; font-weight: 800; line-height: 1.1;">${score}</div>
                    <div style="font-size: 1.3rem; font-weight: 700; background-color: rgba(255,255,255,0.3); display: inline-block; padding: 4px 12px; border-radius: 20px; margin-top: 8px;">${interpretacao}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <p style="font-size: 1.05rem; color: #444; font-weight: bold; line-height: 1.5; margin-bottom: 0; text-align: center;">${mortalidade}</p>
                    ${htmlTabela}
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
