const gina_state = { symptoms: null, night: null, lungFunction: null, eos: null, track: null };

window.gina_reset = function() {
    gina_state.symptoms = null;
    gina_state.night = null;
    gina_state.lungFunction = null;
    gina_state.eos = null;
    gina_state.track = null;

    document.getElementById('gina-lungFunction').value = 'normal';
    document.getElementById('gina-eosinophils').value = 'unknown';
    
    document.querySelectorAll('#view-gina .gold-radio-option').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('#view-gina .gold-radio-option input').forEach(el => el.checked = false);

    document.getElementById('gina-results-section').innerHTML = '';
    window.gina_showSection('gina-step-1');
};

window.gina_nextStep = function(currentStep) {
    if (currentStep === 1) {
        const selected = document.querySelector('input[name="gina-symptoms"]:checked');
        if (!selected) return alert("Selecione a frequência dos sintomas diurnos.");
        gina_state.symptoms = selected.value;
        window.gina_showSection('gina-step-2');
    } 
    else if (currentStep === 2) {
        const selected = document.querySelector('input[name="gina-night"]:checked');
        if (!selected) return alert("Selecione o impacto noturno.");
        gina_state.night = selected.value;
        window.gina_showSection('gina-step-3');
    }
    else if (currentStep === 3) {
        gina_state.lungFunction = document.getElementById('gina-lungFunction').value;
        gina_state.eos = document.getElementById('gina-eosinophils').value;
        window.gina_showSection('gina-step-4');
    }
};

window.gina_prevStep = function(currentStep) {
    if (currentStep === 2) window.gina_showSection('gina-step-1');
    if (currentStep === 3) window.gina_showSection('gina-step-2');
    if (currentStep === 4) window.gina_showSection('gina-step-3');
};

window.gina_showSection = function(id) {
    const ginaMain = document.getElementById('gina-main-container');
    ginaMain.querySelectorAll('.gold-card, #gina-results-section').forEach(div => div.classList.add('gold-hidden'));
    ginaMain.querySelectorAll('.gold-card, #gina-results-section').forEach(div => div.classList.remove('gold-fade-in'));
    
    const target = document.getElementById(id);
    if(target) {
        target.classList.remove('gold-hidden');
        target.classList.add('gold-fade-in');
    }
};

window.gina_selectRadio = function(element, groupName, value) {
    const allLabels = document.querySelectorAll(`input[name="${groupName}"]`);
    allLabels.forEach(input => {
        let parentLabel = input.closest('.gold-radio-option');
        if(parentLabel) parentLabel.classList.remove('selected');
    });
    element.classList.add('selected');
    const radio = element.querySelector('input');
    radio.checked = true;
};

window.gina_calculateResults = function() {
    const selected = document.querySelector('input[name="gina-track"]:checked');
    if (!selected) return alert("Selecione a Trilha de tratamento preferencial.");
    gina_state.track = selected.value;
    
    let step = 0;
    let rationale = "";

    if ((gina_state.symptoms === 'daily' || gina_state.night === 'yes') && gina_state.lungFunction === 'low') {
        step = 4;
        rationale = "Paciente apresenta sintomas diários/despertares frequentes E função pulmonar reduzida. Indicado início em Step 4.";
    } else if (gina_state.symptoms === 'daily' || gina_state.symptoms === 'frequent' || gina_state.night === 'yes') {
        step = 3;
        rationale = "Paciente apresenta sintomas na maioria dos dias ou despertares noturnos semanais.";
    } else {
        step = 2;
        rationale = "Paciente com sintomas pouco frequentes (menos de 4-5 dias/semana) e função pulmonar preservada.";
    }

    let trackColor = gina_state.track === '1' ? '#16a085' : '#e67e22';
    let trackName = gina_state.track === '1' ? 'TRILHA 1 (PREFERENCIAL)' : 'TRILHA 2 (ALTERNATIVA)';
    let trackDesc = gina_state.track === '1' ? 'Uso de CI-Formoterol como medicação de alívio (anti-inflamatório) e manutenção (se necessário).' : 'Uso de SABA (Broncodilatador de curta) para alívio + Corticoide Inalatório (CI) de manutenção diária obrigatória.';

    let treatmentText = "";
    let tradeNames = "";

    if (gina_state.track === '1') {
        if (step <= 2) {
            treatmentText = "Corticoide Inalatório (dose baixa) + Formoterol <strong>APENAS SOB DEMANDA</strong> (Alívio).";
            tradeNames = "Ex: Budesonida/Formoterol (Alenia, Symbicort, Vannair) ou Beclometasona/Formoterol (Fostair).";
        } else if (step === 3) {
            treatmentText = "Terapia MART (Manutenção e Alívio) com CI (dose baixa) + Formoterol.<br>Dose de manutenção diária (1x ou 2x ao dia) + Doses extras para alívio.";
            tradeNames = "Ex: Budesonida/Formoterol 100/6 ou 200/6 (Alenia, Symbicort) ou Beclometasona/Formoterol 100/6 (Fostair).";
        } else if (step >= 4) {
            treatmentText = "Terapia MART (Manutenção e Alívio) com CI (dose média) + Formoterol.<br>Aumentar dose de manutenção.";
            tradeNames = "Ex: Budesonida/Formoterol (Alenia, Symbicort) ou Beclometasona/Formoterol (Fostair).";
        }
    } else {
        if (step <= 2) {
            treatmentText = "Corticoide Inalatório (dose baixa) de uso DIÁRIO e REGULAR.<br>+ SABA (Salbutamol) apenas para alívio.";
            tradeNames = "CI Manutenção: Budesonida, Beclometasona, Fluticasona. Alívio: Aerolin.";
        } else if (step === 3) {
            treatmentText = "CI (dose baixa) + LABA (Beta-agonista longa duração) de uso DIÁRIO.<br>+ SABA para alívio.";
            tradeNames = "Manutenção: Fluticasona/Vilanterol (Relvar), Fluticasona/Salmeterol (Seretide), Budesonida/Formoterol (Symbicort - uso fixo).";
        } else if (step >= 4) {
            treatmentText = "CI (dose média/alta) + LABA de uso DIÁRIO.<br>+ SABA para alívio.";
            tradeNames = "Manutenção: Doses mais altas de Seretide, Relvar, Alenia ou Symbicort.";
        }
    }

    let eosWarning = "";
    if (gina_state.eos === 'unknown') {
        eosWarning = `<div style="margin-top: 15px; padding: 10px; background-color: #fff3cd; border-left: 5px solid #ffc107; color: #856404; font-size: 0.9rem; border-radius: 4px;"><strong>⚠️ Atenção:</strong> Faltam dados sobre os Eosinófilos. Reavalie o fenótipo após hemograma, crucial para ajustes em Steps avançados.</div>`;
    }

    const resDiv = document.getElementById("gina-results-section");
    resDiv.innerHTML = `
        <div style="background-color: ${trackColor}; color: #FFFFFF; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin: 0; color: white;">Resultado da Estratificação</h2>
            <div style="display: inline-block; background-color: rgba(255,255,255,0.2); color: white; padding: 0.5rem 1rem; border-radius: 4px; font-weight: 700; font-size: 1.2rem; margin-top: 0.5rem;">Estágio (Step) ${step}</div>
        </div>
        <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <span style="background-color: ${trackColor}; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.85rem; font-weight: bold;">${trackName}</span>
            <p style="margin-top: 10px; color: #555; font-size: 0.95rem;">${trackDesc}</p>
            <p style="font-style: italic; color: #888; font-size: 0.9rem; margin-top: 5px;">${rationale}</p>
            
            <div style="margin-top: 1.5rem;">
                <div style="color: ${trackColor}; font-weight: 700; margin-bottom: 0.5rem; font-size: 1.1rem;">💊 Tratamento Farmacológico Indicado</div>
                <div style="font-weight: 600; color: #333; font-size: 1.05rem; margin-bottom: 0.5rem;">${treatmentText}</div>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 4px; border: 1px solid #e9ecef; color: #555; font-size: 0.95rem; font-style: italic;">
                    <strong>Opções Comerciais (Brasil):</strong><br>${tradeNames}
                </div>
            </div>
            
            ${eosWarning}

            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 0.85rem;">Referência: Global Initiative for Asthma (GINA), 2025.</p>
            </div>
            <button class="btn-outline-sc" onclick="gina_reset()" style="width: 100%; margin-top: 1.5rem;">Nova Avaliação</button>
        </div>
    `;
    
    window.gina_showSection('gina-results-section');
    resDiv.scrollIntoView({ behavior: 'smooth' });
};