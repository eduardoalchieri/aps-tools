// Dispara o aplicativo para a tela da PPS guardando a página de retorno
window.iniciarIntegracaoPPS = function() {
    window.ppsOrigem = 'view-risco-ad';
    document.querySelectorAll('.view').forEach(v => { v.classList.remove('active'); v.classList.add('hidden'); });
    document.getElementById('view-pps').classList.remove('hidden');
    document.getElementById('view-pps').classList.add('active');
    document.getElementById('btn-voltar').classList.remove('hidden');
    window.scrollTo(0,0);
};

document.addEventListener("DOMContentLoaded", () => {
    const btnCalc = document.getElementById("btn-calc-risco-ad");

    if (btnCalc) {
        btnCalc.addEventListener("click", () => {
            let scoreTotal = 0;

            // 1. Soma dos Radios únicos
            scoreTotal += parseInt(document.querySelector('input[name="rad_idade"]:checked').value);
            scoreTotal += parseInt(document.querySelector('input[name="rad_dep"]:checked').value);
            scoreTotal += parseInt(document.querySelector('input[name="rad_pps"]:checked').value);

            // 2. Soma de todos os Checkboxes múltiplos marcados na tela
            document.querySelectorAll('.ad-chk:checked').forEach(chk => {
                scoreTotal += parseInt(chk.value);
            });

            // Definição das Faixas e Renderização
            const faixasRisco = [
                { titulo: "Baixo", min: 0, max: 5, prazo: "6 meses a 1 ano", cor: "#28a745", bg: "#e8f5e9" },
                { titulo: "Médio", min: 6, max: 10, prazo: "4 a 6 meses", cor: "#ff9800", bg: "#fff3e0" },
                { titulo: "Alto", min: 11, max: 15, prazo: "2 a 3 meses", cor: "#f57c00", bg: "#ffe0b2" },
                { titulo: "Muito alto", min: 16, max: 999, prazo: "1 a 2 meses", cor: "#dc3545", bg: "#ffebee" }
            ];

            let diag = "";
            let corPrincipal = "";

            let htmlTabela = `<div style="margin-top: 0.5rem; margin-bottom: 0;">
                <h4 style="color: #0b5ed7; margin-bottom: 10px; font-size: 1.05rem;">Classificação de Risco e Planejamento Temporal (Tabela 1)</h4>`;
            
            faixasRisco.forEach(faixa => {
                let ativo = (scoreTotal >= faixa.min && scoreTotal <= faixa.max);
                if (ativo) {
                    diag = faixa.titulo;
                    corPrincipal = faixa.cor;
                    htmlTabela += `
                        <div style="border: 2px solid ${faixa.cor}; background-color: ${faixa.bg}; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: ${faixa.cor}; font-size: 1.05rem;">Risco ${faixa.titulo}</strong>
                                <div style="font-size: 0.85rem; color: #444; margin-top: 3px;">Tempo médio p/ próxima visita: <strong>${faixa.prazo}</strong></div>
                            </div>
                            <span style="background-color: ${faixa.cor}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">PACIENTE</span>
                        </div>`;
                } else {
                    let descMax = faixa.max === 999 ? "Maior que 16" : `${faixa.min} a ${faixa.max}`;
                    if (faixa.min === 0) descMax = "Até 5";
                    
                    htmlTabela += `
                        <div style="border: 1px solid #ddd; background-color: #fafafa; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; opacity: 0.6;">
                            <div>
                                <strong style="color: #666; font-size: 1.05rem;">Risco ${faixa.titulo} <span style="font-size: 0.85rem; font-weight: normal;">(Escore: ${descMax})</span></strong>
                            </div>
                        </div>`;
                }
            });
            htmlTabela += `</div>`;

            // Renderização do Output
            const resDiv = document.getElementById("res-risco-ad");
            resDiv.innerHTML = `
                <div style="background-color: ${corPrincipal}; color: #FFFFFF; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Escore de Risco e Vulnerabilidade</div>
                    <div style="font-size: 4rem; font-weight: 800; line-height: 1.1;">${scoreTotal}</div>
                    <div style="font-size: 1.3rem; font-weight: 700; background-color: rgba(255,255,255,0.2); display: inline-block; padding: 4px 12px; border-radius: 20px; margin-top: 8px;">Risco ${diag}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    ${htmlTabela}
                    <p style="color: #888; font-size: 0.8rem; margin-top: 1.5rem; border-top: 1px solid #ddd; padding-top: 10px;">
                        Referência: Ribeiro MTAM, Fiuza TM, Pinheiro JV. Ferramenta para avaliação e gestão da visita domiciliar na atenção primária à saúde: um relato de experiência. Rev Bras Med Fam Comunidade. 2019.
                    </p>
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});