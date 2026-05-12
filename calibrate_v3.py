from PIL import Image
import os

IMG_DIR = "curvas_img"

def find_white_grid(img_path):
    img = Image.open(img_path).convert("RGB")
    w, h = img.size
    pixels = img.load()
    
    # We'll look for a large white-ish rectangle.
    # The grid is usually white with light gray/colored lines.
    
    def is_white_ish(r, g, b):
        # Grid background is usually very light
        return r > 245 and g > 245 and b > 245

    # Scan for the bounds of the largest white area in the middle.
    # Top-down
    grid_top = 0
    for y in range(int(h * 0.05), int(h * 0.5)):
        white_count = 0
        for x in range(int(w * 0.2), int(w * 0.8)):
            if is_white_ish(*pixels[x, y]):
                white_count += 1
        if white_count > w * 0.5:
            grid_top = y
            break
            
    # Bottom-up
    grid_bottom = h
    for y in range(int(h * 0.95), int(h * 0.5), -1):
        white_count = 0
        for x in range(int(w * 0.2), int(w * 0.8)):
            if is_white_ish(*pixels[x, y]):
                white_count += 1
        if white_count > w * 0.5:
            grid_bottom = y
            break
            
    # Left-right
    grid_left = 0
    for x in range(int(w * 0.02), int(w * 0.3)):
        white_count = 0
        for y in range(int(h * 0.3), int(h * 0.7)):
            if is_white_ish(*pixels[x, y]):
                white_count += 1
        if white_count > h * 0.3:
            grid_left = x
            break
            
    # Right-left
    grid_right = w
    for x in range(int(w * 0.98), int(w * 0.7), -1):
        white_count = 0
        for y in range(int(h * 0.3), int(h * 0.7)):
            if is_white_ish(*pixels[x, y]):
                white_count += 1
        if white_count > h * 0.3:
            grid_right = x
            break
            
    # Now we have the WHITE area. 
    # BUT wait, the WHO charts have blue axes WITHIN the non-white area? 
    # No, the blue axes are OUTSIDE the white grid.
    # However, the first/last grid lines might be exactly at the edge of the white area.
    
    return {
        "l": round(grid_left/w*100, 2),
        "t": round(grid_top/h*100, 2),
        "r": round(grid_right/w*100, 2),
        "b": round(grid_bottom/h*100, 2)
    }

for fname in sorted(os.listdir(IMG_DIR)):
    if fname.endswith(".png"):
        try:
            res = find_white_grid(os.path.join(IMG_DIR, fname))
            print(f"'{fname}': {{ left: {res['l']}, top: {res['t']}, right: {res['r']}, bottom: {res['b']} }},")
        except:
            pass
