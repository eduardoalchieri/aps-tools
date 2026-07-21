document.addEventListener("DOMContentLoaded", () => {
    const btnCalcBili = document.getElementById("btn-calc-bilirrubina");
    const inputIdadeGest = document.getElementById("bili-idade-gestacional");
    const inputHoras = document.getElementById("bili-idade-horas");
    const inputValor = document.getElementById("bili-valor");
    const resDiv = document.getElementById("res-bilirrubina");
    const textoRes = document.getElementById("bili-texto-resultado");
    const canvas = document.getElementById("bili-canvas");

    const cbHemo = document.getElementById("bili-risk-hemo");
    const cbSepse = document.getElementById("bili-risk-sepse");
    const cbAlbumina = document.getElementById("bili-risk-albumina");

    const tabFoto = document.getElementById("bili-tab-foto");
    const tabExsang = document.getElementById("bili-tab-exsang");

    let currentMode = "foto"; // "foto" or "exsang"

    // Funções de Estilo das Abas
    function setTabStyles() {
        if (currentMode === "foto") {
            tabFoto.style.background = "#0b5ed7";
            tabFoto.style.color = "white";
            tabFoto.style.borderColor = "#0b5ed7";

            tabExsang.style.background = "#f8f9fa";
            tabExsang.style.color = "#555";
            tabExsang.style.borderColor = "#ddd";
        } else {
            tabExsang.style.background = "#0b5ed7";
            tabExsang.style.color = "white";
            tabExsang.style.borderColor = "#0b5ed7";

            tabFoto.style.background = "#f8f9fa";
            tabFoto.style.color = "#555";
            tabFoto.style.borderColor = "#ddd";
        }
    }

    tabFoto.addEventListener("click", () => {
        currentMode = "foto";
        setTabStyles();
        if (resDiv.style.display === "block") updateChartAndResults();
    });

    tabExsang.addEventListener("click", () => {
        currentMode = "exsang";
        setTabStyles();
        if (resDiv.style.display === "block") updateChartAndResults();
    });

    // Bancos de Dados das Curvas (Baseados nas Tabelas Suplementares AAP 2022)
    const datasets = {
        "fotoNoRisk": {
            "40": { label: "≥ 40 Semanas", color: "#00796B", dash: [], points: [{x:0, y:8.9}, {x:24, y:13.3}, {x:48, y:17.0}, {x:72, y:19.8}, {x:96, y:21.8}, {x:336, y:21.8}] },
            "39": { label: "39 Semanas", color: "#F57C00", dash: [5, 5], points: [{x:0, y:8.4}, {x:24, y:12.8}, {x:48, y:16.6}, {x:72, y:19.5}, {x:96, y:21.5}, {x:336, y:21.8}] },
            "38": { label: "38 Semanas", color: "#C2185B", dash: [], points: [{x:0, y:7.9}, {x:24, y:12.3}, {x:48, y:16.0}, {x:72, y:18.8}, {x:96, y:20.7}, {x:336, y:21.8}] },
            "37": { label: "37 Semanas", color: "#00ACC1", dash: [5, 5], points: [{x:0, y:7.4}, {x:24, y:11.7}, {x:48, y:15.4}, {x:72, y:18.1}, {x:96, y:20.0}, {x:336, y:21.1}] },
            "36": { label: "36 Semanas", color: "#E64A19", dash: [], points: [{x:0, y:6.9}, {x:24, y:11.2}, {x:48, y:14.8}, {x:72, y:17.5}, {x:96, y:19.3}, {x:336, y:20.4}] },
            "35": { label: "35 Semanas", color: "#F06292", dash: [5, 5], points: [{x:0, y:6.4}, {x:24, y:10.6}, {x:48, y:14.2}, {x:72, y:16.8}, {x:96, y:18.6}, {x:336, y:19.6}] }
        },
        "fotoRisk": {
            "40": { label: "≥ 38 Semanas", color: "#00796B", dash: [], points: [{x:0, y:6.4}, {x:24, y:10.5}, {x:48, y:14.0}, {x:72, y:16.6}, {x:96, y:18.2}, {x:336, y:18.2}] },
            "39": { label: "≥ 38 Semanas", color: "#00796B", dash: [], points: [{x:0, y:6.4}, {x:24, y:10.5}, {x:48, y:14.0}, {x:72, y:16.6}, {x:96, y:18.2}, {x:336, y:18.2}] },
            "38": { label: "≥ 38 Semanas", color: "#00796B", dash: [], points: [{x:0, y:6.4}, {x:24, y:10.5}, {x:48, y:14.0}, {x:72, y:16.6}, {x:96, y:18.2}, {x:336, y:18.2}] },
            "37": { label: "37 Semanas", color: "#F57C00", dash: [5, 5], points: [{x:0, y:5.9}, {x:24, y:10.0}, {x:48, y:13.5}, {x:72, y:16.1}, {x:96, y:17.9}, {x:336, y:18.2}] },
            "36": { label: "36 Semanas", color: "#C2185B", dash: [], points: [{x:0, y:5.4}, {x:24, y:9.4}, {x:48, y:12.8}, {x:72, y:15.4}, {x:96, y:17.0}, {x:336, y:18.2}] },
            "35": { label: "35 Semanas", color: "#00ACC1", dash: [5, 5], points: [{x:0, y:4.9}, {x:24, y:8.9}, {x:48, y:12.2}, {x:72, y:14.6}, {x:96, y:16.1}, {x:336, y:17.4}] }
        },
        "exsangNoRisk": {
            "40": { label: "≥ 38 Semanas", color: "#00796B", dash: [], points: [{x:0, y:18.0}, {x:24, y:21.4}, {x:48, y:24.0}, {x:72, y:25.9}, {x:96, y:27.0}, {x:336, y:27.0}] },
            "39": { label: "≥ 38 Semanas", color: "#00796B", dash: [], points: [{x:0, y:18.0}, {x:24, y:21.4}, {x:48, y:24.0}, {x:72, y:25.9}, {x:96, y:27.0}, {x:336, y:27.0}] },
            "38": { label: "≥ 38 Semanas", color: "#00796B", dash: [], points: [{x:0, y:18.0}, {x:24, y:21.4}, {x:48, y:24.0}, {x:72, y:25.9}, {x:96, y:27.0}, {x:336, y:27.0}] },
            "37": { label: "37 Semanas", color: "#F57C00", dash: [5, 5], points: [{x:0, y:17.0}, {x:24, y:20.3}, {x:48, y:23.1}, {x:72, y:25.2}, {x:96, y:26.6}, {x:336, y:27.0}] },
            "36": { label: "36 Semanas", color: "#C2185B", dash: [], points: [{x:0, y:15.9}, {x:24, y:19.1}, {x:48, y:21.9}, {x:72, y:24.1}, {x:96, y:25.5}, {x:336, y:27.0}] },
            "35": { label: "35 Semanas", color: "#00ACC1", dash: [5, 5], points: [{x:0, y:14.8}, {x:24, y:17.7}, {x:48, y:20.1}, {x:72, y:22.1}, {x:96, y:23.5}, {x:336, y:23.5}] }
        },
        "exsangRisk": {
            "40": { label: "≥ 38 Semanas", color: "#00796B", dash: [], points: [{x:0, y:14.8}, {x:24, y:17.7}, {x:48, y:20.1}, {x:72, y:22.1}, {x:96, y:23.5}, {x:336, y:23.5}] },
            "39": { label: "≥ 38 Semanas", color: "#00796B", dash: [], points: [{x:0, y:14.8}, {x:24, y:17.7}, {x:48, y:20.1}, {x:72, y:22.1}, {x:96, y:23.5}, {x:336, y:23.5}] },
            "38": { label: "≥ 38 Semanas", color: "#00796B", dash: [], points: [{x:0, y:14.8}, {x:24, y:17.7}, {x:48, y:20.1}, {x:72, y:22.1}, {x:96, y:23.5}, {x:336, y:23.5}] },
            "37": { label: "37 Semanas", color: "#F57C00", dash: [5, 5], points: [{x:0, y:14.3}, {x:24, y:17.2}, {x:48, y:19.7}, {x:72, y:21.7}, {x:96, y:23.1}, {x:336, y:23.5}] },
            "36": { label: "36 Semanas", color: "#C2185B", dash: [], points: [{x:0, y:13.7}, {x:24, y:16.6}, {x:48, y:19.1}, {x:72, y:20.9}, {x:96, y:22.1}, {x:336, y:23.5}] },
            "35": { label: "35 Semanas", color: "#00ACC1", dash: [5, 5], points: [{x:0, y:13.1}, {x:24, y:16.1}, {x:48, y:18.5}, {x:72, y:20.1}, {x:96, y:21.1}, {x:336, y:22.9}] }
        }
    };

    function interpolateY(points, x) {
        if (x <= points[0].x) return points[0].y;
        if (x >= points[points.length - 1].x) return points[points.length - 1].y;

        for (let i = 0; i < points.length - 1; i++) {
            if (x >= points[i].x && x <= points[i + 1].x) {
                const x0 = points[i].x;
                const y0 = points[i].y;
                const x1 = points[i + 1].x;
                const y1 = points[i + 1].y;
                return y0 + ((y1 - y0) / (x1 - x0)) * (x - x0);
            }
        }
        return 0;
    }

    function getActiveDatasetAndTitle(hasRisk) {
        if (currentMode === "foto") {
            return {
                ds: hasRisk ? datasets.fotoRisk : datasets.fotoNoRisk,
                title: hasRisk ? "Fototerapia: Um ou Mais Fatores de Risco" : "Fototerapia: Sem Fatores de Risco de Neurotoxicidade",
                minY: 4, maxY: 24
            };
        } else {
            return {
                ds: hasRisk ? datasets.exsangRisk : datasets.exsangNoRisk,
                title: hasRisk ? "Exsanguineotransfusão: Um ou Mais Fatores de Risco" : "Exsanguineotransfusão: Sem Fatores de Risco de Neurotoxicidade",
                minY: 12, maxY: 30
            };
        }
    }

    function setupCanvasDPI() {
        // Obter tamanho real na tela
        const rect = canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Limita a largura em 800 e a altura proporcionalmente (como no css style max-width: 800px e height: 400px)
        const cssWidth = Math.min(rect.width, 800);
        const cssHeight = 400;

        // Atualizar canvas com as dimensões escalonadas
        canvas.width = cssWidth * dpr;
        canvas.height = cssHeight * dpr;
        
        // CSS display size
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;

        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);

        return { ctx, cssWidth, cssHeight };
    }

    function drawChart(userX, userY, userGest, hasRisk) {
        if (!canvas) return;

        const { ctx, cssWidth, cssHeight } = setupCanvasDPI();

        const { ds: activeCurves, title, minY, maxY } = getActiveDatasetAndTitle(hasRisk);

        const width = cssWidth;
        const height = cssHeight;

        ctx.clearRect(0, 0, width, height);

        // Margens responsivas
        const margin = { top: 40, right: 120, bottom: 50, left: 40 };
        const graphWidth = width - margin.left - margin.right;
        const graphHeight = height - margin.top - margin.bottom;

        // Escalas
        const minX = 0, maxX = 336;

        function getCanvasX(x) {
            return margin.left + ((x - minX) / (maxX - minX)) * graphWidth;
        }

        function getCanvasY(y) {
            return margin.top + graphHeight - ((y - minY) / (maxY - minY)) * graphHeight;
        }

        // Fundo Branco
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        // Título
        ctx.fillStyle = "#333";
        ctx.font = "bold 13px Arial";
        ctx.textAlign = "center";
        ctx.fillText(title, margin.left + graphWidth / 2, 25);

        // Desenhar Grid Vertical e Eixo X (horas)
        ctx.strokeStyle = "#eee";
        ctx.lineWidth = 1;
        ctx.fillStyle = "#666";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        
        for (let x = 0; x <= 336; x += 24) {
            const cx = getCanvasX(x);
            ctx.beginPath();
            ctx.moveTo(cx, margin.top);
            ctx.lineTo(cx, margin.top + graphHeight);
            ctx.stroke();

            ctx.fillText(x.toString(), cx, margin.top + graphHeight + 15);
            if (x > 0 && x % 24 === 0) {
                ctx.fillText(`(${x/24}d)`, cx, margin.top + graphHeight + 28);
            }
        }
        
        for (let x = 12; x <= 96; x += 24) {
            const cx = getCanvasX(x);
            ctx.beginPath();
            ctx.moveTo(cx, margin.top);
            ctx.lineTo(cx, margin.top + graphHeight);
            ctx.stroke();
            ctx.fillText(x.toString(), cx, margin.top + graphHeight + 15);
        }

        // Título Eixo X
        ctx.font = "bold 11px Arial";
        ctx.fillText("Idade - horas (dias)", margin.left + graphWidth / 2, margin.top + graphHeight + 45);

        // Desenhar Grid Horizontal e Eixo Y (Bilirrubina)
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        for (let y = minY; y <= maxY; y += 2) {
            const cy = getCanvasY(y);
            ctx.beginPath();
            ctx.moveTo(margin.left, cy);
            ctx.lineTo(margin.left + graphWidth, cy);
            ctx.stroke();

            ctx.fillText(y.toString(), margin.left - 5, cy);
        }
        
        // Título Eixo Y
        ctx.save();
        ctx.translate(12, margin.top + graphHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "center";
        ctx.fillText("Bilirrubina Total (mg/dL)", 0, 0);
        ctx.restore();

        // Moldura do Gráfico
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 1;
        ctx.strokeRect(margin.left, margin.top, graphWidth, graphHeight);

        // Desenhar as Curvas ativas
        const keysToDraw = [];
        // Filtrar chaves únicas (porque ≥38 agrupa algumas)
        const drawnLabels = new Set();
        Object.keys(activeCurves).sort((a,b) => b-a).forEach(k => {
            if (!drawnLabels.has(activeCurves[k].label)) {
                keysToDraw.push(k);
                drawnLabels.add(activeCurves[k].label);
            }
        });

        keysToDraw.forEach((key, index) => {
            const curve = activeCurves[key];
            ctx.beginPath();
            ctx.strokeStyle = curve.color;
            ctx.setLineDash(curve.dash);
            ctx.lineWidth = 2;
            
            // Plotar os pontos exatos e conectar as linhas
            curve.points.forEach((pt, i) => {
                const cx = getCanvasX(pt.x);
                const cy = getCanvasY(pt.y);
                if (i === 0) ctx.moveTo(cx, cy);
                else ctx.lineTo(cx, cy);
            });
            ctx.stroke();
            ctx.setLineDash([]); // reset

            // Legenda Responsiva
            const legX = margin.left + graphWidth + 10;
            const legY = margin.top + 30 + (index * 20);
            
            ctx.beginPath();
            ctx.strokeStyle = curve.color;
            ctx.setLineDash(curve.dash);
            ctx.lineWidth = 2;
            ctx.moveTo(legX, legY);
            ctx.lineTo(legX + 15, legY);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = "#333";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.font = "11px Arial";
            ctx.fillText(curve.label, legX + 20, legY);
        });

        // Título da Legenda
        ctx.font = "bold 11px Arial";
        ctx.fillText("Idade Gestacional", margin.left + graphWidth + 10, margin.top + 10);

        // Desenhar o Ponto do Usuário
        if (userX !== null && userY !== null) {
            const cx = getCanvasX(userX);
            const cy = getCanvasY(userY);

            // Se ponto fora do limite visual Y, limitar visualmente, mas marcar no topo/base
            let plotCy = cy;
            if (userY > maxY) plotCy = margin.top;
            if (userY < minY) plotCy = margin.top + graphHeight;
            let plotCx = cx;
            if (userX > maxX) plotCx = margin.left + graphWidth;

            // Circulo exterior
            ctx.beginPath();
            ctx.arc(plotCx, plotCy, 7, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(220, 53, 69, 0.3)";
            ctx.fill();

            // Circulo interior
            ctx.beginPath();
            ctx.arc(plotCx, plotCy, 4, 0, 2 * Math.PI);
            ctx.fillStyle = "#dc3545"; // Vermelho
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#fff";
            ctx.stroke();

            // Rótulo do ponto (garantir que não vaze pra direita)
            ctx.fillStyle = "#dc3545";
            ctx.font = "bold 12px Arial";
            ctx.textAlign = (plotCx > margin.left + graphWidth - 80) ? "right" : "left";
            const textOffset = (plotCx > margin.left + graphWidth - 80) ? -12 : 12;

            ctx.fillText(`Ponto do Paciente`, plotCx + textOffset, plotCy - 12);
            ctx.fillText(`(${userX}h, ${userY} mg/dL)`, plotCx + textOffset, plotCy + 2);
        }
    }

    function updateChartAndResults() {
        if (!inputHoras.value || !inputValor.value) return;

        const gest = inputIdadeGest.value;
        const horas = parseFloat(inputHoras.value);
        const valor = parseFloat(inputValor.value);

        // Verificar Fatores de Risco
        const hasRisk = cbHemo.checked || cbSepse.checked || cbAlbumina.checked;

        // Limiares
        const dbFoto = hasRisk ? datasets.fotoRisk : datasets.fotoNoRisk;
        const dbExsang = hasRisk ? datasets.exsangRisk : datasets.exsangNoRisk;

        const curveFoto = dbFoto[gest];
        const curveExsang = dbExsang[gest];

        const thresholdFoto = interpolateY(curveFoto.points, horas);
        const thresholdExsang = interpolateY(curveExsang.points, horas);

        let alertHtml = "";
        
        // Avaliação mais severa primeiro
        if (valor >= thresholdExsang) {
            alertHtml = `
                <div style="background-color: #842029; color: #FFFFFF; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 4px 10px rgba(132, 32, 41, 0.2);">
                    <div style="font-size: 1.4rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <span class="material-symbols-outlined" style="font-size: 2rem;">emergency</span>
                        EXSANGUINEOTRANSFUSÃO
                    </div>
                    <div style="margin-top: 10px; font-size: 1.1rem; opacity: 0.9;">
                        O valor de <strong>${valor} mg/dL</strong> está <strong style="text-decoration: underline;">ACIMA ou IGUAL</strong> ao limiar de Exsanguineotransfusão (<strong>${thresholdExsang.toFixed(1)} mg/dL</strong>).<br>
                        Tratamento com fototerapia intensiva deve ser iniciado/mantido imediatamente.
                    </div>
                </div>
            `;
        } else if (valor >= thresholdFoto) {
            alertHtml = `
                <div style="background-color: #dc3545; color: #FFFFFF; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 4px 10px rgba(220, 53, 69, 0.2);">
                    <div style="font-size: 1.4rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <span class="material-symbols-outlined" style="font-size: 2rem;">warning</span>
                        INDICAÇÃO DE FOTOTERAPIA
                    </div>
                    <div style="margin-top: 10px; font-size: 1.1rem; opacity: 0.9;">
                        O valor de <strong>${valor} mg/dL</strong> está <strong style="text-decoration: underline;">ACIMA ou IGUAL</strong> ao limiar de Fototerapia (<strong>${thresholdFoto.toFixed(1)} mg/dL</strong>), porém <strong style="text-decoration: underline;">ABAIXO</strong> do limiar de Exsanguíneo (<strong>${thresholdExsang.toFixed(1)} mg/dL</strong>).
                    </div>
                </div>
            `;
        } else {
            alertHtml = `
                <div style="background-color: #28a745; color: #FFFFFF; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 4px 10px rgba(40, 167, 69, 0.2);">
                    <div style="font-size: 1.4rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <span class="material-symbols-outlined" style="font-size: 2rem;">check_circle</span>
                        ABAIXO DO LIMIAR
                    </div>
                    <div style="margin-top: 10px; font-size: 1.1rem; opacity: 0.9;">
                        O valor de <strong>${valor} mg/dL</strong> está <strong style="text-decoration: underline;">ABAIXO</strong> do limiar de Fototerapia (<strong>${thresholdFoto.toFixed(1)} mg/dL</strong>).
                    </div>
                </div>
            `;
        }

        textoRes.innerHTML = alertHtml;
        resDiv.style.display = "block";
        
        drawChart(horas, valor, gest, hasRisk);
    }

    if (btnCalcBili) {
        btnCalcBili.addEventListener("click", () => {
            if (!inputHoras.value || !inputValor.value) {
                alert("Por favor, preencha todos os campos obrigatórios.");
                return;
            }
            updateChartAndResults();
            setTimeout(() => {
                resDiv.scrollIntoView({ behavior: 'smooth' });
            }, 50);
        });
    }

    // Lidar com resize da janela para redesenhar o canvas (corrige bugs de DPI ao girar o celular)
    window.addEventListener("resize", () => {
        if (resDiv.style.display === "block") {
            updateChartAndResults();
        }
    });
});
