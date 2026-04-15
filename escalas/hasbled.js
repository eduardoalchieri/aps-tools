document.addEventListener("DOMContentLoaded", () => {
    const btnCalcHasbled = document.getElementById("btn-calc-hasbled");

    if (btnCalcHasbled) {
        btnCalcHasbled.addEventListener("click", () => {
            
            // Coleta os valores
            const inputs = [
                document.querySelector('input[name="hb_h"]:checked'),
                document.querySelector('input[name="hb_ar"]:checked'),
                document.querySelector('input[name="hb_ah"]:checked'),
                document.querySelector('input[name="hb_s"]:checked'),
                document.querySelector('input[name="hb_b"]:checked'),
                document.querySelector('input[name="hb_l"]:checked'),
                document.querySelector('input[name="hb_e"]:checked'),
                document.querySelector('input[name="hb_df"]:checked'),
                document.querySelector('input[name="hb_da"]:checked')
            ];

            // Verificação de segurança
            if (inputs.some(input => input === null)) {
                alert("Atenção: Por favor, responda a todos os parâmetros.");
                return;
            }

            // Cálculo Total
            let total = 0;
            inputs.forEach(input => { total += parseInt(input.value); });

            // Identificação de Fatores Modificáveis para o Relatório
            let modificaveis = [];
            if (parseInt(inputs[0].value) === 1) modificaveis.push("Hipertensão sistólica > 160 mmHg");
            if (parseInt(inputs[5].value) === 1) modificaveis.push("INR Lábil (Considerar troca para DOAC se aplicável)");
            if (parseInt(inputs[7].value) === 1) modificaveis.push("Uso de AINEs ou Antiplaquetários (Reavaliar indicação)");
            if (parseInt(inputs[8].value) === 1) modificaveis.push("Etilismo abusivo");

            let diagnostico = "";
            let cor = "";
            let taxaHemorragia = "";

            const faixasRisco = [
                { titulo: "Baixo Risco", min: 0, max: 0, exibe: "0 pontos", cor: "#28a745", bg: "#e8f5e9", taxa: "Baixa incidência hemorrágica." },
                { titulo: "Risco Moderado", min: 1, max: 2, exibe: "1 a 2 pontos", cor: "#ff9800", bg: "#fff3e0", taxa: "Aumento progressivo do risco. Atenção a mudanças clínicas." },
                { titulo: "Alto Risco", min: 3, max: 9, exibe: "≥ 3 pontos", cor: "#dc3545", bg: "#ffebee", taxa: "Incidência elevada (podendo variar de 8,7 a 12,5 sangramentos por 100 pacientes-ano em escores 4-5)." }
            ];

            let htmlTabela = `<div style="margin-top: 1.5rem; margin-bottom: 0;">
                <h4 style="color: #0b5ed7; margin-bottom: 10px; font-size: 1.05rem;">Estratificação de Risco (oHAS-BLED)</h4>`;
            
            faixasRisco.forEach(faixa => {
                let ativo = (total >= faixa.min && total <= faixa.max);
                if (ativo) {
                    diagnostico = faixa.titulo;
                    cor = faixa.cor;
                    taxaHemorragia = faixa.taxa;
                    htmlTabela += `
                        <div style="border: 2px solid ${faixa.cor}; background-color: ${faixa.bg}; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: ${faixa.cor}; font-size: 1rem;">${faixa.titulo}</strong>
                                <div style="font-size: 0.85rem; color: #444; margin-top: 3px;">Escore: <strong>${faixa.exibe}</strong></div>
                            </div>
                            <span style="background-color: ${faixa.cor}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">PACIENTE</span>
                        </div>`;
                } else {
                    htmlTabela += `
                        <div style="border: 1px solid #ddd; background-color: #fafafa; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; opacity: 0.6;">
                            <div>
                                <strong style="color: #666; font-size: 1rem;">${faixa.titulo} <span style="font-size: 0.85rem; font-weight: normal;">(${faixa.exibe})</span></strong>
                            </div>
                        </div>`;
                }
            });
            htmlTabela += `</div>`;

            // Bloco de Alerta para Fatores Modificáveis
            let htmlModificaveis = "";
            if (modificaveis.length > 0) {
                let lista = modificaveis.map(m => `<li style="margin-bottom: 5px;">${m}</li>`).join("");
                htmlModificaveis = `
                    <div style="margin-top: 1.5rem; padding: 1rem; background-color: #e8f5e9; border: 1px solid #c3e6cb; border-radius: 8px;">
                        <h4 style="color: #28a745; margin-bottom: 8px; font-size: 1rem;"><span class="material-symbols-outlined" style="vertical-align: bottom; font-size: 1.1rem;">build</span> Fatores Modificáveis Identificados</h4>
                        <p style="font-size: 0.85rem; color: #333; margin-bottom: 8px;">Corrija agressivamente os seguintes fatores para reduzir a pontuação e estabelecer segurança hemostática:</p>
                        <ul style="font-size: 0.85rem; color: #155724; padding-left: 20px; margin-bottom: 0;">
                            ${lista}
                        </ul>
                    </div>
                `;
            } else {
                htmlModificaveis = `
                    <div style="margin-top: 1.5rem; padding: 1rem; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px;">
                        <h4 style="color: #6c757d; margin-bottom: 8px; font-size: 1rem;"><span class="material-symbols-outlined" style="vertical-align: bottom; font-size: 1.1rem;">check_circle</span> Fatores Modificáveis</h4>
                        <p style="font-size: 0.85rem; color: #555; margin-bottom: 0;">Nenhum fator de risco ativamente modificável foi identificado nesta triagem.</p>
                    </div>
                `;
            }

            // Renderiza o resultado na interface
            const resDiv = document.getElementById("res-hasbled");
            resDiv.innerHTML = `
                <div style="background-color: ${cor}; color: #FFFFFF; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Escore HAS-BLED</div>
                    <div style="font-size: 4rem; font-weight: 800; line-height: 1.1;">${total}</div>
                    <div style="font-size: 1.3rem; font-weight: 700; background-color: rgba(255,255,255,0.2); display: inline-block; padding: 4px 12px; border-radius: 20px; margin-top: 8px;">${diagnostico}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <p style="font-size: 1rem; color: #444; line-height: 1.5; margin-bottom: 0;"><strong>Morbidade Hemorrágica:</strong> ${taxaHemorragia}</p>
                    
                    ${htmlTabela}
                    ${htmlModificaveis}
                    
                    <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px dashed #ccc;">
                        <h4 style="color: #dc3545; margin-bottom: 8px; font-size: 1rem;"><span class="material-symbols-outlined" style="vertical-align: bottom; font-size: 1.1rem;">warning</span> Conduta Clínica Obrigatória</h4>
                        <p style="font-size: 0.85rem; color: #555; line-height: 1.4;">Um escore HAS-BLED elevado (≥ 3) <strong>não deve</strong> ser utilizado para contraindicar ou suspender a anticoagulação oral em pacientes com CHA₂DS₂-VA alto. A recomendação expressa é instituir o anticoagulante (preferencialmente DOACs) implementando um monitoramento ambulatorial rigoroso e frequente.</p>
                    </div>
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});