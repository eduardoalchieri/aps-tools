document.addEventListener("DOMContentLoaded", () => {
    const btnCalcular = document.getElementById("btn-calcular-efs");
    const resDiv = document.getElementById("resultado-efs");
    const statusTxt = document.getElementById("efs-status-texto");
    const detalheTxt = document.getElementById("efs-detalhe-escore");
    const seta = document.getElementById("efs-seta");

    if (btnCalcular) {
        btnCalcular.addEventListener("click", () => {
            // Soma dos itens
            const total = 
                parseInt(document.getElementById("efs-cog").value) +
                parseInt(document.getElementById("efs-hosp").value) +
                parseInt(document.getElementById("efs-auto").value) +
                parseInt(document.getElementById("efs-indep").value) +
                parseInt(document.getElementById("efs-sup").value) +
                parseInt(document.getElementById("efs-med").value) +
                parseInt(document.getElementById("efs-ade").value) +
                parseInt(document.getElementById("efs-nut").value) +
                parseInt(document.getElementById("efs-hum").value) +
                parseInt(document.getElementById("efs-cont").value) +
                parseInt(document.getElementById("efs-tug").value);

            let classe = "";
            let cor = "";
            
            if (total <= 4) { classe = "Não apresenta fragilidade"; cor = "#28a745"; }
            else if (total <= 6) { classe = "Aparentemente vulnerável"; cor = "#ffc107"; }
            else if (total <= 8) { classe = "Fragilidade leve"; cor = "#fd7e14"; }
            else if (total <= 10) { classe = "Fragilidade moderada"; cor = "#e65100"; }
            else { classe = "Fragilidade grave"; cor = "#dc3545"; }

            // Lógica do marcador visual (0 a 17 pontos convertidos em 0 a 100%)
            const porcentagemPosicao = (total / 17) * 100;
            seta.style.left = `calc(${porcentagemPosicao}% - 10px)`;

            // Exibir resultados
            resDiv.style.display = "block";
            statusTxt.innerText = classe;
            statusTxt.style.color = cor;
            detalheTxt.innerHTML = `Pontuação Total: <strong>${total} de 17 pontos</strong>`;
            
            resDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
});