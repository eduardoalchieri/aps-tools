// Registro do Service Worker para funcionamento offline (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registrado com sucesso no escopo:', registration.scope);
      })
      .catch(error => {
        console.log('Falha ao registrar o Service Worker:', error);
      });
  });
}


document.addEventListener("DOMContentLoaded", () => {
    // === 1. ELEMENTOS DE INTERFACE ===
    const views = document.querySelectorAll(".view");
    const btnVoltar = document.getElementById("btn-voltar");
    const menuPrincipal = document.getElementById("menu-principal");
    const btnSobre = document.getElementById("btn-sobre");
    
    // === 2. ELEMENTOS DO SISTEMA DE FAVORITOS ===
    const btnFavoritar = document.getElementById("btn-favoritar");
    const iconeFavorito = document.getElementById("icone-favorito");
    const containerFavoritos = document.getElementById("container-favoritos");
    const secaoFavoritos = document.getElementById("secao-favoritos");

    // Banco de dados local (memória do navegador)
    let favoritos = JSON.parse(localStorage.getItem("aps_favoritos")) || [];
    let ferramentaAtual = null; // Memória da escala/calculadora aberta no momento

    // === 3. LÓGICA DE NAVEGAÇÃO E TROCA DE TELAS ===
    function esconderTodasAsViews() {
        views.forEach(view => {
            view.classList.remove("active");
            view.classList.add("hidden");
        });
    }

    // Função central que gerencia a abertura de qualquer tela
    function abrirView(targetId, botaoElement) {
        const targetView = document.getElementById(targetId);
        if (!targetView) return;

        esconderTodasAsViews();
        targetView.classList.remove("hidden");
        targetView.classList.add("active");
        
        btnVoltar.classList.remove("hidden");

        // Lista de telas que são MENUS e não devem ter o botão de favoritar
        const telasDeMenu = ['view-escalas', 'view-calculadoras', 'view-sobre', 'menu-principal'];
        
        if (!telasDeMenu.includes(targetId)) {
            // É uma escala ou calculadora: Mostra a estrela de favorito
            if (btnFavoritar) btnFavoritar.classList.remove("hidden");
            
            // Salva os dados do botão atual caso o usuário queira favoritar
            if (botaoElement) {
                const iconElement = botaoElement.querySelector('.material-symbols-outlined');
                ferramentaAtual = {
                    id: targetId,
                    title: botaoElement.textContent.replace(iconElement ? iconElement.textContent : '', '').trim(),
                    icon: iconElement ? iconElement.textContent : 'article'
                };
            }
            verificarEstrela(targetId);
        } else {
            // É um menu: Esconde a estrela e reseta a memória
            if (btnFavoritar) btnFavoritar.classList.add("hidden");
            ferramentaAtual = null;
        }
    }

    // Delegação de Eventos: Lê os cliques na tela inteira. 
    // Essencial para botões criados dinamicamente (como os atalhos de favoritos)
    document.body.addEventListener("click", (evento) => {
        const botao = evento.target.closest(".menu-btn[data-target]");
        if (botao) {
            const targetId = botao.getAttribute("data-target");
            abrirView(targetId, botao);
        }
    });

    // Eventos do Cabeçalho (Voltar e Sobre)
    if (btnVoltar) {
        btnVoltar.addEventListener("click", () => {
            esconderTodasAsViews();
            menuPrincipal.classList.remove("hidden");
            menuPrincipal.classList.add("active");
            btnVoltar.classList.add("hidden");
            if (btnFavoritar) btnFavoritar.classList.add("hidden");
            ferramentaAtual = null;
        });
    }

    if (btnSobre) {
        btnSobre.addEventListener("click", () => {
            abrirView("view-sobre", null);
            if (btnFavoritar) btnFavoritar.classList.add("hidden");
        });
    }

    // === 4. LÓGICA DE FAVORITOS (LOCALSTORAGE) ===
    function verificarEstrela(id) {
        const isFav = favoritos.some(f => f.id === id);
        if (iconeFavorito) {
            iconeFavorito.textContent = isFav ? "star" : "star_border";
            iconeFavorito.style.color = isFav ? "#f39c12" : "white";
        }
    }

    if (btnFavoritar) {
        btnFavoritar.addEventListener("click", () => {
            if (!ferramentaAtual) return;
            
            const index = favoritos.findIndex(f => f.id === ferramentaAtual.id);
            
            if (index > -1) {
                favoritos.splice(index, 1); // Remove
            } else {
                favoritos.push(ferramentaAtual); // Adiciona
            }
            
            // Salva na memória do navegador
            localStorage.setItem("aps_favoritos", JSON.stringify(favoritos));
            verificarEstrela(ferramentaAtual.id);
            renderizarFavoritos();
        });
    }

    function renderizarFavoritos() {
        if (!containerFavoritos || !secaoFavoritos) return;
        
        containerFavoritos.innerHTML = "";
        
        if (favoritos.length === 0) {
            secaoFavoritos.style.display = "none";
            return;
        }
        
        secaoFavoritos.style.display = "block";
        
        favoritos.forEach(fav => {
            const btn = document.createElement("button");
            btn.className = "menu-btn";
            btn.style.borderColor = "#fce4ec";
            btn.setAttribute("data-target", fav.id);
            btn.innerHTML = `<span class="material-symbols-outlined" style="color: #f39c12;">${fav.icon}</span> ${fav.title}`;
            containerFavoritos.appendChild(btn);
        });
    }

    renderizarFavoritos(); // Roda ao abrir a página

    // === 5. LÓGICA DE PESQUISA E ORDEM ALFABÉTICA (FUNÇÃO REUTILIZÁVEL) ===
    function configurarPesquisaEOrdem(idContainer, idInput) {
        const container = document.getElementById(idContainer);
        const inputPesquisa = document.getElementById(idInput);

        if (container) {
            // Ordem Alfabética
            const botoes = Array.from(container.querySelectorAll(".menu-btn"));
            botoes.sort((a, b) => a.textContent.trim().localeCompare(b.textContent.trim()));
            container.innerHTML = "";
            botoes.forEach(botao => container.appendChild(botao));

            // Filtro de Texto
            if (inputPesquisa) {
                inputPesquisa.addEventListener("input", (evento) => {
                    const termo = evento.target.value.toLowerCase();
                    const botoesAtualizados = container.querySelectorAll(".menu-btn");
                    
                    botoesAtualizados.forEach(botao => {
                        const textoBotao = botao.textContent.trim().toLowerCase();
                        if (textoBotao.includes(termo)) {
                            botao.style.display = "flex";
                        } else {
                            botao.style.display = "none";
                        }
                    });
                });
            }
        }
    }

    configurarPesquisaEOrdem("container-escalas", "input-pesquisa-escalas");
    configurarPesquisaEOrdem("container-calculadoras", "input-pesquisa-calculadoras");

    // === 6. FUNÇÕES UNIVERSAIS PARA ESCALAS DE PNEUMOLOGIA ===
    window.sc_getRadioVal = function(name) {
        let el = document.querySelector(`input[name="${name}"]:checked`);
        return el ? parseInt(el.value) : null;
    };

    window.sc_renderDetailedResult = function(containerId, totalScore, ranges, scoreLabel = "Pontuação Total") {
        let container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="final-score-box">
                <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8;">${scoreLabel}</div>
                <div style="font-size: 2.5rem; font-weight: 700; line-height: 1.2;">${totalScore}</div>
            </div>
            <div style="font-size: 1.1rem; font-weight: bold; color: #555; margin-bottom: 1rem;">Classificação de Referência</div>
        `;
        ranges.forEach(range => {
            let isActive = (totalScore >= range.min && totalScore <= range.max);
            let borderColor = "#ddd";
            let bgTint = "#fff";
            let badgeHTML = isActive ? '<span style="background-color: #5d4037; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase; display: inline-block; margin-left: 5px;">Paciente</span>' : '';
            
            if (isActive) {
                if(range.severity === 'low') { borderColor = "#4caf50"; bgTint = "#e8f5e9"; }
                else if(range.severity === 'med') { borderColor = "#ff9800"; bgTint = "#fff3e0"; }
                else if(range.severity === 'high') { borderColor = "#f44336"; bgTint = "#ffebee"; }
            }

            let card = document.createElement('div');
            card.className = `ref-card ${isActive ? 'active' : ''}`;
            if(isActive) { card.style.border = `2px solid ${borderColor}`; card.style.backgroundColor = bgTint; }

            card.innerHTML = `
                <div style="min-width: 80px; margin-right: 1.5rem; text-align: center;">
                    <span style="font-size: 0.7rem; text-transform: uppercase; color: #888; font-weight: bold; display: block; margin-bottom: 2px;">Pontos</span>
                    <span style="font-size: 1.4rem; font-weight: 700; color: #555;">${range.label}</span>
                </div>
                <div style="flex-grow: 1;">
                    <div style="font-weight: 700; color: #333; margin-bottom: 0.2rem; font-size: 1.05rem; display: flex; align-items: center; flex-wrap: wrap; gap: 8px;">${range.title} ${badgeHTML}</div>
                    <div style="font-size: 0.9rem; color: #666; line-height: 1.4;">${range.desc}</div>
                </div>`;
            container.appendChild(card);
        });
        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth' });
    };
// === 7. LÓGICA DA BARRA DE PESQUISA GLOBAL ===
    const inputBuscaGlobal = document.getElementById("input-busca-global");
    const secaoResultadosGlobal = document.getElementById("secao-resultados-global");
    const containerBuscaGlobal = document.getElementById("container-busca-global");

    if (inputBuscaGlobal) {
        inputBuscaGlobal.addEventListener("input", (evento) => {
            const termo = evento.target.value.toLowerCase().trim();
            
            if (termo === "") {
                secaoResultadosGlobal.style.display = "none";
                containerBuscaGlobal.innerHTML = "";
                return;
            }

            secaoResultadosGlobal.style.display = "block";
            containerBuscaGlobal.innerHTML = "";

            // Coleta os botões e mapeia de onde eles vêm com suas respectivas cores de etiqueta
            const escalas = Array.from(document.querySelectorAll("#container-escalas .menu-btn")).map(btn => ({ elemento: btn, categoria: "Escala", corTxt: "#0b5ed7", corBg: "#e3f2fd" }));
            const calculadoras = Array.from(document.querySelectorAll("#container-calculadoras .menu-btn")).map(btn => ({ elemento: btn, categoria: "Calculadora", corTxt: "#d81b60", corBg: "#fce4ec" }));
            const fluxogramas = Array.from(document.querySelectorAll("#container-fluxogramas .menu-btn")).map(btn => ({ elemento: btn, categoria: "Fluxograma", corTxt: "#28a745", corBg: "#e8f5e9" }));

            // Junta todas as listas, incluindo os fluxogramas
            const todasFerramentas = [...escalas, ...calculadoras, ...fluxogramas];

            let encontrouAlgo = false;

            todasFerramentas.forEach(item => {
                const textoBotao = item.elemento.textContent.trim().toLowerCase();
                
                // Extrai as palavras-chave ocultas no atributo data-keywords
                const palavrasChave = (item.elemento.getAttribute("data-keywords") || "").toLowerCase();
                
                // Verifica se o termo digitado está no texto visível do botão OU nas palavras-chave
                if (textoBotao.includes(termo) || palavrasChave.includes(termo)) {
                    encontrouAlgo = true;
                    
                    // Clona o botão original
                    const clone = item.elemento.cloneNode(true);
                    clone.style.display = "flex"; 
                    
                    // Cria uma etiqueta visual para mostrar a categoria
                    const badge = document.createElement("span");
                    badge.textContent = item.categoria;
                    badge.style.cssText = `font-size: 0.7rem; background-color: ${item.corBg}; color: ${item.corTxt}; padding: 3px 8px; border-radius: 12px; margin-left: auto; font-weight: bold; text-transform: uppercase;`;
                    
                    // Insere a etiqueta dentro do botão clonado e adiciona à tela
                    clone.appendChild(badge);
                    containerBuscaGlobal.appendChild(clone);
                }
            });

            if (!encontrouAlgo) {
                containerBuscaGlobal.innerHTML = "<p style='color: #666; font-size: 0.95rem; margin-top: 10px;'>Nenhuma ferramenta encontrada para este sintoma ou termo.</p>";
            }
        });
    }
});

// --- TELEMETRIA: Rastreamento de Calculadoras (Google Analytics 4) ---
document.addEventListener("DOMContentLoaded", () => {
    // Seleciona todos os botões do menu lateral
    const menuButtons = document.querySelectorAll('.menu-btn');

    menuButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Pega o nome da calculadora (texto do botão) e limpa espaços extras
            const nomeCalculadora = btn.innerText.trim();
            // Pega a ID da tela (ex: 'view-das28', 'view-childpugh')
            const idTela = btn.getAttribute('data-target');

            // Dispara o evento personalizado para o Google Analytics
            if (typeof gtag === 'function') {
                gtag('event', 'abrir_ferramenta', {
                    'nome_ferramenta': nomeCalculadora,
                    'id_tela': idTela
                });
                console.log(`Telemetria enviada: ${nomeCalculadora}`); // Apenas para você debugar
            }
        });
    });
});
// --- LÓGICA DE INSTALAÇÃO DO APLICATIVO (PWA) ---
let promptDeInstalacao;
const btnInstall = document.getElementById('btn-install-pwa');

// O navegador dispara este evento quando percebe que o site é um PWA válido
window.addEventListener('beforeinstallprompt', (e) => {
    // Impede o mini-infobar padrão do Chrome de aparecer
    e.preventDefault();
    
    // Guarda o evento para usarmos quando o médico clicar no botão
    promptDeInstalacao = e;
    
    // DETECÇÃO DE MOBILE: Verifica se o usuário está em um dispositivo móvel (Android)
    const isMobile = /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Mostra o nosso botão verde APENAS se for um dispositivo móvel
    if (btnInstall && isMobile) {
        btnInstall.style.display = 'flex';
    }
});

// O que acontece quando o médico clica no nosso botão
if (btnInstall) {
    btnInstall.addEventListener('click', async () => {
        if (!promptDeInstalacao) return;
        
        // Dispara a tela nativa de instalação do Android/Windows
        promptDeInstalacao.prompt();
        
        // Espera o médico escolher se quer instalar ou cancelar
        const { outcome } = await promptDeInstalacao.userChoice;
        console.log(`Escolha do usuário: ${outcome}`);
        
        // Limpa a variável, pois ela só pode ser usada uma vez
        promptDeInstalacao = null;
        
        // Esconde o botão novamente
        btnInstall.style.display = 'none';
    });
}

// Se o aplicativo já foi instalado, garante que o botão não apareça
window.addEventListener('appinstalled', () => {
    if (btnInstall) {
        btnInstall.style.display = 'none';
    }
    console.log('PWA instalado com sucesso!');
});

// --- LÓGICA DE INSTALAÇÃO EXCLUSIVA PARA iOS (APPLE) ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Detecta se o aparelho é um dispositivo Apple (iPhone, iPad)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    // 2. Detecta se o usuário está usando o Safari (o Chrome no iOS tem regras diferentes)
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    // 3. Verifica se o aplicativo JÁ ESTÁ instalado (rodando em tela cheia / standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

    // Se for um iPhone, no Safari, e NÃO estiver instalado...
    if (isIOS && isSafari && !isStandalone) {
        const iosToast = document.getElementById('ios-install-toast');
        if (iosToast) {
            // Aguarda 3 segundos após o médico abrir a página para mostrar a dica suavemente
            setTimeout(() => {
                iosToast.style.display = 'block';
            }, 3000);
        }
    }
});