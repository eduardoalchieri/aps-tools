"""
Script de calibração precisa das curvas OMS.
Analisa as imagens pixel a pixel para encontrar as bordas da área de plotagem.
Procura por linhas retas (grade) para identificar os limites do gráfico.
"""
from PIL import Image
import os

IMG_DIR = "curvas_img"

def analyze_grid(img_path):
    """
    Analisa uma imagem para encontrar as bordas da grade do gráfico.
    Procura por linhas horizontais e verticais escuras consecutivas.
    """
    img = Image.open(img_path).convert("RGB")
    w, h = img.size
    pixels = img.load()
    
    def is_dark(r, g, b, threshold=80):
        return r < threshold and g < threshold and b < threshold
    
    # Busca a borda esquerda da grade (linha vertical escura contínua)
    # Percorre da esquerda para a direita, procurando colunas com muitos pixels escuros consecutivos
    left_edge = None
    for x in range(int(w * 0.02), int(w * 0.25)):
        dark_count = 0
        for y in range(int(h * 0.05), int(h * 0.95)):
            r, g, b = pixels[x, y]
            if is_dark(r, g, b):
                dark_count += 1
        # Uma linha vertical do gráfico terá muitos pixels escuros
        if dark_count > (h * 0.5):
            left_edge = x
            break
    
    # Busca a borda direita
    right_edge = None
    for x in range(int(w * 0.98), int(w * 0.7), -1):
        dark_count = 0
        for y in range(int(h * 0.05), int(h * 0.95)):
            r, g, b = pixels[x, y]
            if is_dark(r, g, b):
                dark_count += 1
        if dark_count > (h * 0.5):
            right_edge = x
            break
    
    # Busca a borda superior
    top_edge = None
    for y in range(int(h * 0.02), int(h * 0.25)):
        dark_count = 0
        for x in range(int(w * 0.05), int(w * 0.95)):
            r, g, b = pixels[x, y]
            if is_dark(r, g, b):
                dark_count += 1
        if dark_count > (w * 0.5):
            top_edge = y
            break
    
    # Busca a borda inferior
    bottom_edge = None
    for y in range(int(h * 0.98), int(h * 0.6), -1):
        dark_count = 0
        for x in range(int(w * 0.05), int(w * 0.95)):
            r, g, b = pixels[x, y]
            if is_dark(r, g, b):
                dark_count += 1
        if dark_count > (w * 0.5):
            bottom_edge = y
            break
    
    return {
        "size": (w, h),
        "left_px": left_edge,
        "right_px": right_edge,
        "top_px": top_edge,
        "bottom_px": bottom_edge,
        "left_pct": round(left_edge / w * 100, 2) if left_edge else None,
        "right_pct": round(right_edge / w * 100, 2) if right_edge else None,
        "top_pct": round(top_edge / h * 100, 2) if top_edge else None,
        "bottom_pct": round(bottom_edge / h * 100, 2) if bottom_edge else None,
    }

# Analisa todas as imagens
for fname in sorted(os.listdir(IMG_DIR)):
    if fname.endswith(".png"):
        fpath = os.path.join(IMG_DIR, fname)
        result = analyze_grid(fpath)
        short = fname.replace("OMS__", "").replace(".png", "").replace("Curva_de_", "")
        print(f"\n{short}")
        print(f"  Size: {result['size'][0]}x{result['size'][1]}")
        print(f"  Grid px: L={result['left_px']} T={result['top_px']} R={result['right_px']} B={result['bottom_px']}")
        print(f"  Grid %:  L={result['left_pct']} T={result['top_pct']} R={result['right_pct']} B={result['bottom_pct']}")
