import os
import re

files_to_check = []
for root, _, files in os.walk('.'):
    if '.git' in root: continue
    for f in files:
        if f.endswith(('.html', '.js', '.json', '.css')):
            files_to_check.append(os.path.join(root, f))

# A regex to match any sequence of 2-7 non-ASCII characters
pattern = re.compile(r'[^\x00-\x7F]{2,7}')

unique_mojibake = set()

# Pass 1: Find all mojibake
for path in files_to_check:
    try:
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
            for match in pattern.findall(content):
                try:
                    b = match.encode('cp1252')
                    fixed = b.decode('utf-8')
                    if len(fixed) < len(match):
                        unique_mojibake.add((match, fixed))
                except Exception:
                    try:
                        b = match.encode('latin1')
                        fixed = b.decode('utf-8')
                        if len(fixed) < len(match):
                            unique_mojibake.add((match, fixed))
                    except Exception:
                        pass
    except Exception:
        pass

# Create a list sorted by length descending so longer patterns are replaced first
sorted_replacements = sorted(list(unique_mojibake), key=lambda x: len(x[0]), reverse=True)

# Also add some specific known ones that the regex might have missed or that include spaces/ASCII
extra_replacements = [
    ('â‰¤', '≤'),
    ('â‰¥', '≥'),
    ('âš ï¸\x8f', '⚠️'),
    ('âš\xa0ï¸\x8f', '⚠️'),
    ('âš\xa0 ï¸\x8f', '⚠️'), # the space could be in between
    ('âš ï¸', '⚠️'),
]
for bad, good in extra_replacements:
    sorted_replacements.append((bad, good))

# Sort again just in case
sorted_replacements = sorted(sorted_replacements, key=lambda x: len(x[0]), reverse=True)

# Pass 2: Apply replacements
total_fixed = 0
for path in files_to_check:
    try:
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        new_content = content
        for bad, good in sorted_replacements:
            new_content = new_content.replace(bad, good)
            
        if content != new_content:
            with open(path, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f'Fixed {path}')
            total_fixed += 1
    except Exception as e:
        print(f'Error fixing {path}: {e}')

print(f'Done fixing {total_fixed} files.')
