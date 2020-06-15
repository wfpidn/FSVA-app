
import json
import csv
from collections import OrderedDict
from pyquery import PyQuery as pq

root = json.load(open('./story-src.json'))
sections = []

for i, e in enumerate(root['values']['story']['sections']):
    sections.append(OrderedDict([
        ['id', i],
        ['level', 0],
        ['title', pq(e['title']).text()],
        ['url', 'about:blank'],
        ['content', e['content']]
    ]))

with open('story.json', 'w') as w:
    json.dump({'sections': sections}, w, indent=4)
