document.addEventListener("DOMContentLoaded", () => {
    const btnCalc = document.getElementById("btn-calc-sofa");
    const resContainer = document.getElementById("res-sofa");

    // UI Logic for Cardiovascular Scenario
    const cardioScenario = document.getElementById('sofa-cardio-scenario');
    const doseContainer = document.getElementById('sofa-cardio-dose-container');
    const unitRadios = document.getElementsByName('sofa_cardio_unit');
    const inputMcg = document.getElementById('sofa-cardio-mcg-input');
    const inputMlh = document.getElementById('sofa-cardio-mlh-input');
    const labelMcg = document.getElementById('label-mcg');
    const labelMlh = document.getElementById('label-mlh');

    if (cardioScenario) {
        cardioScenario.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === '4' || val === '5') {
                doseContainer.style.display = 'block';
            } else {
                doseContainer.style.display = 'none';
            }
        });
    }

    if (unitRadios) {
        unitRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'mcg') {
                    inputMcg.style.display = 'block';
                    inputMlh.style.display = 'none';
                    labelMcg.style.background = '#e3f2fd';
                    labelMcg.style.borderColor = '#0b5ed7';
                    labelMcg.style.color = '#0b5ed7';
                    labelMlh.style.background = '#f9f9f9';
                    labelMlh.style.borderColor = '#ddd';
                    labelMlh.style.color = '#555';
                } else {
                    inputMcg.style.display = 'none';
                    inputMlh.style.display = 'block';
                    labelMlh.style.background = '#e3f2fd';
                    labelMlh.style.borderColor = '#0b5ed7';
                    labelMlh.style.color = '#0b5ed7';
                    labelMcg.style.background = '#f9f9f9';
                    labelMcg.style.borderColor = '#ddd';
                    labelMcg.style.color = '#555';
                }
            });
        });
    }

    if (btnCalc) {
        btnCalc.addEventListener("click", () => {
            // A. Respiratory
            let respScore = 0;
            const pao2 = parseFloat(document.getElementById("sofa-pao2").value);
            let fio2 = parseFloat(document.getElementById("sofa-fio2").value);
            const hasVm = document.getElementById("sofa-vm").checked;

            if (!isNaN(pao2) && !isNaN(fio2)) {
                if (fio2 > 1) fio2 = fio2 / 100;
                const ratio = pao2 / fio2;

                if (ratio >= 400) respScore = 0;
                else if (ratio < 400 && ratio >= 300) respScore = 1;
                else if (ratio < 300 && ratio >= 200) respScore = 2;
                else if (ratio < 200 && ratio >= 100 && hasVm) respScore = 3;
                else if (ratio < 100 && hasVm) respScore = 4;
                else if (ratio < 200) respScore = 2; // Maximum without VM is 2
            } else {
                alert("Por favor, preencha corretamente a PaO₂ e a FiO₂.");
                return;
            }

            // B. Neurological
            const neuroScore = parseInt(document.getElementById("sofa-glasgow").value) || 0;

            // C. Cardiovascular
            let cardioScore = 0;
            const cardioVal = document.getElementById('sofa-cardio-scenario').value;
            if (cardioVal === '1') cardioScore = 0;
            else if (cardioVal === '2') cardioScore = 1;
            else if (cardioVal === '3') cardioScore = 2;
            else if (cardioVal === '4' || cardioVal === '5') {
                const unit = document.querySelector('input[name="sofa_cardio_unit"]:checked').value;
                let dose = 0;
                if (unit === 'mcg') {
                    dose = parseFloat(document.getElementById('sofa-cardio-mcg').value);
                } else {
                    const peso = parseFloat(document.getElementById('sofa-peso').value);
                    const conc = parseFloat(document.getElementById('sofa-concentracao').value);
                    const vazao = parseFloat(document.getElementById('sofa-vazao').value);
                    if (peso > 0 && conc > 0 && vazao > 0) {
                        dose = (vazao * conc * 1000) / (peso * 60);
                    } else {
                        alert("Por favor, preencha os dados de Peso, Concentração e Velocidade para a conversão de dose.");
                        return;
                    }
                }
                
                if (isNaN(dose)) {
                    alert("Dose inválida no sistema cardiovascular.");
                    return;
                }

                if (dose <= 0.1) cardioScore = 3;
                else cardioScore = 4;
            }

            // D. Hepático, Coagulação, Renal
            const figadoScore = parseInt(document.getElementById("sofa-figado").value) || 0;
            const coagScore = parseInt(document.getElementById("sofa-coag").value) || 0;
            const renalScore = parseInt(document.getElementById("sofa-renal").value) || 0;

            const totalScore = respScore + neuroScore + cardioScore + figadoScore + coagScore + renalScore;

            // Mortality Estimate
            let mortality = "";
            let cardColor = "";
            let cardBg = "";
            
            if (totalScore <= 1) {
                mortality = "0.0%"; cardColor = "#155724"; cardBg = "#d4edda";
            } else if (totalScore <= 3) {
                mortality = "6.4%"; cardColor = "#155724"; cardBg = "#d4edda";
            } else if (totalScore <= 5) {
                mortality = "20.2%"; cardColor = "#856404"; cardBg = "#fff3cd";
            } else if (totalScore <= 7) {
                mortality = "21.5%"; cardColor = "#856404"; cardBg = "#fff3cd";
            } else if (totalScore <= 9) {
                mortality = "33.3%"; cardColor = "#856404"; cardBg = "#fff3cd";
            } else if (totalScore <= 11) {
                mortality = "50.0%"; cardColor = "#721c24"; cardBg = "#f8d7da";
            } else if (totalScore <= 14) {
                mortality = "95.2%"; cardColor = "#721c24"; cardBg = "#f8d7da";
            } else {
                mortality = "> 95%"; cardColor = "#721c24"; cardBg = "#f8d7da";
            }

            const resultHTML = `
                <div style="background-color: ${cardBg}; color: ${cardColor}; padding: 20px; border-radius: 8px; border: 1px solid ${cardColor}40;">
                    <h3 style="margin-top: 0; font-size: 1.4rem; text-align: center;">Escore Total: <strong>SOFA ${totalScore} Pontos</strong></h3>
                    
                    <div style="background: rgba(255,255,255,0.6); padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <h4 style="margin-top: 0; color: #333; font-size: 1.05rem;">Detalhamento por Sistema:</h4>
                        <ul style="list-style: none; padding-left: 0; margin-bottom: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; color: #444; font-size: 0.95rem;">
                            <li><span class="material-symbols-outlined" style="font-size: 1rem; vertical-align: middle;">air</span> Respiratório: <strong>${respScore}</strong></li>
                            <li><span class="material-symbols-outlined" style="font-size: 1rem; vertical-align: middle;">psychology</span> Neurológico: <strong>${neuroScore}</strong></li>
                            <li><span class="material-symbols-outlined" style="font-size: 1rem; vertical-align: middle;">favorite</span> Cardiovascular: <strong>${cardioScore}</strong></li>
                            <li><span class="material-symbols-outlined" style="font-size: 1rem; vertical-align: middle;">science</span> Hepático: <strong>${figadoScore}</strong></li>
                            <li><span class="material-symbols-outlined" style="font-size: 1rem; vertical-align: middle;">water_drop</span> Coagulação: <strong>${coagScore}</strong></li>
                            <li><span class="material-symbols-outlined" style="font-size: 1rem; vertical-align: middle;">kidney</span> Renal: <strong>${renalScore}</strong></li>
                        </ul>
                    </div>

                    <div style="text-align: center;">
                        <span style="font-size: 1rem;">Mortalidade Estimada: <strong>${mortality}</strong></span>
                        <p style="margin-top: 10px; margin-bottom: 0; font-size: 0.85rem; opacity: 0.9;">Um aumento de 2 ou mais pontos no SOFA basal indica disfunção orgânica relacionada à infecção (sepse).</p>
                    </div>
                </div>
            `;

            resContainer.innerHTML = resultHTML;
            resContainer.style.display = "block";
            resContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }
});
