document.addEventListener("DOMContentLoaded", () => {
    const investigationToggle = document.getElementById("toast-investigation-done");
    const atheroCheck = document.getElementById("toast-athero");
    const cardioCheck = document.getElementById("toast-cardio");
    const lacunarCheck = document.getElementById("toast-lacunar");
    const otherCheck = document.getElementById("toast-other");
    const resContainer = document.getElementById("res-toast");

    const allInputs = [investigationToggle, atheroCheck, cardioCheck, lacunarCheck, otherCheck];

    function evaluateToast() {
        const isComplete = investigationToggle.checked;
        const checks = [
            { id: 'athero', checked: atheroCheck.checked },
            { id: 'cardio', checked: cardioCheck.checked },
            { id: 'lacunar', checked: lacunarCheck.checked },
            { id: 'other', checked: otherCheck.checked }
        ];

        const activeChecks = checks.filter(c => c.checked);
        const count = activeChecks.length;

        let diagnostico = "";
        let colorType = ""; // 'red', 'green', 'yellow'
        let examesHTML = "";

        // Regra A (Múltiplas Causas)
        if (count >= 2) {
            diagnostico = "Etiologia Indeterminada (Múltiplas causas concorrentes)";
            colorType = "red";
            examesHTML = `
                <div style="background-color: #fff3cd; color: #856404; padding: 12px; border-radius: 6px; border: 1px solid #ffeeba; display: flex; gap: 10px; align-items: flex-start; margin-bottom: 10px;">
                    <span class="material-symbols-outlined" style="font-size: 1.2rem;">warning</span>
                    <div>
                        <strong>Aviso Clínico:</strong> O paciente possui mais de um mecanismo fisiopatológico plausível (ex: doença aterosclerótica severa concorrendo com fibrilação atrial). A decisão terapêutica (antiagregação vs. anticoagulação) deve ser individualizada pelo neurologista/clínico com base no risco hemorrágico e na morfologia da lesão na imagem.
                    </div>
                </div>
            `;
        } 
        // Regra B (Causa Única)
        else if (count === 1) {
            colorType = "green";
            const cause = activeChecks[0].id;
            
            if (cause === 'athero') {
                diagnostico = "Aterosclerose de Grandes Artérias";
                examesHTML = `
                    <ul style="margin: 0; padding-left: 20px; line-height: 1.6; color: #444;">
                        <li><strong>Propedêutica concluída</strong> para este eixo.</li>
                        <li>Monitorar perfil lipídico (Painel Lipídico completo).</li>
                        <li>Avaliar indicação de endarterectomia/angioplastia caso haja estenose sintomática &gt;70% na AngioTC, AngioRM ou Doppler de Carótidas.</li>
                    </ul>
                `;
            } else if (cause === 'cardio') {
                diagnostico = "Cardioembolismo";
                examesHTML = `
                    <ul style="margin: 0; padding-left: 20px; line-height: 1.6; color: #444;">
                        <li><strong>Propedêutica concluída</strong> para este eixo.</li>
                        <li>Confirmar documentação no ECG de 12 derivações, Holter de 24h e Ecocardiograma Transtorácico/Transesofágico.</li>
                    </ul>
                `;
            } else if (cause === 'lacunar') {
                diagnostico = "Oclusão de Pequenos Vasos (Lacunar)";
                examesHTML = `
                    <div style="background-color: #fff3cd; color: #856404; padding: 10px; border-radius: 6px; border: 1px solid #ffeeba; margin-bottom: 10px;">
                        <strong>Atenção:</strong> O diagnóstico lacunar exige a exclusão formal de fontes embólicas maiores. Certifique-se de que o paciente realizou Doppler de Carótidas e avaliação cardíaca básica.
                    </div>
                    <ul style="margin: 0; padding-left: 20px; line-height: 1.6; color: #444;">
                        <li>Manter otimização agressiva de fatores de risco cardiovasculares.</li>
                    </ul>
                `;
            } else if (cause === 'other') {
                diagnostico = "Outra Etiologia Determinada";
                examesHTML = `
                    <p style="margin-top: 0; margin-bottom: 8px; color: #444;">Investigação especializada necessária conforme a suspeita:</p>
                    <ul style="margin: 0; padding-left: 20px; line-height: 1.6; color: #444;">
                        <li>AngioTC de pescoço (pesquisa de dissecção).</li>
                        <li>Painel de Trombofilias (Fator V de Leiden, Mutação da Protrombina, Anticorpos Antifosfolípides).</li>
                        <li>Sorologias (VDRL, HIV).</li>
                        <li>Painel Reumatológico para Vasculites.</li>
                    </ul>
                `;
            }
        } 
        // Regra C e D (Sem achados)
        else {
            if (!isComplete) {
                // Regra C
                diagnostico = "Etiologia Indeterminada (Investigação em Andamento)";
                colorType = "yellow";
                examesHTML = `
                    <p style="margin-top: 0; margin-bottom: 12px; font-weight: bold; color: #333;">Checklist de Investigação Pendente (Painel Básico AHA/ASA):</p>
                    <ul style="list-style-type: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; color: #444;">
                        <li style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined" style="color: #ccc;">check_box_outline_blank</span> Tomografia Computadorizada (TC) ou Ressonância Magnética (RM) de Crânio.</li>
                        <li style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined" style="color: #ccc;">check_box_outline_blank</span> Estudo de vasos intra e extracranianos (AngioTC, AngioRM ou Doppler de Carótidas e Vertebrais).</li>
                        <li style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined" style="color: #ccc;">check_box_outline_blank</span> Eletrocardiograma (ECG) e Monitoramento Holter.</li>
                        <li style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined" style="color: #ccc;">check_box_outline_blank</span> Ecocardiograma (Transtorácico e/ou Transesofágico).</li>
                        <li style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined" style="color: #ccc;">check_box_outline_blank</span> Exames laboratoriais de rotina (glicemia, lipidograma, hemograma, coagulograma).</li>
                    </ul>
                `;
            } else {
                // Regra D
                diagnostico = "Etiologia Indeterminada (AVC Criptogênico / ESUS)";
                colorType = "yellow";
                examesHTML = `
                    <p style="margin-top: 0; margin-bottom: 10px; color: #444;">Painel básico negativo. O paciente configura possível <strong>ESUS</strong> (Embolic Stroke of Undetermined Source).</p>
                    <p style="margin-top: 0; margin-bottom: 8px; color: #444;">A diretriz sugere aprofundar com:</p>
                    <ul style="margin: 0; padding-left: 20px; line-height: 1.6; color: #444;">
                        <li>Monitoramento cardíaco prolongado (Loop Recorder implantável ou Holter estendido de 7 a 30 dias) para pesquisa de Fibrilação Atrial paroxística oculta.</li>
                        <li>Pesquisa de Forame Oval Patente (FOP) via Doppler Transcraniano ou Eco Transesofágico com microbolhas.</li>
                    </ul>
                `;
            }
        }

        // Definindo as cores baseadas no tipo
        let headBg, headColor;
        if (colorType === 'red') {
            headBg = '#f8d7da';
            headColor = '#721c24';
        } else if (colorType === 'green') {
            headBg = '#d4edda';
            headColor = '#155724';
        } else {
            headBg = '#fff3cd';
            headColor = '#856404';
        }

        const renderHTML = `
            <div style="background-color: ${headBg}; color: ${headColor}; padding: 15px 20px; border-bottom: 1px solid rgba(0,0,0,0.05);">
                <h3 style="margin: 0; font-size: 1.25rem; display: flex; align-items: center; gap: 8px;">
                    <span class="material-symbols-outlined">analytics</span>
                    ${diagnostico}
                </h3>
            </div>
            <div style="padding: 20px; background-color: #fff;">
                <h4 style="margin-top: 0; color: #0b5ed7; font-size: 1.05rem; margin-bottom: 12px; display: flex; align-items: center; gap: 5px;">
                    <span class="material-symbols-outlined" style="font-size: 1.1rem;">lightbulb</span> Sugestões de Propedêutica
                </h4>
                ${examesHTML}
            </div>
        `;

        resContainer.innerHTML = renderHTML;
        resContainer.style.display = "block";
    }

    // Attach listeners
    allInputs.forEach(input => {
        if(input) input.addEventListener('change', evaluateToast);
    });
    
    // Evaluate initially just in case (though it starts empty)
    // evaluateToast();
});
