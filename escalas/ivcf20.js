document.addEventListener("DOMContentLoaded", () => {
    const btnCalc = document.getElementById("btn-calc-ivcf20");

    if (btnCalc) {
        btnCalc.addEventListener("click", () => {
            // Verificação de preenchimento obrigatório de todas as 20 perguntas
            let todasRespondidas = true;
            let valores = {};

            for (let i = 1; i <= 20; i++) {
                const resposta = document.querySelector(`input[name="iv${i}"]:checked`);
                if (!resposta) {
                    todasRespondidas = false;
                    break;
                }
                valores[`q${i}`] = parseInt(resposta.value);
            }

            if (!todasRespondidas) {
                alert("Atenção: Por favor, responda a todas as 20 perguntas para gerar a pontuação do IVCF-20.");
                return;
            }

            // Lógica Específica: A pontuação máxima do bloco AVD Instrumental (Q3, Q4, Q5) é 4 pontos
            const scoreAVDInst = Math.max(valores.q3, valores.q4, valores.q5);

            // Soma Total
            const scoreTotal = valores.q1 + valores.q2 + scoreAVDInst + valores.q6 + valores.q7 + 
                               valores.q8 + valores.q9 + valores.q10 + valores.q11 + valores.q12 + 
                               valores.q13 + valores.q14 + valores.q15 + valores.q16 + valores.q17 + 
                               valores.q18 + valores.q19 + valores.q20;

            // Definição das Faixas e Renderização
            const faixasIVCF = [
                { titulo: "Baixa Vulnerabilidade", min: 0, max: 6, exibe: "0 a 6 pontos", cor: "#28a745", bg: "#e8f5e9" },
                { titulo: "Moderada Vulnerabilidade", min: 7, max: 14, exibe: "7 a 14 pontos", cor: "#ff9800", bg: "#fff3e0" },
                { titulo: "Alta Vulnerabilidade", min: 15, max: 40, exibe: "≥ 15 pontos", cor: "#dc3545", bg: "#ffebee" }
            ];

            let diag = "";
            let corPrincipal = "";

            let htmlTabela = `<div style="margin-top: 0.5rem; margin-bottom: 0;">
                <h4 style="color: #0b5ed7; margin-bottom: 15px; font-size: 1.05rem;">Classificação IVCF-20</h4>`;
            
            faixasIVCF.forEach(faixa => {
                let ativo = (scoreTotal >= faixa.min && scoreTotal <= faixa.max);
                if (ativo) {
                    diag = faixa.titulo;
                    corPrincipal = faixa.cor;
                    htmlTabela += `
                        <div style="border: 2px solid ${faixa.cor}; background-color: ${faixa.bg}; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                            <strong style="color: ${faixa.cor}; font-size: 1rem;">${faixa.titulo} <br><span style="font-weight: normal; font-size: 0.85rem; color: #555;">(${faixa.exibe})</span></strong>
                            <span style="background-color: ${faixa.cor}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">PACIENTE</span>
                        </div>`;
                } else {
                    htmlTabela += `
                        <div style="border: 1px solid #ddd; background-color: #fafafa; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; opacity: 0.6;">
                            <strong style="color: #666; font-size: 1rem;">${faixa.titulo} <br><span style="font-weight: normal; font-size: 0.85rem; color: #888;">(${faixa.exibe})</span></strong>
                        </div>`;
                }
            });
            htmlTabela += `</div>`;

            // Renderização do Output
            const resDiv = document.getElementById("res-ivcf20");
            resDiv.innerHTML = `
                <div style="background-color: ${corPrincipal}; color: #FFFFFF; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Pontuação Total</div>
                    <div style="font-size: 4rem; font-weight: 800; line-height: 1.1;">${scoreTotal}</div>
                    <div style="font-size: 1.3rem; font-weight: 700; background-color: rgba(255,255,255,0.2); display: inline-block; padding: 4px 12px; border-radius: 20px; margin-top: 8px;">${diag}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    ${htmlTabela}
                    <p style="color: #888; font-size: 0.8rem; margin-top: 1.5rem; border-top: 1px solid #ddd; padding-top: 10px;">
                        Referência: Moraes EN, Lanna FM, Santos RR, Bicalho MAC, Machado CJ, Romero DE. Índice de Vulnerabilidade Clínico-Funcional-20 (IVCF-20): reconhecimento rápido do idoso frágil. Rev Saude Publica. 2016.
                    </p>
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});