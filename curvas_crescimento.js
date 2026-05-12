// ============================================================
// CURVAS DE CRESCIMENTO OMS — Motor de Plotagem
// ============================================================
// Este módulo gerencia toda a lógica de:
// 1. Identificar qual(is) curva(s) usar com base nos dados inseridos
// 2. Mapear as coordenadas do ponto na imagem da curva
// 3. Renderizar a imagem com o ponto plotado via Canvas
// ============================================================

(function () {
    "use strict";

    // === CATÁLOGO DE CURVAS DISPONÍVEIS ===
    // Cada entrada mapeia: tipo de dado, sexo, faixa etária → imagem + coordenadas do gráfico
    // As coordenadas (plotArea) são em % da imagem para ser responsivo
    // Foram calibradas manualmente a partir das imagens geradas dos PDFs da OMS

    const CURVAS = {
        // ===================== PESO POR IDADE =====================
        peso_meninos_0_5_percentil: {
            img: "curvas_img/OMS__Peso_para_Idade__Meninos___0-5_anos__Em_Percentil_.png",
            tipo: "peso", sexo: "M", escala: "percentil",
            idadeMin: 0, idadeMax: 60, // meses
            valorMin: 2, valorMax: 24, // kg
            plotArea: { left: 13.1, top: 20.1, right: 87.6, bottom: 85.0 }
        },
        peso_meninos_0_5_zscore: {
            img: "curvas_img/OMS__Peso_para_Idade__Meninos___0-5_anos__Em_Z_score.png",
            tipo: "peso", sexo: "M", escala: "zscore",
            idadeMin: 0, idadeMax: 60,
            valorMin: 2, valorMax: 28,
            plotArea: { left: 13.1, top: 20.1, right: 87.6, bottom: 85.0 }
        },
        peso_meninas_0_5_percentil: {
            img: "curvas_img/OMS__Peso_para_Idade__Meninas___0-5_anos__Em_Percentil_.png",
            tipo: "peso", sexo: "F", escala: "percentil",
            idadeMin: 0, idadeMax: 60,
            valorMin: 2, valorMax: 24,
            plotArea: { left: 13.1, top: 20.1, right: 87.6, bottom: 85.0 }
        },
        peso_meninas_0_5_zscore: {
            img: "curvas_img/OMS__Peso_para_Idade__Meninas___0-5_anos__Em__Z_score_.png",
            tipo: "peso", sexo: "F", escala: "zscore",
            idadeMin: 0, idadeMax: 60,
            valorMin: 2, valorMax: 30,
            plotArea: { left: 13.1, top: 20.1, right: 87.6, bottom: 85.0 }
        },
        peso_meninos_5_10_percentil: {
            img: "curvas_img/OMS__Peso_para_Idade__Meninos___5-10_anos__Em_Percentil_.png",
            tipo: "peso", sexo: "M", escala: "percentil",
            idadeMin: 60, idadeMax: 120,
            valorMin: 15, valorMax: 45,
            plotArea: { left: 13.4, top: 18.7, right: 84.0, bottom: 85.3 }
        },
        peso_meninos_5_10_zscore: {
            img: "curvas_img/OMS__Peso_para_Idade__Meninos___5-10_anos__Em_Z_score_.png",
            tipo: "peso", sexo: "M", escala: "zscore",
            idadeMin: 60, idadeMax: 120,
            valorMin: 15, valorMax: 55,
            plotArea: { left: 13.4, top: 18.7, right: 83.9, bottom: 85.6 }
        },
        peso_meninas_5_10_percentil: {
            img: "curvas_img/OMS__Peso_para_Idade__Meninas___5-10_anos__Em_Percentil_.png",
            tipo: "peso", sexo: "F", escala: "percentil",
            idadeMin: 60, idadeMax: 120,
            valorMin: 13, valorMax: 50,
            plotArea: { left: 13.4, top: 18.7, right: 84.0, bottom: 83.4 }
        },
        peso_meninas_5_10_zscore: {
            img: "curvas_img/OMS__Peso_para_Idade__Meninas___5-10_anos__Em_Z_score_.png",
            tipo: "peso", sexo: "F", escala: "zscore",
            idadeMin: 60, idadeMax: 120,
            valorMin: 10, valorMax: 60,
            plotArea: { left: 13.4, top: 18.7, right: 84.0, bottom: 85.3 }
        },

        // ===================== ALTURA POR IDADE =====================
        altura_meninos_0_5_percentil: {
            img: "curvas_img/OMS__Altura_para_Idade__Meninos___0-5_anos__Em_Percentil_.png",
            tipo: "altura", sexo: "M", escala: "percentil",
            idadeMin: 0, idadeMax: 60,
            valorMin: 45, valorMax: 120,
            plotArea: { left: 13.1, top: 20.1, right: 87.6, bottom: 85.0 }
        },
        altura_meninos_0_5_zscore: {
            img: "curvas_img/OMS__Altura_para_Idade__Meninos___0-5_anos__Em_Z_score_.png",
            tipo: "altura", sexo: "M", escala: "zscore",
            idadeMin: 0, idadeMax: 60,
            valorMin: 45, valorMax: 125,
            plotArea: { left: 13.1, top: 20.1, right: 87.6, bottom: 85.0 }
        },
        altura_meninas_0_5_percentil: {
            img: "curvas_img/OMS__Altura_para_Idade__Meninas___0-5_anos__Em_Percentil_.png",
            tipo: "altura", sexo: "F", escala: "percentil",
            idadeMin: 0, idadeMax: 60,
            valorMin: 45, valorMax: 120,
            plotArea: { left: 13.1, top: 20.1, right: 87.6, bottom: 85.0 }
        },
        altura_meninas_0_5_zscore: {
            img: "curvas_img/OMS__Altura_para_Idade__Meninas___0-5_anos__Em_Z_score_.png",
            tipo: "altura", sexo: "F", escala: "zscore",
            idadeMin: 0, idadeMax: 60,
            valorMin: 45, valorMax: 125,
            plotArea: { left: 13.1, top: 20.1, right: 87.6, bottom: 85.0 }
        },
        altura_meninos_5_19_percentil: {
            img: "curvas_img/OMS__Altura_para_Idade__Meninos___5-19_anos__Em_Percentil_.png",
            tipo: "altura", sexo: "M", escala: "percentil",
            idadeMin: 60, idadeMax: 228,
            valorMin: 100, valorMax: 190,
            plotArea: { left: 13.4, top: 18.8, right: 84.1, bottom: 85.4 }
        },
        altura_meninos_5_19_zscore: {
            img: "curvas_img/OMS__Altura_para_Idade__Meninos___5-19_anos__Em_Z_score_.png",
            tipo: "altura", sexo: "M", escala: "zscore",
            idadeMin: 60, idadeMax: 228,
            valorMin: 90, valorMax: 200,
            plotArea: { left: 13.3, top: 18.7, right: 84.0, bottom: 85.4 }
        },
        altura_meninas_5_19_percentil: {
            img: "curvas_img/OMS__Altura_para_Idade__Meninas___5-19_anos__Em_Percentil_.png",
            tipo: "altura", sexo: "F", escala: "percentil",
            idadeMin: 60, idadeMax: 228,
            valorMin: 100, valorMax: 180,
            plotArea: { left: 13.4, top: 18.8, right: 84.1, bottom: 85.4 }
        },
        altura_meninas_5_19_zscore: {
            img: "curvas_img/OMS__Altura_para_Idade__Meninas___5-19_anos__Em_Z_score_.png",
            tipo: "altura", sexo: "F", escala: "zscore",
            idadeMin: 60, idadeMax: 228,
            valorMin: 90, valorMax: 190,
            plotArea: { left: 13.3, top: 22.2, right: 84.1, bottom: 85.5 }
        },

        // ===================== IMC POR IDADE =====================
        imc_meninos_0_5_zscore: {
            img: "curvas_img/Curva_de_IMC__OMS__Meninos__de_0_a_5_anos__Escore_Z.png",
            tipo: "imc", sexo: "M", escala: "zscore",
            idadeMin: 0, idadeMax: 60,
            valorMin: 10, valorMax: 22,
            plotArea: { left: 7.0, top: 16.9, right: 93.2, bottom: 84.8 }
        },
        imc_meninas_0_5_zscore: {
            img: "curvas_img/Curva_de_IMC__OMS__Meninas__de_0_a_5_anos__Escore_Z.png",
            tipo: "imc", sexo: "F", escala: "zscore",
            idadeMin: 0, idadeMax: 60,
            valorMin: 10, valorMax: 22,
            plotArea: { left: 7.0, top: 16.9, right: 93.2, bottom: 84.8 }
        },
        imc_meninos_5_19_percentil: {
            img: "curvas_img/OMS__IMC__Meninos___5-19_anos__Em_Percentil_.png",
            tipo: "imc", sexo: "M", escala: "percentil",
            idadeMin: 60, idadeMax: 228,
            valorMin: 12, valorMax: 30,
            plotArea: { left: 13.3, top: 18.8, right: 84.1, bottom: 85.3 }
        },
        imc_meninos_5_19_zscore: {
            img: "curvas_img/OMS__IMC__Meninos___5-19_anos__Em_Z_score_.png",
            tipo: "imc", sexo: "M", escala: "zscore",
            idadeMin: 60, idadeMax: 228,
            valorMin: 12, valorMax: 36,
            plotArea: { left: 13.3, top: 18.7, right: 84.1, bottom: 83.9 }
        },
        imc_meninas_5_19_percentil: {
            img: "curvas_img/OMS__IMC__Meninas___5-19_anos__Em_Percentil_.png",
            tipo: "imc", sexo: "F", escala: "percentil",
            idadeMin: 60, idadeMax: 228,
            valorMin: 12, valorMax: 30,
            plotArea: { left: 13.3, top: 18.7, right: 84.1, bottom: 85.3 }
        },
        imc_meninas_5_19_zscore: {
            img: "curvas_img/OMS__IMC__Meninas___5-19_anos__Em_Z_score_.png",
            tipo: "imc", sexo: "F", escala: "zscore",
            idadeMin: 60, idadeMax: 228,
            valorMin: 12, valorMax: 36,
            plotArea: { left: 13.3, top: 18.8, right: 84.1, bottom: 82.7 }
        },

        // ===================== PERÍMETRO CEFÁLICO =====================
        pc_meninos_0_5_percentil: {
            img: "curvas_img/OMS__Perimetro_cefalico__Meninos___0-5_anos__Em_Percentil_.png",
            tipo: "pc", sexo: "M", escala: "percentil",
            idadeMin: 0, idadeMax: 60,
            valorMin: 32, valorMax: 54,
            plotArea: { left: 13.5, top: 18.8, right: 84.2, bottom: 85.3 }
        },
        pc_meninos_0_5_zscore: {
            img: "curvas_img/OMS__Perimetro_cefalico__Meninos___0-5_anos__Em_Z_score_.png",
            tipo: "pc", sexo: "M", escala: "zscore",
            idadeMin: 0, idadeMax: 60,
            valorMin: 30, valorMax: 55,
            plotArea: { left: 13.5, top: 18.8, right: 84.2, bottom: 85.4 }
        },
        pc_meninas_0_5_percentil: {
            img: "curvas_img/OMS__Perimetro_cefalico__Meninas___0-5_anos__Em_Percentil_.png",
            tipo: "pc", sexo: "F", escala: "percentil",
            idadeMin: 0, idadeMax: 60,
            valorMin: 32, valorMax: 54,
            plotArea: { left: 13.5, top: 18.8, right: 84.2, bottom: 85.4 }
        },
        pc_meninas_0_5_zscore: {
            img: "curvas_img/OMS__Perimetro_cefalico__Meninas___0-5_anos__Em_Z_score_.png",
            tipo: "pc", sexo: "F", escala: "zscore",
            idadeMin: 0, idadeMax: 60,
            valorMin: 30, valorMax: 55,
            plotArea: { left: 13.5, top: 18.8, right: 84.2, bottom: 85.3 }
        },
    };

    // === FUNÇÕES AUXILIARES ===

    /**
     * Converte idade em anos + meses para total de meses
     */
    function idadeEmMeses(anos, meses) {
        return (parseInt(anos) || 0) * 12 + (parseInt(meses) || 0);
    }

    /**
     * Calcula o IMC a partir de peso (kg) e altura (cm)
     */
    function calcularIMC(peso, alturaCm) {
        if (!peso || !alturaCm || alturaCm <= 0) return null;
        const alturaM = alturaCm / 100;
        return peso / (alturaM * alturaM);
    }

    /**
     * Encontra a curva certa para um tipo de dado, sexo, escala e idade
     */
    function encontrarCurva(tipo, sexo, escala, idadeMeses) {
        const resultados = [];
        for (const key in CURVAS) {
            const c = CURVAS[key];
            if (c.tipo === tipo && c.sexo === sexo && c.escala === escala) {
                if (idadeMeses >= c.idadeMin && idadeMeses <= c.idadeMax) {
                    resultados.push(c);
                }
            }
        }
        // Se encontrou mais de uma (overlap), prefere a mais específica (menor range)
        if (resultados.length > 1) {
            resultados.sort((a, b) => (a.idadeMax - a.idadeMin) - (b.idadeMax - b.idadeMin));
        }
        return resultados[0] || null;
    }

    /**
     * Plota o ponto no canvas sobre a imagem da curva
     */
    function plotarPontoNaCurva(curva, idadeMeses, valor, containerEl) {
        const wrapper = document.createElement("div");
        wrapper.className = "curva-resultado-item";

        // Título da curva
        const titulo = document.createElement("h3");
        titulo.className = "curva-titulo";
        const tipoLabel = { peso: "Peso por Idade", altura: "Altura por Idade", imc: "IMC por Idade", pc: "Perímetro Cefálico por Idade" };
        const sexoLabel = curva.sexo === "M" ? "Meninos" : "Meninas";
        const escalaLabel = curva.escala === "percentil" ? "Percentil" : "Escore Z";
        titulo.textContent = `${tipoLabel[curva.tipo]} — ${sexoLabel} (${escalaLabel})`;
        wrapper.appendChild(titulo);

        // Container do canvas
        const canvasContainer = document.createElement("div");
        canvasContainer.className = "curva-canvas-container";

        const canvas = document.createElement("canvas");
        canvas.className = "curva-canvas";
        canvasContainer.appendChild(canvas);

        // Dica de toque para expandir
        const expandHint = document.createElement("div");
        expandHint.className = "curva-expand-hint";
        expandHint.innerHTML = '<span class="material-symbols-outlined" style="font-size: 1rem; vertical-align: middle;">zoom_in</span> Toque para ampliar';
        canvasContainer.appendChild(expandHint);

        wrapper.appendChild(canvasContainer);

        // Info do ponto
        const infoDiv = document.createElement("div");
        infoDiv.className = "curva-ponto-info";
        const unidade = { peso: "kg", altura: "cm", imc: "kg/m²", pc: "cm" };
        const anosCalc = Math.floor(idadeMeses / 12);
        const mesesCalc = idadeMeses % 12;
        const idadeStr = anosCalc > 0 ? `${anosCalc}a ${mesesCalc}m` : `${mesesCalc}m`;
        infoDiv.innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.2rem; vertical-align: middle; color: #e53935;">radio_button_checked</span> <strong>Ponto plotado:</strong> ${valor.toFixed(1)} ${unidade[curva.tipo]} aos ${idadeStr}`;
        wrapper.appendChild(infoDiv);

        containerEl.appendChild(wrapper);

        // Carrega a imagem e plota
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = function () {
            // Define o canvas com o tamanho da imagem
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            // Calcula as coordenadas do ponto em pixels
            const pa = curva.plotArea;
            const plotLeft = (pa.left / 100) * img.width;
            const plotRight = (pa.right / 100) * img.width;
            const plotTop = (pa.top / 100) * img.height;
            const plotBottom = (pa.bottom / 100) * img.height;

            const plotWidth = plotRight - plotLeft;
            const plotHeight = plotBottom - plotTop;

            // Normaliza o valor da idade e do dado para posição no gráfico
            const xNorm = (idadeMeses - curva.idadeMin) / (curva.idadeMax - curva.idadeMin);
            const yNorm = (valor - curva.valorMin) / (curva.valorMax - curva.valorMin);

            const px = plotLeft + xNorm * plotWidth;
            const py = plotBottom - yNorm * plotHeight; // Invertido pois Y cresce para baixo

            // Verifica se o ponto está dentro da área
            if (px < plotLeft || px > plotRight || py < plotTop || py > plotBottom) {
                // Ponto fora da área do gráfico — ainda plota mas avisa
                infoDiv.innerHTML += ' <span style="color: #ff9800; font-size: 0.85rem;"><br>⚠️ Valor fora do intervalo típico da curva</span>';
            }

            // Desenha o ponto — estilo "caneta" (ponto grande e visível)
            const radius = Math.max(8, img.width * 0.006);

            // Sombra do ponto
            ctx.save();
            ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;

            // Ponto principal (vermelho escuro, como caneta)
            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            ctx.fillStyle = "#c62828";
            ctx.fill();
            ctx.restore();

            // Anel externo
            ctx.beginPath();
            ctx.arc(px, py, radius + 2, 0, Math.PI * 2);
            ctx.strokeStyle = "#b71c1c";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Cruz no centro para precisão
            ctx.beginPath();
            ctx.moveTo(px - radius * 1.5, py);
            ctx.lineTo(px + radius * 1.5, py);
            ctx.moveTo(px, py - radius * 1.5);
            ctx.lineTo(px, py + radius * 1.5);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // === EXPANDIR AO CLICAR (MOBILE FRIENDLY) ===
            canvas.style.cursor = "zoom-in";
            canvas.addEventListener("click", function () {
                abrirModalCurva(canvas);
            });
        };

        img.onerror = function () {
            canvasContainer.innerHTML = `<div style="padding: 2rem; text-align: center; color: #999;">
                <span class="material-symbols-outlined" style="font-size: 3rem;">broken_image</span>
                <p>Imagem da curva não encontrada</p>
                <p style="font-size: 0.8rem;">${curva.img}</p>
            </div>`;
        };

        img.src = curva.img;
    }

    /**
     * Abre o modal fullscreen com a curva expandida (pinch-to-zoom no mobile)
     */
    function abrirModalCurva(canvasOriginal) {
        // Remove modal anterior se existir
        const antigo = document.getElementById("curva-modal-fullscreen");
        if (antigo) antigo.remove();

        // Cria o overlay
        const overlay = document.createElement("div");
        overlay.id = "curva-modal-fullscreen";
        overlay.className = "curva-modal-overlay";

        // Container interno
        const inner = document.createElement("div");
        inner.className = "curva-modal-inner";

        // Botão fechar
        const btnFechar = document.createElement("button");
        btnFechar.className = "curva-modal-fechar";
        btnFechar.innerHTML = '<span class="material-symbols-outlined">close</span> Fechar';
        btnFechar.addEventListener("click", function () {
            overlay.classList.remove("curva-modal-active");
            setTimeout(() => overlay.remove(), 300);
        });

        // Imagem expandida (usa o canvas como imagem)
        const imgExpand = document.createElement("img");
        imgExpand.src = canvasOriginal.toDataURL("image/png");
        imgExpand.className = "curva-modal-img";
        imgExpand.alt = "Curva de Crescimento OMS — Expandida";

        inner.appendChild(btnFechar);
        inner.appendChild(imgExpand);
        overlay.appendChild(inner);
        document.body.appendChild(overlay);

        // Fechar ao clicar no fundo
        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) {
                overlay.classList.remove("curva-modal-active");
                setTimeout(() => overlay.remove(), 300);
            }
        });

        // Ativa com animação
        requestAnimationFrame(() => {
            overlay.classList.add("curva-modal-active");
        });
    }

    // === LÓGICA PRINCIPAL: Processar o formulário e plotar ===
    function processarCurvas() {
        const sexo = document.getElementById("curva-sexo").value;
        const escala = document.querySelector('input[name="curva-escala"]:checked')?.value || "percentil";
        const anosInput = document.getElementById("curva-idade-anos").value;
        const mesesInput = document.getElementById("curva-idade-meses").value;
        const pesoInput = document.getElementById("curva-peso").value;
        const alturaInput = document.getElementById("curva-altura").value;
        const pcInput = document.getElementById("curva-pc").value;

        const resultContainer = document.getElementById("curvas-resultado");
        resultContainer.innerHTML = "";

        // Validação
        const totalMeses = idadeEmMeses(anosInput, mesesInput);
        if (totalMeses < 0 || (anosInput === "" && mesesInput === "")) {
            resultContainer.innerHTML = `<div class="curva-erro">
                <span class="material-symbols-outlined">error</span>
                Por favor, insira a idade da criança.
            </div>`;
            resultContainer.style.display = "block";
            return;
        }

        if (!sexo) {
            resultContainer.innerHTML = `<div class="curva-erro">
                <span class="material-symbols-outlined">error</span>
                Por favor, selecione o sexo da criança.
            </div>`;
            resultContainer.style.display = "block";
            return;
        }

        const peso = pesoInput ? parseFloat(pesoInput) : null;
        const altura = alturaInput ? parseFloat(alturaInput) : null;
        const pc = pcInput ? parseFloat(pcInput) : null;

        if (!peso && !altura && !pc) {
            resultContainer.innerHTML = `<div class="curva-erro">
                <span class="material-symbols-outlined">error</span>
                Insira pelo menos um dado antropométrico (peso, altura ou perímetro cefálico).
            </div>`;
            resultContainer.style.display = "block";
            return;
        }

        let plotouAlgo = false;

        // 1. Curva de Peso por Idade
        if (peso) {
            const curva = encontrarCurva("peso", sexo, escala, totalMeses);
            if (curva) {
                plotarPontoNaCurva(curva, totalMeses, peso, resultContainer);
                plotouAlgo = true;
            }
        }

        // 2. Curva de Altura por Idade
        if (altura) {
            const curva = encontrarCurva("altura", sexo, escala, totalMeses);
            if (curva) {
                plotarPontoNaCurva(curva, totalMeses, altura, resultContainer);
                plotouAlgo = true;
            }
        }

        // 3. Curva de IMC por Idade (requer peso E altura)
        if (peso && altura) {
            const imc = calcularIMC(peso, altura);
            if (imc) {
                // Para IMC 0-5 anos, só temos zscore
                let escalaIMC = escala;
                if (totalMeses < 60) {
                    escalaIMC = "zscore"; // IMC 0-5 só tem z-score
                }
                const curva = encontrarCurva("imc", sexo, escalaIMC, totalMeses);
                if (curva) {
                    plotarPontoNaCurva(curva, totalMeses, imc, resultContainer);
                    plotouAlgo = true;
                }
            }
        }

        // 4. Curva de Perímetro Cefálico
        if (pc) {
            const curva = encontrarCurva("pc", sexo, escala, totalMeses);
            if (curva) {
                plotarPontoNaCurva(curva, totalMeses, pc, resultContainer);
                plotouAlgo = true;
            } else if (totalMeses > 60) {
                resultContainer.innerHTML += `<div class="curva-aviso">
                    <span class="material-symbols-outlined">info</span>
                    A curva de perímetro cefálico da OMS só está disponível para crianças de 0 a 5 anos.
                </div>`;
            }
        }

        if (!plotouAlgo) {
            resultContainer.innerHTML = `<div class="curva-aviso">
                <span class="material-symbols-outlined">info</span>
                Nenhuma curva encontrada para os dados informados. Verifique se a idade está dentro do intervalo coberto pelas curvas.
            </div>`;
        }

        resultContainer.style.display = "block";
        resultContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // === INICIALIZAÇÃO ===
    document.addEventListener("DOMContentLoaded", function () {
        const btnPlotarCurvas = document.getElementById("btn-plotar-curvas");
        if (btnPlotarCurvas) {
            btnPlotarCurvas.addEventListener("click", processarCurvas);
        }

        // Botão limpar
        const btnLimpar = document.getElementById("btn-limpar-curvas");
        if (btnLimpar) {
            btnLimpar.addEventListener("click", function () {
                document.getElementById("curva-peso").value = "";
                document.getElementById("curva-altura").value = "";
                document.getElementById("curva-pc").value = "";
                document.getElementById("curva-idade-anos").value = "";
                document.getElementById("curva-idade-meses").value = "";
                document.getElementById("curvas-resultado").innerHTML = "";
                document.getElementById("curvas-resultado").style.display = "none";
            });
        }
    });

})();
