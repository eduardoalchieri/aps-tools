const gold_state = { ratio: null, goldGrade: null, symptomsHigh: false, exacerbationsHigh: false, eos: null };

window.gold_reset = function() {
    gold_state.ratio = null;
    gold_state.goldGrade = null;
    gold_state.symptomsHigh = false;
    gold_state.exacerbationsHigh = false;
    gold_state.eos = null;

    document.getElementById('gold-ratio-input').value = '';
    document.getElementById('gold-eos-input').value = '';
    
    document.querySelectorAll('.gold-radio-option').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.gold-radio-option input').forEach(el => el.checked = false);

    document.getElementById('gold-pharm-treatment').innerHTML = '';
    document.getElementById('gold-pharm-details').innerHTML = '';
    
    window.gold_showSection('gold-step-1');
};

window.gold_nextStep = function(currentStep) {
    if (currentStep === 1) {
        const ratio = parseFloat(document.getElementById('gold-ratio-input').value);
        if (isNaN(ratio)) return alert("Por favor, insira um valor válido.");
        gold_state.ratio = ratio;
        if (gold_state.ratio >= 0.70) {
            window.gold_showSection('gold-not-copd');
            return;
        }
        window.gold_showSection('gold-step-2');
    } 
    else if (currentStep === 2) {
        const selected = document.querySelector('input[name="gold-grade"]:checked');
        if (!selected) return alert("Selecione a gravidade GOLD.");
        gold_state.goldGrade = selected.value;
        window.gold_showSection('gold-step-3');
    }
    else if (currentStep === 3) {
        const scaleType = document.getElementById('gold-symptom-scale-selector').value;
        let selected;
        if (scaleType === 'mMRC') selected = document.querySelector('input[name="gold-symptoms"]:checked');
        else selected = document.querySelector('input[name="gold-symptoms-cat"]:checked');

        if (!selected) return alert("Selecione a pontuação de sintomas.");
        gold_state.symptomsHigh = (selected.value === 'high');
        window.gold_showSection('gold-step-4');
    }
};

window.gold_prevStep = function(currentStep) {
    if (currentStep === 2) window.gold_showSection('gold-step-1');
    if (currentStep === 3) window.gold_showSection('gold-step-2');
    if (currentStep === 4) window.gold_showSection('gold-step-3');
};

window.gold_showSection = function(id) {
    const goldMain = document.getElementById('gold-main-container');
    goldMain.querySelectorAll('.gold-card, #gold-results-section').forEach(div => div.classList.add('gold-hidden'));
    goldMain.querySelectorAll('.gold-card, #gold-results-section').forEach(div => div.classList.remove('gold-fade-in'));
    
    const target = document.getElementById(id);
    if(target) {
        target.classList.remove('gold-hidden');
        target.classList.add('gold-fade-in');
    }
};

window.gold_selectRadio = function(element, groupName, value) {
    const allLabels = document.querySelectorAll(`input[name="${groupName}"]`);
    allLabels.forEach(input => {
        let parentLabel = input.closest('.gold-radio-option');
        if(parentLabel) parentLabel.classList.remove('selected');
    });
    element.classList.add('selected');
    const radio = element.querySelector('input');
    radio.checked = true;
};

window.gold_toggleSymptomInput = function() {
    const scale = document.getElementById('gold-symptom-scale-selector').value;
    if (scale === 'mMRC') {
        document.getElementById('gold-mmrc-options').classList.remove('gold-hidden');
        document.getElementById('gold-cat-options').classList.add('gold-hidden');
    } else {
        document.getElementById('gold-mmrc-options').classList.add('gold-hidden');
        document.getElementById('gold-cat-options').classList.remove('gold-hidden');
    }
};

window.gold_calculateResults = function() {
    const exacSelected = document.querySelector('input[name="gold-exacerbation"]:checked');
    if (!exacSelected) {
        alert("Por favor, selecione o histórico de exacerbações.");
        return;
    }
    gold_state.exacerbationsHigh = (parseInt(exacSelected.value) === 1);
    const eosInput = document.getElementById('gold-eos-input').value;
    gold_state.eos = eosInput ? parseFloat(eosInput) : 0;
    
    let group = '';
    if (gold_state.exacerbationsHigh) group = 'E';
    else {
        if (gold_state.symptomsHigh) group = 'B';
        else group = 'A';
    }
    window.gold_displayResults(group);
};

window.gold_displayResults = function(group) {
    window.gold_showSection('gold-results-section');
    const diagText = `DPOC GOLD ${gold_state.goldGrade} - Grupo ${group}`;
    document.getElementById('gold-final-diagnosis').textContent = diagText;

    const pharmContainer = document.getElementById('gold-pharm-treatment');
    const detailContainer = document.getElementById('gold-pharm-details');
    let pharmHTML = "";
    let detailsHTML = "";
    
    if (group === 'A') {
        pharmHTML = "Broncodilatador (Ação Curta ou Longa)";
        detailsHTML = `<p style="margin-bottom:0.5rem; color: #555;">Opte preferencialmente por ação longa (LAMA ou LABA) para manutenção.</p><ul style="list-style: disc; padding-left: 20px; color: #444; font-size: 0.95rem;"><li><strong>LAMA:</strong> Tiotrópio <span style="color: #888; font-style: italic;">(Spiriva)</span>, Umeclidínio <span style="color: #888; font-style: italic;">(Incruse)</span></li><li><strong>LABA:</strong> Indacaterol <span style="color: #888; font-style: italic;">(Onbrize)</span>, Olodaterol <span style="color: #888; font-style: italic;">(Striverdi)</span></li><li><strong>SABA (Resgate):</strong> Salbutamol <span style="color: #888; font-style: italic;">(Aerolin)</span>, Fenoterol <span style="color: #888; font-style: italic;">(Berotec)</span></li></ul>`;
    } else if (group === 'B') {
        pharmHTML = "Terapia Dupla: LABA + LAMA";
        detailsHTML = `<p style="margin-bottom:0.5rem; color: #555;">Combinação de broncodilatadores de ação longa.</p><ul style="list-style: disc; padding-left: 20px; color: #444; font-size: 0.95rem;"><li><strong>Tiotrópio + Olodaterol:</strong> <span style="color: #888; font-style: italic;">(Spiolto)</span></li><li><strong>Umeclidínio + Vilanterol:</strong> <span style="color: #888; font-style: italic;">(Anoro)</span></li><li><strong>Indacaterol + Glicopirrônio:</strong> <span style="color: #888; font-style: italic;">(Ultibro)</span></li><li><strong>Aclidinio + Formoterol:</strong> <span style="color: #888; font-style: italic;">(Duaklir)</span></li></ul>`;
    } else if (group === 'E') {
        if (gold_state.eos >= 300) {
            pharmHTML = "Terapia Tripla: LABA + LAMA + ICS";
            detailsHTML = `<p style="margin-bottom:0.5rem; color: #555;">Indicado início direto com corticoide inalatório devido Eosinófilos ≥ 300.</p><ul style="list-style: disc; padding-left: 20px; color: #444; font-size: 0.95rem;"><li><strong>FF/Umeclidínio/Vilanterol:</strong> <span style="color: #888; font-style: italic;">(Trelegy)</span></li><li><strong>BDP/Formoterol/Glicopirrônio:</strong> <span style="color: #888; font-style: italic;">(Trimbow)</span></li><li><strong>Budesonida/Glicopirrônio/Formoterol:</strong> <span style="color: #888; font-style: italic;">(Breztri)</span></li></ul>`;
        } else {
            pharmHTML = "Terapia Dupla: LABA + LAMA";
            detailsHTML = `<p style="margin-bottom:0.5rem; color: #555;">Tratamento preferencial para alto risco de exacerbação. Se houver nova exacerbação ou Eosinófilos ≥ 300 no futuro, considerar escalonar para Tripla.</p><ul style="list-style: disc; padding-left: 20px; color: #444; font-size: 0.95rem;"><li><strong>Tiotrópio + Olodaterol:</strong> <span style="color: #888; font-style: italic;">(Spiolto)</span></li><li><strong>Umeclidínio + Vilanterol:</strong> <span style="color: #888; font-style: italic;">(Anoro)</span></li><li><strong>Indacaterol + Glicopirrônio:</strong> <span style="color: #888; font-style: italic;">(Ultibro)</span></li></ul><p style="margin-top:0.5rem; font-size:0.85rem; color:#888;">*Considere ICS se houver história de asma concomitante.</p>`;
        }
    }

    pharmContainer.innerHTML = pharmHTML;
    detailContainer.innerHTML = detailsHTML;
    const rehabLi = document.getElementById('gold-rehab-recommendation');
    if (group === 'B' || group === 'E') rehabLi.classList.remove('gold-hidden');
    else rehabLi.classList.add('gold-hidden');
};