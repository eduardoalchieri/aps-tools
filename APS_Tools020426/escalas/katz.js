document.addEventListener("DOMContentLoaded", () => {
    const btnCalcularKatz = document.getElementById("btn-calcular-katz");
    const divResultadoKatz = document.getElementById("resultado-katz");

    if (btnCalcularKatz) {
        btnCalcularKatz.addEventListener("click", () => {
            // Captura os valores (1 = independente, 0 = dependente)
            const banho = parseInt(document.getElementById("katz-banho").value);
            const vestir = parseInt(document.getElementById("katz-vestir").value);
            const banheiro = parseInt(document.getElementById("katz-banheiro").value);
            const transferencia = parseInt(document.getElementById("katz-transferencia").value);
            const continencia = parseInt(document.getElementById("katz-continencia").value);
            const alimentacao = parseInt(document.getElementById("katz-alimentacao").value);

            // Soma o escore total (0 a 6 pontos)
            const scoreKatz = banho + vestir + banheiro + transferencia + continencia + alimentacao;
            let interpretacao = "";

            // Estabelece a classificação clínica
            if (scoreKatz === 6) {
                interpretacao = "<strong>Independência total</strong> para as Atividades Básicas de Vida Diária (ABVD).";
            } else if (scoreKatz >= 3 && scoreKatz <= 5) {
                interpretacao = "<strong>Dependência moderada/parcial</strong> para as Atividades Básicas de Vida Diária (ABVD).";
            } else {
                interpretacao = "<strong>Dependência severa/importante</strong> para as Atividades Básicas de Vida Diária (ABVD).";
            }

            // Exibe o painel de resultados
            divResultadoKatz.style.display = "block";
            divResultadoKatz.innerHTML = `Escore Total: <strong>${scoreKatz}/6</strong> <br><br> ${interpretacao}`;
            
            // Rola a tela suavemente para mostrar o resultado em celulares
            divResultadoKatz.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }
});