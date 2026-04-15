// Função global de navegação direta para o HAS-BLED
window.irParaHasBled = function() {
    document.querySelectorAll('.view').forEach(v => { 
        v.classList.remove('active'); 
        v.classList.add('hidden'); 
    });
    const viewHasBled = document.getElementById('view-hasbled');
    if (viewHasBled) {
        viewHasBled.classList.remove('hidden');
        viewHasBled.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const btnCalcChads = document.getElementById("btn-calc-chads");

    if (btnCalcChads) {
        btnCalcChads.addEventListener("click", () => {
            
            // Coleta os valores selecionados
            const pIdade = document.querySelector('input[name="chads_idade"]:checked');
            const pIc = document.querySelector('input[name="chads_ic"]:checked');
            const pHas = document.querySelector('input[name="chads_has"]:checked');
            const pDm = document.querySelector('input[name="chads_dm"]:checked');
            const pAvc = document.querySelector('input[name="chads_avc"]:checked');
            const pVasc = document.querySelector('input[name="chads_vasc"]:checked');

            // Validação de segurança
            if (!pIdade || !pIc || !pHas || !pDm || !pAvc || !pVasc) {
                alert("Atenção: Por favor, responda a todos os parâmetros para calcular o escore.");
                return;
            }

            // Cálculo Cumulativo CHA2DS2-VA
            const total = parseInt(pIdade.value) + parseInt(pIc.value) + 
                          parseInt(pHas.value) + parseInt(pDm.value) + 
                          parseInt(pAvc.value) + parseInt(pVasc.value);

            let diagnostico = "";
            let cor = "";
            let desc = "";

            // Tabela 2: Algoritmo de decisão unificado
            const faixasRisco = [
                { titulo: "Baixo Risco", min: 0, max: 0, exibe: "0 pontos", cor: "#28a745", bg: "#e8f5e9", conduta: "A terapia anticoagulante oral não é recomendada." },
                { titulo: "Risco Intermediário", min: 1, max: 1, exibe: "1 ponto", cor: "#ff9800", bg: "#fff3e0", conduta: "A anticoagulação oral deve ser considerada (Classe IIa). A decisão deve ser individualizada, pesando o risco-benefício e as preferências do paciente." },
                { titulo: "Alto Risco", min: 2, max: 99, exibe: "≥ 2 pontos", cor: "#dc3545", bg: "#ffebee", conduta: "A terapia anticoagulante oral é fortemente recomendada (Classe I) para a prevenção absoluta de AVC e eventos sistêmicos. Foco na prescrição de ACODs preferencialmente aos antagonistas da vitamina K." }
            ];

            let htmlTabela = `<div style="margin-top: 1.5rem; margin-bottom: 0;">
                <h4 style="color: #0b5ed7; margin-bottom: 10px; font-size: 1.05rem;">Recomendações Terapêuticas (ESC 2024 / SBC 2025)</h4>`;
            
            faixasRisco.forEach(faixa => {
                let ativo = (total >= faixa.min && total <= faixa.max);
                if (ativo) {
                    diagnostico = faixa.titulo;
                    cor = faixa.cor;
                    desc = faixa.conduta;
                    htmlTabela += `
                        <div style="border: 2px solid ${faixa.cor}; background-color: ${faixa.bg}; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: ${faixa.cor}; font-size: 1rem;">${faixa.titulo}</strong>
                                <div style="font-size: 0.85rem; color: #444; margin-top: 3px;">Escore: <strong>${faixa.exibe}</strong></div>
                            </div>
                            <span style="background-color: ${faixa.cor}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">PACIENTE</span>
                        </div>`;
                } else {
                    htmlTabela += `
                        <div style="border: 1px solid #ddd; background-color: #fafafa; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; opacity: 0.6;">
                            <div>
                                <strong style="color: #666; font-size: 1rem;">${faixa.titulo} <span style="font-size: 0.85rem; font-weight: normal;">(${faixa.exibe})</span></strong>
                            </div>
                        </div>`;
                }
            });
            htmlTabela += `</div>`;

            // Renderiza o resultado na interface
            const resDiv = document.getElementById("res-chads");
            resDiv.innerHTML = `
                <div style="background-color: ${cor}; color: #FFFFFF; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Escore CHA₂DS₂-VA</div>
                    <div style="font-size: 4rem; font-weight: 800; line-height: 1.1;">${total}</div>
                    <div style="font-size: 1.3rem; font-weight: 700; background-color: rgba(255,255,255,0.2); display: inline-block; padding: 4px 12px; border-radius: 20px; margin-top: 8px;">${diagnostico}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <p style="font-size: 1rem; color: #444; line-height: 1.5; margin-bottom: 1.5rem;"><strong>Conduta Clínica:</strong> ${desc}</p>
                    
                    ${htmlTabela}
                    
                    <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px dashed #ccc;">
                        <h4 style="color: #dc3545; margin-bottom: 8px; font-size: 1rem;"><span class="material-symbols-outlined" style="vertical-align: bottom; font-size: 1.1rem;">bloodtype</span> Risco de Sangramento (HAS-BLED)</h4>
                        <p style="font-size: 0.85rem; color: #555; line-height: 1.4; margin-bottom: 15px;">A indicação da terapia anticoagulante baseada no CHA₂DS₂-VA deve ser acompanhada pela avaliação de risco hemorrágico (HAS-BLED). Uma pontuação elevada (≥ 3) <strong>não deve</strong> ser utilizada como justificativa isolada para contraindicar a anticoagulação, servindo prioritariamente para identificar e corrigir fatores modificáveis.</p>
                        
                        <button type="button" class="btn-action-sc" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background-color: #dc3545; border-color: #dc3545;" onclick="irParaHasBled()">
                            <span class="material-symbols-outlined">calculate</span> Avaliar HAS-BLED Agora
                        </button>
                    </div>

                    <p style="color: #888; font-size: 0.8rem; margin-top: 1.5rem; border-top: 1px solid #ddd; padding-top: 10px;">
                        Referência: Diretrizes da Sociedade Europeia de Cardiologia (ESC) de 2024 e Diretriz de Fibrilação Atrial da Sociedade Brasileira de Cardiologia (SBC) de 2025.
                    </p>
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});