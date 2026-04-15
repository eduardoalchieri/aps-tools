document.addEventListener("DOMContentLoaded", () => {
    // Lógica do Visuoespacial - Ligar Letras e Números
    const trailBtns = document.querySelectorAll('.trail-btn');
    const btnResetTrail = document.getElementById('btn-reset-trail');
    const scoreTrilha = document.getElementById('score-trilha');
    
    const sequenciaCorreta = ['1', 'A', '2', 'B', '3', 'C', '4', 'D', '5', 'E'];
    let indiceAtual = 0;
    let trilhaBloqueada = false;

    trailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (trilhaBloqueada) return;
            
            const valorClicado = e.currentTarget.getAttribute('data-val');
            
            if (valorClicado === sequenciaCorreta[indiceAtual]) {
                e.currentTarget.classList.add('success');
                indiceAtual++;
                if (indiceAtual === sequenciaCorreta.length) {
                    scoreTrilha.value = "1";
                    trilhaBloqueada = true;
                }
            } else {
                // Erro: anula a questão
                e.currentTarget.classList.add('error');
                scoreTrilha.value = "0";
                trilhaBloqueada = true;
            }
        });
    });

    btnResetTrail.addEventListener('click', () => {
        trailBtns.forEach(btn => {
            btn.classList.remove('success', 'error');
        });
        indiceAtual = 0;
        trilhaBloqueada = false;
        scoreTrilha.value = "0";
    });

    // Função Principal de Cálculo
    document.getElementById('btn-calc-moca').addEventListener('click', () => {
        // Coletar campos obrigatórios (Radios)
        const escolaridade = document.querySelector('input[name="moca-escolaridade"]:checked');
        const cubo = document.querySelector('input[name="moca-cubo"]:checked');
        const nome1 = document.querySelector('input[name="moca-nome1"]:checked');
        const nome2 = document.querySelector('input[name="moca-nome2"]:checked');
        const nome3 = document.querySelector('input[name="moca-nome3"]:checked');
        const atDir = document.querySelector('input[name="moca-at-dir"]:checked');
        const atInd = document.querySelector('input[name="moca-at-ind"]:checked');
        const letras = document.querySelector('input[name="moca-letras"]:checked');
        const sub = document.querySelector('input[name="moca-sub"]:checked');
        const frase1 = document.querySelector('input[name="moca-frase1"]:checked');
        const frase2 = document.querySelector('input[name="moca-frase2"]:checked');
        const fluencia = document.querySelector('input[name="moca-fluencia"]:checked');
        const abs1 = document.querySelector('input[name="moca-abs1"]:checked');
        const abs2 = document.querySelector('input[name="moca-abs2"]:checked');

        // Validação de preenchimento (Garantir que as categorias com radio buttons foram respondidas)
        if (!escolaridade || !cubo || !nome1 || !nome2 || !nome3 || !atDir || !atInd || !letras || !sub || !frase1 || !frase2 || !fluencia || !abs1 || !abs2) {
            alert("Por favor, preencha todos os campos obrigatórios antes de calcular.");
            return;
        }

        // Soma dos pontos dos Radios
        let total = 0;
        total += parseInt(cubo.value) + parseInt(nome1.value) + parseInt(nome2.value) + parseInt(nome3.value);
        total += parseInt(atDir.value) + parseInt(atInd.value) + parseInt(letras.value) + parseInt(sub.value);
        total += parseInt(frase1.value) + parseInt(frase2.value) + parseInt(fluencia.value);
        total += parseInt(abs1.value) + parseInt(abs2.value);

        // Soma da Trilha
        total += parseInt(scoreTrilha.value);

        // Soma dos Checkboxes (Relógio, Evocação, Orientação)
        const checkboxes = [
            'relogio-contorno', 'relogio-numeros', 'relogio-ponteiros',
            'evo-rosto', 'evo-veludo', 'evo-igreja', 'evo-margarida', 'evo-vermelho',
            'ori-dia', 'ori-mes', 'ori-ano', 'ori-semana', 'ori-lugar', 'ori-cidade'
        ];
        checkboxes.forEach(id => {
            const cb = document.getElementById(id);
            if (cb.checked) {
                total += parseInt(cb.value);
            }
        });

        // Ajuste de escolaridade (Máximo 30 pontos)
        if (escolaridade.value === "1" && total < 30) {
            total += 1;
        }

        // Renderização do Resultado e Cores de Alerta
        const resDiv = document.getElementById('res-moca');
        let corDeFundo = "";
        let corDoTexto = "#ffffff";
        let interpretacao = "";

        if (total >= 26) {
            corDeFundo = "#28a745"; // Verde
            interpretacao = "Normal";
        } else if (total >= 18) {
            corDeFundo = "#ff9800"; // Laranja
            interpretacao = "Sugestivo de Comprometimento Cognitivo Leve (CCL)";
        } else {
            corDeFundo = "#dc3545"; // Vermelho
            interpretacao = "Sugestivo de Demência";
        }

        resDiv.style.display = "block";
        resDiv.style.backgroundColor = corDeFundo;
        resDiv.style.color = corDoTexto;
        
        resDiv.innerHTML = `
            <h3 style="margin: 0; font-size: 2rem;">${total} / 30</h3>
            <p style="margin: 0.5rem 0 1rem 0; font-weight: 600; font-size: 1.1rem;">${interpretacao}</p>
            <p style="font-size: 0.8rem; color: rgba(255,255,255,0.8); margin: 0; text-align: left;">
                Referência: Nasreddine ZS, Phillips NA, Bédirian V, et al. The Montreal Cognitive Assessment, MoCA: a brief screening tool for mild cognitive impairment. J Am Geriatr Soc. 2005;53(4):695-699.
            </p>
        `;
    });
});