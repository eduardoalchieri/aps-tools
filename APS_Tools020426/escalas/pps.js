window.pps_select = function(element) {
    document.querySelectorAll('input[name="pps_level"]').forEach(input => {
        let parentLabel = input.closest('.gold-radio-option');
        if(parentLabel) parentLabel.classList.remove('selected');
    });
    element.classList.add('selected');
    element.querySelector('input').checked = true;
};

document.addEventListener("DOMContentLoaded", () => {
    const btnCalc = document.getElementById("btn-calc-pps");

    if (btnCalc) {
        btnCalc.addEventListener("click", () => {
            const selecionado = document.querySelector('input[name="pps_level"]:checked');
            if (!selecionado) {
                alert("Por favor, selecione o nível que melhor se adequa ao paciente antes de confirmar.");
                return;
            }

            const valorPPS = parseInt(selecionado.value);

            // === LÓGICA DE INTEGRAÇÃO (VIAGEM DE IDA E VOLTA) ===
            if (window.ppsOrigem) {
                let origem = window.ppsOrigem;
                window.ppsOrigem = null; // Limpa a memória global
                
                if (origem === 'view-risco-ad') {
                    // Mapeia o valor exato devolvido pela PPS para as caixas do Risco AD
                    let radId = '';
                    if (valorPPS >= 80) radId = 'rad_pps_80';
                    else if (valorPPS >= 50) radId = 'rad_pps_50';
                    else if (valorPPS >= 30) radId = 'rad_pps_30';
                    else radId = 'rad_pps_20';
                    
                    // Marca o Radio na escala de origem
                    document.getElementById(radId).checked = true;
                    
                    // Volta a tela dinamicamente sem recarregar a página
                    document.querySelectorAll('.view').forEach(v => { v.classList.remove('active'); v.classList.add('hidden'); });
                    document.getElementById(origem).classList.remove('hidden');
                    document.getElementById(origem).classList.add('active');
                    window.scrollTo({ top: document.getElementById('rad_pps_0').offsetTop - 100, behavior: 'smooth' });
                    return; // Para a execução, ocultando o resultado padrão do PPS
                }
            }

            // === RESULTADO PADRÃO DA PPS (QUANDO ACESSADA DIRETAMENTE DO MENU) ===
            let cor = "#0b5ed7"; 
            if (valorPPS <= 30 && valorPPS > 0) cor = "#dc3545";
            else if (valorPPS <= 50) cor = "#ff9800";
            else if (valorPPS === 0) cor = "#8b0000";

            const resDiv = document.getElementById("res-pps");
            resDiv.innerHTML = `
                <div style="background-color: ${cor}; color: #FFFFFF; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Nível de Desempenho</div>
                    <div style="font-size: 3.5rem; font-weight: 800; line-height: 1.1;">PPS ${valorPPS}%</div>
                </div>
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <p style="font-size: 0.95rem; color: #444; line-height: 1.5; margin-bottom: 15px;">
                        <strong>Conduta Registrada:</strong> O paciente foi avaliado clinicamente e o perfil que melhor descreve o seu nível de atividade atual, autocuidado e evidência de doença corresponde ao Palliative Performance Scale (PPS) de <strong>${valorPPS}%</strong>.
                    </p>
                    <p style="color: #888; font-size: 0.8rem; margin-top: 1.5rem; border-top: 1px solid #ddd; padding-top: 10px;">
                        Copyright © 2001 Victoria Hospice Society. Versão Portuguesa (PPS PT): Observatório Português dos Cuidados Paliativos; 2022.
                    </p>
                </div>
            `;
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});