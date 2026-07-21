document.addEventListener("DOMContentLoaded", () => {
    const btnCalcIdade = document.getElementById("btn-calc-idade");
    const btnIdadeHoje = document.getElementById("btn-idade-hoje");

    const inputDataNasc = document.getElementById("idade-data-nasc");
    const inputHoraNasc = document.getElementById("idade-hora-nasc");
    const inputDataAlvo = document.getElementById("idade-data-alvo");
    const inputHoraAlvo = document.getElementById("idade-hora-alvo");
    const resDiv = document.getElementById("res-idade");

    function preencherAgora() {
        const agora = new Date();
        const ano = agora.getFullYear();
        const mes = String(agora.getMonth() + 1).padStart(2, '0');
        const dia = String(agora.getDate()).padStart(2, '0');
        const hora = String(agora.getHours()).padStart(2, '0');
        const min = String(agora.getMinutes()).padStart(2, '0');

        inputDataAlvo.value = `${ano}-${mes}-${dia}`;
        inputHoraAlvo.value = `${hora}:${min}`;
    }

    if (btnIdadeHoje) {
        btnIdadeHoje.addEventListener("click", preencherAgora);
    }

    // Preencher a data alvo por padrão ao carregar
    if (inputDataAlvo && inputHoraAlvo) {
        preencherAgora();
    }

    if (btnCalcIdade) {
        btnCalcIdade.addEventListener("click", () => {
            if (!inputDataNasc.value) {
                alert("Por favor, preencha a data de nascimento.");
                return;
            }
            if (!inputDataAlvo.value) {
                alert("Por favor, preencha a data alvo.");
                return;
            }

            const valDataNasc = inputDataNasc.value;
            const valHoraNasc = inputHoraNasc.value || "00:00";
            const valDataAlvo = inputDataAlvo.value;
            const valHoraAlvo = inputHoraAlvo.value || "00:00";

            const nasc = new Date(`${valDataNasc}T${valHoraNasc}:00`);
            const alvo = new Date(`${valDataAlvo}T${valHoraAlvo}:00`);

            if (isNaN(nasc.getTime()) || isNaN(alvo.getTime())) {
                alert("Datas inválidas.");
                return;
            }

            if (alvo < nasc) {
                alert("A data alvo não pode ser anterior à data de nascimento.");
                return;
            }

            const diffMs = alvo - nasc;
            
            // Cálculo em horas (útil para recém-nascidos)
            const horasTotais = Math.floor(diffMs / (1000 * 60 * 60));
            const diasTotais = Math.floor(horasTotais / 24);

            // Cálculo detalhado (anos, meses, dias)
            let anos = alvo.getFullYear() - nasc.getFullYear();
            let meses = alvo.getMonth() - nasc.getMonth();
            let dias = alvo.getDate() - nasc.getDate();

            // Ajuste pelo horário: se a hora alvo for menor que a hora de nascimento, o dia atual ainda não foi completado
            const horaAlvoMinutos = alvo.getHours() * 60 + alvo.getMinutes();
            const horaNascMinutos = nasc.getHours() * 60 + nasc.getMinutes();
            if (horaAlvoMinutos < horaNascMinutos) {
                dias--;
            }

            if (dias < 0) {
                meses--;
                // Pega o último dia do mês anterior ao alvo para ajustar os dias
                const ultimoDiaMesAnterior = new Date(alvo.getFullYear(), alvo.getMonth(), 0).getDate();
                dias += ultimoDiaMesAnterior;
            }
            if (meses < 0) {
                anos--;
                meses += 12;
            }

            let classificacao = "";
            let detalheHoras = "";

            if (diasTotais <= 28) {
                classificacao = "Recém-nascido";
                detalheHoras = `Idade em horas: <strong>${horasTotais} horas</strong><br>Idade em dias: <strong>${diasTotais} dias</strong>`;
            } else if (anos < 2) {
                classificacao = "Lactente / Bebê";
                detalheHoras = `Idade em meses totais: <strong>${(anos * 12) + meses} meses</strong> e ${dias} dias`;
            } else if (anos < 12) {
                classificacao = "Criança";
            } else if (anos < 18) {
                classificacao = "Adolescente";
            } else if (anos < 60) {
                classificacao = "Adulto";
            } else {
                classificacao = "Idoso";
            }

            resDiv.innerHTML = `
                <div style="background-color: #0b5ed7; color: #FFFFFF; padding: 1.5rem; border-radius: 8px 8px 0 0; text-align: center;">
                    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Idade Calculada</div>
                    <div style="font-size: 2.5rem; font-weight: 800; line-height: 1.2; margin-top: 10px;">
                        ${anos} anos, ${meses} meses, ${dias} dias
                    </div>
                    <div style="font-size: 1rem; font-weight: 600; background-color: rgba(255,255,255,0.2); display: inline-block; padding: 6px 14px; border-radius: 20px; margin-top: 12px;">
                        Faixa: ${classificacao}
                    </div>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem; background: #f8f9fa; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <h4 style="color: #0b5ed7; margin-top: 0; margin-bottom: 8px; font-size: 1.1rem;">Informações Adicionais</h4>
                    <p style="font-size: 1rem; color: #444; line-height: 1.5; margin-bottom: 0;">
                        ${detalheHoras ? detalheHoras : 'Para crianças maiores e adultos, a idade cronológica padrão é a forma mais útil.'}
                    </p>
                </div>
            `;
            
            resDiv.style.display = "block";
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
