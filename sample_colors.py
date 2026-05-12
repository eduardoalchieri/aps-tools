from PIL import Image
import os

img = Image.open('curvas_img/OMS__Peso_para_Idade__Meninos___5-10_anos__Em_Percentil_.png').convert("RGB")
w, h = img.size
print(f"Size: {w}x{h}")

# Sample some points
points = [
    (0,0), (w//2, 0), (w-1, 0),
    (0, h//2), (w//2, h//2), (w-1, h//2),
    (0, h-1), (w//2, h-1), (w-1, h-1),
    (int(w*0.05), h//2), (int(w*0.95), h//2),
    (w//2, int(h*0.05)), (w//2, int(h*0.95))
]

for p in points:
    print(f"Point {p}: {img.getpixel(p)}")
