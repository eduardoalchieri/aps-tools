/**
 * Lógica da Calculadora de Idade Corrigida para Prematuros.
 * Desenvolvida para o APAS Tools.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Configura a data máxima (Hoje) e a data padrão de consulta (Hoje)
    const dataNascInput = document.getElementById('ip-data-nasc');
    const dataConsInput = document.getElementById('ip-data-cons');
    
    if (dataNascInput && dataConsInput) {
        const todayStr = getTodayString();
        dataNascInput.max = todayStr;
        dataConsInput.value = todayStr;
    }
});

/**
 * Retorna a data atual no formato YYYY-MM-DD
 */
function getTodayString() {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    return `${y}-${m}-${d}`;
}

/**
 * Calcula a diferença exata em meses e dias entre duas datas (baseado no calendário civil).
 */
function calcularIdadeExata(dataInicio, dataFim) {
    if (dataFim < dataInicio) return { meses: 0, dias: 0 };

    let meses = (dataFim.getFullYear() - dataInicio.getFullYear()) * 12 + (dataFim.getMonth() - dataInicio.getMonth());
    
    let dataCopia = new Date(dataInicio);
    dataCopia.setMonth(dataCopia.getMonth() + meses);
    
    let dias = Math.floor((dataFim - dataCopia) / (1000 * 60 * 60 * 24));
    
    // Se os dias forem negativos, significa que o dia do mês da data final 
    // é menor que o dia do mês da data inicial. Retrocedemos um mês.
    if (dias < 0) {
        meses -= 1;
        dataCopia = new Date(dataInicio);
        dataCopia.setMonth(dataCopia.getMonth() + meses);
        dias = Math.floor((dataFim - dataCopia) / (1000 * 60 * 60 * 24));
    }
    
    return { meses, dias };
}

/**
 * Formata os meses e dias em uma string amigável para leitura.
 */
function formatarIdadeAmigavel(meses, dias) {
    let partes = [];
    if (meses > 0) partes.push(`${meses} ${meses === 1 ? 'mês' : 'meses'}`);
    if (dias > 0 || partes.length === 0) partes.push(`${dias} ${dias === 1 ? 'dia' : 'dias'}`);
    return partes.join(' e ');
}

/**
 * Função Principal de Cálculo e Atualização da UI
 */
function calcularIdadeCorrigida() {
    const dataNascStr = document.getElementById('ip-data-nasc').value;
    const dataConsStr = document.getElementById('ip-data-cons').value;
    const igSemanasStr = document.getElementById('ip-ig-sem').value;
    const igDiasStr = document.getElementById('ip-ig-dias').value;

    // Referências UI
    const resultCard = document.getElementById('ip-result-card');
    const alertTermo = document.getElementById('ip-alert-termo');
    const alertLimite = document.getElementById('ip-alert-limite');

    // Estado inicial: Esconder resultados e alertas
    resultCard.classList.add('hidden');
    resultCard.style.display = 'none'; // Compatibilidade extra
    alertTermo.style.display = 'none';
    alertLimite.style.display = 'none';

    // Validação de preenchimento
    if (!dataNascStr || !dataConsStr || !igSemanasStr) return;

    const semanasIG = parseInt(igSemanasStr, 10);
    let diasIG = parseInt(igDiasStr, 10) || 0;

    // Trava de segurança: Limite de dias 0 a 6
    if (diasIG < 0) diasIG = 0;
    if (diasIG > 6) diasIG = 6;

    // Regra Crítica: >= 37 semanas (Bebê a termo)
    if (semanasIG >= 37) {
        alertTermo.style.display = 'block';
        return;
    }

    // Validação extra se estiver muito abaixo do limite viável
    if (semanasIG < 20) return;

    const dataNascimento = new Date(dataNascStr + 'T00:00:00');
    const dataConsulta = new Date(dataConsStr + 'T00:00:00');

    // Validações de datas
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dataNascimento > today) {
        // Data futura não permitida
        return;
    }
    if (dataConsulta < dataNascimento) {
        // Consulta não pode ser anterior ao nascimento
        return;
    }

    // --- PASSO 1: Calcular Prematuridade ---
    // Total alvo é 40 semanas (280 dias)
    const igEmDias = (semanasIG * 7) + diasIG;
    const diasPrematuridade = 280 - igEmDias;
    const descSemanas = Math.floor(diasPrematuridade / 7);
    const descDias = diasPrematuridade % 7;

    // --- PASSO 2: Idade Cronológica ---
    const idadeCronologicaDiasTotal = Math.floor((dataConsulta - dataNascimento) / (1000 * 60 * 60 * 24));
    const idadeCronologicaExata = calcularIdadeExata(dataNascimento, dataConsulta);

    // --- PASSO 3: Idade Corrigida ---
    const idadeCorrigidaDiasTotal = idadeCronologicaDiasTotal - diasPrematuridade;
    
    // Calcula a data base teórica para encontrar meses/dias corretos
    // (Avançamos a data de nascimento simulando que ele ficasse na barriga pelos dias de prematuridade)
    const dataNascimentoCorrigida = new Date(dataNascimento);
    dataNascimentoCorrigida.setDate(dataNascimentoCorrigida.getDate() + diasPrematuridade);
    
    // --- PASSO 4: Formatação de Exibição ---
    
    // Idade Cronológica formatada (fallback para semanas se < 1 mês)
    let cronoFormatada = '';
    if (idadeCronologicaDiasTotal < 30 && idadeCronologicaDiasTotal >= 7) {
        let semCrono = Math.floor(idadeCronologicaDiasTotal / 7);
        let diaCrono = idadeCronologicaDiasTotal % 7;
        cronoFormatada = `${semCrono} sem e ${diaCrono} ${diaCrono === 1 ? 'dia' : 'dias'}`;
    } else {
        cronoFormatada = formatarIdadeAmigavel(idadeCronologicaExata.meses, idadeCronologicaExata.dias);
    }

    // Tempo de Prematuridade formatado
    let premFormatada = `${descSemanas} sem e ${descDias} ${descDias === 1 ? 'dia' : 'dias'}`;

    // Idade Corrigida formatada
    let corrFormatada = '';
    if (idadeCorrigidaDiasTotal <= 0) {
        corrFormatada = "Bebê ainda não atingiu a data prevista para o parto (Idade corrigida negativa).";
    } else {
        if (idadeCorrigidaDiasTotal < 30 && idadeCorrigidaDiasTotal >= 7) {
            let semCorr = Math.floor(idadeCorrigidaDiasTotal / 7);
            let diaCorr = idadeCorrigidaDiasTotal % 7;
            corrFormatada = `${semCorr} sem e ${diaCorr} ${diaCorr === 1 ? 'dia' : 'dias'}`;
        } else {
            const idadeCorrigidaExata = calcularIdadeExata(dataNascimentoCorrigida, dataConsulta);
            corrFormatada = formatarIdadeAmigavel(idadeCorrigidaExata.meses, idadeCorrigidaExata.dias);
        }
    }

    // Exibir o card de resultados usando o padrão do projeto
    resultCard.innerHTML = `
        <div style="margin-top: 1rem;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span style="color: #666;">Idade Cronológica:</span>
                <strong style="color: #333;">${cronoFormatada}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span style="color: #666;">Tempo de Prematuridade (Desconto):</span>
                <strong style="color: #333;">${premFormatada}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px 0; background-color: #f0f7ff; margin: 12px -16px -16px -16px; padding: 16px; border-radius: 0 0 8px 8px; border-top: 2px solid #0b5ed7;">
                <span style="color: #0b5ed7; font-weight: bold;">Idade Corrigida:</span>
                <strong style="color: #0b5ed7; font-size: 1.1rem; text-align: right;">${corrFormatada}</strong>
            </div>
        </div>
    `;

    resultCard.classList.remove('hidden');
    resultCard.style.display = 'block';

    // Exibir alerta caso Idade Cronológica > 2 Anos (730 dias)
    if (idadeCronologicaDiasTotal > 730) {
        alertLimite.style.display = 'block';
    }
}
