
import re
import json
import csv
from openpyxl import load_workbook

wb = load_workbook(filename='./fsva.xlsx')
sheet = wb.active

def build_dataset():
    records = []
    [indicators, years] = resolve_indicators_years()
    for r in sheet.rows[1:]:
        for e in indicators:
            value = r[e['colindex']].value or None
            records.append({
                'year': e['year'],
                'indicatorId': e['id'],
                'value': value,
                'province': r[0].value,
                'district': r[1].value,
                'subdistrict': r[2].value,
                'subdistrictId': r[3].value
                })
    json.dump(records, open('./dataset.json', 'w'), indent=4)


def build_indicators():
    values = build_indicators_data()

    reader = csv.reader(open('./indicators.csv'))
    records = []
    for i, row in enumerate(reader):
        if i == 0:
            # header
            continue
        id = row[0]
        rec = {
            'id': id,
            'label': row[1],
            'description': row[2],
            'range': resolve_range(id, values)
        }
        records.append(rec)
    json.dump(records, open('./indicators.json', 'w'), indent = 4)


def resolve_range(id, values):
    min = None
    max = None
    for e in values:
        if e['indicator'] != id or e['value'] is None:
            continue
        v = e['value']
        if min is None or min > v:
            min = v
        if max is None or max < v:
            max = v
    return {'min': min, 'max': max}


def resolve_indicators_years():
    indicators = []
    pattern = re.compile(r'^(\w+)_(\d+)$')
    # search header for indicators
    for i, c in enumerate(sheet.rows[0]):
        v = c.value
        if not v:
            continue
        m = re.match(pattern, v.strip())
        if m:
            indicator = m.group(1)
            year = int(m.group(2))
            if indicator.lower().endswith('_c'):
                continue
            indicators.append({
                'id': indicator,
                'year': year,
                'colindex': i
            })

    years = set()
    for indicator in indicators:
        years.add(indicator['year'])

    years = sorted(list(years))
    return [indicators, years]

build_dataset()
# build_areas()
# build_indicators has now deprecated because many custom added attributes already in indicators.json
# build_indicators()
# below has been triggered by build_indicators
# build_indicators_data()
