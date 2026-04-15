document.addEventListener("DOMContentLoaded", () => {
    const btnCalc = document.getElementById("btn-calc-imc-simples");

    if (btnCalc) {
        btnCalc.addEventListener("click", () => {
            const pesoRaw = document.getElementById("imcs_peso").value;
            const alturaRaw = document.getElementById("imcs_altura").value;

            if (!pesoRaw || !alturaRaw) {
                alert("Por favor, preencha o peso e a altura antes de calcular.");
                return;
            }

            const peso = parseFloat(pesoRaw);
            const alturaCm = parseFloat(alturaRaw);
            const alturaM = alturaCm / 100;
            const imc = peso / (alturaM * alturaM);

            // Tabela de classificação baseada nos limiares padrão
            const faixasIMC = [
                { titulo: "Abaixo do Peso", min: 0, max: 18.49, exibe: "< 18.5", cor: "#0288d1", bg: "#e1f5fe" },
                { titulo: "Peso Saudável", min: 18.5, max: 24.99, exibe: "18.5 a < 25", cor: "#28a745", bg: "#e8f5e9" },
                { titulo: "Sobrepeso", min: 25.0, max: 29.99, exibe: "25 a < 30", cor: "#ff9800", bg: "#fff3e0" },
                { titulo: "Obesidade Classe 1", min: 30.0, max: 34.99, exibe: "30 a < 35", cor: "#f57c00", bg: "#ffe0b2" },
                { titulo: "Obesidade Classe 2", min: 35.0, max: 39.99, exibe: "35 a < 40", cor: "#d84315", bg: "#ffccbc" },
                { titulo: "Obesidade Classe 3 (Severa)", min: 40.0, max: 999, exibe: "≥ 40", cor: "#b71c1c", bg: "#ffcdd2" }
            ];

            let diag = "";
            let corPrincipal = "";

            let htmlTabela = `<div style="margin-top: 0.5rem; margin-bottom: 0;">
                <h4 style="color: #0b5ed7; margin-bottom: 15px; font-size: 1.05rem;">Classificação</h4>`;
            
            faixasIMC.forEach(faixa => {
                let ativo = (imc >= faixa.min && imc <= faixa.max);
                if (ativo) {
                    diag = faixa.titulo.split(" (")[0]; 
                    corPrincipal = faixa.cor;
                    htmlTabela += `
                        <div style="border: 2px solid ${faixa.cor}; background-color: ${faixa.bg}; padding: 0.8rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                            <strong style="color: ${faixa.cor}; font-size: 0.95rem;">${faixa.titulo} <br><span style="font-weight: normal; font-size: 0.85rem; color: #555;">(${faixa.exibe} kg/m²)</span></strong>
                            <span style="background-color: ${faixa.cor}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">PACIENTE</span>
                        </div>`;
                } else {
                    htmlTabela += `
                        <div style="border: 1px solid #ddd; background-color: #fafafa; padding: 0.8rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; opacity: 0.6;">
                            <strong style="color: #666; font-size: 0.95rem;">${faixa.titulo} <br><span style="font-weight: normal; font-size: 0.85rem; color: #888;">(${faixa.exibe} kg/m²)</span></strong>
                        </div>`;
                }
            });
            htmlTabela += `</div>`;

            const resDiv = document.getElementById("res-imc-simples");
            resDiv.innerHTML = `
                <div style="background-color: ${corPrincipal}; color: #FFFFFF; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Índice de Massa Corporal</div>
                    <div style="font-size: 4rem; font-weight: 800; line-height: 1.1;">${imc.toFixed(1)}</div>
                    <div style="font-size: 1.3rem; font-weight: 700; background-color: rgba(255,255,255,0.2); display: inline-block; padding: 4px 12px; border-radius: 20px; margin-top: 8px;">${diag}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    ${htmlTabela}
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});