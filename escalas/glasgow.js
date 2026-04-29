document.addEventListener("DOMContentLoaded", () => {
    const selectIdade = document.getElementById("gcs-idade");
    const containerVerbal = document.getElementById("container-gcs-verbal");
    const containerMotor = document.getElementById("container-gcs-motor");
    const btnCalc = document.getElementById("btn-calc-glasgow");

    // Dicionários de Respostas baseados nas diretrizes de 2014 e Adaptações Pediátricas (PGCS)
    const opcoesVerbal = {
        "adulto": [
            { val: "5", text: "5 - Orientado (Sabe nome, local e data)" },
            { val: "4", text: "4 - Confuso (Comunicação coerente, mas desorientado)" },
            { val: "3", text: "3 - Palavras isoladas ou inapropriadas" },
            { val: "2", text: "2 - Sons incompreensíveis (gemidos)" },
            { val: "1", text: "1 - Nenhuma resposta audível" }
        ],
        "pre-escolar": [
            { val: "5", text: "5 - Palavras adequadas (Comunica-se perfeitamente)" },
            { val: "4", text: "4 - Confuso (Frases com confusão situacional severa)" },
            { val: "3", text: "3 - Palavras isoladas ou inapropriadas (Gritos/Jargões)" },
            { val: "2", text: "2 - Sons incompreensíveis ou guturais" },
            { val: "1", text: "1 - Nenhuma resposta audível" }
        ],
        "lactente": [
            { val: "5", text: "5 - Sorri, arrulha, balbucia, interage" },
            { val: "4", text: "4 - Choro contínuo, mas consolável / Irritabilidade" },
            { val: "3", text: "3 - Inconsolável (Chora intensamente à dor)" },
            { val: "2", text: "2 - Gemidos prolongados perante dor" },
            { val: "1", text: "1 - Nenhuma resposta audível" }
        ]
    };

    const opcoesMotor = {
        "adulto": [
            { val: "6", text: "6 - Obedece a comandos (Duas ações distintas)" },
            { val: "5", text: "5 - Localiza o estímulo (Eleva mão à cabeça/pescoço)" },
            { val: "4", text: "4 - Flexão normal / Retirada à pressão" },
            { val: "3", text: "3 - Flexão anormal (Decorticação espástica)" },
            { val: "2", text: "2 - Extensão anormal (Descerebração)" },
            { val: "1", text: "1 - Nenhuma resposta motora (Flácido/Plegia)" }
        ],
        "lactente": [ // Aplicável tanto para lactentes quanto pré-escolares
            { val: "6", text: "6 - Movimentos espontâneos ou obedece a comandos" },
            { val: "5", text: "5 - Localiza o estímulo doloroso (Esquiva periférica)" },
            { val: "4", text: "4 - Retirada à dor (Contração protetora)" },
            { val: "3", text: "3 - Flexão anormal (Decorticação)" },
            { val: "2", text: "2 - Extensão anormal (Descerebração)" },
            { val: "1", text: "1 - Nenhuma resposta motora (Flácido/Plegia)" }
        ]
    };

    // Função para renderizar os botões dinamicamente
    function renderizarBotoes() {
        const idade = selectIdade.value;
        const arrayVerbal = opcoesVerbal[idade];
        const arrayMotor = idade === "adulto" ? opcoesMotor["adulto"] : opcoesMotor["lactente"];

        // Adiciona a opção fixa de Não Testável (NT)
        const btnVerbalNT = `<input type="radio" id="gcs_v_nt" name="gcs_v" value="NT"><label for="gcs_v_nt" style="text-align: left; padding-left: 15px; background-color: #f8f9fa; color: #6c757d;">NT - Não Testável (Intubado, Traqueostomia)</label>`;
        const btnMotorNT = `<input type="radio" id="gcs_m_nt" name="gcs_m" value="NT"><label for="gcs_m_nt" style="text-align: left; padding-left: 15px; background-color: #f8f9fa; color: #6c757d;">NT - Não Testável (Sedação profunda, Bloqueio, Plegia anatômica)</label>`;

        containerVerbal.innerHTML = arrayVerbal.map(opt => `<input type="radio" id="gcs_v_${opt.val}" name="gcs_v" value="${opt.val}"><label for="gcs_v_${opt.val}" style="text-align: left; padding-left: 15px;">${opt.text}</label>`).join("") + btnVerbalNT;
        
        containerMotor.innerHTML = arrayMotor.map(opt => `<input type="radio" id="gcs_m_${opt.val}" name="gcs_m" value="${opt.val}"><label for="gcs_m_${opt.val}" style="text-align: left; padding-left: 15px;">${opt.text}</label>`).join("") + btnMotorNT;
    }

    if (selectIdade) {
        selectIdade.addEventListener("change", renderizarBotoes);
        renderizarBotoes(); // Chamada inicial
    }

    if (btnCalc) {
        btnCalc.addEventListener("click", () => {
            const pE = document.querySelector('input[name="gcs_e"]:checked');
            const pV = document.querySelector('input[name="gcs_v"]:checked');
            const pM = document.querySelector('input[name="gcs_m"]:checked');
            const pPupila = document.querySelector('input[name="gcs_p"]:checked');

            if (!pE || !pV || !pM) {
                alert("Atenção: Selecione a resposta para Ocular, Verbal e Motora.");
                return;
            }

            const valE = pE.value;
            const valV = pV.value;
            const valM = pM.value;
            const hasNT = (valE === "NT" || valV === "NT" || valM === "NT");

            // String Descritiva Canônica (ex: E3 V-NT M5)
            const stringFracionada = `E${valE} V${valV === "NT" ? "-NT" : valV} M${valM}`;
            
            let escoreTotal = null;
            let escoreGCSP = null;
            let cor = "#6c757d"; // Cor neutra padrão (NT)
            let diagnostico = "Avaliação Comprometida (Fator de Interferência)";
            let conduta = "O somatório numérico foi bloqueado (NT) devido a sedação, intubação ou trauma local severo que impede a resposta do paciente. O prognóstico deve focar no componente motor isolado.";

            // Lógica de Soma (Apenas se NÃO houver NT)
            if (!hasNT) {
                escoreTotal = parseInt(valE) + parseInt(valV) + parseInt(valM);
                
                if (escoreTotal >= 13) {
                    diagnostico = "Lesão Leve / Concussional";
                    cor = "#28a745"; // Verde
                    conduta = "Atenção a sinais de alarme. Pacientes alertas, mas podem apresentar confusão temporal leve.";
                } else if (escoreTotal >= 9) {
                    diagnostico = "Lesão Moderada";
                    cor = "#ff9800"; // Laranja
                    conduta = "Risco de deterioração. Rebaixamento de sensório, letargia. Monitoramento neurológico rigoroso requerido.";
                } else {
                    diagnostico = "Lesão Grave / Coma";
                    cor = "#dc3545"; // Vermelho
                    conduta = "<strong>GCS ≤ 8 (Indicação formal de Intubação Profilática).</strong> Risco iminente de perda de reflexos de proteção de vias aéreas e hipóxia letal.";
                }

                // Aplica a Reatividade Pupilar (GCS-P = GCS - PRS)
                if (pPupila) {
                    const prs = parseInt(pPupila.value);
                    escoreGCSP = escoreTotal - prs;
                }
            }

            // Bloco HTML de Resultado Numérico
            let blocoNumerico = "";
            if (hasNT) {
                blocoNumerico = `
                    <div style="font-size: 3.5rem; font-weight: 800; line-height: 1.1;">N/A</div>
                    <div style="font-size: 0.9rem; margin-top: 5px; font-weight: bold; opacity: 0.8;">CÁLCULO BLOQUEADO POR (NT)</div>
                `;
            } else {
                let txtPupila = pPupila && parseInt(pPupila.value) > 0 ? `<div style="font-size: 1.2rem; font-weight: 600; color: #ffc107; margin-top: 10px;">GCS-P (Com Pupila): ${escoreGCSP} pts</div>` : "";
                blocoNumerico = `
                    <div style="font-size: 4rem; font-weight: 800; line-height: 1.1;">${escoreTotal} <span style="font-size: 1.5rem; opacity: 0.7;">/15</span></div>
                    ${txtPupila}
                `;
            }

            // Renderiza o resultado na interface
            const resDiv = document.getElementById("res-glasgow");
            resDiv.innerHTML = `
                <div style="background-color: ${cor}; color: #FFFFFF; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Avaliação Neurológica</div>
                    ${blocoNumerico}
                    <div style="font-size: 1.1rem; font-weight: 700; background-color: rgba(255,255,255,0.2); display: inline-block; padding: 4px 12px; border-radius: 20px; margin-top: 15px;">${diagnostico}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <div style="background-color: #f8f9fa; border-left: 4px solid ${cor}; padding: 10px 15px; margin-bottom: 1.5rem; border-radius: 4px;">
                        <span style="font-size: 0.8rem; color: #666; text-transform: uppercase;">Notação de Prontuário</span><br>
                        <strong style="font-size: 1.5rem; color: #333; letter-spacing: 2px;">${stringFracionada}</strong>
                    </div>

                    <p style="font-size: 1rem; color: #444; line-height: 1.5; margin-bottom: 0;"><strong>Parâmetro / Ação:</strong> ${conduta}</p>
                    
                    <p style="color: #888; font-size: 0.8rem; margin-top: 1.5rem; border-top: 1px solid #ddd; padding-top: 10px;">
                        Referência: Teasdale G, et al. The Glasgow Coma Scale at 40 years: standing the test of time (2014). / Brennan PM, et al. Simplifying the use of prognostic information in TBI (GCS-Pupils, 2018).
                    </p>
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});