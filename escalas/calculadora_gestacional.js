document.addEventListener('DOMContentLoaded', () => {
    const selector = document.getElementById('calc-gest-selector');
    if (selector) {
        selector.addEventListener('change', function(e) {
            document.querySelectorAll('.calc-module').forEach(el => el.classList.add('hidden'));
            document.getElementById(e.target.value).classList.remove('hidden');
        });
    }
});

function getT00Date(dateString) {
    if (!dateString) return null;
    return new Date(dateString + 'T00:00:00');
}

function formatDateBR(dateObj) {
    const d = String(dateObj.getDate()).padStart(2, '0');
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const y = dateObj.getFullYear();
    return `${d}/${m}/${y}`;
}

function renderResult(elementId, html) {
    const el = document.getElementById(elementId);
    el.innerHTML = html;
    el.classList.remove('hidden');
}

function getTodayT00() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

// A. Calculadora por DUM
function calcularDUM() {
    const dumInput = document.getElementById('dum-date').value;
    if (!dumInput) return alert('Por favor, insira a DUM.');

    const dumDate = getT00Date(dumInput);
    const today = getTodayT00();
    
    const diffTime = today - dumDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return alert('A DUM não pode estar no futuro.');

    const semanas = Math.floor(diffDays / 7);
    const dias = diffDays % 7;

    const dppDate = new Date(dumDate);
    dppDate.setDate(dppDate.getDate() + 280);

    const resultHtml = `<strong>Idade Gestacional Atual:</strong><br> ${semanas} semanas e ${dias} dias<br><br><strong>Data Provável do Parto (DPP):</strong><br> ${formatDateBR(dppDate)}`;
    renderResult('result-dum', resultHtml);
}

// B. Calculadora por Ultrassonografia (USG)
function calcularUSG() {
    const usgInput = document.getElementById('usg-date').value;
    const weeks = parseInt(document.getElementById('usg-weeks').value) || 0;
    const days = parseInt(document.getElementById('usg-days').value) || 0;

    if (!usgInput) return alert('Por favor, insira a data do exame.');

    const usgDate = getT00Date(usgInput);
    const today = getTodayT00();
    
    const baseGestationalDays = (weeks * 7) + days;
    
    const diffTime = today - usgDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const totalCurrentDays = baseGestationalDays + diffDays;
    const currentWeeks = Math.floor(totalCurrentDays / 7);
    const currentDays = totalCurrentDays % 7;

    const dppDate = new Date(usgDate);
    dppDate.setDate(dppDate.getDate() + (280 - baseGestationalDays));

    const resultHtml = `<strong>Idade Gestacional Atual:</strong><br> ${currentWeeks} semanas e ${currentDays} dias<br><br><strong>Data Provável do Parto (DPP):</strong><br> ${formatDateBR(dppDate)}`;
    renderResult('result-usg', resultHtml);
}

// C. Calculadora de Reprodução Assistida (FIV / TEC)
function calcularFIV() {
    const fivInput = document.getElementById('fiv-date').value;
    if (!fivInput) return alert('Por favor, insira a data da transferência.');

    const typeEmb = parseInt(document.querySelector('input[name="fiv-type"]:checked').value);
    const transferDate = getT00Date(fivInput);
    
    const fecundationDate = new Date(transferDate);
    fecundationDate.setDate(fecundationDate.getDate() - typeEmb);

    const dumFicticia = new Date(fecundationDate);
    dumFicticia.setDate(dumFicticia.getDate() - 14);

    const today = getTodayT00();
    const diffTime = today - dumFicticia;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const semanas = Math.floor(diffDays / 7);
    const dias = diffDays % 7;

    const dppDate = new Date(dumFicticia);
    dppDate.setDate(dppDate.getDate() + 280);

    const resultHtml = `<strong>DUM Fictícia:</strong><br> ${formatDateBR(dumFicticia)}<br><br><strong>Idade Gestacional Atual:</strong><br> ${semanas} semanas e ${dias} dias<br><br><strong>Data Provável do Parto (DPP):</strong><br> ${formatDateBR(dppDate)}`;
    renderResult('result-fiv', resultHtml);
}

// D. Calculadora Reversa (Pela DPP)
function calcularReversa() {
    const dppInput = document.getElementById('rev-dpp').value;
    if (!dppInput) return alert('Por favor, insira a DPP.');

    const dppDate = getT00Date(dppInput);
    
    const dumTeorica = new Date(dppDate);
    dumTeorica.setDate(dumTeorica.getDate() - 280);

    const today = getTodayT00();
    const diffTime = today - dumTeorica;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const semanas = Math.floor(diffDays / 7);
    const dias = diffDays % 7;

    const resultHtml = `<strong>DUM Teórica:</strong><br> ${formatDateBR(dumTeorica)}<br><br><strong>Idade Gestacional Atual:</strong><br> ${semanas} semanas e ${dias} dias`;
    renderResult('result-reversa', resultHtml);
}

// E. Calculadora do Escore de Bishop
function calcularBishop() {
    const dil = parseInt(document.querySelector('input[name="bish-dil"]:checked').value);
    const apg = parseInt(document.querySelector('input[name="bish-apg"]:checked').value);
    const alt = parseInt(document.querySelector('input[name="bish-alt"]:checked').value);
    const cons = parseInt(document.querySelector('input[name="bish-cons"]:checked').value);
    const pos = parseInt(document.querySelector('input[name="bish-pos"]:checked').value);

    const score = dil + apg + alt + cons + pos;
    const interpretation = score <= 6 ? "Colo Desfavorável (requer preparo do colo)" : "Colo Favorável (indução com ocitocina)";

    const resultHtml = `<strong>Escore de Bishop: ${score} pontos</strong><br><br><span>${interpretation}</span>`;
    renderResult('result-bishop', resultHtml);
}