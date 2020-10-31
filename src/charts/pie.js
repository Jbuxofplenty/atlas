export const accountsPieOptions = {
  legend: {
    orient: 'vertical',
    left: 10,
    textStyle: {
      color: 'white'
    },
    data: []
  },
  series: [
    {
      type: 'pie',
      selectedMode: 'single',
      radius: [0, '30%'],

      label: {
          position: 'inner'
      },
      labelLine: {
          show: false
      },
      data: []
    },
    {
      type: 'pie',
      radius: ['40%', '55%'],
      label: {
        // eslint-disable-next-line
        formatter: '{{b|{b}：}${c}  {per|{d}%}  ',
        backgroundColor: '#333',
        borderColor: '#aaa',
        borderWidth: 1,
        borderRadius: 4,
        rich: {
          hr: {
            borderColor: '#aaa',
            width: '100%',
            borderWidth: 0.5,
            height: 0
          },
          b: {
            fontSize: 16,
            lineHeight: 33
          },
          per: {
            color: '#eee',
            backgroundColor: '#334455',
            padding: [2, 4],
            borderRadius: 2
          }
        }
      },
      data: []
  }
]
};