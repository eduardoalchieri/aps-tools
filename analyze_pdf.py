import fitz
import sys

def analyze_pdf(filepath):
    try:
        doc = fitz.open(filepath)
        with open("pdf_analysis.txt", "w", encoding="utf-8") as f:
            f.write(f"Total pages: {len(doc)}\n")
            
            for i in range(50, min(65, len(doc))):
                page = doc.load_page(i)
                text = page.get_text("text")
                f.write(f"--- PAGE {i} ---\n")
                f.write(text)
                f.write("\n\n")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    analyze_pdf("rename-2024.pdf")
