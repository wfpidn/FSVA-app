
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
                'province': 'PAPUA',
                'district': r[1].value,
                'districtId': r[0].value
                })
    json.dump(records, open('./dataset.json', 'w'), indent=4)

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
