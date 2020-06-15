import re
import os
import json
import urllib.parse
from jinja2 import Template
from collections import OrderedDict

langs = ['id', 'en']
root = os.path.realpath(os.path.join(os.path.realpath(__file__), '../../..'))

message = """
    <p>{{title1}}</p>
    <ul>
    {% for row in pdf.full %}
    <li>
      <a target='_blank' href='/public/attachments/{{ row[0] }}'>
        <span class='icon-pdf'></span>
        {{ row[1] }}
      </a>
    </li>
    {% endfor %}
    {% if pdf.adv %}
    </ul>
    <p>{{title2}}</p>
    <ul>
    {% for row in pdf.adv %}
    <li>
      <a target='_blank' href='/public/attachments/{{ row[0] }}'>
        <span class='icon-pdf'></span>
        <span>{{ row[1] }}</span>
      </a>
    </li>
    {% endfor %}
    </ul>
    {% endif %}
    """

titles = {
    'id': ['Laporan lengkap FSVA {} dapat di download melalui link berikut:',
           'Versi Advokasi singkat:'],
    'en': ['The full version of the {} FSVA report is available for download via the links below',
           'Brief Advocacy version:']
}

stories = ['jatim', 'ntb', 'ntt', 'papua'] # exclude main

with open(root + '/stories/stories.json') as f:
    storyLabels = { e['id']: e['label'] for e in json.load(f)['stories'] }

pdfs = {
    e: {
        'full': [
            ['fsva_full_{}_id.pdf'.format(e), 'Bahasa Indonesia']
        ]
    }
    for e in stories
}


def main():
    with open(root + '/scripts/pdf/list.txt') as f:
        lines = f.read().strip().split('\n')
        for l in lines:
            m = re.match(r'adv/(\w+)/.*', l)
            story = m.group(1)
            pdf = pdfs[story]
            if 'adv' not in pdf:
                pdf['adv'] = []
            name = os.path.basename(l)
            url = urllib.parse.quote(l)
            pdf['adv'].append([url, name])

    for [s, l] in [[s, l] for s in stories for l in langs]:
        inject(s, l)


def inject(story, lang):
    fname = '{}/stories/{}/story.{}.json'.format(root, story, lang)
    title1 = titles[lang][0].format(storyLabels[story])
    title2 = titles[lang][1]
    content = Template(message).render(
        pdf=pdfs[story],
        title1=title1,
        title2=title2,
    )

    with open(fname) as f:
        model = json.load(f, object_pairs_hook=OrderedDict)
    # check last page
    sec = model['sections'][-1]
    if sec['url'] != '/pages/static/pdf/index.html':
        raise Exception('Not a PDF Page')
    sec['content'] = content

    with open(fname, 'w') as f:
        json.dump(model, f, indent=4)


if __name__ == '__main__':
    main()
