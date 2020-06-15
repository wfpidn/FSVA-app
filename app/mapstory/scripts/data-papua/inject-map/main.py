
import os
import json

_root = os.path.realpath(os.path.dirname(os.path.abspath(__file__)) + '/../..')

story = 'papua'
src = './src-papua.txt'
blocks = map(lambda x: x.split('\n'), open(src).read().strip().split('\n\n\n'))

def findFiles(id):
    candidates = []
    for root, dirs, files in os.walk(_root + '/stories/' + story):
        for f in files:
            if f.startswith(id) and f.endswith('.json'):
                candidates.append(root + '/' + f)
    return candidates

for b in blocks:
    head = b[0]
    i = head.index(':')
    id = head[:i].strip()
    url = head[i+1:].strip()
    for f in findFiles(id):
        with open(f) as fi:
            data = json.load(fi)
        data['map']['url'] = url
        with open(f, 'w') as fo:
            fo.write(json.dumps(data, indent=4))
