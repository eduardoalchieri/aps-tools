document.addEventListener("DOMContentLoaded", () => {
    const btnCalc = document.getElementById("btn-calc-qsofa");
    const resContainer = document.getElementById("res-qsofa");

    if (btnCalc) {
        btnCalc.addEventListener("click", () => {
            const fr = document.getElementById("qsofa-fr").checked ? 1 : 0;
            const mental = document.getElementById("qsofa-mental").checked ? 1 : 0;
            const pas = document.getElementById("qsofa-pas").checked ? 1 : 0;

            const totalScore = fr + mental + pas;

            let resultHTML = "";

            if (totalScore >= 2) {
                resultHTML = `
                    <div style="background-color: #f8d7da; color: #721c24; padding: 15px; border-radius: 8px; border: 1px solid #f5c6cb;">
                        <h3 style="margin-top: 0; display: flex; align-items: center; gap: 8px;">
                            <span class="material-symbols-outlined">warning</span> Alto Risco (qSOFA: ${totalScore} pontos)
                        </h3>
                        <p style="margin-bottom: 0;"><strong>Alerta:</strong> Pontuação &ge; 2 indica alto risco de desfecho clínico ruim e mortalidade. Avalie disfunção orgânica detalhada (SOFA) e considere manejo clínico agressivo para provável sepse.</p>
                    </div>
                `;
            } else {
                resultHTML = `
                    <div style="background-color: #d4edda; color: #155724; padding: 15px; border-radius: 8px; border: 1px solid #c3e6cb;">
                        <h3 style="margin-top: 0; display: flex; align-items: center; gap: 8px;">
                            <span class="material-symbols-outlined">check_circle</span> Baixo Risco (qSOFA: ${totalScore} ponto${totalScore === 1 ? '' : 's'})
                        </h3>
                        <p style="margin-bottom: 0;">Pontuação < 2. Menor risco imediato de complicação por sepse. Mantenha reavaliação clínica conforme evolução.</p>
                    </div>
                `;
            }

            resContainer.innerHTML = resultHTML;
            resContainer.style.display = "block";
        });
    }
});
