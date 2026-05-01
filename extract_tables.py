import pdfplumber
import json
import re

def process_rename(pdf_path, output_json):
    medicamentos = {}
    
    # These pages usually contain the list. We need to skip intro and indexes.
    # In RENAME 2024, the list usually starts around page 45-55. We will scan all pages
    # and look for tables that have headers like 'Denominação Comum Brasileira (DCB)'
    print("Starting PDF extraction...")
    
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            tables = page.extract_tables()
            for table in tables:
                if not table or len(table) < 2:
                    continue
                
                # Check if this table has the right header
                header = [str(cell).replace("\n", " ").strip() for cell in table[0] if cell is not None]
                
                # Sometimes the header spans multiple columns or has slightly different text
                header_str = " ".join(header).lower()
                
                if "denominação comum brasileira" in header_str or "dcb" in header_str or "fármaco" in header_str:
                    
                    current_med = None
                    
                    for row in table[1:]:
                        if len(row) < 4:
                            continue
                        
                        # Clean up row cells
                        cleaned_row = [str(cell).replace("\n", " ").strip() if cell is not None else "" for cell in row]
                        
                        dcb = cleaned_row[0]
                        concentracao = cleaned_row[1]
                        forma = cleaned_row[2] if len(cleaned_row) > 2 else ""
                        componente = cleaned_row[3] if len(cleaned_row) > 3 else ""
                        
                        # Skip empty rows or continuation headers
                        if not concentracao and not forma:
                            # It might be a new med that spans multiple lines, or just garbage
                            if dcb and dcb.lower() != "continua" and dcb.lower() != "continuação" and dcb.lower() != "conclusão":
                                current_med = dcb
                            continue
                            
                        # If dcb is empty, it means this row is a continuation of the previous med
                        if dcb and dcb.lower() != "continua" and dcb.lower() != "continuação" and dcb.lower() != "conclusão":
                            current_med = dcb
                            
                        if not current_med:
                            continue
                            
                        med_name_clean = current_med.strip().capitalize()
                        
                        # Format presentation: Concentração + Forma
                        apresentacao = f"{forma} {concentracao}".strip()
                        if not apresentacao:
                            continue
                            
                        # Clean componente
                        comp_clean = "Básico"
                        if "especializado" in componente.lower():
                            comp_clean = "Especializado"
                        elif "estratégico" in componente.lower():
                            comp_clean = "Estratégico"
                        elif "básico" in componente.lower():
                            comp_clean = "Básico"
                        else:
                            comp_clean = componente.strip()
                        
                        if med_name_clean not in medicamentos:
                            medicamentos[med_name_clean] = {
                                "nome": med_name_clean,
                                "apresentacoes": set(),
                                "componente": comp_clean,
                                "tags": []
                            }
                            
                        medicamentos[med_name_clean]["apresentacoes"].add(apresentacao)

    print(f"Extracted {len(medicamentos)} medications.")
    
    # Post-processing: convert sets to lists and assign basic tags based on simple rules
    final_list = []
    
    # Very basic tagging for common meds to satisfy the user's request
    tag_rules = {
        "dipirona": ["dor", "febre", "analgésico", "antitérmico"],
        "paracetamol": ["dor", "febre", "analgésico", "antitérmico"],
        "ibuprofeno": ["dor", "febre", "anti-inflamatório", "aine"],
        "amoxicilina": ["infecção", "antibiótico", "bactéria"],
        "azitromicina": ["infecção", "antibiótico", "bactéria"],
        "cefalexina": ["infecção", "antibiótico", "bactéria"],
        "losartana": ["pressão alta", "hipertensão", "anti-hipertensivo"],
        "captopril": ["pressão alta", "hipertensão", "anti-hipertensivo"],
        "hidroclorotiazida": ["pressão alta", "hipertensão", "diurético"],
        "metformina": ["diabetes", "açúcar", "hipoglicemiante"],
        "gliclazida": ["diabetes", "açúcar", "hipoglicemiante"],
        "insulina": ["diabetes", "açúcar"],
        "omeprazol": ["estômago", "gastrite", "azia", "refluxo"],
        "simeticona": ["gases"],
        "clonazepam": ["ansiedade", "calmante", "insônia"],
        "diazepam": ["ansiedade", "calmante"],
        "fluoxetina": ["depressão", "ansiedade", "antidepressivo"],
        "sertralina": ["depressão", "ansiedade", "antidepressivo"],
        "loratadina": ["alergia", "antialérgico", "coceira"],
        "dexclorfeniramina": ["alergia", "antialérgico", "coceira"],
        "prednisona": ["alergia", "anti-inflamatório", "corticoide"],
        "dexametasona": ["alergia", "anti-inflamatório", "corticoide"]
    }
    
    for med in medicamentos.values():
        med["apresentacoes"] = sorted(list(med["apresentacoes"]))
        
        # Apply tags if matches
        for key, tags in tag_rules.items():
            if key in med["nome"].lower():
                med["tags"].extend(tags)
                
        # Remove duplicates
        med["tags"] = list(set(med["tags"]))
        
        final_list.append(med)
        
    final_list.sort(key=lambda x: x["nome"])
    
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(final_list, f, ensure_ascii=False, indent=2)
        
    print(f"Saved to {output_json}")

if __name__ == "__main__":
    process_rename("rename-2024.pdf", "medicamentos.json")
