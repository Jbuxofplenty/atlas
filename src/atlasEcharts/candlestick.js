
import config from './config';
const colors = config.chartColors;

let lineColors = [colors.blue, colors.green, colors.orange];

const candlestickOptions = {
  color: lineColors,
  tooltip: {
    trigger: 'none',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {
    data: ['2015 Precipitation', '2016 Precipitation'],
    textStyle: {
      color: colors.textColor
    }
  },
  grid: {
    top: 70,
    bottom: 50,
  },
  xAxis: [
    {
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        onZero: false,
        lineStyle: {
          color: colors.textColor
        }
      },
      axisPointer: {
        label: {
          formatter: function (params) {
            return 'BTC-USD  ' + params.value
              + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
          }
        }
      },
      data: ["2020-1", "2020-2", "2020-3", "2020-4", "2020-5", "2020-6", "2020-7", "2020-8", "2020-9", "2020-10", "2020-11", "2020-12"]
    }
  ],
  dataZoom: [
      {
          type: 'inside',
          xAxisIndex: [0],
          start: 98,
          end: 100
      },
      {
          show: true,
          xAxisIndex: [0],
          type: 'slider',
          top: '85%',
          start: 98,
          end: 100
      }
  ],
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
  series: [
    {
      name: '2015 Precipitation',
      type: 'line',
      xAxisIndex: 0,
      smooth: true,
      data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
      itemStyle: {
        color: colors.green,
        color0: colors.red,
        borderColor: null,
        borderColor0: null
    },
    }
  ]
}
export default candlestickOptions;