// Alternância de Telas (Tabs) da CuidaSM
function cuidasm_switchTab(tab) {
    document.getElementById('btn-cuidasm-tab1').classList.remove('active');
    document.getElementById('btn-cuidasm-tab2').classList.remove('active');
    document.getElementById('cuidasm-part1').style.display = 'none';
    document.getElementById('cuidasm-part2').style.display = 'none';

    document.getElementById(`btn-cuidasm-tab${tab}`).classList.add('active');
    document.getElementById(`cuidasm-part${tab}`).style.display = 'block';
    
    // Rola para o topo do formulário suavemente
    document.getElementById('view-cuidasm').scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener("DOMContentLoaded", () => {
    const qContainer1 = document.getElementById('cuidasm-q-container1');
    const qContainer2 = document.getElementById('cuidasm-q-container2');
    const btnCalc = document.getElementById('btn-calc-cuidasm');

    if (!qContainer1 || !qContainer2) return;

    // Perguntas ipsis literis do Bloco 1
    const perguntasParte1 = [
        "Você tem amigos?",
        "Você conversa com seus amigos?",
        "Você consegue manter amizades?",
        "Você é capaz de ir aos serviços de saúde sozinho?",
        "Você consegue desenvolver suas atividades do trabalho?",
        "Você consegue se manter trabalhando?",
        "Você é capaz de fazer as compras para o seu dia a dia?",
        "Você é capaz de tomar banho sozinho?",
        "Você realiza a sua higiene diária sozinho?",
        "Você se veste sozinho?",
        "Você é capaz de controlar a sua impulsividade?",
        "Você é capaz de controlar a sua agressividade verbal?",
        "Você é capaz de controlar sua agressão física?",
        "Você encontra sentido na vida?",
        "Você sente que sua vida tem uma finalidade?",
        "Você consegue ter admiração pelas coisas a seu redor?",
        "Você está esperançoso com sua vida?"
    ];

    // Perguntas ipsis literis do Bloco 2
    const perguntasParte2 = [
        "O usuário foi testemunha de violência?",
        "O usuário foi autor de violência?",
        "O usuário foi vítima de violência?",
        "O usuário tem desejo de morte?",
        "O usuário tem ideação suicida?",
        "O usuário tem planejamento suicida?",
        "O usuário tentou suicídio?",
        "O usuário pensa em se agredir?",
        "O usuário apresenta risco iminente para autoagressividade?",
        "O usuário tem história de autoagressividade?",
        "A equipe ESF apresenta dificuldades no manejo desse caso?",
        "O usuário nega a sua doença?",
        "O usuário desconhece a sua doença?",
        "O usuário demonstra resistência ao plano de cuidado proposto?"
    ];

    // Função construtora do HTML das perguntas
    function renderizarPerguntas(arrayPerguntas, container, prefix) {
        let html = '';
        arrayPerguntas.forEach((pergunta, index) => {
            const num = index + 1;
            const idGroup = `${prefix}_q${num}`;
            html += `
                <div class="input-group-med" style="border: none; padding: 0; flex-direction: column; align-items: flex-start; margin-bottom: 15px;">
                    <p style="font-size: 0.9rem; color: #333; margin: 0 0 8px 0; font-weight: 500;">${num}. ${pergunta}</p>
                    <div class="score-toggle" style="width: 100%; display: flex;">
                        <input type="radio" id="${idGroup}_nao" name="${idGroup}" value="0"><label for="${idGroup}_nao" style="flex: 1; text-align: center;">Não (0)</label>
                        <input type="radio" id="${idGroup}_sim" name="${idGroup}" value="1"><label for="${idGroup}_sim" style="flex: 1; text-align: center;">Sim (1)</label>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // Renderiza nos containers
    renderizarPerguntas(perguntasParte1, qContainer1, "c1");
    renderizarPerguntas(perguntasParte2, qContainer2, "c2");

    // Motor Matemático da Escala CuidaSM
    if (btnCalc) {
        btnCalc.addEventListener("click", () => {
            let scoreAutorreferido = 0;
            let answered1 = 0;
            
            for (let i = 1; i <= perguntasParte1.length; i++) {
                const val = document.querySelector(`input[name="c1_q${i}"]:checked`);
                if (val) {
                    scoreAutorreferido += parseInt(val.value);
                    answered1++;
                }
            }

            let scoreProfissional = 0;
            let answered2 = 0;
            
            for (let i = 1; i <= perguntasParte2.length; i++) {
                const val = document.querySelector(`input[name="c2_q${i}"]:checked`);
                if (val) {
                    scoreProfissional += parseInt(val.value);
                    answered2++;
                }
            }

            // Validação de preenchimento completo
            if (answered1 < perguntasParte1.length || answered2 < perguntasParte2.length) {
                alert("Para o cálculo preciso, todas as 31 perguntas devem ser respondidas.");
                return;
            }

            // Cálculo Oficial: O bloco autorreferido age como fator protetor
            // NCSM = (17 - soma dimensões autorreferidas) + soma dimensões avaliadas pelo profissional
            const pontuacaoFinal = (17 - scoreAutorreferido) + scoreProfissional;

   // Estratificação e Classificação
            let classificacao = "";
            let corFundo = "";
            let isBaixa = false, isMod = false, isAlta = false, isAltissima = false;
            
            if (pontuacaoFinal <= 1) {
                classificacao = "Baixa NCSM";
                corFundo = "#28a745"; // Verde
                isBaixa = true;
            } else if (pontuacaoFinal <= 3) {
                classificacao = "Moderada NCSM";
                corFundo = "#ffc107"; // Amarelo
                isMod = true;
            } else if (pontuacaoFinal <= 6) {
                classificacao = "Alta NCSM";
                corFundo = "#fd7e14"; // Laranja
                isAlta = true;
            } else {
                classificacao = "Altíssima NCSM";
                corFundo = "#dc3545"; // Vermelho
                isAltissima = true;
            }

            // Variáveis de Estilo Dinâmico para a Tabela
            const hlStyle = "background-color: #e3f2fd; color: #0b5ed7;"; // Fundo de destaque
            const tagPac = "<span style='background: #0b5ed7; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; margin-left: 10px; font-weight: bold; vertical-align: middle; display: inline-block;'>PACIENTE</span>";

            // Exibição dos Resultados e Valores de Corte
            const resDiv = document.getElementById("res-cuidasm");
            resDiv.innerHTML = `
                <div style="background-color: ${corFundo}; color: ${pontuacaoFinal === 2 || pontuacaoFinal === 3 ? '#333' : '#fff'}; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Escore CuidaSM</div>
                    <div style="font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin: 10px 0;">${pontuacaoFinal} <span style="font-size: 1.2rem; font-weight: 600;">pts</span></div>
                    <div style="font-size: 1.3rem; font-weight: 700;">${classificacao}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <h4 style="color: #0b5ed7; margin-bottom: 15px; font-size: 1.1rem;">Tabela de Valores de Corte</h4>
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; color: #444;">
                        <tbody>
                            <tr style="border-bottom: 1px solid #eee; ${isBaixa ? hlStyle : ''}">
                                <td style="padding: 12px 10px; font-weight: ${isBaixa ? '700' : '600'}; width: 45%; border-radius: ${isBaixa ? '6px 0 0 6px' : '0'};">Baixa NCSM</td>
                                <td style="padding: 12px 10px; font-weight: ${isBaixa ? '700' : 'normal'}; border-radius: ${isBaixa ? '0 6px 6px 0' : '0'};">0 a 1 ponto ${isBaixa ? tagPac : ''}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #eee; ${isMod ? hlStyle : ''}">
                                <td style="padding: 12px 10px; font-weight: ${isMod ? '700' : '600'}; border-radius: ${isMod ? '6px 0 0 6px' : '0'};">Moderada NCSM</td>
                                <td style="padding: 12px 10px; font-weight: ${isMod ? '700' : 'normal'}; border-radius: ${isMod ? '0 6px 6px 0' : '0'};">2 a 3 pontos ${isMod ? tagPac : ''}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #eee; ${isAlta ? hlStyle : ''}">
                                <td style="padding: 12px 10px; font-weight: ${isAlta ? '700' : '600'}; border-radius: ${isAlta ? '6px 0 0 6px' : '0'};">Alta NCSM</td>
                                <td style="padding: 12px 10px; font-weight: ${isAlta ? '700' : 'normal'}; border-radius: ${isAlta ? '0 6px 6px 0' : '0'};">4 a 6 pontos ${isAlta ? tagPac : ''}</td>
                            </tr>
                            <tr style="${isAltissima ? hlStyle : ''}">
                                <td style="padding: 12px 10px; font-weight: ${isAltissima ? '700' : '600'}; border-radius: ${isAltissima ? '6px 0 0 6px' : '0'};">Altíssima NCSM</td>
                                <td style="padding: 12px 10px; font-weight: ${isAltissima ? '700' : 'normal'}; border-radius: ${isAltissima ? '0 6px 6px 0' : '0'};">7 ou mais pontos ${isAltissima ? tagPac : ''}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <p style="color: #888; font-size: 0.75rem; margin-top: 1.5rem; border-top: 1px solid #ddd; padding-top: 10px; text-align: justify;">
                        Cálculo efetuado subtraindo os fatores protetores do escore autorreferido e somando aos indicadores profissionais.
                    </p>
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});