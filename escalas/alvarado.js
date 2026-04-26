document.addEventListener("DOMContentLoaded", () => {
    const btnCalcAlvarado = document.getElementById("btn-calc-alvarado");

    if (btnCalcAlvarado) {
        btnCalcAlvarado.addEventListener("click", () => {
            const migratoria = parseInt(document.querySelector('input[name="alv_migratoria"]:checked').value);
            const anorexia = parseInt(document.querySelector('input[name="alv_anorexia"]:checked').value);
            const nausea = parseInt(document.querySelector('input[name="alv_nausea"]:checked').value);
            const palpacao = parseInt(document.querySelector('input[name="alv_palpacao"]:checked').value);
            const descompressao = parseInt(document.querySelector('input[name="alv_descompressao"]:checked').value);
            const febre = parseInt(document.querySelector('input[name="alv_febre"]:checked').value);
            const leuco = parseInt(document.querySelector('input[name="alv_leuco"]:checked').value);

            const pontuacaoFinal = migratoria + anorexia + nausea + palpacao + descompressao + febre + leuco;

            let classificacao = "";
            let conduta = "";
            let corFundo = "";
            
            let isBaixo = false, isInt = false, isAlto = false;

            if (pontuacaoFinal <= 3) {
                classificacao = "Baixo Risco";
                conduta = "Apendicite improvável (rule out). Tratar os sintomas. Alta médica com orientações de retorno se surgirem novos sintomas, ou avaliação para diagnósticos diferenciais se a clínica persistir.";
                corFundo = "#28a745"; // Verde
                isBaixo = true;
            } else if (pontuacaoFinal <= 6) {
                classificacao = "Risco Intermediário";
                conduta = "Avaliação adicional mandatória. Recomenda-se exame de imagem (Ultrassonografia em serviços com recursos limitados onde a TC não está disponível). Alternativamente, considerar observação hospitalar ou avaliação cirúrgica se imagem for inconclusiva.";
                corFundo = "#ffc107"; // Amarelo
                isInt = true;
            } else {
                classificacao = "Alto Risco";
                conduta = "Alta probabilidade clínica, contudo a especificidade é de 81%. O paciente deve ser avaliado com exame de imagem (TC ou USG) antes da definição do tratamento, ou submetido à avaliação/exploração cirúrgica caso a imagem seja indisponível e a suspeita mantida.";
                corFundo = "#dc3545"; // Vermelho
                isAlto = true;
            }

            const hlStyle = "background-color: #e3f2fd; color: #0b5ed7;"; 
            const tagPac = "<span style='background: #0b5ed7; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; margin-left: 10px; font-weight: bold; vertical-align: middle; display: inline-block;'>PACIENTE</span>";

            const resDiv = document.getElementById("res-alvarado");
            resDiv.innerHTML = `
                <div style="background-color: ${corFundo}; color: ${pontuacaoFinal >= 4 && pontuacaoFinal <= 6 ? '#333' : '#fff'}; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Alvarado Modificado</div>
                    <div style="font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin: 10px 0;">${pontuacaoFinal} <span style="font-size: 1.2rem; font-weight: 600;">pts</span></div>
                    <div style="font-size: 1.3rem; font-weight: 700;">${classificacao}</div>
                    <div style="font-size: 0.95rem; margin-top: 15px; font-weight: 500; text-align: justify;">${conduta}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <h4 style="color: #0b5ed7; margin-bottom: 15px; font-size: 1.1rem;">Tabela de Valores de Corte e Conduta</h4>
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; color: #444;">
                        <tbody>
                            <tr style="border-bottom: 1px solid #eee; ${isBaixo ? hlStyle : ''}">
                                <td style="padding: 12px 10px; font-weight: ${isBaixo ? '700' : '600'}; width: 35%; border-radius: ${isBaixo ? '6px 0 0 6px' : '0'};">0 a 3 pontos</td>
                                <td style="padding: 12px 10px; font-weight: ${isBaixo ? '700' : 'normal'}; border-radius: ${isBaixo ? '0 6px 6px 0' : '0'};">Apendicite improvável. Investigar outras causas. ${isBaixo ? tagPac : ''}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #eee; ${isInt ? hlStyle : ''}">
                                <td style="padding: 12px 10px; font-weight: ${isInt ? '700' : '600'}; border-radius: ${isInt ? '6px 0 0 6px' : '0'};">4 a 6 pontos</td>
                                <td style="padding: 12px 10px; font-weight: ${isInt ? '700' : 'normal'}; border-radius: ${isInt ? '0 6px 6px 0' : '0'};">Requer avaliação adicional com imagem ou cirurgia. ${isInt ? tagPac : ''}</td>
                            </tr>
                            <tr style="${isAlto ? hlStyle : ''}">
                                <td style="padding: 12px 10px; font-weight: ${isAlto ? '700' : '600'}; border-radius: ${isAlto ? '6px 0 0 6px' : '0'};">7 a 9 pontos</td>
                                <td style="padding: 12px 10px; font-weight: ${isAlto ? '700' : 'normal'}; border-radius: ${isAlto ? '0 6px 6px 0' : '0'};">Alta suspeita. Confirmar com imagem antes de tratar. ${isAlto ? tagPac : ''}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});