document.addEventListener("DOMContentLoaded", function() {
    const viewContainer = document.getElementById("view-calc-mdsupdrs");
    if (!viewContainer) return;

    const navBtns = viewContainer.querySelectorAll(".sub-nav-btn");
    const partContainers = viewContainer.querySelectorAll(".mds-part-container");
    const calcBtn = document.getElementById("btn-calc-mdsupdrs");
    const resultBox = document.getElementById("resultado-mdsupdrs");

    navBtns.forEach((btn, index) => {
        btn.addEventListener("click", function() {
            navBtns.forEach(b => b.classList.remove("active"));
            partContainers.forEach(p => p.classList.remove("active"));
            
            this.classList.add("active");
            partContainers[index].classList.add("active");
        });
    });

    calcBtn.addEventListener("click", function() {
        const inputGroups = viewContainer.querySelectorAll(".input-group-med");
        let scorePart1 = 0, scorePart2 = 0, scorePart3 = 0, scorePart4 = 0;
        let missingItems = 0;

        inputGroups.forEach(group => {
            const checkedRadio = group.querySelector("input[type='radio']:checked");
            
            if (!checkedRadio) {
                missingItems++;
            } else {
                const value = parseInt(checkedRadio.value, 10);
                const name = checkedRadio.name;
                
                if (name.startsWith("mds_1_")) {
                    scorePart1 += value;
                } else if (name.startsWith("mds_2_")) {
                    scorePart2 += value;
                } else if (name.startsWith("mds_3_")) {
                    scorePart3 += value;
                } else if (name.startsWith("mds_4_")) {
                    scorePart4 += value;
                }
            }
        });

        if (missingItems > 0) {
            alert(`Aviso do Sistema: Impossível calcular. Faltam ${missingItems} variáveis obrigatórias a serem preenchidas na escala MDS-UPDRS.`);
            resultBox.classList.add("hidden");
            return;
        }

        const totalScore = scorePart1 + scorePart2 + scorePart3 + scorePart4;

        resultBox.innerHTML = `
            <div style="text-align: left; margin-bottom: 15px;">
                <p style="margin: 5px 0;"><strong>Parte I (Não Motor):</strong> ${scorePart1} pontos</p>
                <p style="margin: 5px 0;"><strong>Parte II (Motor - AVD):</strong> ${scorePart2} pontos</p>
                <p style="margin: 5px 0;"><strong>Parte III (Exame Motor):</strong> ${scorePart3} pontos</p>
                <p style="margin: 5px 0;"><strong>Parte IV (Complicações):</strong> ${scorePart4} pontos</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #bbdefb; margin: 15px 0;">
            <div style="font-size: 1.5rem; color: #004d7a;">
                Escore Total Geral: <strong>${totalScore}</strong> pontos
            </div>
        `;
        
        resultBox.classList.remove("hidden");
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
});