
import json

with open('./src-papua.txt') as f:
    blocks = f.read().strip().split('\n\n\n')

maps = []
numskip = 4

def build(block):
    lines = block.split('\n')
    legend = []
    for l in lines[numskip:]:
        [color, label] = l.split('\t')
        legend.append({
            'color': color,
            'label': label
            })
    return {
        'id': lines[0].strip(),
        'url': lines[1].strip(),
        'title': lines[2][len('Title: '):],
        'legend': legend
    }

for b in blocks:
    maps.append(build(b))

print(json.dumps(maps, indent=4))

