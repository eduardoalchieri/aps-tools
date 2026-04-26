document.addEventListener("DOMContentLoaded", () => {
    const btnCalcTwist = document.getElementById("btn-calc-twist");

    if (btnCalcTwist) {
        btnCalcTwist.addEventListener("click", () => {
            const inchaco = parseInt(document.querySelector('input[name="tw_inchaco"]:checked').value);
            const endurecido = parseInt(document.querySelector('input[name="tw_endurecido"]:checked').value);
            const reflexo = parseInt(document.querySelector('input[name="tw_reflexo"]:checked').value);
            const nausea = parseInt(document.querySelector('input[name="tw_nausea"]:checked').value);
            const elevado = parseInt(document.querySelector('input[name="tw_elevado"]:checked').value);

            const pontuacaoFinal = inchaco + endurecido + reflexo + nausea + elevado;

            let classificacao = "";
            let conduta = "";
            let corFundo = "";
            
            let isBaixo = false, isInt = false, isAlto = false;

            if (pontuacaoFinal <= 2) {
                classificacao = "Baixo Risco";
                conduta = "Baixa probabilidade de torção testicular. Considerar USG Doppler de bolsa escrotal se diagnóstico diferencial for incerto ou houver persistência clínica.";
                corFundo = "#28a745"; // Verde
                isBaixo = true;
            } else if (pontuacaoFinal <= 4) {
                classificacao = "Risco Intermediário";
                conduta = "Realizar Ultrassonografia (USG) Doppler de Bolsa Escrotal para avaliação de fluxo sanguíneo e guiar a conduta.";
                corFundo = "#ffc107"; // Amarelo
                isInt = true;
            } else {
                classificacao = "Alto Risco";
                conduta = "Forte suspeita de Torção Testicular. Avaliação cirúrgica/urológica precoce recomendada; não atrasar a conduta aguardando exames de imagem.";
                corFundo = "#dc3545"; // Vermelho
                isAlto = true;
            }

            // Variáveis de Estilo Dinâmico para a Tabela
            const hlStyle = "background-color: #e3f2fd; color: #0b5ed7;"; 
            const tagPac = "<span style='background: #0b5ed7; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; margin-left: 10px; font-weight: bold; vertical-align: middle; display: inline-block;'>PACIENTE</span>";

            const resDiv = document.getElementById("res-twist");
            resDiv.innerHTML = `
                <div style="background-color: ${corFundo}; color: ${pontuacaoFinal === 3 || pontuacaoFinal === 4 ? '#333' : '#fff'}; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Escore TWIST</div>
                    <div style="font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin: 10px 0;">${pontuacaoFinal} <span style="font-size: 1.2rem; font-weight: 600;">pts</span></div>
                    <div style="font-size: 1.3rem; font-weight: 700;">${classificacao}</div>
                    <div style="font-size: 0.9rem; margin-top: 10px; font-weight: 500;">${conduta}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <h4 style="color: #0b5ed7; margin-bottom: 15px; font-size: 1.1rem;">Tabela de Valores de Corte</h4>
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; color: #444;">
                        <tbody>
                            <tr style="border-bottom: 1px solid #eee; ${isBaixo ? hlStyle : ''}">
                                <td style="padding: 12px 10px; font-weight: ${isBaixo ? '700' : '600'}; width: 45%; border-radius: ${isBaixo ? '6px 0 0 6px' : '0'};">Baixo Risco</td>
                                <td style="padding: 12px 10px; font-weight: ${isBaixo ? '700' : 'normal'}; border-radius: ${isBaixo ? '0 6px 6px 0' : '0'};">0 a 2 pontos ${isBaixo ? tagPac : ''}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #eee; ${isInt ? hlStyle : ''}">
                                <td style="padding: 12px 10px; font-weight: ${isInt ? '700' : '600'}; border-radius: ${isInt ? '6px 0 0 6px' : '0'};">Risco Intermediário</td>
                                <td style="padding: 12px 10px; font-weight: ${isInt ? '700' : 'normal'}; border-radius: ${isInt ? '0 6px 6px 0' : '0'};">3 a 4 pontos ${isInt ? tagPac : ''}</td>
                            </tr>
                            <tr style="${isAlto ? hlStyle : ''}">
                                <td style="padding: 12px 10px; font-weight: ${isAlto ? '700' : '600'}; border-radius: ${isAlto ? '6px 0 0 6px' : '0'};">Alto Risco</td>
                                <td style="padding: 12px 10px; font-weight: ${isAlto ? '700' : 'normal'}; border-radius: ${isAlto ? '0 6px 6px 0' : '0'};">5 a 7 pontos ${isAlto ? tagPac : ''}</td>
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