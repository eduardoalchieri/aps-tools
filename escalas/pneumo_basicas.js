document.addEventListener("DOMContentLoaded", () => {
    // === GERAÇÃO DINÂMICA (ARRAYS ORIGINAIS) ===
    
    // CAT
    const sc_catLabels = [
        ["Nunca tenho tosse", "Tenho tosse o tempo todo"],
        ["Sem catarro no peito", "Peito cheio de catarro"],
        ["Sem pressão no peito", "Grande pressão no peito"],
        ["Sem falta de ar (escada)", "Muita falta de ar (escada)"],
        ["Sem limitação em casa", "Muito limitado em casa"],
        ["Confiante para sair", "Sem confiança para sair"],
        ["Durmo profundamente", "Não durmo bem"],
        ["Muita energia", "Sem energia"]
    ];
    const sc_catContainer = document.getElementById('cat-questions');
    if (sc_catContainer) {
        sc_catLabels.forEach((labels, idx) => {
            let i = idx + 1;
            sc_catContainer.innerHTML += `
            <div style="margin-bottom: 2rem; border-bottom: 1px solid #eee; padding-bottom: 1.5rem;">
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:#666; margin-bottom:5px;">
                    <span>${labels[0]} (0)</span><span>${labels[1]} (5)</span>
                </div>
                <div class="btn-group-sc">
                    ${[0,1,2,3,4,5].map(v => `
                        <input type="radio" name="cat${i}" id="cat${i}-${v}" value="${v}">
                        <label for="cat${i}-${v}" class="btn-option-sc" style="min-width:40px; justify-content:center;">${v}</label>
                    `).join('')}
                </div>
            </div>`;
        });
    }

    // STOP-BANG
    const sc_sbQs = [
        "1. Ronca alto (mais que falar)?", "2. Sente-se cansado/fadiga de dia?", 
        "3. Alguém observou apneia?", "4. Tem pressão alta?", 
        "5. IMC > 35 kg/m²?", "6. Idade > 50 anos?", 
        "7. Pescoço > 40cm?", "8. Gênero Masculino?"
    ];
    const sc_sbContainer = document.getElementById('sb-questions');
    if (sc_sbContainer) {
        sc_sbQs.forEach((q, idx) => {
            let i = idx + 1;
            sc_sbContainer.innerHTML += `
            <div style="margin-bottom:1rem; padding-bottom:1rem;">
                <span style="font-weight: 600; margin-bottom: 1rem; color: #2c3e50; display: block;">${q}</span>
                <div class="btn-group-sc" style="display: flex; max-width: 100%;">
                    <input type="radio" name="sb${i}" id="sb${i}-1" value="1"><label for="sb${i}-1" class="btn-option-sc">Sim</label>
                    <input type="radio" name="sb${i}" id="sb${i}-0" value="0"><label for="sb${i}-0" class="btn-option-sc">Não</label>
                </div>
            </div>`;
        });
    }

    // Epworth
    const sc_epQs = [
        "1. Sentado, lendo", "2. Assistindo TV", "3. Sentado passivo em lugar público",
        "4. Passageiro em viagem de 1h", "5. Deitado à tarde (se possível)",
        "6. Sentado conversando", "7. Sentado quieto após almoço", "8. No carro parado no trânsito"
    ];
    const sc_epContainer = document.getElementById('epworth-list');
    if (sc_epContainer) {
        sc_epQs.forEach((q, idx) => {
            let i = idx + 1;
            sc_epContainer.innerHTML += `
            <div style="margin-bottom:1rem; padding-bottom:1rem;">
                <span style="font-weight: 600; margin-bottom: 1rem; color: #2c3e50; display: block;">${q}</span>
                <div class="btn-group-sc">
                    ${[0,1,2,3].map(v => `
                        <input type="radio" name="ep${i}" id="ep${i}-${v}" value="${v}">
                        <label for="ep${i}-${v}" class="btn-option-sc" style="justify-content:center;">${v}</label>
                    `).join('')}
                </div>
            </div>`;
        });
    }

    // AMBIENTAL (HUSM)
    const sc_envQs = [
        "1. Mora em fazenda e tem silos?", "2. Tem pássaros em casa? (Pombo, Periquito, Papagaio, etc)",
        "3. Aparelhos de ar condicionado em casa/trabalho?", "4. Umidificador/vaporizador em casa/trabalho?",
        "5. Acúmulo de fungos/bolor (paredes, móveis, colchão)?", "6. Cheiro de mofo em casa/trabalho?",
        "7. Tem vazamentos em casa?", "8. Frequenta saunas de água quente?", "9. Tem piscina em casa?",
        "10. Tem fonte de água interna?", "11. Travesseiros/acolchoado/almofada de pena?",
        "12. Decoração com penas?", "13. Trabalha/trabalhou com tintas ou verniz?",
        "14. Fábricas de móveis?", "15. Madeiras/serrarias?", "16. Exposto a fluidos metálicos?",
        "17. Sprays de espuma?", "18. Alimentos para pássaros ou peixes?", "19. Farinha de trigo?",
        "20. Plantas ou manipula terra/adubos?", "21. Inseticidas ou sulfato de cobre?",
        "22. Plantação de fungos (shitake)?", "23. Toca instrumentos de sopro?"
    ];
    const sc_envContainer = document.getElementById('ambiental-list');
    if (sc_envContainer) {
        sc_envQs.forEach((q, idx) => {
            let i = idx + 1;
            sc_envContainer.innerHTML += `
            <div style="margin-bottom:1rem; padding-bottom:1rem;">
                <span style="font-weight: 600; margin-bottom: 1rem; color: #2c3e50; display: block;">${q}</span>
                <div class="btn-group-sc" style="display: flex; max-width: 100%;">
                    <input type="radio" name="env${i}" id="env${i}-0" value="0" onclick="sc_toggleObs(${i}, false)" checked>
                    <label for="env${i}-0" class="btn-option-sc">Não</label>
                    <input type="radio" name="env${i}" id="env${i}-1" value="1" onclick="sc_toggleObs(${i}, true)">
                    <label for="env${i}-1" class="btn-option-sc">Sim</label>
                </div>
                <div id="obs-box-${i}" class="obs-container">
                    <input type="text" id="env-obs-${i}" class="obs-input" placeholder="Observação (opcional)...">
                </div>
            </div>`;
        });
    }

    // === FUNÇÕES DE CÁLCULO (Disponíveis globalmente) ===
    window.sc_toggleObs = function(idx, show) {
        document.getElementById(`obs-box-${idx}`).style.display = show ? 'block' : 'none';
    };

    window.sc_calcMMRC = function() {
        let val = window.sc_getRadioVal('mmrc');
        if (val === null) { alert('Selecione uma opção.'); return; }
        window.sc_renderDetailedResult('mmrc-result', val, [
            {min: 0, max: 0, label: "0", title: "Dispneia Leve (Exercício)", desc: "Falta de ar apenas exercícios intensos.", severity:'low'},
            {min: 1, max: 1, label: "1", title: "Dispneia Leve", desc: "Andando rápido ou subindo leve.", severity:'low'},
            {min: 2, max: 2, label: "2", title: "Dispneia Moderada", desc: "Anda mais devagar que a média.", severity:'med'},
            {min: 3, max: 3, label: "3", title: "Dispneia Grave", desc: "Para após 100m.", severity:'high'},
            {min: 4, max: 4, label: "4", title: "Dispneia Muito Grave", desc: "Não sai de casa.", severity:'high'}
        ], "Grau mMRC");
    };

    window.sc_calcCAT = function() {
        let sum = 0;
        for(let i=1; i<=8; i++) {
            let v = window.sc_getRadioVal(`cat${i}`);
            if(v===null) { alert("Responda todas as perguntas."); return; }
            sum += v;
        }
        window.sc_renderDetailedResult('cat-result', sum, [
            {min: 0, max: 9, label: "0-9", title: "Baixo Impacto", desc: "A maioria dos dias é bom.", severity:'low'},
            {min: 10, max: 19, label: "10-19", title: "Médio Impacto", desc: "Sintomas impactam dia a dia.", severity:'med'},
            {min: 20, max: 29, label: "20-29", title: "Alto Impacto", desc: "Grande impacto na qualidade de vida.", severity:'high'},
            {min: 30, max: 40, label: "30-40", title: "Muito Alto Impacto", desc: "Doença domina a vida.", severity:'high'}
        ]);
    };

    window.sc_calcACT = function() {
        let sum = 0;
        for(let i=1; i<=5; i++) {
            let v = window.sc_getRadioVal(`act${i}`);
            if(v===null) { alert("Responda todas as perguntas."); return; }
            sum += v;
        }
        window.sc_renderDetailedResult('act-result', sum, [
            {min: 5, max: 15, label: "5-15", title: "Não Controlada", desc: "Avaliação urgente.", severity:'high'},
            {min: 16, max: 19, label: "16-19", title: "Parcialmente Controlada", desc: "Considerar ajuste.", severity:'med'},
            {min: 20, max: 24, label: "20-24", title: "Bem Controlada", desc: "Manter tratamento.", severity:'low'},
            {min: 25, max: 25, label: "25", title: "Totalmente Controlada", desc: "Excelente.", severity:'low'}
        ]);
    };

    window.sc_calcFagerstrom = function() {
        let sum = 0;
        for(let i=1; i<=6; i++) {
            let v = window.sc_getRadioVal(`fag${i}`);
            if(v===null) { alert("Responda todas as perguntas."); return; }
            sum += v;
        }
        window.sc_renderDetailedResult('fagerstrom-result', sum, [
            {min: 0, max: 2, label: "0-2", title: "Muito Baixa", desc: "Dependência mínima.", severity:'low'},
            {min: 3, max: 4, label: "3-4", title: "Baixa", desc: "Dependência leve.", severity:'low'},
            {min: 5, max: 5, label: "5", title: "Média", desc: "Dependência moderada.", severity:'med'},
            {min: 6, max: 7, label: "6-7", title: "Elevada", desc: "Forte dependência.", severity:'high'},
            {min: 8, max: 10, label: "8-10", title: "Muito Elevada", desc: "Altíssima dependência.", severity:'high'}
        ]);
    };

    window.sc_calcStopBang = function() {
        let sum = 0;
        for(let i=1; i<=8; i++) {
            let v = window.sc_getRadioVal(`sb${i}`);
            if(v===null) { alert("Responda todos os itens."); return; }
            sum += v;
        }
        window.sc_renderDetailedResult('stopbang-result', sum, [
            {min: 0, max: 2, label: "0-2", title: "Baixo Risco", desc: "Baixa probabilidade de SAOS.", severity:'low'},
            {min: 3, max: 4, label: "3-4", title: "Risco Interm.", desc: "Probabilidade moderada.", severity:'med'},
            {min: 5, max: 8, label: "5-8", title: "Alto Risco", desc: "Alta probabilidade de SAOS.", severity:'high'}
        ]);
    };

    window.sc_calcEpworth = function() {
        let sum = 0;
        for(let i=1; i<=8; i++) {
            let v = window.sc_getRadioVal(`ep${i}`);
            if(v===null) { alert("Responda todos os itens."); return; }
            sum += v;
        }
        window.sc_renderDetailedResult('epworth-result', sum, [
            {min: 0, max: 10, label: "0-10", title: "Normal", desc: "Sonolência normal.", severity:'low'},
            {min: 11, max: 15, label: "11-15", title: "Leve/Moderada", desc: "Acima do normal.", severity:'med'},
            {min: 16, max: 24, label: "16-24", title: "Grave", desc: "Sonolência excessiva patológica.", severity:'high'}
        ]);
    };

    window.sc_calcAmbiental = function() {
        const container = document.getElementById('ambiental-result');
        container.innerHTML = "";
        let count = 0;
        let ul = document.createElement('ul');
        ul.style.listStyle = 'none'; ul.style.padding = 0; ul.style.margin = 0;
        
        for(let i=1; i<=23; i++) {
            let v = window.sc_getRadioVal(`env${i}`);
            if (v === 1) {
                count++;
                let obsText = document.getElementById(`env-obs-${i}`).value;
                let li = document.createElement('li');
                li.style.background = 'white'; li.style.border = '1px solid #eee'; li.style.borderLeft = '4px solid #0b5ed7'; li.style.marginBottom = '8px'; li.style.padding = '12px'; li.style.borderRadius = '4px';
                li.innerHTML = `<span style="font-weight: bold; color: #333; display: block;">${sc_envQs[i-1]}</span>`;
                if(obsText.trim() !== "") {
                    li.innerHTML += `<span style="font-size: 0.9rem; color: #666; margin-top: 4px; font-style: italic; display: block;">Obs: ${obsText}</span>`;
                }
                ul.appendChild(li);
            }
        }

        container.innerHTML += `
            <div class="final-score-box">
                <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8;">Fatores de Exposição</div>
                <div style="font-size: 2.5rem; font-weight: 700; line-height: 1.2;">${count}</div>
            </div>
        `;
        let contentDiv = document.createElement('div');
        if(count === 0) {
            contentDiv.innerHTML = "<p style='text-align:center; color:#666;'>Nenhum fator de risco identificado.</p>";
        } else {
            contentDiv.innerHTML = `<div style="font-size: 1.1rem; font-weight: bold; color: #555; margin-bottom: 1rem;">Detalhamento</div>`;
            contentDiv.appendChild(ul);
        }
        container.appendChild(contentDiv);
        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth' });
    };
});