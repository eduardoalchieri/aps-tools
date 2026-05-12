"""Convert WHO growth curve PDFs to PNG images for web use."""
import fitz  # PyMuPDF
import os

INPUT_DIR = r"Curvas de crescimento"
OUTPUT_DIR = r"curvas_img"

os.makedirs(OUTPUT_DIR, exist_ok=True)

for filename in os.listdir(INPUT_DIR):
    if not filename.lower().endswith(".pdf"):
        continue
    pdf_path = os.path.join(INPUT_DIR, filename)
    doc = fitz.open(pdf_path)
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        # Render at 200 DPI for good quality while keeping file size reasonable
        mat = fitz.Matrix(200/72, 200/72)
        pix = page.get_pixmap(matrix=mat, alpha=False)
        
        base_name = os.path.splitext(filename)[0]
        # Clean filename for web
        clean_name = base_name.replace(" ", "_").replace(".", "_").replace(",", "_")
        
        if len(doc) > 1:
            out_name = f"{clean_name}_p{page_num+1}.png"
        else:
            out_name = f"{clean_name}.png"
        
        out_path = os.path.join(OUTPUT_DIR, out_name)
        pix.save(out_path)
        print(f"Saved: {out_name} ({pix.width}x{pix.height})")
    
    doc.close()

print(f"\nAll done! {len(os.listdir(OUTPUT_DIR))} images generated in '{OUTPUT_DIR}'")
