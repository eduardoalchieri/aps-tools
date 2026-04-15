// Função global para manipular a seleção visual dos botões
window.fr_select = function(element, groupName) {
    document.querySelectorAll(`input[name="${groupName}"]`).forEach(input => {
        let parentLabel = input.closest('.gold-radio-option');
        if(parentLabel) parentLabel.classList.remove('selected');
    });
    element.classList.add('selected');
    element.querySelector('input').checked = true;
};

document.addEventListener("DOMContentLoaded", () => {
    const btnCalc = document.getElementById("btn-calc-findrisc");

    if (btnCalc) {
        btnCalc.addEventListener("click", () => {
            // Coleta de Dados via inputs de Radio
            const q1 = document.querySelector('input[name="fr_idade"]:checked');
            const q3 = document.querySelector('input[name="fr_cintura"]:checked');
            const q4 = document.querySelector('input[name="fr_ativ"]:checked');
            const q5 = document.querySelector('input[name="fr_dieta"]:checked');
            const q6 = document.querySelector('input[name="fr_has"]:checked');
            const q7 = document.querySelector('input[name="fr_glicose"]:checked');
            const q8 = document.querySelector('input[name="fr_familia"]:checked');

            // Coleta de Peso e Altura para cálculo do IMC
            const pesoRaw = document.getElementById("fr_peso").value;
            const alturaRaw = document.getElementById("fr_altura").value;

            // Validação de Preenchimento
            if (!q1 || !q3 || !q4 || !q5 || !q6 || !q7 || !q8 || !pesoRaw || !alturaRaw) {
                alert("Por favor, preencha todos os campos e responda a todas as perguntas antes de calcular.");
                return;
            }

            // Lógica de Pontuação do IMC
            const peso = parseFloat(pesoRaw);
            const altura = parseFloat(alturaRaw);
            const imc = peso / (altura * altura);
            
            let ptsIMC = 0;
            if (imc >= 25 && imc <= 30) ptsIMC = 1;
            else if (imc > 30) ptsIMC = 3;

            // Soma Total
            const scoreTotal = parseInt(q1.value) + 
                               ptsIMC + 
                               parseInt(q3.value) + 
                               parseInt(q4.value) + 
                               parseInt(q5.value) + 
                               parseInt(q6.value) + 
                               parseInt(q7.value) + 
                               parseInt(q8.value);

            // Definição das Faixas e Renderização
            const ranges = [
                { max: 6,   title: "Risco Baixo",         desc: "Cerca de 1 em cada 100 pessoas irá desenvolver a doença.", cor: "#28a745", bg: "#e8f5e9" },
                { max: 11,  title: "Levemente Elevado",   desc: "Cerca de 1 em cada 25 pessoas irá desenvolver a doença.",  cor: "#8bc34a", bg: "#f1f8e9" },
                { max: 14,  title: "Risco Moderado",      desc: "Cerca de 1 em 6 pessoas. Avaliar seriamente atividades físicas e hábitos alimentares.", cor: "#ff9800", bg: "#fff3e0" },
                { max: 20,  title: "Risco Alto",          desc: "Cerca de 1 em 3 pessoas. Fazer o teste de glicemia (em jejum ou após dose) para rastreio.", cor: "#e65100", bg: "#ffe0b2" },
                { max: 99,  title: "Risco Muito Alto",    desc: "Cerca de 1 em 2 pessoas irá desenvolver a doença.",        cor: "#dc3545", bg: "#ffebee" }
            ];

            let htmlCards = "";
            let categoryAssigned = false;

            ranges.forEach(range => {
                let isActive = false;
                if (!categoryAssigned && scoreTotal <= range.max) {
                    isActive = true;
                    categoryAssigned = true;
                }

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
                    htmlCards += `
                        <div style="border: 1px solid #ddd; background-color: #fafafa; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; opacity: 0.6;">
                            <strong style="color: #666; font-size: 1.1rem;">${range.title}</strong>
                        </div>
                    `;
                }
            });

            // Exibir Resultado Final
            const resDiv = document.getElementById("res-findrisc");
            resDiv.innerHTML = `
                <div style="background-color: #0b5ed7; color: #FFFFFF; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <h2 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; margin: 0;">Pontuação Total (FINDRISC)</h2>
                    <div style="font-size: 3.5rem; font-weight: 800; line-height: 1.2;">${scoreTotal}</div>
                    <div style="font-size: 1rem; opacity: 0.9;">IMC Calculado: ${imc.toFixed(1)} kg/m²</div>
                </div>
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <div style="margin-bottom: 1rem; font-weight: bold; color: #333; font-size: 1.1rem;">Categorias de Risco em 10 Anos:</div>
                    ${htmlCards}
                    <p style="color: #888; font-size: 0.8rem; margin-top: 1.5rem; border-top: 1px solid #ddd; padding-top: 10px;">
                        Referência: Lindström J, Tuomilehto J. The diabetes risk score: a practical tool to predict type 2 diabetes risk. Diabetes Care. 2003.
                    </p>
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});