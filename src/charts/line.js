
import config from './config';
const colors = config.chartColors;

let lineColors = [colors.blue, colors.green, colors.orange];

export const lineOptions = {
  color: lineColors,
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100
    },
  ],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    },
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
      },
      name: '',
      nameGap: 40,
      nameLocation: 'middle',
      nameRotation: 90,
      nameTextStyle: {
        color: '#fff'
      },
    }
  ],
  series: []
}