// === LÓGICA CARGA TABÁGICA ===

function sc_updateYears() {
    const start = parseInt(document.getElementById('tab-age-start').value) || 0;
    const end = parseInt(document.getElementById('tab-age-end').value) || 0;
    
    if (end > start) {
        const diff = end - start;
        document.getElementById('tab-total-years').innerText = diff + " Anos";
        
        ['tab-cig-years', 'tab-pal-years', 'tab-vape-years', 'tab-hook-years'].forEach(id => {
            const el = document.getElementById(id);
            if(!el.value) el.value = diff;
        });
    }
}

function sc_calcPackYears() {
    // 1. Cigarro: (Qtd / 20) * Anos
    let cigQty = parseFloat(document.getElementById('tab-cig-qty').value) || 0;
    let cigUnit = document.getElementById('tab-cig-unit').value;
    let cigYears = parseFloat(document.getElementById('tab-cig-years').value) || 0;
    if (cigUnit === 'unit') cigQty = cigQty / 20; 
    let scoreCig = cigQty * cigYears;

    // 2. Palheiro: ((Qtd * 3) / 20) * Anos
    let palQty = parseFloat(document.getElementById('tab-pal-qty').value) || 0;
    let palYears = parseFloat(document.getElementById('tab-pal-years').value) || 0;
    let scorePal = ((palQty * 3) / 20) * palYears;

    // 3. Vape: (Pods * 1) * Anos  [1 Pod ~ 1 Maço]
    let vapeQty = parseFloat(document.getElementById('tab-vape-qty').value) || 0;
    let vapeYears = parseFloat(document.getElementById('tab-vape-years').value) || 0;
    let scoreVape = vapeQty * vapeYears;

    // 4. Narguilé: (Sessões * 5) * Anos [1 Sessão ~ 5 Maços/100 cigs]
    let hookQty = parseFloat(document.getElementById('tab-hook-qty').value) || 0;
    let hookYears = parseFloat(document.getElementById('tab-hook-years').value) || 0;
    let scoreHook = (hookQty * 5) * hookYears;

    let total = scoreCig + scorePal + scoreVape + scoreHook;
    
    let container = document.getElementById('tabagismo-result');
    let color = "#4CAF50";
    let msg = "Baixa Carga";
    
    if (total >= 20) { color = "#d32f2f"; msg = "ALTO RISCO (Indica-se rastreamento de CA)"; }
    else if (total >= 10) { color = "#FF9800"; msg = "Carga Moderada"; }

    container.innerHTML = `
        <div class="final-score-box" style="background-color: ${color}20; border-color: ${color}; color: #333;">
            <div style="font-size: 0.9rem; text-transform: uppercase;">Carga Total</div>
            <div style="font-size: 3rem; font-weight: 800; color: ${color}; line-height:1;">${total.toFixed(1)}</div>
            <div style="font-size: 1rem; font-weight: bold;">Maços-Ano</div>
        </div>
        <div style="padding:15px; background:white; border-left:4px solid ${color}; margin-top:10px;">
            <strong>Interpretação:</strong> ${msg}
            <ul style="margin-top:10px; padding-left:20px; font-size:0.9rem; color:#555;">
                <li>Cigarro: ${scoreCig.toFixed(1)} m/a</li>
                <li>Palheiro: ${scorePal.toFixed(1)} m/a</li>
                <li>Vape: ${scoreVape.toFixed(1)} m/a</li>
                <li>Narguilé: ${scoreHook.toFixed(1)} m/a</li>
            </ul>
        </div>
    `;
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth' });
}