document.addEventListener("DOMContentLoaded", () => {
    const btnCalcMeem = document.getElementById("btn-calc-meem");
    
    if (btnCalcMeem) {
        btnCalcMeem.addEventListener("click", () => {
            
            const inputsMarcados = document.querySelectorAll('#form-meem input[type="radio"]:checked');
            
            if (inputsMarcados.length < 30) {
                alert("Atenção: Por favor, assinale 0 ou 1 para todos os 30 itens da escala antes de gerar o resultado.");
                return;
            }

            let scoreTotal = 0;
            let perdasPorDominio = {};
            
            // Define o máximo de pontos possíveis por categoria baseados na nova estrutura
            const maximosCategoria = {
                "Orientação Temporal": 5,
                "Orientação Espacial": 5,
                "Registros": 3,
                "Atenção e Cálculo": 5,
                "Lembranças (memória de evocação)": 3,
                "Linguagem": 9
            };

            const pontosPaciente = {
                "Orientação Temporal": 0,
                "Orientação Espacial": 0,
                "Registros": 0,
                "Atenção e Cálculo": 0,
                "Lembranças (memória de evocação)": 0,
                "Linguagem": 0
            };

            // Tabulação dos pontos
            inputsMarcados.forEach(radio => {
                const valor = parseInt(radio.value);
                const categoria = radio.getAttribute("data-cat");
                scoreTotal += valor;
                if (categoria && pontosPaciente.hasOwnProperty(categoria)) {
                    pontosPaciente[categoria] += valor;
                }
            });

            // Geração da lista de perdas discriminadas
            let htmlPerdas = "";
            let tevePerda = false;

            for (const [cat, maximo] of Object.entries(maximosCategoria)) {
                const pontosFeitos = pontosPaciente[cat];
                const pontosPerdidos = maximo - pontosFeitos;
                
                if (pontosPerdidos > 0) {
                    tevePerda = true;
                    const textoPonto = pontosPerdidos === 1 ? "ponto" : "pontos";
                    htmlPerdas += `<li style="margin-bottom: 6px; color: #dc3545;"><strong>${cat}:</strong> Perdeu ${pontosPerdidos} ${textoPonto} (Fez ${pontosFeitos}/${maximo}).</li>`;
                }
            }

            if (!tevePerda) {
                htmlPerdas = `<li style="color: #28a745; font-weight: 500;">Nenhuma perda identificada em nenhum domínio cognitivo.</li>`;
            }

            // Coleta a nota de corte baseada na escolaridade usando parseFloat
            const cutoffStr = document.getElementById("meem-escolaridade").value;
            const cutoff = parseFloat(cutoffStr);

            let diagnostico = "";
            let cor = "";
            let desc = "";

            if (scoreTotal < cutoff) {
                diagnostico = "Sugestivo de Declínio Cognitivo";
                cor = "#dc3545"; 
                desc = "O escore do paciente encontra-se abaixo da nota de corte para a sua faixa de escolaridade. Indica a necessidade de investigação clínica aprofundada.";
            } else {
                diagnostico = "Cognição Preservada (Rastreio Negativo)";
                cor = "#28a745"; 
                desc = "O escore do paciente encontra-se igual ou superior à nota de corte esperada para a sua faixa de escolaridade.";
            }

            const resDiv = document.getElementById("res-meem");
            resDiv.innerHTML = `
                <div style="background-color: ${cor}; color: #FFFFFF; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Pontuação Total</div>
                    <div style="font-size: 4rem; font-weight: 800; line-height: 1.1;">${scoreTotal}<span style="font-size: 1.5rem; opacity: 0.7;">/30</span></div>
                    <div style="font-size: 1.3rem; font-weight: 700; background-color: rgba(255,255,255,0.2); display: inline-block; padding: 4px 12px; border-radius: 20px; margin-top: 8px;">${diagnostico}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <p style="color: #444; margin-bottom: 8px; font-size: 0.95rem;"><strong>Nota de corte considerada:</strong> ${cutoff.toString().replace('.', ',')} pontos.</p>
                    <p style="color: #555; font-size: 0.95rem; line-height: 1.4; margin-bottom: 1.5rem;">${desc}</p>
                    
                    <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px dashed #ccc;">
                        <h4 style="color: #0b5ed7; margin-bottom: 10px; font-size: 1.05rem;">Detalhamento das Perdas Cognitivas</h4>
                        <ul style="padding-left: 20px; font-size: 0.95rem; line-height: 1.4;">
                            ${htmlPerdas}
                        </ul>
                    </div>

                    <p style="color: #888; font-size: 0.8rem; margin-top: 1.5rem; border-top: 1px solid #ddd; padding-top: 10px;">
                        Referência base utilizada: Brucki et al. (2003). Sugestões para o uso do mini-exame do estado mental no Brasil.
                    </p>
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});