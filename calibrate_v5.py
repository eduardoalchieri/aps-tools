from PIL import Image
import os

IMG_DIR = "curvas_img"

def find_chart_and_grid(img_path):
    img = Image.open(img_path).convert("RGB")
    w, h = img.size
    pixels = img.load()
    
    def is_not_white(r, g, b):
        return r < 252 or g < 252 or b < 252

    # 1. Find the blue chart bounding box (optimized scan)
    chart_l, chart_t, chart_r, chart_b = w, h, 0, 0
    
    # Top
    for y in range(0, h, 2):
        found = False
        for x in range(0, w, 5):
            if is_not_white(*pixels[x, y]):
                chart_t = y
                found = True
                break
        if found: break
        
    # Bottom
    for y in range(h-1, 0, -2):
        found = False
        for x in range(0, w, 5):
            if is_not_white(*pixels[x, y]):
                chart_b = y
                found = True
                break
        if found: break
        
    # Left
    for x in range(0, w, 2):
        found = False
        for y in range(chart_t, chart_b + 1, 5):
            if is_not_white(*pixels[x, y]):
                chart_l = x
                found = True
                break
        if found: break
        
    # Right
    for x in range(w-1, 0, -2):
        found = False
        for y in range(chart_t, chart_b + 1, 5):
            if is_not_white(*pixels[x, y]):
                chart_r = x
                found = True
                break
        if found: break

    # 2. Inside the chart, find the white grid
    def is_grid_white(r, g, b):
        return r > 240 and g > 240 and b > 240

    grid_l, grid_t, grid_r, grid_b = chart_r, chart_b, chart_l, chart_t
    
    # Grid top
    for y in range(chart_t + 10, chart_b - 10):
        white_count = 0
        for x in range(chart_l + 50, chart_r - 50, 5):
            if is_grid_white(*pixels[x, y]):
                white_count += 1
        if white_count > ((chart_r - chart_l - 100) / 5) * 0.7:
            grid_t = y
            break
            
    # Grid bottom
    for y in range(chart_b - 10, chart_t + 10, -1):
        white_count = 0
        for x in range(chart_l + 50, chart_r - 50, 5):
            if is_grid_white(*pixels[x, y]):
                white_count += 1
        if white_count > ((chart_r - chart_l - 100) / 5) * 0.7:
            grid_b = y
            break
            
    # Grid left
    for x in range(chart_l + 10, chart_r - 10):
        white_count = 0
        for y in range(grid_t + 50, grid_b - 50, 5):
            if is_grid_white(*pixels[x, y]):
                white_count += 1
        if white_count > ((grid_b - grid_t - 100) / 5) * 0.7:
            grid_l = x
            break
            
    # Grid right
    for x in range(chart_r - 10, chart_l + 10, -1):
        white_count = 0
        for y in range(grid_t + 50, grid_b - 50, 5):
            if is_grid_white(*pixels[x, y]):
                white_count += 1
        if white_count > ((grid_b - grid_t - 100) / 5) * 0.7:
            grid_r = x
            break

    return {
        "l": round(grid_l/w*100, 2),
        "t": round(grid_t/h*100, 2),
        "r": round(grid_r/w*100, 2),
        "b": round(grid_b/h*100, 2)
    }

for fname in sorted(os.listdir(IMG_DIR)):
    if fname.endswith(".png"):
        try:
            res = find_chart_and_grid(os.path.join(IMG_DIR, fname))
            print(f"'{fname}': {{ left: {res['l']}, top: {res['t']}, right: {res['r']}, bottom: {res['b']} }},")
        except Exception as e:
            pass
