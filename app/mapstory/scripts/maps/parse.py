
import json

with open('source.txt') as f:
    blocks = f.read().strip().split('\n\n\n')

maps = []

def build(block):
    lines = block.split('\n')
    legend = []
    for i in range((len(lines) - 3) // 2):
        legend.append({
            'color': lines[3 + i*2],
            'label': lines[3 + i*2 + 1]
        })
    return {
        'id': lines[0],
        'url': lines[1],
        'title': lines[2],
        'legend': legend
    }

for b in blocks:
    maps.append(build(b))

print(json.dumps(maps, indent=4))

