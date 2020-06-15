import re
import os
import json
from collections import OrderedDict

langs = ['id', 'en']
root = os.path.realpath(os.path.join(os.path.realpath(__file__), '../../..'))

def main():
    with open( root + '/stories/stories.json') as f:
        stories = [e['id'] for e in json.load(f)['stories']]
        for s in stories:
            inject_parent(s)
            cdir = root + '/stories/{}/map/'.format(s)
            for f in os.listdir(cdir):
                m = re.match(r'[A-Z]+\.(en|id).json', f)
                if (m):
                    inject_child(cdir + '/' + f)

def inject_parent(story):
    #FIXME: hardcoded
    suffix = 'nation' if story == 'main' else 'district'

    cdir = root + '/stories/{}/map'.format(story)
    for lang in langs:
        fname = cdir + '/_base.' + lang + '.json'
        with open(fname) as f:
            model = json.load(f, object_pairs_hook=OrderedDict)
            model['indicator'] = {
                'path': '/stories/shared/indicator.{}.json'.format(suffix)
            }
        with open(fname, 'w') as f:
            json.dump(model, f, indent=4)

def inject_child(fname):
    with open(fname) as f:
        model = json.load(f, object_pairs_hook=OrderedDict)
    if 'path' in model['indicator']:
        model['indicator'].pop('path')
    with open(fname, 'w') as f:
        json.dump(model, f, indent=4)

if __name__ == '__main__':
    main()

# stories = '
