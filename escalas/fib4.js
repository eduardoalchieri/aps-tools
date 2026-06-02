document.addEventListener("DOMContentLoaded", () => {
    const btnCalcFib4 = document.getElementById("btn-calc-fib4");

    if (btnCalcFib4) {
        btnCalcFib4.addEventListener("click", () => {
            const inputIdade = document.getElementById("fib4-idade").value;
            const inputAst = document.getElementById("fib4-ast").value;
            const inputAlt = document.getElementById("fib4-alt").value;
            const inputPlaquetas = document.getElementById("fib4-plaquetas").value;

            if (!inputIdade || !inputAst || !inputAlt || !inputPlaquetas) {
                alert("Por favor, preencha todos os campos.");
                return;
            }

            const idade = parseFloat(inputIdade);
            const ast = parseFloat(inputAst);
            const alt = parseFloat(inputAlt);
            const plaquetas = parseFloat(inputPlaquetas);

            // Validações para evitar divisão por zero ou valores absurdos/negativos
            if (idade <= 0 || ast <= 0 || alt <= 0 || plaquetas <= 0) {
                alert("Todos os valores numéricos devem ser maiores que zero. A contagem de plaquetas e ALT não podem ser nulas.");
                return;
            }

            // Lógica: FIB-4 = (Age * AST) / (Platelets * sqrt(ALT))
            const fib4 = (idade * ast) / (plaquetas * Math.sqrt(alt));
            const fib4Rounded = fib4.toFixed(2);

            let diagnostico = "";
            let corHex = "";
            let descricao = "";
            
            const faixasRisco = [
                { titulo: "Risco Baixo", min: 0, max: 1.4499, cor: "#28a745", bg: "#e8f5e9", desc: "Alto valor preditivo negativo para excluir fibrose avançada (F3-F4)." },
                { titulo: "Indeterminado", min: 1.45, max: 3.25, cor: "#ff9800", bg: "#fff3e0", desc: "Necessária avaliação adicional ou métodos não invasivos (ex: elastografia hepática)." },
                { titulo: "Risco Alto", min: 3.2501, max: 9999, cor: "#dc3545", bg: "#ffebee", desc: "Alto valor preditivo positivo para diagnosticar fibrose avançada (F3-F4)." }
            ];

            let htmlTabela = `<div style="margin-top: 1.5rem; margin-bottom: 0;">
                <h4 style="color: #0b5ed7; margin-bottom: 10px; font-size: 1.05rem;">Estratificação de Risco Hepático</h4>`;

            faixasRisco.forEach(faixa => {
                let ativo = (fib4 >= faixa.min && fib4 <= faixa.max);
                if (ativo) {
                    diagnostico = faixa.titulo;
                    corHex = faixa.cor;
                    descricao = faixa.desc;
                    htmlTabela += `
                        <div style="border: 2px solid ${faixa.cor}; background-color: ${faixa.bg}; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: ${faixa.cor}; font-size: 1rem;">${faixa.titulo}</strong>
                            </div>
                            <span style="background-color: ${faixa.cor}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">PACIENTE</span>
                        </div>`;
                } else {
                    let exibicaoFiltro = "";
                    if (faixa.titulo === "Risco Baixo") exibicaoFiltro = "< 1.45";
                    if (faixa.titulo === "Indeterminado") exibicaoFiltro = "1.45 - 3.25";
                    if (faixa.titulo === "Risco Alto") exibicaoFiltro = "> 3.25";

                    htmlTabela += `
                        <div style="border: 1px solid #ddd; background-color: #fafafa; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; opacity: 0.6;">
                            <div>
                                <strong style="color: #666; font-size: 1rem;">${faixa.titulo} <span style="font-size: 0.85rem; font-weight: normal;">(${exibicaoFiltro})</span></strong>
                            </div>
                        </div>`;
                }
            });
            htmlTabela += `</div>`;

            const resDiv = document.getElementById("res-fib4");
            resDiv.innerHTML = `
                <div style="background-color: ${corHex}; color: #FFFFFF; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Escore FIB-4</div>
                    <div style="font-size: 4rem; font-weight: 800; line-height: 1.1;">${fib4Rounded}</div>
                    <div style="font-size: 1.3rem; font-weight: 700; background-color: rgba(255,255,255,0.2); display: inline-block; padding: 4px 12px; border-radius: 20px; margin-top: 8px;">${diagnostico}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <p style="font-size: 1rem; color: #444; line-height: 1.5; margin-bottom: 0;"><strong>Interpretação:</strong> ${descricao}</p>
                    ${htmlTabela}
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
