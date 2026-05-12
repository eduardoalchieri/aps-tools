from PIL import Image
import os

IMG_DIR = "curvas_img"

def find_chart_and_grid(img_path):
    img = Image.open(img_path).convert("RGB")
    w, h = img.size
    pixels = img.load()
    
    def is_not_white(r, g, b):
        return r < 250 or g < 250 or b < 250

    # 1. Find the blue chart bounding box
    chart_l, chart_t, chart_r, chart_b = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            if is_not_white(*pixels[x, y]):
                chart_l = min(chart_l, x)
                chart_t = min(chart_t, y)
                chart_r = max(chart_r, x)
                chart_b = max(chart_b, y)
    
    # 2. Inside the chart, find the white grid
    # The grid is white with colored lines.
    # We look for the first/last mostly white areas inside the chart bounds.
    def is_grid_white(r, g, b):
        # Grid white is usually very pure, or at least lighter than the blue axes
        return r > 240 and g > 240 and b > 240

    grid_l, grid_t, grid_r, grid_b = chart_r, chart_b, chart_l, chart_t
    
    # Grid top
    for y in range(chart_t + 5, chart_b - 5):
        white_count = 0
        for x in range(chart_l + 5, chart_r - 5):
            if is_grid_white(*pixels[x, y]):
                white_count += 1
        if white_count > (chart_r - chart_l) * 0.5:
            grid_t = y
            break
            
    # Grid bottom
    for y in range(chart_b - 5, chart_t + 5, -1):
        white_count = 0
        for x in range(chart_l + 5, chart_r - 5):
            if is_grid_white(*pixels[x, y]):
                white_count += 1
        if white_count > (chart_r - chart_l) * 0.5:
            grid_b = y
            break
            
    # Grid left
    for x in range(chart_l + 5, chart_r - 5):
        white_count = 0
        for y in range(chart_t + 5, chart_b - 5):
            if is_grid_white(*pixels[x, y]):
                white_count += 1
        if white_count > (chart_b - chart_t) * 0.5:
            grid_l = x
            break
            
    # Grid right
    for x in range(chart_r - 5, chart_l + 5, -1):
        white_count = 0
        for y in range(chart_t + 5, chart_b - 5):
            if is_grid_white(*pixels[x, y]):
                white_count += 1
        if white_count > (chart_b - chart_t) * 0.5:
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
