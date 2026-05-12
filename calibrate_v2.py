from PIL import Image
import os

IMG_DIR = "curvas_img"

def find_bounds(img_path):
    img = Image.open(img_path).convert("RGB")
    w, h = img.size
    pixels = img.load()
    
    # We want to find the main chart area. 
    # Usually it's a rectangle with a border or a distinct background.
    # Let's look for the first and last non-white pixels with some margin.
    
    left, top, right, bottom = w, h, 0, 0
    
    # Threshold for "not white"
    def is_not_white(r, g, b):
        return r < 240 or g < 240 or b < 240

    # To avoid noise (text, logos), we'll look for lines.
    # The grid usually has long horizontal and vertical lines.
    
    # Find top: search from top, first line with many non-white pixels
    for y in range(int(h * 0.05), int(h * 0.3)):
        count = 0
        for x in range(int(w * 0.1), int(w * 0.9)):
            if is_not_white(*pixels[x, y]):
                count += 1
        if count > w * 0.4:
            top = y
            break
            
    # Find bottom: search from bottom
    for y in range(int(h * 0.95), int(h * 0.6), -1):
        count = 0
        for x in range(int(w * 0.1), int(w * 0.9)):
            if is_not_white(*pixels[x, y]):
                count += 1
        if count > w * 0.4:
            bottom = y
            break
            
    # Find left: search from left
    for x in range(int(w * 0.02), int(w * 0.2)):
        count = 0
        for y in range(int(h * 0.2), int(h * 0.8)):
            if is_not_white(*pixels[x, y]):
                count += 1
        if count > h * 0.3:
            left = x
            break
            
    # Find right: search from right
    for x in range(int(w * 0.98), int(w * 0.8), -1):
        count = 0
        for y in range(int(h * 0.2), int(h * 0.8)):
            if is_not_white(*pixels[x, y]):
                count += 1
        if count > h * 0.3:
            right = x
            break
            
    return {
        "l": round(left/w*100, 2),
        "t": round(top/h*100, 2),
        "r": round(right/w*100, 2),
        "b": round(bottom/h*100, 2)
    }

for fname in sorted(os.listdir(IMG_DIR)):
    if fname.endswith(".png"):
        try:
            res = find_bounds(os.path.join(IMG_DIR, fname))
            print(f"'{fname}': {{ left: {res['l']}, top: {res['t']}, right: {res['r']}, bottom: {res['b']} }},")
        except:
            pass
