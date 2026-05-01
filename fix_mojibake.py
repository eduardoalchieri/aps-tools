import os

chars = 'áàãâéêíóôõúçÁÀÃÂÉÊÍÓÔÕÚÇºª“”‘’–—'
replacements = {}
for c in chars:
    try:
        mojibake = c.encode('utf-8').decode('latin1')
        replacements[mojibake] = c
    except Exception as e:
        pass

# Add some explicit ones just in case latin1 decode behaves weirdly on some systems
# For example, Ã§ is ç.
# replacements['Ã§'] = 'ç' # already covered by the loop

sorted_repls = sorted(replacements.items(), key=lambda x: len(x[0]), reverse=True)

files_to_fix = [
    'app.js',
    'index.html',
    'ecomapa/index.html',
    'escalas/dengue.js',
    'escalas/glasgow.js',
    'escalas/pneumo_basicas.js',
    'escalas/pps.js',
    'escalas/wells.js',
    'sw.js',
    'style.css'
]

base_dir = r'c:\Users\eduar\OneDrive\Desktop\aps-tools'

for root, _, files in os.walk(base_dir):
    if '.git' in root: continue
    for f_name in files:
        if f_name.endswith(('.html', '.js', '.json', '.css')):
            path = os.path.join(root, f_name)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                for bad, good in sorted_repls:
                    new_content = new_content.replace(bad, good)
                    
                if content != new_content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f'Fixed {path}')
            except UnicodeDecodeError:
                pass
            except Exception as e:
                print(f"Error on {path}: {e}")

print("Done fixing mojibake.")
