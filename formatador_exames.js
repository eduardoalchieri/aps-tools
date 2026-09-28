// =====================================================
// DICIONÁRIO DE NORMALIZAÇÃO
// Mapeia nomes longos/variáveis -> abreviação padrão
// =====================================================
const dicionario = {
    // Hemograma
    "hemoglobina": "Hb", "hematócrito": "Ht", "leucócitos": "Leuc", "plaquetas": "Plaq",
    "neutrófilos": "Neut", "linfócitos": "Linf", "monócitos": "Mon", "eosinófilos": "Eos", "basófilos": "Bas",
    "eritrócitos": "Hm", "vcm": "VCM", "hcm": "HCM", "chcm": "CHCM", "rdw": "RDW", "vpm": "VPM",
    // Glicemia
    "hemoglobina glicada": "HbA1c", "hba1c": "HbA1c", "glicose": "Gli",
    // Função renal
    "ureia": "Ur", "creatinina": "Cr",
    // Eletrólitos
    "potássio": "K", "cálcio": "Ca", "fósforo": "P", "sódio": "Na",
    // Lipídios
    "colesterol total": "CT", "colesterol hdl": "HDL", "colesterol ldl": "LDL", "triglicerídeos": "TG",
    // Hepático
    "tgo": "TGO", "tgp": "TGP", "gama gt": "GGT", "albumina": "Alb",
    // Outros bioquímicos
    "ácido úrico": "AU", "amilase": "Amil", "lipase": "Lip",
    "proteinúria": "ProtU", "creatininúria": "CrU",
    "relação proteinúria creatininúria": "Rel Prot/Cr",
    // Tireóide
    "tsh": "TSH", "t4 livre": "T4L",
    "anti tpo": "Anti-TPO", "tpo ab": "Anti-TPO",
    "anticorpo anti receptor de tsh": "TRAb", "trab": "TRAb",
    // Metabolismo
    "insulina": "Ins", "peptídeo c": "Pept C",
    "vitamina d 25 hidroxi": "Vit D", "vitamina d": "Vit D",
    "vitamina b12": "Vit B12",
    // Outros
    "psa": "PSA", "inr": "INR", "tap": "TAP", "ktpp": "KTPP", "tco2": "CO2",
    "anticorpos anti insulina": "Anti-Insulina", "anticorpos anti gad": "Anti-GAD",
    "cpk": "CPK", "creatinofosfoquinase": "CPK",
    "bnp": "BNP", "peptídeo natriurético": "BNP",
    "pcr": "PCR", "proteína c reativa": "PCR",
};

const keysSorted = Object.keys(dicionario).sort((a,b) => b.length - a.length);

// =====================================================
// LISTA DE BLOQUEIO
// Palavras que NUNCA são nomes de exames
// =====================================================
const blockList = [
    // Estrutura do laudo
    "resultado", "referência", "método", "material", "valores",
    "colheita", "recebimento", "conferência", "liberação", "eletrônica",
    "observações", "análise", "repetida", "confirmada",
    // Faixas demográficas 
    "adultos", "crianças", "mulheres", "homens", "masculino", "feminino",
    "prematuros", "recém", "idade",
    // Qualificadores
    "desejável", "baixo", "intermediário", "alto", "muito alto",
    "inferior", "superior", "negativo", "positivo", "reagente",
    // Conteúdo descartável
    "jejum", "variações", "indivíduos", "álcool", "interferir", "risco",
    "categoria", "fonte", "diretriz", "atualização", "atenção",
    // Nomes de métodos
    "química", "úmida", "enzimático", "colorimétrico", "eletroquimioluminescência",
    "cromatografia", "hplc", "cinético", "jaffé", "imunoturbidimétrico",
    "turbidimétrico", "quimioluminescência", "fluorimétrico", "espectrofotometria",
    "automatizada", "microscopia", "absorção", "atômica", "eletrodo", "seletivo",
    "cinética", "ensaio", "enzimaimunoensaio", "íon seletivo",
    // Cabeçalhos e estrutura
    "hemograma", "eritrograma", "leucograma", "diferencial",
    "glicose média estimada", "gme", "absoluto", "relativo",
    // Outros lixos
    "cliente", "paciente", "prontuario", "prontuário", "pedido",
    "médico", "medico", "requisitante", "convênio", "emissao",
    "assinatura", "digital", "coletado", "cadastro", "apoiado",
    "página", "laudo", "imprima", "voltar", "scola", "soro",
    "sangue", "urina", "plasma", "amostra", "sexo",
    "endereço", "telefone", "laboratório", "responsável", "técnico",
];

// =====================================================
// UNIDADES VÁLIDAS (regex)
// =====================================================
const unidadesRegex = /mg\/dL|uIU\/mL|uUI\/mL|UI\/L|U\/L|ng\/dL|ng\/mL|ng\/ml|mmol\/L|milhões\/mm³|mil\/mm³|\/mm³|g\/dL|pg\/mL|pg|micra³|UI\/mL|U\/mL|%/g;

function isValidName(n) {
    let lower = n.toLowerCase().trim();
    if (!lower || lower.length < 2) return false;
    if (n.split(/\s+/).length > 8) return false;
    // Bloqueia palavras que parecem nomes mas não são exames
    if (/^(até|a|de|da|do|em|ou|e|o|os|as)$/i.test(lower)) return false;
    // Rejeita intervalos numéricos (valores de referência grudados)
    if (/\d+\s*a\s*$/i.test(lower) || /\d+\s*a\s+\d+/i.test(lower)) return false;
    // Rejeita se for um número puro ou quase puro
    if (/^\d[\d\s.,]*$/.test(lower)) return false;
    for (let b of blockList) {
        if (lower.includes(b)) return false;
    }
    return true;
}

function normalizarNome(nomeCapture) {
    // Remove pontos (P.S.A. -> PSA, H.C.M. -> HCM), traços decorativos, underscores
    let n = nomeCapture.toLowerCase()
        .replace(/\./g, '')
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .replace(/\(/g, ' ')
        .replace(/\)/g, ' ')
        .replace(/[^\w\sà-ÿ]/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    
    for (let key of keysSorted) {
        if (n.includes(key)) return dicionario[key];
    }
    // Fallback: capitaliza cada palavra
    return nomeCapture.trim()
        .replace(/\./g, '')
        .split(/\s+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}

function extrairCabecalho(texto) {
    let nome = "Não encontrado";
    let data = "XX/XX/XX";
    let prontuario = "Não encontrado";

    let matchNome = texto.match(/(?:Paciente|Cliente):\s*([A-Za-zÀ-ÿ\s]+)/i);
    if (matchNome) {
        nome = matchNome[1].split('Data')[0].split('Dt')[0].split('Idade')[0].trim();
    }

    let matchProntuario = texto.match(/Prontuari[oa]:\s*(\d+)/i);
    if (matchProntuario) prontuario = matchProntuario[1].trim();

    // Busca data na ordem: Colheita > Atendimento > Coletado > Cadastro > campo "em"
    let matchData = texto.match(/(?:Colheita|Atendimento|Coletado).*?(\d{2}\/\d{2}\/\d{4})/i)
        || texto.match(/Cadastro.*?(\d{2}\/\d{2}\/\d{4})/i)
        || texto.match(/em\s+(\d{2}\/\d{2}\/\d{4})/i);
    if (matchData) {
        let p = matchData[1].split('/');
        data = `${p[0]}/${p[1]}/${p[2].slice(2)}`;
    }

    return { nome, data, prontuario };
}

// =====================================================
// MOTOR DE EXTRAÇÃO PRINCIPAL
// =====================================================
function processarTexto(texto) {
    let cabecalho = extrairCabecalho(texto);
    let resultados = {};
    let contextoDB = "";     // Nome do exame pendente (DB Diagnósticos)
    let pendingName = "";    // Nome do exame com resultado na próxima linha (HUSM layout quebrado)

    let linhas = texto.split('\n');

    for (let i = 0; i < linhas.length; i++) {
        let linhaOriginal = linhas[i];
        let linha = linhaOriginal.replace(/\s+/g, ' ').trim();
        if (!linha) continue;

        // ======== FILTROS DE LINHA INTEIRA ========
        // Linhas de rodapé, assinaturas, hashes
        if (/^[_=\-]{5,}$/.test(linha)) continue;
        if (/CNES|CRF|CRBM|CRM|Assinatura|Conferência|Liberação|Colheita|Recebimento|Liberado por|Assinado elet/i.test(linha)) continue;
        if (/^[A-F0-9]{20,}$/i.test(linha)) continue;
        if (/Página \d+ de \d+/i.test(linha)) continue;
        if (/\*\*\* LAUDO/i.test(linha)) continue;
        if (/Clique aqui/i.test(linha)) continue;
        if (/Scola - Resultados/i.test(linha)) continue;
        if (/^\d+ of \d+/.test(linha)) continue;
        if (/Endereço:|Telefone:/i.test(linha)) continue;
        if (/^Sair$/i.test(linha)) continue;
        if (/^Logado:/i.test(linha)) continue;
        if (/Cliente:|Prontuari|Un\. Requisitante|Medico:|Emissao|Cod\. Cliente|Apoiado:|Cidade|Cód\. Apoiado/i.test(linha)) continue;
        if (/^(Sexo|Dt\. Nasc|CPF|Pedido|Dt\. Cadastro):/i.test(linha)) continue;
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(linha)) continue;
        if (/^\d{10,}$/.test(linha)) continue;
        if (/^(Masculino|Feminino)$/i.test(linha)) continue;
        if (/Responsável Técnico/i.test(linha)) continue;
        if (/\[ Voltar \]/i.test(linha)) continue;
        if (/^SCOLA -/i.test(linha)) continue;
        if (/RESULTADO DO PEDIDO/i.test(linha)) continue;
        if (/DB SÃO JOSÉ/i.test(linha)) continue;
        if (/biológica coletada/i.test(linha)) continue;
        if (/resultado conferido/i.test(linha)) continue;

        // Linhas de referência pura (ex: "Homens : 3,5 a 7,2 mg/dL", "70 a 99 mg/dl")
        if (/^\s*(?:Homens?|Mulheres?|Masculino|Feminino|Crianças?|Adultos?|RN|Prematuros)\s*[:(]/i.test(linha)) continue;
        if (/^\s*\d+[\-,]?\d*\s*a\s+\d/i.test(linha)) continue;
        if (/^\s*<\s*\d/i.test(linha)) continue;
        if (/^\s*>\s*\d/i.test(linha)) continue;

        // Linhas descritivas longas (frases médicas, notas)
        if (/certificada|recomendações|diretrizes|sociedade|brasileira|federação|national|international|variabilidade|variações|saudáveis|cerca de|atividades físicas|risco cardiovascular|diretriz|Atualização|mineralização|remodelação|departamento|bariátricos|osteo/i.test(linha)) continue;
        if (/Método\.?\.*:|Método\s/i.test(linha) && !/\b(Hemoglobina|Hematócrito|Eritrócitos|Leucócitos|Plaquetas|Neutrófilos|Linfócitos|Monócitos|Eosinófilos|Basófilos)\b/i.test(linha)) continue;
        if (/^Material:/i.test(linha)) continue;
        if (/Valores\s+(de\s+)?Referência/i.test(linha) && !/^\s*\w+.*\d+.*(?:mg|ng|uI|mmol|g\/|U\/|%|pg|micra)/i.test(linha)) continue;

        // ======== DETECÇÃO DE CONTEXTO DB DIAGNÓSTICOS ========
        // Linhas como "PEPTÍDEO C", "ANTICORPOS ANTI-GAD", "BNP - PEPTÍDEO NATRIURÉTICO"
        // São headers em maiúsculas sem números, antes de "Resultado:"
        if (/^[A-ZÀ-Ÿ][A-ZÀ-Ÿ0-9\s\-\(\)]+$/.test(linha) && linha.length >= 3 && linha.length < 50) {
            let testName = linha.replace(/\s+/g, ' ').trim();
            if (isValidName(testName)) {
                contextoDB = testName;
            }
            continue;
        }

        // ======== DETECÇÃO DE NOME HUSM QUEBRADO (nome na linha, valor na próxima) ========
        // Ex: "TGP" sozinho numa linha, "59" na próxima
        // Ex: "CPK" sozinho numa linha, "50" na próxima
        if (/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9\.\s\-]*$/.test(linha) && linha.length < 30) {
            let candidato = linha.replace(/\./g, '').replace(/\s+/g, ' ').trim().toLowerCase();
            let chaveDic = keysSorted.find(k => candidato.includes(k));
            if (chaveDic) {
                pendingName = dicionario[chaveDic];
                continue;
            }
        }

        // ======== RESULTADO ISOLADO (valor sozinho ou quase) ========
        // Linha tipo " 0,48 ng/mL" ou "285 pg/mL" ou " 59" (número puro)
        let matchIsolado = linha.match(/^\s*((?:<|>|Inferior a\s*)?\s*\d+(?:[.,]\d+)?)\s*(mg\/dL|uIU\/mL|uUI\/mL|UI\/L|U\/L|ng\/dL|ng\/mL|ng\/ml|mmol\/L|milhões\/mm³|mil\/mm³|\/mm³|g\/dL|pg\/mL|pg|micra³|UI\/mL|U\/mL|%)?$/i);
        if (matchIsolado) {
            let valor = matchIsolado[1].trim().replace(/inferior a\s*/i, "< ");
            // Rejeita se parece ser valor de referência (está numa faixa com "a")
            if (/\d+\s+a\s+\d+/.test(linha)) continue;
            
            let nomeFinal = null;
            if (pendingName) {
                nomeFinal = pendingName;
                pendingName = "";
            } else if (contextoDB) {
                nomeFinal = normalizarNome(contextoDB);
            }
            
            if (nomeFinal && !resultados[nomeFinal]) {
                resultados[nomeFinal] = valor;
            }
            continue;
        }

        // Limpa pending se a linha não era um valor isolado
        pendingName = "";

        // ======== EXTRAÇÃO PRINCIPAL COM UNIDADE ========
        // Padrão: NomeExame [:]  Valor  Unidade
        const regexUnit = /([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9\.\-\_\(\)]*(?:\s+[A-Za-zÀ-ÿ0-9\.\-\_\(\)]+){0,6})\s*:?\s+((?:<|>|Inferior a\s*)?\s*\d+(?:[.,]\d+)?)\s*(mg\/dL|uIU\/mL|uUI\/mL|UI\/L|U\/L|ng\/dL|ng\/mL|ng\/ml|mmol\/L|milhões\/mm³|mil\/mm³|\/mm³|g\/dL|pg\/mL|pg|micra³|UI\/mL|U\/mL|%)/gi;
        
        let match;
        while ((match = regexUnit.exec(linha)) !== null) {
            let nomeCapturado = match[1].trim();
            let valor = match[2].trim().replace(/inferior a\s*/i, "< ");
            let unidade = match[3].trim();
            
            if (!isValidName(nomeCapturado)) continue;
            
            let nomeFinal = normalizarNome(nomeCapturado);
            
            if (nomeFinal && !resultados[nomeFinal]) {
                resultados[nomeFinal] = valor + (unidade === '%' ? '%' : '');
            }
        }

        // ======== EXTRAÇÃO FALLBACK SEM UNIDADE (só se nome está no dicionário) ========
        const regexNoUnit = /([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9\.\-\_]*(?:\s+[A-Za-zÀ-ÿ0-9\.\-\_]+){0,5})\s*:?\s+((?:<|>)?\s*\d+(?:[.,]\d+)?)\s*$/gi;
        while ((match = regexNoUnit.exec(linha)) !== null) {
            let nomeCapturado = match[1].trim();
            let valor = match[2].trim();
            
            if (!isValidName(nomeCapturado)) continue;
            
            let nomeLower = nomeCapturado.toLowerCase().replace(/\./g, '').replace(/-/g, ' ').replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
            let chaveDicionario = keysSorted.find(k => nomeLower.includes(k));
            
            if (chaveDicionario) {
                let nomeFinal = dicionario[chaveDicionario];
                if (!resultados[nomeFinal]) {
                    resultados[nomeFinal] = valor;
                }
            }
        }
    }

    // =====================================================
    // FORMATAÇÃO DO TEXTO FINAL
    // =====================================================
    let hemograma = [];
    let diferencial = [];
    let outros = [];

    // Ordem preferencial para hemograma
    const ordemHemo = ['Hm', 'Hb', 'Ht', 'VCM', 'HCM', 'CHCM', 'RDW', 'Leuc', 'Plaq', 'VPM'];
    const nomeDiferencial = ['Neut', 'Linf', 'Mon', 'Eos', 'Bas'];
    const ocultar = []; // Removemos os itens daqui para que todos sejam mostrados

    for (let chave in resultados) {
        let valor = resultados[chave];
        if (ocultar.includes(chave)) continue;

        if (ordemHemo.includes(chave)) {
            hemograma.push({nome: chave, val: valor});
        } else if (nomeDiferencial.includes(chave)) {
            diferencial.push(`${chave} ${valor}`);
        } else {
            outros.push(`${chave} ${valor}`);
        }
    }

    let textoProntuario = `- ${cabecalho.data}: `;
    
    if (hemograma.length > 0) {
        let hemoString = [];
        ordemHemo.forEach(exame => {
            let e = hemograma.find(i => i.nome === exame);
            if (e) {
                let str = `${e.nome} ${e.val}`;
                if (exame === 'Leuc' && diferencial.length > 0) {
                    str += ` (${diferencial.join("; ")})`;
                }
                hemoString.push(str);
            }
        });

        textoProntuario += hemoString.join(" | ") + (outros.length > 0 ? " | " : "");
    }

    textoProntuario += outros.join(" | ");

    return { cabecalho, textoProntuario };
}

function executarFormatacao() {
    const texto = document.getElementById("inputText-formatador").value;
    if(!texto.trim()) {
        alert("Cole o texto do exame!");
        return;
    }
    
    try {
        const { cabecalho, textoProntuario } = processarTexto(texto);
        
        document.getElementById("outNome-formatador").innerText = cabecalho.nome;
        document.getElementById("outData-formatador").innerText = cabecalho.data;
        document.getElementById("outProntuario-formatador").innerText = cabecalho.prontuario;
        document.getElementById("resultadoFinal-formatador").innerText = textoProntuario;
        
        document.getElementById("resultPanel-formatador").style.display = "block";
    } catch (e) {
        alert("Erro ao processar: " + e.message);
    }
}

function copiarTextoFormatador() {
    const texto = document.getElementById("resultadoFinal-formatador").innerText;
    if (texto && texto !== "-") {
        navigator.clipboard.writeText(texto).then(() => {
            const feedback = document.getElementById("copyFeedback-formatador");
            feedback.style.display = "block";
            setTimeout(() => {
                feedback.style.display = "none";
            }, 2500);
        }).catch(err => {
            console.error('Falha ao copiar: ', err);
            alert("Erro ao tentar copiar o texto.");
        });
    }
}
