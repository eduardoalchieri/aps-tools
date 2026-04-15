document.addEventListener("DOMContentLoaded", () => {
    const btnCalc = document.getElementById("btn-calc-coelho");

    if (btnCalc) {
        btnCalc.addEventListener("click", () => {
            
            // Soma ponderada: Valor do Botão Selecionado * Peso da Sentinela
            const total = 
                (parseInt(document.querySelector('input[name="cs_aca"]:checked').value) * 3) +
                (parseInt(document.querySelector('input[name="cs_def"]:checked').value) * 3) +
                (parseInt(document.querySelector('input[name="cs_desn"]:checked').value) * 3) +
                (parseInt(document.querySelector('input[name="cs_dro"]:checked').value) * 2) +
                (parseInt(document.querySelector('input[name="cs_desemp"]:checked').value) * 2) +
                (parseInt(document.querySelector('input[name="cs_analf"]:checked').value) * 1) +
                (parseInt(document.querySelector('input[name="cs_m6"]:checked').value) * 1) +
                (parseInt(document.querySelector('input[name="cs_m70"]:checked').value) * 1) +
                (parseInt(document.querySelector('input[name="cs_has"]:checked').value) * 1) +
                (parseInt(document.querySelector('input[name="cs_dm"]:checked').value) * 1) +
                parseInt(document.querySelector('input[name="cs_san"]:checked').value) +
                parseInt(document.querySelector('input[name="cs_rel"]:checked').value);

            // Definição das Faixas e Renderização baseada na tabela
            const faixasCoelho = [
                { titulo: "Sem Risco Específico", min: 0, max: 4, exibe: "0 a 4", cor: "#6c757d", bg: "#f8f9fa", desc: "A família encontra-se em situação de risco basal. O acompanhamento pode seguir a rotina padrão da Unidade Básica de Saúde." },
                { titulo: "R1 – Risco menor", min: 5, max: 6, exibe: "5 ou 6", cor: "#28a745", bg: "#e8f5e9", desc: "Recomenda-se acompanhamento e visitas domiciliares periódicas para monitoramento dos agravos identificados." },
                { titulo: "R2 – Risco médio", min: 7, max: 8, exibe: "7 ou 8", cor: "#ff9800", bg: "#fff3e0", desc: "O agente comunitário de saúde deve aumentar a vigilância e a equipe técnica deve ser envolvida no plano terapêutico." },
                { titulo: "R3 – Risco máximo", min: 9, max: 999, exibe: "Acima de 9", cor: "#dc3545", bg: "#ffebee", desc: "Atenção: Intervenção imediata e multiprofissional da ESF é prioritária no domicílio." }
            ];

            let diag = "";
            let corPrincipal = "";
            let descr = "";

            let htmlTabela = `<div style="margin-top: 1rem; margin-bottom: 0;">
                <h4 style="color: #0b5ed7; margin-bottom: 10px; font-size: 1.05rem;">Cálculo do risco familiar</h4>`;
            
            faixasCoelho.forEach(faixa => {
                let ativo = (total >= faixa.min && total <= faixa.max);
                if (ativo) {
                    diag = faixa.titulo;
                    corPrincipal = faixa.cor;
                    descr = faixa.desc;
                    htmlTabela += `
                        <div style="border: 2px solid ${faixa.cor}; background-color: ${faixa.bg}; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: ${faixa.cor}; font-size: 1rem;">${faixa.titulo}</strong>
                                <div style="font-size: 0.85rem; color: #444; margin-top: 3px;">Escore total: <strong>${faixa.exibe}</strong></div>
                            </div>
                            <span style="background-color: ${faixa.cor}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">FAMÍLIA</span>
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

            // Renderização do Output "Dashboard"
            const resDiv = document.getElementById("resultado-coelho");
            resDiv.innerHTML = `
                <div style="background-color: ${corPrincipal}; color: #FFFFFF; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Escore de Risco Familiar</div>
                    <div style="font-size: 4rem; font-weight: 800; line-height: 1.1;">${total}</div>
                    <div style="font-size: 1.3rem; font-weight: 700; background-color: rgba(255,255,255,0.2); display: inline-block; padding: 4px 12px; border-radius: 20px; margin-top: 8px;">${diag}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <p style="font-size: 1rem; color: #444; line-height: 1.5; margin-bottom: 1.5rem;"><strong>Conduta sugerida:</strong> ${descr}</p>
                    
                    ${htmlTabela}
                    
                    <p style="color: #888; font-size: 0.8rem; margin-top: 1.5rem; border-top: 1px solid #ddd; padding-top: 10px;">
                        Referência: Savassi LCM, Lage JL, Coelho FLG. Sistematização de instrumento de estratificação de risco familiar: a Escala de Risco Familiar de Coelho-Savassi. J Manag Prim Health Care. 2012.
                    </p>
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});