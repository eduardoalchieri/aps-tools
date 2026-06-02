document.addEventListener("DOMContentLoaded", () => {
    const btnCalcGbs = document.getElementById("btn-calc-gbs");

    if (btnCalcGbs) {
        btnCalcGbs.addEventListener("click", () => {
            const inputSexo = document.querySelector('input[name="gbs_sexo"]:checked');
            const inputUreia = document.getElementById("gbs-ureia").value;
            const inputHb = document.getElementById("gbs-hb").value;
            const inputPas = document.getElementById("gbs-pas").value;
            const inputFc = document.getElementById("gbs-fc").value;
            
            const inputMelena = document.querySelector('input[name="gbs_melena"]:checked');
            const inputSincope = document.querySelector('input[name="gbs_sincope"]:checked');
            const inputFigado = document.querySelector('input[name="gbs_figado"]:checked');
            const inputIc = document.querySelector('input[name="gbs_ic"]:checked');

            if (!inputSexo || !inputUreia || !inputHb || !inputPas || !inputFc || !inputMelena || !inputSincope || !inputFigado || !inputIc) {
                alert("Por favor, preencha todos os campos obrigatórios para o cálculo do Escore GBS.");
                return;
            }

            const sexo = inputSexo.value;
            const ureia = parseFloat(inputUreia);
            const hb = parseFloat(inputHb);
            const pas = parseFloat(inputPas);
            const fc = parseFloat(inputFc);

            const melena = parseInt(inputMelena.value);
            const sincope = parseInt(inputSincope.value);
            const figado = parseInt(inputFigado.value);
            const ic = parseInt(inputIc.value);

            let total = 0;

            // Ureia
            if (ureia >= 39 && ureia < 48) total += 2;
            else if (ureia >= 48 && ureia < 60) total += 3;
            else if (ureia >= 60 && ureia < 150) total += 4;
            else if (ureia >= 150) total += 6;

            // Hemoglobina
            if (sexo === 'M') {
                if (hb >= 12.0 && hb < 13.0) total += 1;
                else if (hb >= 10.0 && hb < 12.0) total += 3;
                else if (hb < 10.0) total += 6;
            } else { // F
                if (hb >= 10.0 && hb < 12.0) total += 1;
                else if (hb < 10.0) total += 6;
            }

            // PAS
            if (pas >= 100 && pas <= 109) total += 1;
            else if (pas >= 90 && pas <= 99) total += 2;
            else if (pas < 90) total += 3;

            // FC
            if (fc >= 100) total += 1;

            // Comorbidades / Apresentação
            if (melena === 1) total += 1;
            if (sincope === 1) total += 2;
            if (figado === 1) total += 2;
            if (ic === 1) total += 2;

            let classificacao = "";
            let corHex = "";
            let bgTint = "";
            let conduta = "";

            if (total === 0) {
                classificacao = "Risco Muito Baixo";
                corHex = "#28a745"; // Verde
                bgTint = "#e8f5e9";
                conduta = "Necessidade mínima de intervenção clínica. Considerar alta precoce e endoscopia ambulatorial.";
            } else {
                classificacao = "Alto Risco";
                corHex = "#dc3545"; // Vermelho
                bgTint = "#ffebee";
                conduta = "Risco progressivo de necessidade de transfusão, terapia endoscópica ou intervenção cirúrgica. Indicada admissão hospitalar.";
            }

            const resDiv = document.getElementById("res-gbs");
            resDiv.innerHTML = `
                <div style="background-color: ${corHex}; color: #FFFFFF; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Escore Glasgow-Blatchford</div>
                    <div style="font-size: 4rem; font-weight: 800; line-height: 1.1;">${total}</div>
                    <div style="font-size: 1.3rem; font-weight: 700; background-color: rgba(255,255,255,0.3); display: inline-block; padding: 4px 12px; border-radius: 20px; margin-top: 8px;">${classificacao}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: ${bgTint}; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <h4 style="color: ${corHex}; margin-top: 0; margin-bottom: 8px; font-size: 1.1rem;">Conduta Recomendada</h4>
                    <p style="font-size: 1rem; color: #444; line-height: 1.5; margin-bottom: 0;">${conduta}</p>
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
