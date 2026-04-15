document.addEventListener("DOMContentLoaded", () => {
    const btnCalc = document.getElementById("btn-calc-imc-avancado");

    if (btnCalc) {
        btnCalc.addEventListener("click", () => {
            // 1. Coleta de Variáveis
            const idadeCheck = document.querySelector('input[name="imc_idade"]:checked');
            const sexoCheck = document.querySelector('input[name="imc_sexo"]:checked');
            const asiaCheck = document.querySelector('input[name="imc_asia"]:checked');
            const ampCheck = document.querySelector('input[name="imc_amp"]:checked');
            const pesoRaw = document.getElementById("imc_peso").value;
            const alturaRaw = document.getElementById("imc_altura").value;

            // Validação de Preenchimento
            if (!idadeCheck || !sexoCheck || !asiaCheck || !ampCheck || !pesoRaw || !alturaRaw) {
                alert("Por favor, preencha todos os campos e botões para executar a estratificação completa.");
                return;
            }

            const idadeGrupo = idadeCheck.value; // "adulto" ou "idoso"
            const sexo = sexoCheck.value; // "M" ou "F"
            const isAsia = asiaCheck.value === "1";
            const isAmp = ampCheck.value === "1";
            let pesoObservado = parseFloat(pesoRaw);
            let alturaCm = parseFloat(alturaRaw);
            let alturaM = alturaCm / 100;

            // 2. Método de Osterkamp (Reconstrução de Amputados)
            let pesoCalculo = pesoObservado;
            let avisoAmputacao = "";
            let pFracaoTotal = 0;

            if (isAmp) {
                const checkboxes = document.querySelectorAll('.amp-checkbox:checked');
                checkboxes.forEach(cb => { pFracaoTotal += parseFloat(cb.value); });
                
                if (pFracaoTotal > 0 && pFracaoTotal < 1) {
                    pesoCalculo = pesoObservado / (1 - pFracaoTotal);
                    avisoAmputacao = `<div style="background-color: #fff3cd; color: #856404; padding: 10px; border-radius: 6px; margin-top: 10px; font-size: 0.9rem; border: 1px solid #ffeeba;"><strong>Correção de Osterkamp Aplicada:</strong> O paciente perdeu ${(pFracaoTotal*100).toFixed(1)}% da massa corporal teórica. O peso estimado (reconstruído) para a fórmula do IMC é de <strong>${pesoCalculo.toFixed(1)} kg</strong>.</div>`;
                }
            }

            // 3. Cálculo do IMC Base
            const imc = pesoCalculo / (alturaM * alturaM);

            // 4. Estratificação Diagnóstica (OPAS, Ásia, OMS)
            let diag = "";
            let diagDesc = "";
            let cor = "";

            if (idadeGrupo === "idoso") {
                // OPAS (≥ 60 anos)
                if (imc < 23.0) { diag = "Baixo Peso / Risco de Fragilidade"; cor = "#dc3545"; diagDesc = "Alerta: Risco grave de sarcopenia, déficit imunológico e mortalidade. Requer intervenção nutricional (OPAS)."; }
                else if (imc >= 23.0 && imc <= 28.0) { diag = "Peso Normal (Eutrofia Geriátrica)"; cor = "#28a745"; diagDesc = "Faixa de proteção biológica. Risco basal médio (OPAS)."; }
                else if (imc > 28.0 && imc <= 29.9) { diag = "Sobrepeso"; cor = "#ff9800"; diagDesc = "Atenção osteoarticular recomendada (OPAS)."; }
                else { diag = "Obesidade Geriátrica"; cor = "#dc3545"; diagDesc = "Risco aumentado de doenças osteoarticulares e limitações de mobilidade severas (OPAS)."; }
            } else if (isAsia) {
                // Critérios Asiáticos (OMS/IASO/IOTF)
                if (imc < 18.5) { diag = "Baixo Peso"; cor = "#dc3545"; diagDesc = "Risco clínico aumentado (Critério Ásia-Pacífico)."; }
                else if (imc >= 18.5 && imc <= 22.9) { diag = "Peso Saudável"; cor = "#28a745"; diagDesc = "Risco metabólico basal (Critério Ásia-Pacífico)."; }
                else if (imc >= 23.0 && imc <= 24.9) { diag = "Risco Aumentado (Sobrepeso)"; cor = "#ff9800"; diagDesc = "Limiar de triagem rigorosa para Diabetes Tipo 2 para populações asiáticas."; }
                else if (imc >= 25.0 && imc <= 29.9) { diag = "Obesidade Classe I"; cor = "#dc3545"; diagDesc = "Risco metabólico grave. Intervenção equivalente à obesidade clássica ocidental."; }
                else { diag = "Obesidade Classe II"; cor = "#8b0000"; diagDesc = "Risco muito severo. Indicações potenciais para cirurgia metabólica asiática."; }
            } else {
                // OMS Padrão Adulto (20 a 59 anos)
                if (imc < 16.0) { diag = "Magreza Grau III (Grave)"; cor = "#8b0000"; diagDesc = "Risco crítico. Associação com falência orgânica e alta mortalidade."; }
                else if (imc >= 16.0 && imc <= 16.9) { diag = "Magreza Grau II (Moderada)"; cor = "#dc3545"; diagDesc = "Risco alto de morbidade."; }
                else if (imc >= 17.0 && imc <= 18.4) { diag = "Magreza Grau I (Leve)"; cor = "#ff9800"; diagDesc = "Risco moderado. Suscetibilidade a doenças infecciosas."; }
                else if (imc >= 18.5 && imc <= 24.9) { diag = "Peso Normal (Eutrofia)"; cor = "#28a745"; diagDesc = "Risco basal médio populacional."; }
                else if (imc >= 25.0 && imc <= 29.9) { diag = "Pré-obesidade (Sobrepeso)"; cor = "#ff9800"; diagDesc = "Elevação inicial na resistência à insulina e dislipidemia."; }
                else if (imc >= 30.0 && imc <= 34.9) { diag = "Obesidade Classe I"; cor = "#dc3545"; diagDesc = "Risco moderado a alto de morbidades crônicas."; }
                else if (imc >= 35.0 && imc <= 39.9) { diag = "Obesidade Classe II"; cor = "#8b0000"; diagDesc = "Risco grave. Prevalência altíssima de apneia do sono e esteatose hepática."; }
                else { diag = "Obesidade Classe III (Grave)"; cor = "#8b0000"; diagDesc = "Risco muito grave. Insuficiência cardíaca e risco iminente de morte."; }
            }

            // 5. Cálculos Farmacocinéticos Avançados
            // A. Peso Ideal (IBW) - Método Devine (1974)
            const alturaPolegadas = alturaCm / 2.54;
            let ibw = 0;
            if (sexo === "M") {
                ibw = 50 + 2.3 * (alturaPolegadas - 60);
            } else {
                ibw = 45.5 + 2.3 * (alturaPolegadas - 60);
            }
            if (alturaPolegadas < 60) ibw = sexo === "M" ? 50 : 45.5; // Limite base da fórmula
            
            // Peso Ajustado para Obesidade (se peso estimado for > 30% do IBW)
            let pesoAjustadoTexto = "";
            if (pesoCalculo > (ibw * 1.3)) {
                let pAjustado = ibw + 0.4 * (pesoCalculo - ibw);
                pesoAjustadoTexto = `<li style="margin-bottom: 5px; color: #dc3545;"><strong>Peso Ajustado (Dosing Weight):</strong> ${pAjustado.toFixed(1)} kg <br><span style="font-size: 0.8rem; color: #666;">*Recomendado para clearance de creatinina e drogas hidrofílicas devido à obesidade.</span></li>`;
            }

            // B. Área de Superfície Corporal (BSA) - Método Mosteller
            const bsa = Math.sqrt((alturaCm * pesoObservado) / 3600); // Usa o peso observado real para toxicidade tissular
            let bsaAlerta = "";
            if (bsa > 2.0) {
                bsaAlerta = `<div style="background-color: #ffebee; color: #c62828; padding: 10px; border-radius: 6px; margin-top: 10px; font-size: 0.9rem; border: 1px solid #ffcdd2;"><strong>⚠️ ALERTA ONCOLÓGICO (Fadiga Farmacológica):</strong> BSA elevado (${bsa.toFixed(2)} m²). Protocolos quimioterápicos recomendam "travar" a dose máxima no teto de segurança de 2.0 a 2.2 m² para evitar necrose tissular/renal.</div>`;
            }

            // 6. Geração da Tabela Visual de Classificação (Padrão)
            const faixasIMC = [
                { titulo: "Abaixo do peso", min: 0, max: 18.49, exibe: "< 18.5", cor: "#0288d1", bg: "#e1f5fe" },
                { titulo: "Peso Saudável", min: 18.5, max: 24.99, exibe: "18.5 a < 25", cor: "#28a745", bg: "#e8f5e9" },
                { titulo: "Sobrepeso", min: 25.0, max: 29.99, exibe: "25 a < 30", cor: "#ff9800", bg: "#fff3e0" },
                { titulo: "Obesidade Classe 1", min: 30.0, max: 34.99, exibe: "30 a < 35", cor: "#f57c00", bg: "#ffe0b2" },
                { titulo: "Obesidade Classe 2", min: 35.0, max: 39.99, exibe: "35 a < 40", cor: "#d84315", bg: "#ffccbc" },
                { titulo: "Obesidade Classe 3 (Severa)", min: 40.0, max: 999, exibe: "≥ 40", cor: "#b71c1c", bg: "#ffcdd2" }
            ];

            let htmlTabela = `<div style="margin-top: 1.5rem; margin-bottom: 1.5rem;">
                <h4 style="color: #0b5ed7; margin-bottom: 10px; font-size: 1.05rem;">Classificação Padrão de IMC</h4>`;
            
            faixasIMC.forEach(faixa => {
                let ativo = (imc >= faixa.min && imc <= faixa.max);
                if (ativo) {
                    htmlTabela += `
                        <div style="border: 2px solid ${faixa.cor}; background-color: ${faixa.bg}; padding: 0.8rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                            <strong style="color: ${faixa.cor}; font-size: 0.95rem;">${faixa.titulo} <span style="font-weight: normal; font-size: 0.85rem;">(${faixa.exibe})</span></strong>
                            <span style="background-color: ${faixa.cor}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">PACIENTE</span>
                        </div>`;
                } else {
                    htmlTabela += `
                        <div style="border: 1px solid #ddd; background-color: #fafafa; padding: 0.8rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; opacity: 0.6;">
                            <strong style="color: #666; font-size: 0.95rem;">${faixa.titulo} <span style="font-weight: normal; font-size: 0.85rem;">(${faixa.exibe})</span></strong>
                        </div>`;
                }
            });
            htmlTabela += `</div>`;

            // 7. Renderização do Output "Dashboard"
            const resDiv = document.getElementById("res-imc-avancado");
            resDiv.innerHTML = `
                <div style="background-color: ${cor}; color: #FFFFFF; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Índice de Massa Corporal Clínico</div>
                    <div style="font-size: 4rem; font-weight: 800; line-height: 1.1;">${imc.toFixed(1)}</div>
                    <div style="font-size: 1.3rem; font-weight: 700; background-color: rgba(255,255,255,0.2); display: inline-block; padding: 4px 12px; border-radius: 20px; margin-top: 8px;">${diag}</div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <p style="font-size: 1rem; color: #444; line-height: 1.5; margin-bottom: 15px;"><strong>Ajuste Clínico (Idade/Etnia):</strong> ${diagDesc}</p>
                    
                    ${avisoAmputacao}
                    
                    ${htmlTabela}

                    <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px dashed #ccc;">
                        <h4 style="color: #0b5ed7; margin-bottom: 10px; font-size: 1.05rem;"><span class="material-symbols-outlined" style="font-size: 1.2rem; vertical-align: bottom;">medication_liquid</span> Modulação Farmacotóxica (Dosagem)</h4>
                        <ul style="list-style: none; padding-left: 0; color: #333; font-size: 0.95rem;">
                            <li style="margin-bottom: 5px;"><strong>Área de Superfície Corporal (BSA - Mosteller):</strong> ${bsa.toFixed(2)} m²</li>
                            ${bsaAlerta}
                            <li style="margin-top: 10px; margin-bottom: 5px;"><strong>Peso Corporal Ideal (IBW - Devine):</strong> ${ibw.toFixed(1)} kg</li>
                            ${pesoAjustadoTexto}
                        </ul>
                    </div>
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});