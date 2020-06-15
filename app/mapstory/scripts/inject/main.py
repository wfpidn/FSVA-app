import json
import sys
from collections import OrderedDict

def main():
    with open(sys.argv[1]) as f:
        src = [c.strip().replace('\n\n', '\n') for c in f.read().split('<p>--</p>')]
    with open(sys.argv[2]) as f:
        model = json.load(f, object_pairs_hook=OrderedDict)

    len_src = len(src)
    len_dst = len(model['sections'])
    if len_src != len_dst:
        raise Exception('Must be sync in length! src:{}, dst:{}'.format(len_src, len_dst))

    for i, m in enumerate(model['sections']):
        if i == len(model['sections']) - 1:
            # do not modify last content (pdf list)
            pass
        else:
            m['content'] = src[i]

    with open(sys.argv[2], 'w') as f:
        json.dump(model, f, indent=4)

if __name__ == '__main__':
    main()
