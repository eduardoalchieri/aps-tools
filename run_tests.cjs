// Teste automatizado do Motor V6 - roda via Node.js
const fs = require('fs');
const path = require('path');

// Ler o HTML do motor
const html = fs.readFileSync(path.join(__dirname, 'testador_exames.html'), 'utf-8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) { console.log("ERRO: script não encontrado"); process.exit(1); }

// Extrair apenas as funções do motor (sem as funções de UI)
let motorCode = scriptMatch[1];
// Remover funções de UI para evitar erros de DOM
motorCode = motorCode.replace(/function executarFormatacao[\s\S]*?^        }/m, '');
motorCode = motorCode.replace(/function copiarTexto[\s\S]*?^        }/m, '');

eval(motorCode);

const expected = {
    "exame_1": {
        nome: "LUIZ FRANCISCO AUGUSTI",
        prontuario: "162450",
        exames: ["HbA1c 6,0%", "Cr 0,94", "CT 221", "TG 220", "HDL 50", "LDL 127"]
    },
    "exame_2": {
        nome: "LUIS ADEMAR PIMENTEL",
        prontuario: "423337",
        exames: ["HbA1c 5,7%", "CT 96", "TG 80", "HDL 42", "LDL 38", "TSH 6,870", "T4L 1,58", "Anti-TPO 8,01", "TRAb 1,52"]
    },
    "exame_3": {
        nome: "GILDA ROSANE DIEFENTHALER",
        prontuario: "108979",
        exames: ["HbA1c 6,7%", "Cr 1,11", "CT 169", "TG 162", "HDL 61", "LDL 75.6", "K 4,8", "Alb 4,0", "TGO 18", "TGP 31", "GGT 23"]
    },
    "exame_4": {
        nome: "MARA REGINA DA SILVA SILVEIRA",
        prontuario: "413809",
        exames: ["Hb 14,2", "Ht 40,2%", "Leuc 5240", "Plaq 246", "Segm 62,5%", "Gli 134", "HbA1c 6,7%", "Cr 0,65"]
    },
    "exame_5": {
        nome: "ILMO ARMANDO REETZ",
        prontuario: "117287",
        exames: ["Hb 15,3", "Ht 45,4%", "Leuc 11110", "Plaq 199", "HbA1c 5,9%", "Cr 1,15", "CT 158", "TG 178", "HDL 49", "LDL 73.4", "AU 6,3", "K 3,4", "TGP 40", "Vit D 36,66", "TSH 4,150", "PSA 1,060", "Vit B12 546.0"]
    },
    "exame_6": {
        nome: "ILMO ARMANDO REETZ",
        prontuario: "117287",
        exames: ["Hb 15,3", "Ht 45,4%", "Leuc 11110", "Plaq 199", "HbA1c 5,9%", "Cr 1,15", "CT 158", "TG 178", "HDL 49", "LDL 73.4", "AU 6,3", "K 3,4", "TGP 40", "Vit D 36,66", "TSH 4,150", "PSA 1,060", "Vit B12 546.0"]
    },
    "exame_7": {
        nome: "JANDIRA COSTA DA SILVA",
        prontuario: "437524",
        exames: ["Hb 14,1", "Ht 42,4%", "Leuc 8870", "Plaq 282", "Gli 154", "HbA1c 8,0%", "Ur 38,0", "Cr 0,92", "CT 254", "TG 226", "HDL 35", "LDL 173.8", "TGO 54", "TGP 59", "CPK 50"]
    },
    "exame_8": {
        nome: "MARIA HELENA DORMALTO DA SILVA",
        prontuario: "24984",
        exames: ["Hb 15,7", "Ht 48,0%", "Leuc 6410", "Plaq 129", "Gli 128", "HbA1c 6,3%", "Cr 1,07", "CT 135", "TG 87", "HDL 42", "LDL 75.6", "K 4,8", "BNP 285"]
    }
};

let totalExames = 0;
let totalEncontrados = 0;
let totalFaltando = 0;

console.log("========================================");
console.log("  TESTE AUTOMATIZADO - MOTOR V6");
console.log("========================================\n");

for (let arquivo in expected) {
    const exp = expected[arquivo];
    const filePath = path.join(__dirname, 'amostras_exames', `${arquivo}.txt`);
    
    let textoExame;
    try {
        textoExame = fs.readFileSync(filePath, 'utf-8');
    } catch(e) {
        console.log(`⚠️  ${arquivo}.txt - ARQUIVO NÃO ENCONTRADO`);
        continue;
    }

    const { cabecalho, textoProntuario } = processarTexto(textoExame);

    let encontrados = [];
    let faltando = [];

    for (let exEsperado of exp.exames) {
        totalExames++;
        if (textoProntuario.includes(exEsperado)) {
            encontrados.push(exEsperado);
            totalEncontrados++;
        } else {
            faltando.push(exEsperado);
            totalFaltando++;
        }
    }

    let nomeOk = cabecalho.nome.includes(exp.nome.split(' ')[0]);
    let prontuarioOk = cabecalho.prontuario === exp.prontuario;

    let icon = faltando.length === 0 ? '✅' : '⚠️';
    console.log(`${icon} ${arquivo}.txt — ${exp.nome}`);
    console.log(`   Nome: ${cabecalho.nome} ${nomeOk ? '✅' : '❌'} | Prontuário: ${cabecalho.prontuario} ${prontuarioOk ? '✅' : '❌'}`);
    console.log(`   Saída: ${textoProntuario}`);
    console.log(`   Encontrados: ${encontrados.length}/${exp.exames.length}`);
    if (faltando.length > 0) {
        console.log(`   ❌ FALTANDO: ${faltando.join(' | ')}`);
    }
    console.log('');
}

let pct = totalExames > 0 ? Math.round((totalEncontrados / totalExames) * 100) : 0;
console.log("========================================");
console.log(`📊 RESUMO: ${totalEncontrados}/${totalExames} exames (${pct}%) — ${totalFaltando} faltando`);
console.log("========================================");
