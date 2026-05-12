from PIL import Image
import os

def find_grid_lines(img_path):
    img = Image.open(img_path).convert("RGB")
    w, h = img.size
    pixels = img.load()
    
    # Threshold for a grid line (darker than background)
    def is_line(r, g, b):
        return r < 200 and g < 200 and b < 200

    # Vertical lines (age)
    v_lines = []
    for x in range(w):
        count = 0
        for y in range(int(h*0.3), int(h*0.7)):
            if is_line(*pixels[x, y]):
                count += 1
        if count > h * 0.35: # Vertical line found
            if not v_lines or x - v_lines[-1] > 5:
                v_lines.append(x)
                
    # Horizontal lines (value)
    h_lines = []
    for y in range(h):
        count = 0
        for x in range(int(w*0.3), int(w*0.7)):
            if is_line(*pixels[x, y]):
                count += 1
        if count > w * 0.35: # Horizontal line found
            if not h_lines or y - h_lines[-1] > 5:
                h_lines.append(y)
                
    if not v_lines or not h_lines:
        return None
        
    return {
        "l": round(v_lines[0]/w*100, 2),
        "t": round(h_lines[0]/h*100, 2),
        "r": round(v_lines[-1]/w*100, 2),
        "b": round(h_lines[-1]/h*100, 2),
        "v_count": len(v_lines),
        "h_count": len(h_lines)
    }

IMG_DIR = "curvas_img"
for fname in sorted(os.listdir(IMG_DIR)):
    if fname.endswith(".png"):
        res = find_grid_lines(os.path.join(IMG_DIR, fname))
        if res:
            print(f"'{fname}': {{ left: {res['l']}, top: {res['t']}, right: {res['r']}, bottom: {res['b']} }}, // {res['v_count']}v, {res['h_count']}h")
