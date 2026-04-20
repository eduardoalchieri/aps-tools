function dengue_nextStep(currentStep) {
    document.getElementById(`dengue-step-${currentStep}`).classList.add('gold-hidden');
    document.getElementById(`dengue-step-${currentStep + 1}`).classList.remove('gold-hidden');
    document.getElementById('view-dengue').scrollIntoView({ behavior: 'smooth' });
}

function dengue_prevStep(currentStep) {
    document.getElementById(`dengue-step-${currentStep}`).classList.add('gold-hidden');
    document.getElementById(`dengue-step-${currentStep - 1}`).classList.remove('gold-hidden');
    document.getElementById('view-dengue').scrollIntoView({ behavior: 'smooth' });
}

function dengue_reset() {
    document.getElementById('dengue-results-section').classList.add('gold-hidden');
    document.getElementById('dengue-step-1').classList.remove('gold-hidden');
    document.getElementById('view-dengue').scrollIntoView({ behavior: 'smooth' });
}

function dengue_calculate(grupo) {
    // Esconde a pergunta atual (pode ser a 2, 3 ou 4)
    document.querySelectorAll('[id^="dengue-step-"]').forEach(el => el.classList.add('gold-hidden'));
    
    const header = document.getElementById('dengue-result-header');
    const title = document.getElementById('dengue-final-group');
    const content = document.getElementById('dengue-result-content');
    
    let htmlContent = "";

    // Lógica para injetar 100% do texto do Cartaz do MS
    if (grupo === 'A') {
        header.style.backgroundColor = "#0b5ed7"; // Azul MS
        title.innerText = "GRUPO A";
        htmlContent = `
            <p style="color: #0b5ed7; font-weight: 700; font-size: 1.1rem; margin-bottom: 15px;">Dengue sem sinais de alarme, sem condição especial, sem risco social e sem comorbidades.</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #0b5ed7; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #333;">🏥 Acompanhamento</h4>
                <p style="margin: 0;">Ambulatorial.</p>
                <h4 style="margin: 15px 0 10px 0; color: #333;">🔬 Exames Complementares</h4>
                <p style="margin: 0;">A critério médico.</p>
            </div>
            <div style="background: #e3f2fd; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #0b5ed7;">💧 Conduta: Hidratação Oral</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;"><strong>Adulto:</strong> 60 mL/kg/dia, sendo 1/3 com sais de reidratação oral e no início com volume maior. Para os 2/3 restantes, orientar a ingestão de líquidos caseiros (água, suco de frutas, soro caseiro, chás, água de coco etc.).</li>
                    <li><strong>Crianças (<13 anos):</strong><br>
                    - Até 10 kg: 130 mL/kg/dia;<br>
                    - Acima de 10 kg a 20 kg: 100 mL/kg/dia;<br>
                    - Acima de 20 kg: 80 mL/kg/dia.</li>
                </ul>
            </div>
            <div style="background: #fff3cd; padding: 15px; border-radius: 6px; border: 1px solid #ffeeba;">
                <h4 style="margin: 0 0 5px 0; color: #856404;">⚠️ IMPORTANTE</h4>
                <p style="margin: 0;">Os sinais de alarme e agravamento do quadro costumam ocorrer na fase de remissão da febre. Retorno imediato na presença de sinais de alarme ou no dia da melhora da febre (possível início da fase crítica); caso não haja defervescência, retornar no 5º dia da doença. Entregar cartão de acompanhamento de dengue.</p>
            </div>
        `;
    } 
    else if (grupo === 'B') {
        header.style.backgroundColor = "#28a745"; // Verde MS
        title.innerText = "GRUPO B";
        htmlContent = `
            <p style="color: #28a745; font-weight: 700; font-size: 1.1rem; margin-bottom: 15px;">Dengue sem sinais de alarme, COM condição especial, risco social ou comorbidades.</p>
            <p style="font-size: 0.85rem; color: #666; margin-bottom: 15px; font-style: italic;">Esses pacientes podem apresentar evolução desfavorável e devem ter acompanhamento diferenciado.</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #28a745; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #333;">🏥 Acompanhamento</h4>
                <p style="margin: 0;">Em leito de observação até resultado de exames e reavaliação clínica.</p>
                <h4 style="margin: 15px 0 10px 0; color: #333;">🔬 Exames Complementares</h4>
                <p style="margin: 0;"><strong>Hemograma completo: obrigatório.</strong></p>
            </div>
            <div style="background: #e8f5e9; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #2e7d32;">💧 Conduta Inicial</h4>
                <p style="margin: 0;">Hidratação oral (conforme Grupo A) até o resultado dos exames.</p>
            </div>
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <div style="flex: 1; background: #fff; border: 1px solid #ddd; padding: 10px; border-radius: 6px;">
                    <strong style="color: #333; display: block; margin-bottom: 5px;">Hematócrito Normal</strong>
                    Tratamento ambulatorial (Alta). Retorno diário para reavaliação clínica e laboratorial (até 48 horas após a remissão da febre). Manter hidratação oral.
                </div>
                <div style="flex: 1; background: #fff; border: 1px solid #ddd; padding: 10px; border-radius: 6px;">
                    <strong style="color: #fd7e14; display: block; margin-bottom: 5px;">Hemoconcentração ou Sinais de Alarme</strong>
                    Conduzir imediatamente como Grupo C.
                </div>
            </div>
        `;
    }
    else if (grupo === 'C') {
        header.style.backgroundColor = "#fd7e14"; // Amarelo/Laranja MS
        title.innerText = "GRUPO C";
        htmlContent = `
            <p style="color: #fd7e14; font-weight: 700; font-size: 1.1rem; margin-bottom: 15px;">Sinais de alarme presentes e sinais de gravidade ausentes.</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #fd7e14; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #333;">🏥 Acompanhamento</h4>
                <p style="margin: 0;">Em leito de internação até estabilização - mínimo de 48h.</p>
                <h4 style="margin: 15px 0 10px 0; color: #333;">🔬 Exames Complementares</h4>
                <p style="margin: 0;"><strong>Obrigatórios:</strong> hemograma completo, dosagem de albumina sérica e transaminases.<br>
                <strong>Recomendados:</strong> raio X de tórax (PA, perfil e incidência de Laurell) e USG de abdome.<br>
                <strong>Outros exames conforme necessidade:</strong> glicemia, ureia, creatinina, eletrólitos, gasometria, Tpae e ecocardiograma.<br>
                <em>Nota: Exames específicos para confirmação de dengue são obrigatórios, mas não são essenciais para conduta clínica.</em></p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #ffeeba;">
                <h4 style="margin: 0 0 10px 0; color: #856404;">💧 Conduta Adulto e Criança (Iniciar Imediato)</h4>
                <p style="margin: 0 0 10px 0; font-weight: bold;">Iniciar hidratação venosa enquanto aguarda exames laboratoriais.</p>
                <ol style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;"><strong>Fase de Expansão:</strong> Iniciar reposição volêmica imediata (<strong>10 mL/kg de soro fisiológico na primeira hora</strong>), em qualquer ponto de atenção, independente do nível e complexidade, mesmo na ausência de exames complementares. Reavaliação clínica após 1 hora.</li>
                    <li style="margin-bottom: 8px;"><strong>Após 1 hora:</strong> Reavaliar o paciente (sinais vitais, PA, avaliar diurese - desejável 1 mL/kg/h). Manter hidratação IV <strong>10 mL/kg/h</strong> (SF a 0,9%) na segunda hora. Até avaliação do hematócrito (que deverá ocorrer em até duas horas da reposição volêmica).</li>
                    <li>Reavaliação clínica e laboratorial após 2 horas.</li>
                </ol>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                <div style="background: #e8f5e9; border: 1px solid #c8e6c9; padding: 10px; border-radius: 6px;">
                    <strong style="color: #2e7d32; display: block; margin-bottom: 5px;">✅ Melhora clínica e laboratorial</strong>
                    Sinais vitais e PA estável, diurese normal e queda do hematócrito. Iniciar a fase de manutenção com soro fisiológico:<br>
                    <strong>Primeira fase:</strong> 25 mL/kg em 6 horas. Se houver melhora, iniciar segunda fase.<br>
                    <strong>Segunda fase:</strong> 25 mL/kg em 8 horas.
                </div>
                <div style="background: #fbe9e7; border: 1px solid #ffccbc; padding: 10px; border-radius: 6px;">
                    <strong style="color: #d84315; display: block; margin-bottom: 5px;">❌ Sem melhora clínica / hemodinâmica / hematócrito</strong>
                    Repetir fase de expansão até três vezes. Manter reavaliação clínica (sinais vitais, PA, avaliar diurese) após 1 hora e de hematócrito em 2 horas (após conclusão de cada etapa). <strong>Sem melhora clínica e laboratorial após as fases, conduzir como grupo D.</strong>
                </div>
            </div>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border: 1px solid #ddd;">
                <h4 style="margin: 0 0 5px 0; color: #333;">Critérios de Alta (Preencher todos os 6)</h4>
                <ul style="margin: 0; padding-left: 20px; font-size: 0.9rem;">
                    <li>Estabilização hemodinâmica durante 48 horas.</li>
                    <li>Ausência de febre por 24 horas.</li>
                    <li>Melhora visível do quadro clínico.</li>
                    <li>Hematócrito normal e estável por 24 horas.</li>
                    <li>Plaquetas em elevação.</li>
                </ul>
                <p style="margin: 10px 0 0 0; font-size: 0.9rem;"><strong>Retorno:</strong> Após preencher critérios de alta, retorno para reavaliação conforme grupo B. Entregar cartão de acompanhamento.</p>
            </div>
        `;
    }
    else if (grupo === 'D') {
        header.style.backgroundColor = "#dc3545"; // Vermelho MS
        title.innerText = "GRUPO D";
        htmlContent = `
            <p style="color: #dc3545; font-weight: 700; font-size: 1.1rem; margin-bottom: 15px;">Dengue Grave (Choque, Sangramento Grave ou Disfunção de Órgãos).</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #dc3545; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #333;">🏥 Acompanhamento</h4>
                <p style="margin: 0;">Em leito de UTI até estabilização - mínimo de 48h.</p>
                <h4 style="margin: 15px 0 10px 0; color: #333;">🔬 Exames Complementares</h4>
                <p style="margin: 0;">Obrigatórios e recomendados iguais ao Grupo C.</p>
            </div>

            <div style="background: #f8d7da; padding: 15px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #f5c6cb;">
                <h4 style="margin: 0 0 10px 0; color: #721c24;">🚨 Conduta: Reposição Volêmica Rápida</h4>
                <p style="margin: 0 0 10px 0;">Iniciar hidratação venosa enquanto aguarda exames laboratoriais. Iniciar imediatamente fase de expansão rápida parenteral (adulto e criança), com <strong>Soro Fisiológico a 0,9%: 20 mL/kg em até 20 minutos</strong>, em qualquer nível de complexidade, inclusive durante eventual transferência para uma unidade de referência.</p>
                <p style="margin: 0; font-weight: bold;">Reavaliação clínica a cada 15-30 minutos e de hematócrito em 2 horas. A reavaliação deve acontecer após cada etapa de expansão.</p>
            </div>

            <div style="border-left: 4px solid #0b5ed7; padding-left: 15px; margin-bottom: 15px;">
                <strong style="color: #0b5ed7;">✅ Melhora clínica e de hematócrito</strong>
                <p style="margin: 5px 0 0 0;">Retornar para fase de expansão do grupo C.</p>
            </div>

            <div style="border-left: 4px solid #dc3545; padding-left: 15px; margin-bottom: 15px;">
                <strong style="color: #dc3545;">❌ Resposta inadequada caracterizada pela persistência do choque. Avaliar hematócrito:</strong>
                
                <div style="background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-top: 10px;">
                    <strong style="color: #333;">A) Hematócrito em elevação:</strong>
                    <p style="margin: 5px 0 5px 0;">Utilizar expansores plasmáticos (albumina 0,5-1 g/kg); preparar solução de albumina a 5% (para cada 100 mL desta solução, usar 25 mL de albumina a 20% e 75 mL de SF a 0,9%); na falta desta, usar coloides sintéticos, a 10 mL/kg/hora.</p>
                    <p style="margin: 0; font-size: 0.9rem; color: #555;">Com resolução do choque e ausência de sangramento, mas com surgimento de outros sinais de gravidade (desconforto respiratório, sinais de ICC): investigar hiperhidratação. Tratar com diminuição importante da infusão de líquido, uso de diuréticos e drogas inotrópicas, quando necessário.</p>
                </div>

                <div style="background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-top: 10px;">
                    <strong style="color: #333;">B) Hematócrito em queda (E Persistência do Choque):</strong>
                    <p style="margin: 5px 0 5px 0;">Investigar hemorragia e coagulopatia de consumo.</p>
                    <ul style="margin: 0; padding-left: 20px; font-size: 0.9rem;">
                        <li><strong>Hemorragia:</strong> transfundir concentrado de hemácias (10 a 15 mL/kg/dia) apenas.</li>
                        <li><strong>Coagulopatia:</strong> avaliar uso de plasma fresco (10 mL/kg). Vitamina K endovenosa e crioprecipitado (1 U para cada 5-10 kg).</li>
                        <li><strong>Plaquetas:</strong> Transfundir apenas se sangramento persistente não controlado (depois de corrigidos os fatores de coagulação e do choque), COM trombocitopenia e INR > que 1,5 vez o valor normal.</li>
                    </ul>
                    <p style="margin: 10px 0 0 0; font-weight: bold;">Se resposta adequada, tratar como grupo C.</p>
                </div>
            </div>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border: 1px solid #ddd;">
                <h4 style="margin: 0 0 10px 0; color: #333;">🛑 Critérios para interromper ou reduzir infusão</h4>
                <p style="margin: 0 0 5px 0; font-size: 0.9rem;">Interromper ou reduzir a infusão de líquidos à velocidade mínima necessária se:</p>
                <ul style="margin: 0; padding-left: 20px; font-size: 0.9rem;">
                    <li>Houver término do extravasamento plasmático.</li>
                    <li>Normalização da PA, do pulso e da perfusão periférica.</li>
                    <li>Diminuição do hematócrito, na ausência de sangramento.</li>
                    <li>Diurese normalizada.</li>
                    <li>Resolução dos sintomas abdominais.</li>
                </ul>
                <p style="margin: 15px 0 0 0; font-size: 0.85rem; color: #dc3545; font-weight: bold;">ATENÇÃO: pacientes idosos ou na presença de comorbidades, como as cardiopatias e insuficiência renal, precisam adequar os volumes de hidratação caso a caso, evitando sobrecargas de volume.</p>
            </div>
        `;
    }

    content.innerHTML = htmlContent;
    document.getElementById('dengue-results-section').classList.remove('gold-hidden');
    document.getElementById('dengue-results-section').scrollIntoView({ behavior: 'smooth' });
}