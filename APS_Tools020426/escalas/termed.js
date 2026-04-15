document.addEventListener("DOMContentLoaded", () => {
    const trigger = document.getElementById("trigger-termed");
    const viewTermed = document.getElementById("view-termed");
    const btnFechar = document.getElementById("btn-fechar-termed");
    const btnDesisto = document.getElementById("btn-desisto-termed");
    const grid = document.getElementById("termed-grid");
    const keyboard = document.getElementById("termed-keyboard");
    const toast = document.getElementById("termed-toast");

    if (!trigger || !viewTermed) return;

    // Navegação Oculta (Easter Egg)
    trigger.addEventListener("click", () => {
        document.querySelectorAll('.view').forEach(v => { v.classList.remove('active'); v.classList.add('hidden'); });
        viewTermed.classList.remove('hidden');
        viewTermed.classList.add('active');
        window.scrollTo(0, 0);
        iniciarJogo();
    });

    btnFechar.addEventListener("click", () => {
        viewTermed.classList.remove('active');
        viewTermed.classList.add('hidden');
        const viewInicio = document.getElementById("view-inicio") || document.querySelector('.view');
        if(viewInicio) {
            viewInicio.classList.remove('hidden');
            viewInicio.classList.add('active');
        }
    });

    // Dicionário de 300 palavras médicas
    const listaPalavras = [
        "vírion", "abdome", "virais", "ácinos", "viável", "adulta", "vértex", "adulto", "vermes", "afasia", 
        "vênula", "aferir", "ventre", "agente", "varize", "agulha", "valvas", "alexia", "vagina", "âmnios", 
        "vacina", "ampola", "úteros", "anemia", "urinas", "anexos", "uretra", "angina", "ureter", "ácidos", 
        "umbigo", "anóxia", "úlcera", "apneia", "túnica", "aréola", "túbulo", "ascite", "tronco", "asilar", 
        "trompa", "ataxia", "trombo", "atonia", "tremor", "atopia", "trauma", "átrios", "imunes", "axilar", 
        "toxina", "bacilo", "tosses", "bainha", "torpor", "biliar", "tóxico", "bulbar", "tóxica", "bucais", 
        "tísico", "cabeça", "tísica", "cabelo", "tíbias", "calota", "tétano", "cancro", "testes", "cárdia", 
        "testar", "cáries", "tensão", "carpal", "tendão", "cecais", "tecido", "célula", "tarsos", "crises", 
        "tarsal", "cérvix", "sutura", "choque", "surtos", "cistos", "surdez", "clônus", "sopros", "cóclea", 
        "somite", "cólera", "solear", "cólica", "sinais", "colite", "seroso", "coluna", "serosa", "cordão", 
        "sérico", "córnea", "septos", "corpos", "septal", "córtex", "sépsis", "costal", "sêmens", "crânio", 
        "saúdes", "crista", "sangue", "crosta", "saliva", "cúpula", "sacral", "dentes", "rótula", "dengue", 
        "ritmos", "dental", "rinite", "dermes", "retral", "agudas", "retina", "agudos", "resina", "díploe", 
        "renais", "distal", "realce", "doença", "focais", "doente", "raízes", "dorsal", "radial", "dúctil", 
        "rábido", "ductos", "quisto", "edemas", "purgar", "efusão", "pupila", "êmbolo", "punhos", "enzima", 
        "punção", "escara", "pulsos", "soroso", "pulsar", "estoma", "pulmão", "estria", "ptoses", "exames", 
        "proles", "fácies", "príons", "fadiga", "pregas", "fânero", "portal", "fáscia", "poroso", "chagas", 
        "porção", "ferida", "pontes", "febres", "pomada", "fíbula", "pólipo", "fígado", "plegia", "cânula", 
        "plexos", "cortes", "pleura", "fleuma", "plasma", "fluido", "planta", "fórnix", "placas", "fungos", 
        "facial", "genoma", "piolho", "glande", "piloro", "globos", "pílula", "glômus", "idosos", "glotal", 
        "pernas", "glúteo", "pélvis", "gotosa", "partos", "gripes", "parede", "grupos", "pápula", "hálito", 
        "pânico", "hélice", "palpar", "hérnia", "palmar", "herpes", "pálido", "hígido", "palato", "hífens", 
        "padrão", "íctero", "óxidos", "ilíaco", "óvulos", "incisa", "ouvido", "índice", "otites", "íleons", 
        "óstios", "iníons", "ósseos", "ínsula", "órtese", "íntima", "origem", "jejuno", "órgãos", "joelho", 
        "órbita", "labial", "óptico", "lábios", "óptica", "lacuna", "omento", "lâmina", "ombros", "lanugo", 
        "olfato", "lesões", "óculos", "letais", "ocular", "lígula", "óbitos", "limiar", "obesos", "gessos", 
        "nutriz", "língua", "núcleo", "lipoma", "clones", "líquor", "nódulo", "lóbulo", "néfron", "lombar", 
        "neural", "lúmens", "nervos", "lúteos", "nerval", "mácula", "náusea", "mamilo", "narina", "mancha", 
        "muleta", "maxila", "mucosa", "meatos", "mucina", "medial", "motora", "médico", "mortes", "medula", 
        "mitral", "melena", "miopia", "mental", "miomas", "mentos", "miolos", "miasma", "miíase", "micose"
    ];

    function normalizar(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    }

    const palavrasPermitidas = listaPalavras.map(normalizar);
    
    // Define a palavra do dia com base na data
    const dataBase = new Date("2024-01-01T00:00:00").valueOf();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const diasPassados = Math.floor((hoje.valueOf() - dataBase) / (1000 * 60 * 60 * 24));
    const palavraDoDia = palavrasPermitidas[diasPassados % palavrasPermitidas.length];

    // Variáveis de Estado
    const MAX_TENTATIVAS = 6;
    const TAMANHO_PALAVRA = 6;
    let tentativaAtual = 0;
    let letraAtual = 0;
    let grade = [];
    let jogoFinalizado = false;

    function mostrarToast(msg) {
        toast.innerText = msg;
        toast.style.opacity = "1";
        setTimeout(() => { toast.style.opacity = "0"; }, 2500);
    }

    // Gerencia o foco visual da célula selecionada
    function atualizarFoco() {
        if (jogoFinalizado) return;
        
        // Remove a classe de seleção de todas as células
        for (let r = 0; r < MAX_TENTATIVAS; r++) {
            for (let c = 0; c < TAMANHO_PALAVRA; c++) {
                grade[r][c].classList.remove("termed-cell-selected");
            }
        }
        
        // Adiciona a classe de seleção na célula ativa
        if (tentativaAtual < MAX_TENTATIVAS) {
            grade[tentativaAtual][letraAtual].classList.add("termed-cell-selected");
        }
    }

    function inicializarGrade() {
        grid.innerHTML = "";
        grade = [];
        for (let r = 0; r < MAX_TENTATIVAS; r++) {
            let linha = [];
            for (let c = 0; c < TAMANHO_PALAVRA; c++) {
                const celula = document.createElement("div");
                celula.className = "termed-cell";
                
                // Torna a célula clicável para mover o cursor
                celula.addEventListener("click", () => {
                    if (r === tentativaAtual && !jogoFinalizado) {
                        letraAtual = c;
                        atualizarFoco();
                    }
                });

                grid.appendChild(celula);
                linha.push(celula);
            }
            grade.push(linha);
        }
        atualizarFoco(); // Ilumina a primeira célula do jogo
    }

    function atualizarCoresTeclado(letra, classeCor) {
        const botoes = document.querySelectorAll(`.termed-key[data-key="${letra}"]`);
        botoes.forEach(btn => {
            if (btn.classList.contains("termed-correct")) return; 
            if (btn.classList.contains("termed-present") && classeCor === "termed-absent") return; 
            btn.classList.remove("termed-absent", "termed-present", "termed-correct");
            btn.classList.add(classeCor);
        });
    }

    function verificarPalavra() {
        let chute = "";
        for (let c = 0; c < TAMANHO_PALAVRA; c++) {
            const letra = grade[tentativaAtual][c].innerText.trim();
            if (!letra) {
                mostrarToast("Faltam letras");
                return;
            }
            chute += letra;
        }

        if (!palavrasPermitidas.includes(chute)) {
            mostrarToast("Palavra não reconhecida no dicionário médico");
            return;
        }

        let arrayAlvo = palavraDoDia.split("");
        let cores = new Array(TAMANHO_PALAVRA).fill("termed-absent");

        // Passagem 1: Letras corretas (Verde)
        for (let i = 0; i < TAMANHO_PALAVRA; i++) {
            if (chute[i] === arrayAlvo[i]) {
                cores[i] = "termed-correct";
                arrayAlvo[i] = null; 
            }
        }

        // Passagem 2: Letras presentes (Laranja)
        for (let i = 0; i < TAMANHO_PALAVRA; i++) {
            if (cores[i] !== "termed-correct" && arrayAlvo.includes(chute[i])) {
                cores[i] = "termed-present";
                arrayAlvo[arrayAlvo.indexOf(chute[i])] = null; 
            }
        }

        // Remove o foco visual da linha que está sendo verificada
        for (let c = 0; c < TAMANHO_PALAVRA; c++) {
            grade[tentativaAtual][c].classList.remove("termed-cell-selected");
        }

        // Aplica as cores na grade e no teclado
        for (let i = 0; i < TAMANHO_PALAVRA; i++) {
            setTimeout(() => {
                grade[tentativaAtual][i].classList.add(cores[i]);
                atualizarCoresTeclado(chute[i], cores[i]);
            }, i * 200);
        }

        setTimeout(() => {
            if (chute === palavraDoDia) {
                mostrarToast("Incrível! Diagnóstico preciso.");
                jogoFinalizado = true;
            } else if (tentativaAtual === MAX_TENTATIVAS - 1) {
                mostrarToast(`A palavra era: ${palavraDoDia}`);
                jogoFinalizado = true;
            } else {
                tentativaAtual++;
                letraAtual = 0;
                atualizarFoco(); // Ilumina a primeira célula da nova linha
            }
            salvarEstado();
        }, TAMANHO_PALAVRA * 200 + 100);
    }

    function adicionarLetra(letra) {
        if (letraAtual < TAMANHO_PALAVRA) {
            grade[tentativaAtual][letraAtual].innerText = letra;
            // Pula automaticamente para a próxima caixa, se não estiver na última
            if (letraAtual < TAMANHO_PALAVRA - 1) {
                letraAtual++;
            }
            atualizarFoco();
        }
    }

    function apagarLetra() {
        if (grade[tentativaAtual][letraAtual].innerText !== "") {
            // Se a caixa atual tem letra, apenas apaga ela
            grade[tentativaAtual][letraAtual].innerText = "";
        } else if (letraAtual > 0) {
            // Se a caixa atual está vazia, volta para a anterior e apaga
            letraAtual--;
            grade[tentativaAtual][letraAtual].innerText = "";
        }
        atualizarFoco();
    }

    function interagir(tecla) {
        if (jogoFinalizado) return;

        if (tecla === "BACKSPACE") {
            apagarLetra();
        } else if (tecla === "ENTER") {
            verificarPalavra();
        } else if (/^[A-Z]$/.test(tecla)) {
            adicionarLetra(tecla);
        }
    }

    // Evento do botão Desisto
    if (btnDesisto) {
        btnDesisto.addEventListener("click", () => {
            if (jogoFinalizado) return;
            jogoFinalizado = true;
            mostrarToast(`A palavra era: ${palavraDoDia}`);
            for (let c = 0; c < TAMANHO_PALAVRA; c++) {
                grade[tentativaAtual][c].classList.remove("termed-cell-selected");
            }
            salvarEstado();
        });
    }

    // Eventos do Teclado Virtual e Físico
    keyboard.addEventListener("click", (e) => {
        const btn = e.target.closest(".termed-key");
        if (btn) interagir(btn.getAttribute("data-key"));
    });

    document.addEventListener("keydown", (e) => {
        if (viewTermed.classList.contains("active")) {
            const tecla = e.key.toUpperCase();
            if (tecla === "BACKSPACE" || tecla === "ENTER" || /^[A-Z]$/.test(tecla)) {
                interagir(tecla);
            }
        }
    });

    // Lógica de Persistência (LocalStorage)
    function salvarEstado() {
        const estadoGeral = [];
        for (let r = 0; r < tentativaAtual; r++) {
            let p = "";
            for (let c = 0; c < TAMANHO_PALAVRA; c++) p += grade[r][c].innerText || " ";
            estadoGeral.push(p);
        }
        localStorage.setItem("termed_data", hoje.toISOString().split("T")[0]);
        localStorage.setItem("termed_estado", JSON.stringify({ estadoGeral, jogoFinalizado }));
    }

    function carregarEstado() {
        const dataSalva = localStorage.getItem("termed_data");
        const estadoSalvo = localStorage.getItem("termed_estado");
        const dataAtualString = hoje.toISOString().split("T")[0];

        if (dataSalva === dataAtualString && estadoSalvo) {
            const parsed = JSON.parse(estadoSalvo);
            const tentativasAntigas = parsed.estadoGeral;
            
            // Reconstroi o estado anterior
            tentativasAntigas.forEach(palavra => {
                if (palavra.trim().length > 0 && tentativaAtual < MAX_TENTATIVAS) {
                    for (let i = 0; i < TAMANHO_PALAVRA; i++) {
                        if (palavra[i] !== " ") adicionarLetra(palavra[i]);
                    }
                    verificarPalavra();
                }
            });
            
            // Se o jogo foi dado como finalizado, mantém esse estado
            if (parsed.jogoFinalizado) {
                jogoFinalizado = true;
                for (let c = 0; c < TAMANHO_PALAVRA; c++) {
                    if (tentativaAtual < MAX_TENTATIVAS) grade[tentativaAtual][c].classList.remove("termed-cell-selected");
                }
            }
        }
    }

    function iniciarJogo() {
        document.querySelectorAll(".termed-key").forEach(btn => {
            btn.classList.remove("termed-absent", "termed-present", "termed-correct");
        });
        tentativaAtual = 0;
        letraAtual = 0;
        jogoFinalizado = false;
        inicializarGrade();
        carregarEstado();
    }
});