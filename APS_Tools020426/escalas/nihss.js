const nihssData = [
  {
    id: "step1a",
    title: "1a. Nível de Consciência",
    instruction: `O investigador deve escolher uma resposta mesmo se uma avaliação completa é prejudicada por obstáculos como um tubo orotraqueal, barreiras de linguagem, trauma ou curativo orotraqueal. Um 3 é dado apenas se o paciente não faz nenhum movimento (outro além de postura reflexa) em resposta à estimulação dolorosa.`,
    options: [
      { val: 0, text: "0 = Alerta; reponde com entusiasmo." },
      { val: 1, text: "1 = Não alerta, mas ao ser acordado por mínima estimulação obedece, responde ou reage." },
      { val: 2, text: "2 = Não alerta, requer repetida estimulação ou estimulação dolorosa para realizar movimentos (não estereotipados)." },
      { val: 3, text: "3 = Responde somente com reflexo motor ou reações autonômicas, ou totalmente irresponsivo, flácido e arreflexo." }
    ]
  },
  {
    id: "step1b",
    title: "1b. Perguntas de Nível de Consciência",
    instruction: `O paciente é questionado sobre o mês e sua idade. A resposta deve ser correta - não há nota parcial por chegar perto. Pacientes com afasia ou esturpor que não compreendem as perguntas irão receber 2. Pacientes incapacitados de falar devido a intubação orotraqueal, trauma orotraqueal, disartria grave de qualquer causa, barreiras de linguagem ou qualquer outro problema não secundário a afasia receberão um 1. É importante que somente a resposta inicial seja considerada e que o examinador não "ajude" o paciente com dicas verbais ou não verbais.`,
    options: [
      { val: 0, text: "0 = Responde ambas as questões corretamente." },
      { val: 1, text: "1 = Responde uma questão corretamente." },
      { val: 2, text: "2 = Não responde nenhuma questão corretamente." }
    ]
  },
  {
    id: "step1c",
    title: "1c. Comandos de Nível de Consciência",
    instruction: `O paciente é solicitado a abrir e fechar os olhos e então abrir e fechar a mão não parética. Substitua por outro comando de um único passo se as mãos não podem ser utilizadas. É dado credito se uma tentativa inequívoca é feita, mas não completada devido à fraqueza. Se o paciente não responde ao comando, a tarefa deve ser demonstrada a ele (pantomima) e o resultado registrado (i.e., segue um, nenhum ou ambos os comandos). Aos pacientes com trauma, amputação ou outro impedimento físico devem ser dados comandos únicos compatíveis. Somente a primeira tentativa é registrada.`,
    options: [
      { val: 0, text: "0 = Realiza ambas as tarefas corretamente." },
      { val: 1, text: "1 = Realiza uma tarefa corretamente." },
      { val: 2, text: "2 = Não realiza nenhuma tarefa corretamente." }
    ]
  },
  {
    id: "step2",
    title: "2. Melhor olhar conjugado",
    instruction: `Somente os movimentos oculares horizontais são testados. Movimentos oculares voluntários ou reflexos (óculo-cefálico) recebem nota, mas a prova calórica não é usada. Se o paciente tem um desvio conjugado do olhar, que pode ser sobreposto por atividade voluntária ou reflexa, o escore será 1. Se o paciente tem uma paresia de nervo periférica isolada (NC III, IV ou VI), marque 1. O olhar é testado em todos os pacientes afásicos. Os pacientes com trauma ocular, curativos, cegueira preexistente ou outro distúrbio de acuidade ou campo visual devem ser testados com movimentos reflexos e a escolha feita pelo investigador. Estabelecer contato visual e, então, mover-se perto do paciente de um lado para outro, pode esclarecer a presença de paralisia do olhar.`,
    options: [
      { val: 0, text: "0 = Normal." },
      { val: 1, text: "1 = Paralisia parcial do olhar. Este escore é dado quando o olhar é anormal em um ou ambos os olhos, mas não há desvio forçado ou paresia total do olhar." },
      { val: 2, text: "2 = Desvio forçado ou paralisia total do olhar que não podem ser vencidos pela manobra óculo-cefálica." }
    ]
  },
  {
    id: "step3",
    title: "3. Visual",
    instruction: `Os campos visuais (quadrantes superiores e inferiores) são testados por confrontação, utilizando contagem de dedos ou ameaça visual, conforme apropriado. O paciente deve ser encorajado, mas se olha para o lado do movimento dos dedos, deve ser considerado como normal. Se houver cegueira unilateral ou enucleação, os campos visuais no olho restante são avaliados. Marque 1 somente se uma clara assimetria, incluindo quadrantanopsia, for encontrada. Se o paciente é cego por qualquer causa, marque 3. Estimulação dupla simultânea é realizada neste momento. Se houver uma extinção, o paciente recebe 1 e os resultados são usados para responder a questão 11.`,
    options: [
      { val: 0, text: "0 = Sem perda visual." },
      { val: 1, text: "1 = Hemianopsia parcial." },
      { val: 2, text: "2 = Hemianopsia completa." },
      { val: 3, text: "3 = Hemianopsia bilateral (cego, incluindo cegueira cortical)." }
    ]
  },
  {
    id: "step4",
    title: "4. Paralisia Facial",
    instruction: `Pergunte ou use pantomima para encorajar o paciente a mostrar os dentes ou sorrir e fechar os olhos. Considere a simetria de contração facial em resposta a estímulo doloroso em paciente pouco responsivo ou incapaz de compreender. Na presença de trauma /curativo facial, tubo orotraqueal, esparadrapo ou outra barreira física que obscureça a face, estes devem ser removidos, tanto quanto possível.`,
    options: [
      { val: 0, text: "0 = Movimentos normais simétricos." },
      { val: 1, text: "1 = Paralisia facial leve (apagamento de prega nasolabial, assimetria no sorriso)." },
      { val: 2, text: "2 = Paralisia facial central evidente (paralisia facial total ou quase total da região inferior da face)." },
      { val: 3, text: "3 = Paralisia facial completa (ausência de movimentos faciais das regiões superior e inferior da face)." }
    ]
  },
  {
    id: "step5a",
    title: "5a. Motor para braços - Braço esquerdo",
    instruction: `O braço é colocado na posição apropriada: extensão dos braços (palmas para baixo) a 90° (se sentado) ou a 45° (se deitado). É valorizada queda do braço se esta ocorre antes de 10 segundos. O paciente afásico é encorajado através de firmeza na voz e de pantomima, mas não com estimulação dolorosa. Cada membro é testado isoladamente, iniciando pelo braço não-parético. Somente em caso de amputação ou de fusão de articulação no ombro, o item deve ser considerado não-testável (NT), e uma explicação deve ser escrita para esta escolha.`,
    options: [
      { val: 0, text: "0 = Sem queda; mantém o braço 90° (ou 45°) por 10 segundos completos." },
      { val: 1, text: "1 = Queda; mantém o braço a 90° (ou 45°), porém este apresenta queda antes dos 10 segundos completos; não toca a cama ou outro suporte." },
      { val: 2, text: "2 = Algum esforço contra a gravidade; o braço não atinge ou não mantém 90° (ou 45°), cai na cama, mas tem alguma força contra a gravidade." },
      { val: 3, text: "3 = Nenhum esforço contra a gravidade; braço despenca." },
      { val: 4, text: "4 = Nenhum movimento." },
      { val: 0, text: "NT = Amputação ou fusão articular. (Computado como 0 para soma).", isNT: true }
    ]
  },
  {
    id: "step5b",
    title: "5b. Motor para braços - Braço direito",
    instruction: `Mesmas instruções do item 5a. Avaliando o braço direito.`,
    options: [
      { val: 0, text: "0 = Sem queda; mantém o braço 90° (ou 45°) por 10 segundos completos." },
      { val: 1, text: "1 = Queda; mantém o braço a 90° (ou 45°), porém este apresenta queda antes dos 10 segundos completos; não toca a cama ou outro suporte." },
      { val: 2, text: "2 = Algum esforço contra a gravidade; o braço não atinge ou não mantém 90° (ou 45°), cai na cama, mas tem alguma força contra a gravidade." },
      { val: 3, text: "3 = Nenhum esforço contra a gravidade; braço despenca." },
      { val: 4, text: "4 = Nenhum movimento." },
      { val: 0, text: "NT = Amputação ou fusão articular. (Computado como 0 para soma).", isNT: true }
    ]
  },
  {
    id: "step6a",
    title: "6a. Motor para pernas - Perna esquerda",
    instruction: `A perna é colocada na posição apropriada: extensão a 30° (sempre na posição supina). É valorizada queda do braço se esta ocorre antes de 5 segundos. O paciente afásico é encorajado através de firmeza na voz e de pantomima, mas não com estimulação dolorosa. Cada membro é testado isoladamente, iniciando pela perna não-parética. Somente em caso de amputação ou de fusão de articulação no quadril, o item deve ser considerado não-testável (NT), e uma explicação deve ser escrita para esta escolha.`,
    options: [
      { val: 0, text: "0 = Sem queda; mantém a perna a 30° por 5 segundos completos." },
      { val: 1, text: "1 = Queda; mantém a perna a 30°, porém esta apresenta queda antes dos 5 segundos completos; não toca a cama ou outro suporte." },
      { val: 2, text: "2 = Algum esforço contra a gravidade; a perna não atinge ou não mantém 30°, cai na cama, mas tem alguma força contra a gravidade." },
      { val: 3, text: "3 = Nenhum esforço contra a gravidade; perna despenca." },
      { val: 4, text: "4 = Nenhum movimento." },
      { val: 0, text: "NT = Amputação ou fusão articular. (Computado como 0 para soma).", isNT: true }
    ]
  },
  {
    id: "step6b",
    title: "6b. Motor para pernas - Perna direita",
    instruction: `Mesmas instruções do item 6a. Avaliando a perna direita.`,
    options: [
      { val: 0, text: "0 = Sem queda; mantém a perna a 30° por 5 segundos completos." },
      { val: 1, text: "1 = Queda; mantém a perna a 30°, porém esta apresenta queda antes dos 5 segundos completos; não toca a cama ou outro suporte." },
      { val: 2, text: "2 = Algum esforço contra a gravidade; a perna não atinge ou não mantém 30°, cai na cama, mas tem alguma força contra a gravidade." },
      { val: 3, text: "3 = Nenhum esforço contra a gravidade; perna despenca." },
      { val: 4, text: "4 = Nenhum movimento." },
      { val: 0, text: "NT = Amputação ou fusão articular. (Computado como 0 para soma).", isNT: true }
    ]
  },
  {
    id: "step7",
    title: "7. Ataxia de membros",
    instruction: `Este item avalia se existe evidência de uma lesão cerebelar unilateral. Teste com os olhos abertos. Em caso de defeito visual, assegure-se que o teste é feito no campo visual intacto. Os testes índex-nariz e calcanhar-joelho são realizados em ambos os lados e a ataxia é valorizada, somente, se for desproporcional á fraqueza. A ataxia é considerada ausente no paciente que não pode entender ou está hemiplégico. Somente em caso de amputação ou de fusão de articulações, o item deve ser considerado não-testável (NT), e uma explicação deve ser escrita para esta escolha. Em caso de cegueira, teste tocando o nariz, a partir de uma posição com os braços estendidos.`,
    options: [
      { val: 0, text: "0 = Ausente." },
      { val: 1, text: "1 = Presente em 1 membro." },
      { val: 2, text: "2 = Presente em dois membros." },
      { val: 0, text: "NT = Amputação ou fusão articular. (Computado como 0 para soma).", isNT: true }
    ]
  },
  {
    id: "step8",
    title: "8. Sensibilidade",
    instruction: `Avalie sensibilidade ou mímica facial ao beliscar ou retirada do estímulo doloroso em paciente torporoso ou afásico. Somente a perda de sensibilidade atribuída ao AVC é registrada como anormal e o examinador deve testar tantas áreas do corpo (braços [exceto mãos], pernas, tronco e face) quantas forem necessárias para checar acuradamente um perda hemisensitiva. Um escore de 2, "grave ou total" deve ser dados somente quando uma perda grave ou total da sensibilidade pode ser claramente demonstrada. Portanto, pacientes em esturpor e afásicos irão receber provavelmente 1 ou 0. O paciente com AVC de tronco que tem perda de sensibilidade bilateral recebe 2. Se o paciente não responde e está quadriplégico, marque 2. Pacientes em coma (item 1a=3) recebem arbitrariamente 2 neste item.`,
    options: [
      { val: 0, text: "0 = Normal; nenhuma perda." },
      { val: 1, text: "1 = Perda sensitiva leve a moderada; a sensibilidade ao beliscar é menos aguda ou diminuída do lado afetado, ou há uma perda da dor superficial ao beliscar, mas o paciente está ciente de que está sendo tocado." },
      { val: 2, text: "2 = Perda da sensibilidade grave ou total; o paciente não sente que estás sendo tocado." }
    ]
  },
  {
    id: "step9",
    title: "9. Melhor linguagem",
    instruction: `Uma grande quantidade de informações acerca da compreensão pode obtida durante a aplicação dos itens precedentes do exame. O paciente é solicitado a descrever o que está acontecendo no quadro em anexo, a nomear os itens na lista de identificação anexa e a ler da lista de sentença anexa. A compreensão é julgada a partir destas respostas assim como das de todos os comandos no exame neurológico precedente. Se a perda visual interfere com os testes, peça ao paciente que identifique objetos colocados em sua mão, repita e produza falas. O paciente intubado deve ser incentivado a escrever. O paciente em coma (Item 1A=3) receberá automaticamente 3 neste item. O examinador deve escolher um escore para pacientes em estupor ou pouco cooperativos, mas a pontuação 3 deve ser reservada ao paciente que está mudo e que não segue nenhum comando simples.`,
    mediaHtml: `
      <div style="background-color: #f1f3f5; border-radius: 8px; padding: 1.5rem 1rem; margin-bottom: 1.5rem; text-align: center;">
        <p style="font-size: 1rem; color: #d9534f; margin-bottom: 15px; font-weight: bold; text-transform: uppercase;">
          Atenção: Mostre a tela ao paciente
        </p>
        
        <p style="text-align: left; font-size: 0.95rem; margin-bottom: 8px; color: #333;">
          <strong>Cena:</strong> Solicite que o paciente descreva a situação da imagem.
        </p>
        <img src="imagens/fig1nih.jpeg" alt="Cena da cozinha" style="width: 100%; max-width: 500px; height: auto; border-radius: 6px; border: 1px solid #ccc; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        
        <p style="text-align: left; font-size: 0.95rem; margin-bottom: 8px; color: #333;">
          <strong>Nomeação:</strong> Solicite que o paciente nomeie cada figura.
        </p>
        <img src="imagens/fig2nih.jpeg" alt="Itens para nomeação" style="width: 100%; max-width: 500px; height: auto; border-radius: 6px; border: 1px solid #ccc; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        
        <hr style="border-top: 1px solid #dee2e6; margin-bottom: 15px;">
        
        <p style="text-align: left; font-size: 0.95rem; color: #333; margin-bottom: 10px;">
          <strong>Leitura:</strong> Solicite que o paciente leia as sentenças em voz alta.
        </p>
        <div style="font-size: 1.25rem; font-weight: bold; color: #000; line-height: 1.6; text-align: center; background: #fff; padding: 15px; border-radius: 6px; border: 1px solid #ccc; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);">
          Você sabe como fazer.<br>
          De volta pra casa.<br>
          Eu cheguei em casa do trabalho.<br>
          Próximo da mesa, na sala de jantar.<br>
          Eles ouviram o Pelé falar no rádio.
        </div>
      </div>
    `,
    options: [
      { val: 0, text: "0 = Sem afasia; normal." },
      { val: 1, text: "1 = Afasia leve a moderada; alguma perda óbvia da fluência ou dificuldade de compreensão, sem limitação significativa das idéias expressão ou forma de expressão. A redução do discurso e/ou compreensão, entretanto, dificultam ou impossibilitam a conversação sobre o material fornecido. Por exemplo, na conversa sobre o material geral fornecido, o examinador pode identi-ficar figuras ou item da lista de nomeação a partir da resposta do paciente." },
      { val: 2, text: "2 = Afasia grave; toda a comunicação é feita através de expressões fragmentadas; grande necessidade de interferência, questionamento e adivinhação por parte do ouvinte. A quantidade de informação que pode ser trocada é limitada; o ouvinte carrega o fardo da comunicação. O examinador não consegue identificar itens do material fornecido a partir da resposta do paciente." },
      { val: 3, text: "3 = Mudo, afasia global; nenhuma fala útil ou compreensão auditiva." }
    ]
  },
  {
    id: "step10",
    title: "10. Disartria",
    instruction: `Se acredita que o paciente é normal, uma avaliação mais adequada é obtida pedindo-se ao paciente que leia ou repita palavras da lista anexa. Se o paciente tem afasia grave, a clareza da articulação da fala espontânea pode ser graduada. Somente se o paciente estiver intubado ou tiver outras barreiras físicas a produção da fala, este item deverá ser considerado não testável (NT). Não diga ao paciente por que ele está sendo testado.`,
    mediaHtml: `
      <div style="background-color: #f1f3f5; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; text-align: center;">
        <p style="font-size:0.85rem; color:#666; margin-bottom:10px;">Lista para item 10. Disartria:</p>
        <div style="font-size: 1.15rem; font-weight: bold; color: #333; line-height: 1.6;">
          Mamãe<br>Tic-Tac<br>Paralelo<br>Obriga do<br>Estrada de ferro<br>Jogador de futebol
        </div>
      </div>
    `,
    options: [
      { val: 0, text: "0 = Normal." },
      { val: 1, text: "1 = Disartria leve a moderada; paciente arrasta pelo menos algumas palavras, e na pior das hipóteses, pode ser entendido, com alguma dificuldade." },
      { val: 2, text: "2 = Disartria grave; fala do paciente é tão empastada que chega a ser ininteligível, na ausência de disfasia ou com disfasia desproporcional, ou é mudo/anártrico." },
      { val: 0, text: "NT = Intubado ou outra barreira física. (Computado como 0 para soma).", isNT: true }
    ]
  },
  {
    id: "step11",
    title: "11. Extinção ou Desatenção (antiga negligência)",
    instruction: `Informação suficiente para a identificação de negligência pode ter sido obtida durante os testes anteriores. Se o paciente tem perda visual grave, que impede o teste da estimulação visual dupla simultânea, e os estímulos cutâneos são normais, o escore é normal. Se o paciente tem afasia, mas parece atentar para ambos os lados, o escore é normal. A presença de negligência espacial visual ou anosagnosia pode também ser considerada como evidência de negligência. Como a anormalidade só é pontuada se presente, o item nunca é considerado não testável.`,
    options: [
      { val: 0, text: "0 = Nenhuma anormalidade." },
      { val: 1, text: "1 = Desatenção visual, tátil, auditiva, espacial ou pessoal, ou extinção à estimulação simultânea em uma das modalidades sensoriais." },
      { val: 2, text: "2 = Profunda hemi-desatenção ou hemi-desatenção para mais de uma modalidade; não reconhece a própria mão e se orienta somente para um lado do espaço." }
    ]
  }
];

let currentNihssStep = 0;
let nihssAnswers = new Array(nihssData.length).fill(null);

document.addEventListener("DOMContentLoaded", () => {
  renderNihssStep();

  document.getElementById("btn-next-nihss").addEventListener("click", () => {
    const selected = document.querySelector(`input[name="nihss-radio-group"]:checked`);
    if (!selected) {
      alert("Por favor, selecione uma opção para continuar a avaliação.");
      return;
    }
    
    nihssAnswers[currentNihssStep] = parseInt(selected.value, 10);
    
    if (currentNihssStep < nihssData.length - 1) {
      currentNihssStep++;
      renderNihssStep();
    } else {
      calculateNihssScore();
    }
  });

  document.getElementById("btn-prev-nihss").addEventListener("click", () => {
    if (currentNihssStep > 0) {
      currentNihssStep--;
      renderNihssStep();
    }
  });

  document.getElementById("btn-reset-nihss").addEventListener("click", () => {
    currentNihssStep = 0;
    nihssAnswers = new Array(nihssData.length).fill(null);
    document.getElementById("res-nihss").style.display = "none";
    document.getElementById("form-nihss").style.display = "flex";
    renderNihssStep();
  });
});

function renderNihssStep() {
  const container = document.getElementById("nihss-question-container");
  const data = nihssData[currentNihssStep];
  
  document.getElementById("nihss-current-step").innerText = currentNihssStep + 1;
  document.getElementById("nihss-total-steps").innerText = nihssData.length;
  
  document.getElementById("btn-prev-nihss").style.display = currentNihssStep === 0 ? "none" : "block";
  document.getElementById("btn-next-nihss").innerText = currentNihssStep === nihssData.length - 1 ? "Calcular Escore" : "Próximo Passo";

  let html = `
    <div style="margin-bottom: 1rem;">
      <span style="font-weight: 600; margin-bottom: 0.8rem; color: #2c3e50; display: block; font-size: 1.15rem;">
        ${data.title}
      </span>
      <p style="font-size: 0.9rem; color: #555; margin-bottom: 1.5rem; text-align: justify; line-height: 1.4;">
        ${data.instruction}
      </p>
      ${data.mediaHtml ? data.mediaHtml : ''}
      <div class="btn-group-sc btn-group-vertical-sc" style="width: 100%;">
  `;

  data.options.forEach((opt, idx) => {
    const isChecked = nihssAnswers[currentNihssStep] === opt.val; 
    html += `
        <input type="radio" id="nihss-opt-${idx}" name="nihss-radio-group" value="${opt.val}" ${isChecked ? 'checked' : ''}>
        <label for="nihss-opt-${idx}" class="btn-option-sc" style="text-align: left; padding: 14px; height: auto; white-space: normal; line-height: 1.3;">
            ${opt.text}
        </label>
    `;
  });

  html += `</div></div>`;
  container.innerHTML = html;
}

function calculateNihssScore() {
  const totalScore = nihssAnswers.reduce((acc, curr) => acc + curr, 0);
  
  document.getElementById("form-nihss").style.display = "none";
  document.getElementById("res-nihss").style.display = "block";
  
  const scoreDisplay = document.getElementById("nihss-score-display");
  const estagioDisplay = document.getElementById("nihss-estagio");
  
  scoreDisplay.innerText = totalScore;
  
  for (let i = 0; i <= 4; i++) {
    document.getElementById(`row-sev-${i}`).style.backgroundColor = "transparent";
  }

  if (totalScore === 0) {
    scoreDisplay.style.color = "#28a745";
    estagioDisplay.style.color = "#28a745";
    estagioDisplay.innerText = "Sem sintomas de AVC";
    document.getElementById("row-sev-0").style.backgroundColor = "#d4edda";
  } else if (totalScore >= 1 && totalScore <= 4) {
    scoreDisplay.style.color = "#ff9800";
    estagioDisplay.style.color = "#ff9800";
    estagioDisplay.innerText = "AVC Leve";
    document.getElementById("row-sev-1").style.backgroundColor = "#fff3cd";
  } else if (totalScore >= 5 && totalScore <= 15) {
    scoreDisplay.style.color = "#ff9800";
    estagioDisplay.style.color = "#ff9800";
    estagioDisplay.innerText = "AVC Moderado";
    document.getElementById("row-sev-2").style.backgroundColor = "#fff3cd";
  } else if (totalScore >= 16 && totalScore <= 20) {
    scoreDisplay.style.color = "#dc3545";
    estagioDisplay.style.color = "#dc3545";
    estagioDisplay.innerText = "AVC Moderado a Grave";
    document.getElementById("row-sev-3").style.backgroundColor = "#f8d7da";
  } else if (totalScore >= 21) {
    scoreDisplay.style.color = "#dc3545";
    estagioDisplay.style.color = "#dc3545";
    estagioDisplay.innerText = "AVC Grave";
    document.getElementById("row-sev-4").style.backgroundColor = "#f8d7da";
  }
}