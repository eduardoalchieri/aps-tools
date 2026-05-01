import re
with open('escalas/pneumo_basicas.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace CAT labels
cat_new = '''const sc_catLabels = [
    ["Eu nunca tusso", "Eu estou sempre tossindo"],
    ["Eu não tenho catarro no peito", "O meu peito está completamente cheio de catarro"],
    ["Eu não sinto nenhum aperto no peito", "Sinto muito aperto no peito"],
    ["Quando subo uma ladeira ou um lance de escadas, não sinto falta de ar", "Quando subo uma ladeira ou um lance de escadas, sinto muita falta de ar"],
    ["Não me sinto limitado(a) em fazer minhas atividades em casa", "Sinto-me muito limitado(a) em fazer minhas atividades em casa"],
    ["Sinto-me confiante para sair de casa, apesar da minha doença pulmonar", "Não me sinto nem um pouco confiante para sair de casa por causa de minha doença pulmonar"],
    ["Durmo profundamente", "Não durmo bem por causa da minha doença pulmonar"],
    ["Tenho muita energia", "Não tenho nenhuma energia"]
];'''
text = re.sub(r'const sc_catLabels = \[.*?\];', cat_new, text, flags=re.DOTALL)

# Replace STOP-BANG questions
sb_new = '''const sc_sbQs = [
    "1. Ronco: Você ronca alto (mais alto que falar ou o suficiente para ser ouvido por trás de portas fechadas)?",
    "2. Cansaço: Você frequentemente se sente cansado(a), fadigado(a) ou sonolento(a) durante o dia?",
    "3. Observação: Alguém já observou você parar de respirar durante o sono?",
    "4. Pressão alta: Você tem ou está em tratamento para pressão alta?",
    "5. IMC: Seu Índice de Massa Corporal é superior a 35 kg/m²?",
    "6. Idade: Você tem mais de 50 anos?",
    "7. Pescoço: A circunferência do seu pescoço é maior que 40 cm?",
    "8. Gênero: Você é do sexo masculino?"
];'''
text = re.sub(r'const sc_sbQs = \[.*?\];', sb_new, text, flags=re.DOTALL)

# Replace Epworth questions
ep_new = '''const sc_epQs = [
    "1. Sentado e lendo",
    "2. Assistindo à televisão",
    "3. Sentado, inativo, em um lugar público (ex: teatro, reunião)",
    "4. Como passageiro em um carro durante uma hora sem parar",
    "5. Deitado para descansar à tarde, quando as circunstâncias permitem",
    "6. Sentado e conversando com alguém",
    "7. Sentado calmamente após o almoço sem álcool",
    "8. Em um carro, parado por alguns minutos no trânsito"
];'''
text = re.sub(r'const sc_epQs = \[.*?\];', ep_new, text, flags=re.DOTALL)

with open('escalas/pneumo_basicas.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Replaced pneumo_basicas.js')
