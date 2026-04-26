// Registro do Service Worker para funcionamento offline (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
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

    // === 3. MOTOR DE NAVEGAÇÃO UNIFICADO (HASH ROUTER + FAVORITOS) ===

    // 1. Lê os cliques em qualquer botão de menu (inclusive na aba de pesquisa/favoritos)
    document.body.addEventListener("click", (evento) => {
        const botao = evento.target.closest(".menu-btn[data-target]");
        if (botao) {
            evento.preventDefault();
            const targetId = botao.getAttribute("data-target");

            // Salva a ferramenta na memória para a "Estrela de Favoritos" ANTES de mudar a tela
            const telasDeMenu = ['view-escalas', 'view-calculadoras', 'view-sobre', 'menu-principal', 'view-menu-fluxogramas'];
            if (!telasDeMenu.includes(targetId)) {
                const iconElement = botao.querySelector('.material-symbols-outlined');
                ferramentaAtual = {
                    id: targetId,
                    title: botao.textContent.replace(iconElement ? iconElement.textContent : '', '').trim(),
                    icon: iconElement ? iconElement.textContent : 'article'
                };
            } else {
                ferramentaAtual = null;
            }

            // Dispara a navegação nativa do Android (Altera a URL com #)
            window.location.hash = targetId;
        }
    });

    // 2. O "Ouvinte": Muda a tela quando a URL muda (Pelo clique ou pelo Gesto Físico do Android)
    window.addEventListener('hashchange', () => {
        let viewDestino = window.location.hash.substring(1); 
        
        // Proteção contra URL vazia
        if (!viewDestino) {
            viewDestino = 'menu-principal';
            history.replaceState(null, null, '#menu-principal');
        }

        // Esconde todas as telas
        document.querySelectorAll('.view').forEach(v => {
            v.classList.remove('active');
            v.classList.add('hidden');
        });

        // Mostra a tela alvo
        const telaAlvo = document.getElementById(viewDestino);
        if (telaAlvo) {
            telaAlvo.classList.remove('hidden');
            telaAlvo.classList.add('active');
        }

        // Controle Dinâmico: Seta de Voltar e Estrela de Favoritos
        const btnSetaCabecalho = document.getElementById('btn-voltar');
        const telasDeMenu = ['view-escalas', 'view-calculadoras', 'view-sobre', 'menu-principal', 'view-menu-fluxogramas'];

        if (telasDeMenu.includes(viewDestino)) {
            // Se for menu: Esconde seta, esconde estrela e zera memória
            if (btnFavoritar) btnFavoritar.classList.add("hidden");
            if (btnSetaCabecalho) btnSetaCabecalho.classList.add('hidden');
            ferramentaAtual = null; 
        } else {
            // Se for calculadora: Mostra seta, mostra estrela e verifica se já é favorita
            if (btnFavoritar) btnFavoritar.classList.remove("hidden");
            if (btnSetaCabecalho) btnSetaCabecalho.classList.remove('hidden');
            verificarEstrela(viewDestino);
        }
        
        // Joga a tela pro topo a cada nova navegação
        window.scrollTo(0, 0);
    });

    // 3. Evento do Botão "Sobre a Equipe" (no cabeçalho)
    if (btnSobre) {
        btnSobre.addEventListener("click", () => {
            window.location.hash = "view-sobre";
        });
    }

    // 4. Sincroniza a seta visual do App com o Android
    if (btnVoltar) {
        const novoBtnVoltar = btnVoltar.cloneNode(true);
        btnVoltar.parentNode.replaceChild(novoBtnVoltar, btnVoltar);
        
        novoBtnVoltar.addEventListener('click', () => {
            history.back(); // Simula o gesto nativo do celular
        });
    }

    // 5. Ao iniciar o app, garante que ele crie a âncora inicial (#menu-principal)
    if (!window.location.hash) {
        history.replaceState(null, null, '#menu-principal');
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
