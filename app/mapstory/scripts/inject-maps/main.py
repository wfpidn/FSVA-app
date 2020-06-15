import os
import json
import re
from collections import OrderedDict

_root = os.path.realpath(os.path.dirname(os.path.abspath(__file__)) + '/../..')


def apply_file(fname):
    check(fname)
    [story, lang, _] = fname.split('.')
    blocks = [[l.strip() for l in block.split('\n')] for block in
              read(fname).split('\n\n\n')]

    for block in blocks:
        doc = build(block)

        id = block[0]
        f = findFile(story, '{}.{}.json'.format(id, lang))
        if not f:
            continue
        with open(f) as fi:
            data = json.load(fi, object_pairs_hook=OrderedDict)
        data['map']['url'] = doc['url']
        data['title'] = doc['title']
        data['legend'] = doc['legend']
        with open(f, 'w') as fo:
            fo.write(json.dumps(data, indent=4))


def build(lines):
    url = lines[1]
    check_url(url)
    legend = []
    for c in chunks(lines[3:], 2):
        legend.append({
            'color': c[0],
            'label': c[1]
        })
    check_legend(legend)
    return {
        'id': lines[0],
        'url': lines[1],
        'title': lines[2],
        'legend': legend
    }


def check_url(url):
    if not re.match('^https?://.*', url):
        raise Exception('URL not valid: ' + url)


def check_legend(legend):
    for row in legend:
        if not row['color'].startswith('RGB('):
            raise Exception('Color must start with RGB')


def check(fname):
    content = read(fname)
    if re.search(r'\w\n\n\w', content, flags=re.MULTILINE):
        raise Exception('Contains 2 newlines, should be 3 on: ' + fname)
    if content.find('\n\n\n\n') >= 0:
        raise Exception('Contains 4 newlines, should be 3 on: ' + fname)


def chunks(iterable, n):
    return (iterable[i:i + n] for i in range(0, len(iterable), n))


def findFile(story, fname):
    candidates = []
    for root, dirs, files in os.walk(_root + '/stories/' + story):
        for f in files:
            if f == fname:
                return root + '/' + f
    print('Skipping: ', fname)


def read(fname):
    with open('./src/' + fname) as f:
        return f.read().strip()


def main():
    for f in os.listdir('./src'):
        print('Applying file: ' + f)
        apply_file(f)


if __name__ == '__main__':
    main()
