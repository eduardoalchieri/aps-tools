document.addEventListener("DOMContentLoaded", () => {
    const btnCalcBili = document.getElementById("btn-calc-bilirrubina");
    const inputIdadeGest = document.getElementById("bili-idade-gestacional");
    const inputHoras = document.getElementById("bili-idade-horas");
    const inputValor = document.getElementById("bili-valor");
    const resDiv = document.getElementById("res-bilirrubina");
    const textoRes = document.getElementById("bili-texto-resultado");
    const canvas = document.getElementById("bili-canvas");

    // Limiares fototerapia AAP 2022 (No Neurotoxicity Risk Factors)
    // Pontos definidos em horas: [0, 96, 336]
    const curves = {
        "40": { label: "≥ 40 Semanas", color: "#00796B", dash: [], points: [{x: 0, y: 8.8}, {x: 96, y: 21.8}, {x: 336, y: 21.8}] },
        "39": { label: "39 Semanas", color: "#F57C00", dash: [5, 5], points: [{x: 0, y: 8.2}, {x: 96, y: 21.5}, {x: 336, y: 21.8}] },
        "38": { label: "38 Semanas", color: "#C2185B", dash: [], points: [{x: 0, y: 7.8}, {x: 96, y: 20.8}, {x: 336, y: 21.8}] },
        "37": { label: "37 Semanas", color: "#00ACC1", dash: [5, 5], points: [{x: 0, y: 7.2}, {x: 96, y: 20.0}, {x: 336, y: 21.0}] },
        "36": { label: "36 Semanas", color: "#E64A19", dash: [], points: [{x: 0, y: 6.8}, {x: 96, y: 19.3}, {x: 336, y: 20.3}] },
        "35": { label: "35 Semanas", color: "#F06292", dash: [5, 5], points: [{x: 0, y: 6.2}, {x: 96, y: 18.5}, {x: 336, y: 19.5}] }
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

    function drawChart(userX, userY, userGest) {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;

        // Limpar canvas
        ctx.clearRect(0, 0, width, height);

        // Margens
        const margin = { top: 40, right: 150, bottom: 50, left: 50 };
        const graphWidth = width - margin.left - margin.right;
        const graphHeight = height - margin.top - margin.bottom;

        // Escalas
        const minX = 0, maxX = 336;
        const minY = 6, maxY = 24;

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
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Limiares de Fototerapia: Sem Fatores de Risco de Neurotoxicidade", margin.left + graphWidth / 2, 25);

        // Desenhar Grid Vertical e Eixo X (horas)
        ctx.strokeStyle = "#eee";
        ctx.lineWidth = 1;
        ctx.fillStyle = "#666";
        ctx.font = "11px Arial";
        ctx.textAlign = "center";
        
        for (let x = 0; x <= 336; x += 24) {
            const cx = getCanvasX(x);
            ctx.beginPath();
            ctx.moveTo(cx, margin.top);
            ctx.lineTo(cx, margin.top + graphHeight);
            ctx.stroke();

            ctx.fillText(x.toString(), cx, margin.top + graphHeight + 15);
            if (x > 0 && x % 24 === 0) {
                ctx.fillText(`(${x/24}d)`, cx, margin.top + graphHeight + 30);
            }
        }
        // Sub-grid para 12h no começo (opcional, como na imagem)
        for (let x = 12; x <= 96; x += 24) {
            const cx = getCanvasX(x);
            ctx.beginPath();
            ctx.moveTo(cx, margin.top);
            ctx.lineTo(cx, margin.top + graphHeight);
            ctx.stroke();
            ctx.fillText(x.toString(), cx, margin.top + graphHeight + 15);
        }

        // Título Eixo X
        ctx.font = "bold 12px Arial";
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

            ctx.fillText(y.toString(), margin.left - 10, cy);
        }
        
        // Título Eixo Y
        ctx.save();
        ctx.translate(15, margin.top + graphHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "center";
        ctx.fillText("Bilirrubina Sérica Total (mg/dL)", 0, 0);
        ctx.restore();

        // Moldura do Gráfico
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 1;
        ctx.strokeRect(margin.left, margin.top, graphWidth, graphHeight);

        // Desenhar as Curvas
        const gestKeys = ["40", "39", "38", "37", "36", "35"];
        gestKeys.forEach((key, index) => {
            const curve = curves[key];
            ctx.beginPath();
            ctx.strokeStyle = curve.color;
            ctx.setLineDash(curve.dash);
            ctx.lineWidth = 2;
            
            // É linear, então só conectar os pontos definidos e mais alguns para garantir
            const pointsToDraw = [];
            for (let x = 0; x <= 336; x += 12) {
                pointsToDraw.push({x: x, y: interpolateY(curve.points, x)});
            }
            // Adicionar ponto final (336)
            pointsToDraw.push({x: 336, y: interpolateY(curve.points, 336)});

            pointsToDraw.forEach((pt, i) => {
                const cx = getCanvasX(pt.x);
                const cy = getCanvasY(pt.y);
                if (i === 0) ctx.moveTo(cx, cy);
                else ctx.lineTo(cx, cy);
            });
            ctx.stroke();
            ctx.setLineDash([]); // reset

            // Legenda
            const legX = margin.left + graphWidth + 15;
            const legY = margin.top + 30 + (index * 20);
            
            ctx.beginPath();
            ctx.strokeStyle = curve.color;
            ctx.setLineDash(curve.dash);
            ctx.lineWidth = 2;
            ctx.moveTo(legX, legY);
            ctx.lineTo(legX + 20, legY);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = "#333";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.font = "12px Arial";
            ctx.fillText(curve.label, legX + 25, legY);
        });

        // Título da Legenda
        ctx.font = "bold 12px Arial";
        ctx.fillText("Idade Gestacional", margin.left + graphWidth + 15, margin.top + 10);

        // Desenhar o Ponto do Usuário
        if (userX !== null && userY !== null) {
            const cx = getCanvasX(userX);
            const cy = getCanvasY(userY);

            // Se ponto fora do limite visual Y, limitar visualmente, mas marcar
            let plotCy = cy;
            if (userY > maxY) plotCy = margin.top;
            if (userY < minY) plotCy = margin.top + graphHeight;
            let plotCx = cx;
            if (userX > maxX) plotCx = margin.left + graphWidth;

            // Circulo exterior
            ctx.beginPath();
            ctx.arc(plotCx, plotCy, 7, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(220, 53, 69, 0.3)"; // Red semi-transparent
            ctx.fill();

            // Circulo interior
            ctx.beginPath();
            ctx.arc(plotCx, plotCy, 4, 0, 2 * Math.PI);
            ctx.fillStyle = "#dc3545"; // Vermelho
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#fff";
            ctx.stroke();

            // Rótulo do ponto
            ctx.fillStyle = "#dc3545";
            ctx.font = "bold 13px Arial";
            ctx.textAlign = "left";
            ctx.fillText(`Ponto do Paciente`, plotCx + 12, plotCy - 12);
            ctx.fillText(`(${userX}h, ${userY} mg/dL)`, plotCx + 12, plotCy + 2);
        }
    }

    if (btnCalcBili) {
        btnCalcBili.addEventListener("click", () => {
            if (!inputHoras.value || !inputValor.value) {
                alert("Por favor, preencha todos os campos obrigatórios.");
                return;
            }

            const gest = inputIdadeGest.value;
            const horas = parseFloat(inputHoras.value);
            const valor = parseFloat(inputValor.value);

            const curve = curves[gest];
            const threshold = interpolateY(curve.points, horas);

            let alertHtml = "";
            if (valor >= threshold) {
                alertHtml = `
                    <div style="background-color: #dc3545; color: #FFFFFF; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 4px 10px rgba(220, 53, 69, 0.2);">
                        <div style="font-size: 1.5rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <span class="material-symbols-outlined" style="font-size: 2rem;">warning</span>
                            INDICAÇÃO DE FOTOTERAPIA
                        </div>
                        <div style="margin-top: 10px; font-size: 1.1rem; opacity: 0.9;">
                            O valor de <strong>${valor} mg/dL</strong> está <strong style="text-decoration: underline;">ACIMA ou IGUAL</strong> ao limiar de <strong>${threshold.toFixed(1)} mg/dL</strong> para ${curve.label} com ${horas} horas de vida.
                        </div>
                    </div>
                `;
            } else {
                alertHtml = `
                    <div style="background-color: #28a745; color: #FFFFFF; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 4px 10px rgba(40, 167, 69, 0.2);">
                        <div style="font-size: 1.5rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <span class="material-symbols-outlined" style="font-size: 2rem;">check_circle</span>
                            ABAIXO DO LIMIAR
                        </div>
                        <div style="margin-top: 10px; font-size: 1.1rem; opacity: 0.9;">
                            O valor de <strong>${valor} mg/dL</strong> está <strong style="text-decoration: underline;">ABAIXO</strong> do limiar de fototerapia que é <strong>${threshold.toFixed(1)} mg/dL</strong> para ${curve.label} com ${horas} horas de vida.
                        </div>
                    </div>
                `;
            }

            textoRes.innerHTML = alertHtml;
            resDiv.style.display = "block";
            
            // Desenhar gráfico com timeout pequeno para o canvas estar visível
            setTimeout(() => {
                drawChart(horas, valor, gest);
                resDiv.scrollIntoView({ behavior: 'smooth' });
            }, 50);
        });
    }

    // Inicializar canvas em branco na primeira carga (escondido até mostrar)
    drawChart(null, null, null);
});
