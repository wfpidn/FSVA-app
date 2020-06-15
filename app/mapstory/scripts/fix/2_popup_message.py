import re
import os
import json
from collections import OrderedDict

langs = ['id', 'en']
root = os.path.realpath(os.path.join(os.path.realpath(__file__), '../../..'))

paths = ['map-misc/_base', 'stunting/STUN']

messages = {
    'nation': {
        'en': 'District trends and profile data are not available for this indicator. Please select another indicator under <strong>Food Availability, Food Access or Food Utilization</strong> to view district trends and profile data.',
        'id': 'Data profil dan tren tiap kabupaten tidak tersedia untuk indicator ini. Pilih indicator lain di bawah Ketersediaan Pangan, Akses terhadap Pangan dan Pemanfaatan Pangan untuk melihat data profil dan tren tiap kabupaten.'
    },
    'province': {
        'en': 'Sub-district trends and profile data are not available for this indicator. Please select another indicator under <strong>Food Availability, Food Access or Food Utilization</strong> to view sub-district trends and profile data.',
        'id': 'Data profil dan tren tiap kecamatan tidak tersedia untuk indicator ini. Pilih indicator lain di bawah Ketersediaan Pangan, Akses terhadap Pangan dan Pemanfaatan Pangan untuk melihat data profil dan tren tiap kecamatan.'
    }
}

def main():
    with open( root + '/stories/stories.json') as f:
        stories = [e['id'] for e in json.load(f)['stories']]
        for [s, p, l] in [[s, p, l] for l in langs for p in paths for s in stories]:
            inject(s, p, l)

def inject(story, path, lang):
    fname = '{}/stories/{}/{}.{}.json'.format(root, story, path, lang)
    level = 'nation' if story == 'main' else 'province'
    message = messages[level][lang]
    with open(fname) as f:
        model = json.load(f, object_pairs_hook=OrderedDict)
    model['messages']['popup.click'] = message
    with open(fname, 'w') as f:
        json.dump(model, f, indent=4)


if __name__ == '__main__':
    main()
