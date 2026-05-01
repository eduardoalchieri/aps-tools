
window.medicamentosData = [];

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container-medicamentos");
    const inputPesquisa = document.getElementById("input-pesquisa-medicamentos");

    // Usa a variavel global de medicamentos_data.js
    if (typeof medicamentosJSON !== "undefined") {
        window.medicamentosData = medicamentosJSON.sort((a, b) => a.nome.localeCompare(b.nome));
        renderMedicamentos(window.medicamentosData);
    } else {
        console.error("Erro: arquivo medicamentos_data.js não carregado corretamente.");
    }

    function renderMedicamentos(lista) {
        if (!container) return;
        container.innerHTML = "";
        
        if (lista.length === 0) {
            container.innerHTML = `<p style="text-align: center; color: #666; padding: 20px;">Nenhum medicamento encontrado.</p>`;
            return;
        }

        lista.forEach(med => {
            const card = document.createElement("div");
            card.className = "med-card";
            
            // Build tags HTML
            let tagsHtml = "";
            
            // Component Tag
            const compClass = "tag-" + med.componente.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            tagsHtml += `<span class="med-tag ${compClass}" onclick="event.stopPropagation(); abrirModalTag(\`${med.componente}\`)">${med.componente}</span>`;
            
            // Symptom Tags
            if (med.tags && med.tags.length > 0) {
                med.tags.slice(0, 3).forEach(tag => {
                    tagsHtml += `<span class="med-tag tag-sintoma">${tag}</span>`;
                });
            }

            // Presentations HTML
            let presHtml = "";
            med.apresentacoes.forEach(ap => {
                presHtml += `<li>${ap}</li>`;
            });

            card.innerHTML = `
                <div class="med-header" onclick="toggleMed(this)">
                    <div>
                        <div class="med-title">${med.nome}</div>
                        <div class="med-tags">${tagsHtml}</div>
                    </div>
                    <span class="material-symbols-outlined" style="color: #0b5ed7; transition: transform 0.3s;">expand_more</span>
                </div>
                <div class="med-details">
                    <h4>Apresentações disponíveis:</h4>
                    <ul>${presHtml}</ul>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Local Search
    if (inputPesquisa) {
        inputPesquisa.addEventListener("input", (e) => {
            const termo = e.target.value.toLowerCase().trim();
            if (!termo) {
                renderMedicamentos(window.medicamentosData);
                return;
            }
            
            const filtrados = window.medicamentosData.filter(med => {
                const nomeMatch = med.nome.toLowerCase().includes(termo);
                const tagMatch = med.tags && med.tags.some(tag => tag.toLowerCase().includes(termo));
                return nomeMatch || tagMatch;
            });
            renderMedicamentos(filtrados);
        });
    }
});

// Accordion toggle
window.toggleMed = function(headerElem) {
    const details = headerElem.nextElementSibling;
    const icon = headerElem.querySelector(".material-symbols-outlined");
    
    if (details.classList.contains("open")) {
        details.classList.remove("open");
        icon.style.transform = "rotate(0deg)";
    } else {
        details.classList.add("open");
        icon.style.transform = "rotate(180deg)";
    }
};

// Modal for Tags
window.abrirModalTag = function(tag) {
    const modal = document.getElementById("tag-modal");
    const title = document.getElementById("tag-modal-title");
    const body = document.getElementById("tag-modal-body");
    
    if (!modal) return;
    
    title.textContent = tag;
    
    if (tag.toLowerCase() === "básico") {
        body.innerHTML = "<strong>Componente Básico da Assistência Farmacêutica (CBAF):</strong><br><br>Medicamentos para o tratamento dos problemas de saúde mais comuns na Atenção Primária à Saúde (postos de saúde/UBS). O acesso ocorre diretamente nas farmácias básicas dos municípios.";
    } else if (tag.toLowerCase() === "estratégico") {
        body.innerHTML = "<strong>Componente Estratégico (CESAF):</strong><br><br>Medicamentos para doenças com perfil endêmico ou impacto socioeconômico (ex: tuberculose, hanseníase, HIV/Aids, influenza). O fornecimento segue protocolos específicos do Ministério da Saúde.";
    } else if (tag.toLowerCase() === "especializado") {
        body.innerHTML = "<strong>Componente Especializado (CEAF):</strong><br><br>Garante medicamentos de alto custo ou para tratamentos crônicos complexos (ex: asma grave, artrite reumatoide, alzheimer). A dispensação exige preenchimento de LME e documentos específicos, geralmente nas Farmácias do Estado.";
    } else {
        body.innerHTML = "Categoria de medicamento do SUS.";
    }
    
    modal.classList.add("active");
};

