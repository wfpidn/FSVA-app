
import _ from 'lodash';

function buildOpts({indicator, rows, opts}) {
  let years = _.chain(rows).map('year').uniq().sort().value();

  let colorMap = _.get(indicator, 'range.colors', {});

  let values = years.map(y => {
    let row = _.find(rows, {year: y});
    let value = row ? Math.round(row.value*100)/100 : null;
    let color = row.value in colorMap ? colorMap[row.value] : undefined;
    return {
      y: value,
      name: String(y),
      color
    };
  });

  let categories = years.map(e => String(e));
  let colorByPoint = false;
  if (indicator.range && indicator.range.colors) {
    colorByPoint = true;
  }

  let range = resolveRange(indicator);

  let extended = _.merge({
    chart: {
      backgroundColor: 'transparent'
    },
    series: [{
      name: indicator.label,
      data: values,
      animation: {
        duration: 300
      }
    }],
    xAxis: {
      categories
    },
    yAxis: {
      title: {
        text: null
      },
      min: range.min,
      max: range.max,
      tickInterval: _.get(indicator,'range.step')
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true
        },
        colorByPoint
        // colors
      },
      line: {
        dataLabels: {
          enabled: true
        }
      }
    },
    title: {
      text: null
    }
  }, opts);
  return extended;
}

function resolveRange(indicator) {
  if (indicator.range && indicator.range.type === "local") {
    return {
      min: undefined,
      max: undefined
    };
  }
  return {
    min: _.get(indicator, 'range.min'),
    max: _.get(indicator, 'range.max')
  };
}

export default { buildOpts };
