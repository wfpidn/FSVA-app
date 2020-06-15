
import json

with open('../../public/data/story.json') as f:
    story = json.load(f)


print(','.join([
    'id',
    'parent',
    'title',
    'indicator',
    'map-url'
]))

for sec in story['sections']:
    indicator = None
    url = None
    if 'params' in sec:
        params = sec['params']
        if 'indicator' in params:
            indicator = params['indicator']
        if 'layer' in params:
            url = params['layer']

    parent = ''
    if sec['parent'] != None:
        parent = str(sec['parent'])

    cols = [
        sec['id'],
        sec['parent'],
        sec['title'],
        indicator,
        url
    ]

    encoded = [str(e) if e != None else '' for e in cols]
    print(','.join(encoded))


