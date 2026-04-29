document.addEventListener("DOMContentLoaded", () => {
    // ================= LÓGICA WELLS TVP =================
    const btnCalcTVP = document.getElementById("btn-calc-tvp");
    if (btnCalcTVP) {
        btnCalcTVP.addEventListener("click", () => {
            const cancer = parseInt(document.querySelector('input[name="tvp_cancer"]:checked').value);
            const paralisia = parseInt(document.querySelector('input[name="tvp_paralisia"]:checked').value);
            const acamado = parseInt(document.querySelector('input[name="tvp_acamado"]:checked').value);
            const dor = parseInt(document.querySelector('input[name="tvp_dor"]:checked').value);
            const edema_total = parseInt(document.querySelector('input[name="tvp_edematotal"]:checked').value);
            const panturrilha = parseInt(document.querySelector('input[name="tvp_panturrilha"]:checked').value);
            const cacifo = parseInt(document.querySelector('input[name="tvp_cacifo"]:checked').value);
            const veias = parseInt(document.querySelector('input[name="tvp_veias"]:checked').value);
            const hist = parseInt(document.querySelector('input[name="tvp_hist"]:checked').value);
            const alt = parseInt(document.querySelector('input[name="tvp_alt"]:checked').value);

            const pontuacao = cancer + paralisia + acamado + dor + edema_total + panturrilha + cacifo + veias + hist + alt;

            let classificacao = "";
            let conduta = "";
            let corFundo = "";
            let isBaixo = false, isAlto = false;

            if (pontuacao <= 1) {
                classificacao = "TVP Improvável";
                conduta = "Risco aceitável para descarte laboratorial. <strong>Conduta:</strong> Solicite D-dímero. Se o D-dímero for negativo, a TVP está descartada. Se for positivo, prossiga com USG Doppler Venoso.";
                corFundo = "#28a745"; // Verde
                isBaixo = true;
            } else {
                classificacao = "TVP Provável";
                conduta = "A probabilidade transcende o limite de segurança laboratorial. <strong>Conduta:</strong> Exame de imagem primário (USG Doppler Venoso) é obrigatório. O D-dímero não possui valor isolado de descarte nesta faixa.";
                corFundo = "#dc3545"; // Vermelho
                isAlto = true;
            }

            const resDiv = document.getElementById("res-wells-tvp");
            const tagPac = "<span style='background: #0b5ed7; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; margin-left: 10px; font-weight: bold; vertical-align: middle; display: inline-block;'>PACIENTE</span>";
            const hlStyle = "background-color: #e3f2fd; color: #0b5ed7;";

            resDiv.innerHTML = `
                <div style="background-color: ${corFundo}; color: #fff; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Escore de Wells (TVP)</div>
                    <div style="font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin: 10px 0;">${pontuacao} <span style="font-size: 1.2rem; font-weight: 600;">pts</span></div>
                    <div style="font-size: 1.3rem; font-weight: 700;">${classificacao}</div>
                    <div style="font-size: 0.95rem; margin-top: 15px; font-weight: 500; text-align: justify;">${conduta}</div>
                </div>
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF;">
                    <h4 style="color: #0b5ed7; margin-bottom: 15px; font-size: 1.1rem;">Valores de Corte (Modelo Simplificado)</h4>
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; color: #444;">
                        <tbody>
                            <tr style="border-bottom: 1px solid #eee; ${isBaixo ? hlStyle : ''}">
                                <td style="padding: 12px 10px; font-weight: ${isBaixo ? '700' : '600'}; width: 40%;">≤ 1 ponto</td>
                                <td style="padding: 12px 10px; font-weight: ${isBaixo ? '700' : 'normal'};">TVP Improvável (Proceder D-dímero) ${isBaixo ? tagPac : ''}</td>
                            </tr>
                            <tr style="${isAlto ? hlStyle : ''}">
                                <td style="padding: 12px 10px; font-weight: ${isAlto ? '700' : '600'};">≥ 2 pontos</td>
                                <td style="padding: 12px 10px; font-weight: ${isAlto ? '700' : 'normal'};">TVP Provável (USG Mandatório) ${isAlto ? tagPac : ''}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ================= LÓGICA WELLS TEP E INTEGRAÇÃO PERC =================
    const btnCalcTEP = document.getElementById("btn-calc-tep");
    const containerPERC = document.getElementById("container-perc");
    const resDivTEP = document.getElementById("res-wells-tep");

    if (btnCalcTEP) {
        btnCalcTEP.addEventListener("click", () => {
            const sinais = parseFloat(document.querySelector('input[name="tep_sinais"]:checked').value);
            const alt = parseFloat(document.querySelector('input[name="tep_alt"]:checked').value);
            const fc = parseFloat(document.querySelector('input[name="tep_fc"]:checked').value);
            const imob = parseFloat(document.querySelector('input[name="tep_imob"]:checked').value);
            const hist = parseFloat(document.querySelector('input[name="tep_hist"]:checked').value);
            const hemoptise = parseFloat(document.querySelector('input[name="tep_hemoptise"]:checked').value);
            const cancer = parseFloat(document.querySelector('input[name="tep_cancer"]:checked').value);

            const pontuacao = sinais + alt + fc + imob + hist + hemoptise + cancer;
            
            let classificacao = "";
            let conduta = "";
            let corFundo = "";
            let isBaixo = false, isAlto = false;

            if (pontuacao <= 4.0) {
                classificacao = "TEP Improvável";
                conduta = "A avaliação prossegue obrigatoriamente para regras de descarte suplementares. <strong>Preencha a Regra PERC abaixo para definir a necessidade de D-dímero.</strong>";
                corFundo = "#28a745"; // Verde
                isBaixo = true;
                
                // Exibe o painel da regra PERC dinamicamente e limpa resultados anteriores
                containerPERC.style.display = "block";
                document.getElementById("res-perc").style.display = "none";
                
            } else {
                classificacao = "TEP Provável";
                conduta = "O risco transcende o VPN do D-dímero. <strong>Conduta: Solicite diretamente AngioTC de Tórax (CTPA)</strong> ou Cintilografia V/Q. A Regra PERC é contraindicada e inválida nesta faixa de risco.";
                corFundo = "#dc3545"; // Vermelho
                isAlto = true;
                
                // Oculta o painel da regra PERC pois é proibido em alto risco
                containerPERC.style.display = "none";
            }

            const tagPac = "<span style='background: #0b5ed7; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; margin-left: 10px; font-weight: bold; vertical-align: middle; display: inline-block;'>PACIENTE</span>";
            const hlStyle = "background-color: #e3f2fd; color: #0b5ed7;";

            resDivTEP.innerHTML = `
                <div style="background-color: ${corFundo}; color: #fff; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Escore de Wells (TEP)</div>
                    <div style="font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin: 10px 0;">${pontuacao.toFixed(1)} <span style="font-size: 1.2rem; font-weight: 600;">pts</span></div>
                    <div style="font-size: 1.3rem; font-weight: 700;">${classificacao}</div>
                    <div style="font-size: 0.95rem; margin-top: 15px; font-weight: 500; text-align: justify;">${conduta}</div>
                </div>
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; color: #444;">
                        <tbody>
                            <tr style="border-bottom: 1px solid #eee; ${isBaixo ? hlStyle : ''}">
                                <td style="padding: 12px 10px; font-weight: ${isBaixo ? '700' : '600'}; width: 40%;">≤ 4.0 pontos</td>
                                <td style="padding: 12px 10px; font-weight: ${isBaixo ? '700' : 'normal'};">TEP Improvável (Proceder PERC) ${isBaixo ? tagPac : ''}</td>
                            </tr>
                            <tr style="${isAlto ? hlStyle : ''}">
                                <td style="padding: 12px 10px; font-weight: ${isAlto ? '700' : '600'};">> 4.0 pontos</td>
                                <td style="padding: 12px 10px; font-weight: ${isAlto ? '700' : 'normal'};">TEP Provável (AngioTC) ${isAlto ? tagPac : ''}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            resDivTEP.style.display = "block";
            
            // Rola a tela adequadamente
            if (isBaixo) {
                containerPERC.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                resDivTEP.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ================= CÁLCULO E CONDUTA DA REGRA PERC =================
    const btnCalcPERC = document.getElementById("btn-calc-perc");
    const resDivPERC = document.getElementById("res-perc");

    if (btnCalcPERC) {
        btnCalcPERC.addEventListener("click", () => {
            const r1 = parseInt(document.querySelector('input[name="perc_idade"]:checked').value);
            const r2 = parseInt(document.querySelector('input[name="perc_fc"]:checked').value);
            const r3 = parseInt(document.querySelector('input[name="perc_sat"]:checked').value);
            const r4 = parseInt(document.querySelector('input[name="perc_hemoptise"]:checked').value);
            const r5 = parseInt(document.querySelector('input[name="perc_estro"]:checked').value);
            const r6 = parseInt(document.querySelector('input[name="perc_hist"]:checked').value);
            const r7 = parseInt(document.querySelector('input[name="perc_edema"]:checked').value);
            const r8 = parseInt(document.querySelector('input[name="perc_cirurgia"]:checked').value);

            const scorePerc = r1 + r2 + r3 + r4 + r5 + r6 + r7 + r8;

            if (scorePerc === 0) {
                // Sucesso na exclusão
                resDivPERC.innerHTML = `
                    <div style="background-color: #28a745; color: white; padding: 1.5rem; border-radius: 8px; text-align: center; border: 2px solid #1e7e34;">
                        <span class="material-symbols-outlined" style="font-size: 3rem; margin-bottom: 10px;">check_circle</span>
                        <div style="font-size: 1.4rem; font-weight: 700; margin-bottom: 10px;">PERC Negativo (Score 0)</div>
                        <div style="font-size: 1rem; font-weight: 500; text-align: justify; line-height: 1.4;">
                            Probabilidade residual virtualmente irrelevante de TEP ativo. <strong>TEP descartado clinicamente com segurança</strong> baseada em evidências pela associação de Wells Improvável + PERC Negativo. Abstenha-se de solicitar D-Dímero ou tomografia computadorizada.
                        </div>
                    </div>
                `;
            } else {
                // Falha na exclusão, precisa de laboratório
                resDivPERC.innerHTML = `
                    <div style="background-color: #ffc107; color: #333; padding: 1.5rem; border-radius: 8px; text-align: center; border: 2px solid #e0a800;">
                        <span class="material-symbols-outlined" style="font-size: 3rem; margin-bottom: 10px; color: #d39e00;">warning</span>
                        <div style="font-size: 1.4rem; font-weight: 700; margin-bottom: 10px;">Regra PERC Falhou (Score ≥ 1)</div>
                        <div style="font-size: 1rem; font-weight: 500; text-align: justify; line-height: 1.4;">
                            A presunção clínica de ausência não é suficiente. A via diagnóstica prossegue obrigatoriamente. <strong>Conduta: Solicite D-dímero plasmático.</strong>
                            <br><br>
                            <span style="font-size: 0.85rem; color: #555;"><i>Nota: Avalie a exclusão aplicando a fórmula de D-dímero Ajustado para a Idade (AADD) se o paciente possuir mais de 50 anos (Idade x 10 µg/L FEU).</i></span>
                        </div>
                    </div>
                `;
            }
            
            resDivPERC.style.display = "block";
            resDivPERC.scrollIntoView({ behavior: 'smooth' });
        });
    }
});