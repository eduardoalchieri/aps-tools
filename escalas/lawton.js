// Função global para manipular a seleção visual dos botões da Escala de Lawton
window.lawton_select = function(element, groupName) {
    document.querySelectorAll(`input[name="${groupName}"]`).forEach(input => {
        let parentLabel = input.closest('.gold-radio-option');
        if(parentLabel) parentLabel.classList.remove('selected');
    });
    element.classList.add('selected');
    element.querySelector('input').checked = true;
};

document.addEventListener("DOMContentLoaded", () => {
    const btnCalc = document.getElementById("btn-calc-lawton");

    if (btnCalc) {
        btnCalc.addEventListener("click", () => {
            // Coleta de Dados via inputs de Radio
            const q1 = document.querySelector('input[name="lawton_q1"]:checked');
            const q2 = document.querySelector('input[name="lawton_q2"]:checked');
            const q3 = document.querySelector('input[name="lawton_q3"]:checked');
            const q4 = document.querySelector('input[name="lawton_q4"]:checked');
            const q5 = document.querySelector('input[name="lawton_q5"]:checked');
            const q6 = document.querySelector('input[name="lawton_q6"]:checked');
            const q7 = document.querySelector('input[name="lawton_q7"]:checked');
            const q8 = document.querySelector('input[name="lawton_q8"]:checked');
            const q9 = document.querySelector('input[name="lawton_q9"]:checked');

            // Validação de Preenchimento
            if (!q1 || !q2 || !q3 || !q4 || !q5 || !q6 || !q7 || !q8 || !q9) {
                alert("Por favor, responda a todas as 9 perguntas antes de calcular.");
                return;
            }

            // Soma Total
            const scoreTotal = parseInt(q1.value) + 
                               parseInt(q2.value) + 
                               parseInt(q3.value) + 
                               parseInt(q4.value) + 
                               parseInt(q5.value) + 
                               parseInt(q6.value) + 
                               parseInt(q7.value) + 
                               parseInt(q8.value) + 
                               parseInt(q9.value);

            // Definição das Faixas e Renderização
            // 25-27: Independente
            // 21-24: Dependência Leve
            // 16-20: Dependência Moderada
            // 10-15: Dependência Grave
            // 9: Totalmente Dependente
            const ranges = [
                { min: 25, max: 27, title: "Independente", desc: "O paciente é independente para as atividades instrumentais da vida diária.", cor: "#28a745", bg: "#e8f5e9" },
                { min: 21, max: 24, title: "Dependência Leve", desc: "O paciente necessita de pequeno auxílio em algumas atividades.",  cor: "#ffc107", bg: "#fff8e1" },
                { min: 16, max: 20, title: "Dependência Moderada", desc: "O paciente necessita de auxílio moderado para as atividades.", cor: "#fd7e14", bg: "#fff3e0" },
                { min: 10, max: 15, title: "Dependência Grave", desc: "O paciente necessita de grande auxílio para as atividades.", cor: "#f44336", bg: "#ffebee" },
                { min: 9,  max: 9,  title: "Totalmente Dependente", desc: "O paciente apresenta dependência total para as atividades instrumentais.", cor: "#d32f2f", bg: "#fce4ec" }
            ];

            let htmlCards = "";

            ranges.forEach(range => {
                let isActive = (scoreTotal >= range.min && scoreTotal <= range.max);

                if (isActive) {
                    htmlCards += `
                        <div style="border: 2px solid ${range.cor}; background-color: ${range.bg}; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <strong style="color: ${range.cor}; font-size: 1.1rem;">${range.title}</strong>
                                <p style="margin: 0; font-size: 0.85rem; color: #444; margin-top: 4px;">${range.desc}</p>
                            </div>
                            <span style="background-color: ${range.cor}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; text-align: center;">PACIENTE</span>
                        </div>
                    `;
                } else {
                    let titleRange = range.min === range.max ? `${range.min} pontos` : `${range.min} a ${range.max} pontos`;
                    htmlCards += `
                        <div style="border: 1px solid #ddd; background-color: #fafafa; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; opacity: 0.6;">
                            <strong style="color: #666; font-size: 1.1rem;">${range.title} (${titleRange})</strong>
                        </div>
                    `;
                }
            });

            // Exibir Resultado Final
            const resDiv = document.getElementById("res-lawton");
            resDiv.innerHTML = `
                <div style="background-color: #0b5ed7; color: #FFFFFF; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <h2 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; margin: 0;">Pontuação Total (Lawton)</h2>
                    <div style="font-size: 3.5rem; font-weight: 800; line-height: 1.2;">${scoreTotal}</div>
                    <div style="font-size: 1rem; opacity: 0.9;">Escala de Lawton (AIVD)</div>
                </div>
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <div style="margin-bottom: 1rem; font-weight: bold; color: #333; font-size: 1.1rem;">Classificação:</div>
                    ${htmlCards}
                    <p style="color: #888; font-size: 0.8rem; margin-top: 1.5rem; border-top: 1px solid #ddd; padding-top: 10px;">
                        Referência: BRASIL. Ministério da Saúde. Secretaria de Atenção à Saúde. Departamento de Atenção Básica. Envelhecimento e saúde da pessoa idosa. Brasília, DF: Ministério da Saúde, 2006. (Cadernos de Atenção Básica - n.º 19).
                    </p>
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
