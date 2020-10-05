
import config from './config';
const colors = config.chartColors;

let lineColors = [colors.blue, colors.green, colors.orange];

const candlestickOptions = {
  color: lineColors,
  dataZoom: [
    {
      type: 'slider',
      show: true,
      xAxisIndex: [0],
      start: '8/28/2020, 7:00:00 PM',
      end: '9/28/2020, 8:00:00 PM'
    }
  ],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    },
    position: function (pos, params, el, elRect, size) {
      var obj = {top: 10};
      obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
      return obj;
    }
  },
  legend: {
    data: [],
    textStyle: {
      color: colors.textColor
    }
  },
  grid: {
    top: 70,
    bottom: 50,
  },
  xAxis: [],
  yAxis: [
    {
      scale: true,
      type: 'value',
      axisLabel: {
        color: colors.textColor
      },
      axisLine: {
        lineStyle: {
          color: colors.textColor
        }
      },
      splitLine: {
        lineStyle: {
          color: colors.gridLineColor
        }
      },
      axisPointer: {
        label: {
          color: colors.dark
        }
      }
    }
  ],
  series: []
}

const defaultXAxis = {
  type: 'category',
  axisTick: {
    alignWithLabel: true
  },
  axisLine: {
    onZero: false,
    lineStyle: {
      color: colors.gray
    }
  },
  data: []
};

const defaultSeries = {
  name: '',
  type: 'line',
  xAxisIndex: 0,
  smooth: true,
  data: [],
  itemStyle: {
    color: colors.green,
    color0: colors.red,
    borderColor: null,
    borderColor0: null
  },
}

export {
  candlestickOptions,
  defaultXAxis,
  defaultSeries,
};