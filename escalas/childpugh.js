document.addEventListener("DOMContentLoaded", () => {
    const btnCalcChildPugh = document.getElementById("btn-calc-childpugh");

    if (btnCalcChildPugh) {
        btnCalcChildPugh.addEventListener("click", () => {
            const inputBili = document.getElementById("cp-bilirrubina").value;
            const inputAlb = document.getElementById("cp-albumina").value;
            const inputInr = document.getElementById("cp-inr").value;
            const inputAscite = document.querySelector('input[name="cp_ascite"]:checked');
            const inputEncefalo = document.querySelector('input[name="cp_encefalopatia"]:checked');

            if (!inputBili || !inputAlb || !inputInr || !inputAscite || !inputEncefalo) {
                alert("Por favor, preencha todos os campos obrigatórios para o cálculo do Escore Child-Pugh.");
                return;
            }

            const bili = parseFloat(inputBili);
            const alb = parseFloat(inputAlb);
            const inr = parseFloat(inputInr);
            const ascite = parseInt(inputAscite.value);
            const encefalo = parseInt(inputEncefalo.value);

            let pontosBili = 0;
            if (bili < 2.0) pontosBili = 1;
            else if (bili >= 2.0 && bili <= 3.0) pontosBili = 2;
            else pontosBili = 3;

            let pontosAlb = 0;
            if (alb > 3.5) pontosAlb = 1;
            else if (alb >= 2.8 && alb <= 3.5) pontosAlb = 2;
            else pontosAlb = 3;

            let pontosInr = 0;
            if (inr < 1.7) pontosInr = 1;
            else if (inr >= 1.7 && inr <= 2.2) pontosInr = 2;
            else pontosInr = 3;

            const total = pontosBili + pontosAlb + pontosInr + ascite + encefalo;

            let classificacao = "";
            let corHex = "";
            let bgTint = "";
            let sobrevida = "";

            if (total >= 5 && total <= 6) {
                classificacao = "Classe A";
                corHex = "#28a745"; // Verde
                bgTint = "#e8f5e9";
                sobrevida = "Sobrevida em 1 ano estimada em ~100%. Sobrevida em 2 anos: ~85%.";
            } else if (total >= 7 && total <= 9) {
                classificacao = "Classe B";
                corHex = "#fbc02d"; // Amarelo
                bgTint = "#fff9c4";
                sobrevida = "Sobrevida em 1 ano estimada em ~80%. Sobrevida em 2 anos: ~60%.";
            } else if (total >= 10 && total <= 15) {
                classificacao = "Classe C";
                corHex = "#dc3545"; // Vermelho
                bgTint = "#ffebee";
                sobrevida = "Sobrevida em 1 ano estimada em ~45%. Sobrevida em 2 anos: ~35%.";
            }

            const faixasRisco = [
                { titulo: "Classe A (Doença bem compensada)", min: 5, max: 6, cor: "#28a745", bg: "#e8f5e9", subtitulo: "5 a 6 pontos" },
                { titulo: "Classe B (Comprometimento funcional significativo)", min: 7, max: 9, cor: "#fbc02d", bg: "#fff9c4", subtitulo: "7 a 9 pontos" },
                { titulo: "Classe C (Doença descompensada)", min: 10, max: 15, cor: "#dc3545", bg: "#ffebee", subtitulo: "10 a 15 pontos" }
            ];

            let htmlTabela = `<div style="margin-top: 1.5rem; margin-bottom: 0;">
                <h4 style="color: #0b5ed7; margin-bottom: 10px; font-size: 1.05rem;">Classificação Prognóstica</h4>`;

            faixasRisco.forEach(faixa => {
                let ativo = (total >= faixa.min && total <= faixa.max);
                if (ativo) {
                    htmlTabela += `
                        <div style="border: 2px solid ${faixa.cor}; background-color: ${faixa.bg}; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: ${faixa.cor}; font-size: 1rem;">${faixa.titulo}</strong>
                                <div style="font-size: 0.85rem; color: #444; margin-top: 3px;">Pontuação: <strong>${faixa.subtitulo}</strong></div>
                            </div>
                            <span style="background-color: ${faixa.cor}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">PACIENTE</span>
                        </div>`;
                } else {
                    htmlTabela += `
                        <div style="border: 1px solid #ddd; background-color: #fafafa; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; opacity: 0.6;">
                            <div>
                                <strong style="color: #666; font-size: 1rem;">${faixa.titulo}</strong>
                            </div>
                            <div style="font-size: 0.85rem; color: #888;">${faixa.subtitulo}</div>
                        </div>`;
                }
            });
            htmlTabela += `</div>`;

            const resDiv = document.getElementById("res-childpugh");
            resDiv.innerHTML = `
                <div style="background-color: ${corHex}; color: ${total >= 7 && total <= 9 ? '#333' : '#FFFFFF'}; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Pontuação Total</div>
                    <div style="font-size: 4rem; font-weight: 800; line-height: 1.1;">${total}</div>
                    <div style="font-size: 1.3rem; font-weight: 700; background-color: rgba(255,255,255,0.3); display: inline-block; padding: 4px 12px; border-radius: 20px; margin-top: 8px;">${classificacao}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <p style="font-size: 1rem; color: #444; line-height: 1.5; margin-bottom: 0;"><strong>Estimativa de Sobrevida:</strong> ${sobrevida}</p>
                    ${htmlTabela}
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
