import sys
import os
import re
import json
from collections import OrderedDict

langs = ['en', 'id']

def main():
    for f in os.listdir('.'):
        m = re.match(r'(\w+)?\.title.html', f)
        if m:
            area = m.group(1)
            with open(f) as fi:
                lines = fi.read().strip().split('\n')
            nline = len(lines)
            nlang = len(langs)
            titles = {
                lang: [l for i,l in enumerate(lines) if i % nlang == j ]
                for j, lang in enumerate(langs)
            }
            for lang in langs:
                target = '../../stories/{}/story.{}.json'.format(area, lang)
                mod(target, titles[lang])


def mod(fname, titles):
    with open(fname) as f:
        model = json.load(f, object_pairs_hook=OrderedDict)

    sections = model['sections']
    if len(sections) != len(titles):
        raise Exception('Section length not match!')

    for i, s in enumerate(sections):
        s['title'] = titles[i]

    # print(sections)
    with open(fname, 'w') as f:
        json.dump(model, f, indent=4)




if __name__ == '__main__':
    main()
