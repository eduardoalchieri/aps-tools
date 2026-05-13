document.addEventListener("DOMContentLoaded", () => {
    const btnCalc = document.getElementById("btn-calc-ease");
    const resDiv = document.getElementById("res-ease");

    if (btnCalc) {
        btnCalc.addEventListener("click", () => {
            const symptoms = [
                { id: "dor", name: "Dor", labels: ["Sem dor", "Pior dor possível"] },
                { id: "can", name: "Cansaço / Fadiga", labels: ["Sem cansaço", "Pior cansaço possível"] },
                { id: "nau", name: "Náusea", labels: ["Sem náusea", "Pior náusea possível"] },
                { id: "dep", name: "Depressão", labels: ["Sem depressão", "Pior depressão possível"] },
                { id: "ans", name: "Ansiedade", labels: ["Sem ansiedade", "Pior ansiedade possível"] },
                { id: "son", name: "Sonolência", labels: ["Sem sonolência", "Pior sonolência possível"] },
                { id: "ape", name: "Apetite", labels: ["Melhor apetite", "Pior apetite possível"] },
                { id: "bem", name: "Bem-estar", labels: ["Melhor bem-estar", "Pior bem-estar possível"] },
                { id: "ar",  name: "Falta de ar", labels: ["Sem falta de ar", "Pior falta de ar possível"] }
            ];

            let scoreTotal = 0;
            let resultsHtml = `<div style="margin-bottom: 1.5rem; border-bottom: 1px solid #eee; padding-bottom: 10px;"><h3 style="font-size: 1.1rem; color: #333;">Gravidade por Sintoma:</h3></div>`;
            let allAnswered = true;

            symptoms.forEach(s => {
                const checked = document.querySelector(`input[name="ease_${s.id}"]:checked`);
                if (!checked) {
                    allAnswered = false;
                    return;
                }
                const val = parseInt(checked.value);
                scoreTotal += val;

                let classification = "";
                let cor = "";
                if (val === 0) { classification = "Ausente"; cor = "#28a745"; }
                else if (val <= 3) { classification = "Leve"; cor = "#ffc107"; }
                else if (val <= 6) { classification = "Moderado"; cor = "#fd7e14"; }
                else { classification = "Intenso"; cor = "#dc3545"; }

                resultsHtml += `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f9f9f9;">
                        <div>
                            <strong style="color: #555;">${s.name}:</strong> 
                            <span style="margin-left: 5px; font-weight: 600; color: ${cor};">${classification} (Paciente)</span>
                        </div>
                        <div style="background: ${cor}; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.9rem;">${val}</div>
                    </div>
                `;
            });

            if (!allAnswered) {
                alert("Por favor, avalie todos os 9 sintomas antes de calcular.");
                return;
            }

            resDiv.innerHTML = `
                <div style="background-color: #0b5ed7; color: #FFFFFF; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <h2 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; margin: 0;">Escore de Sofrimento (Total)</h2>
                    <div style="font-size: 3.5rem; font-weight: 800; line-height: 1.2;">${scoreTotal}</div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">Soma dos Sintomas (0 a 90)</div>
                </div>
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    ${resultsHtml}
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
