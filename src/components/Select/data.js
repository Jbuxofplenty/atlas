export const chartTypes = [
  { value: 'candleStick', label: 'Candle Stick', color: '#00B8D9', yType: 'Price', chartType: 'candleStick', units: 'Price' },
  { value: 'line', label: 'Line', color: '#00B8D9', yType: 'Price', chartType: 'line', units: 'Price' },
  { value: 'riverVolume', label: 'River Volume', color: '#0052CC', yType: 'Price', chartType: 'river', units: 'Shares' },
  { value: 'horizontalBar', label: 'Horizontal Bar', color: '#0052CC', yType: 'Percent', chartType: 'horizontalBar', units: 'Percent' },
];

export const chartTypesMap = {
  'candleStick': 0,
  'line': 1,
  'river': 2,
  'horizontalBar': 3,
}

export const units = [
  { value: 'Price', label: 'Price', color: '#00B8D9', yType: 'Price' },
  { value: 'Percent', label: 'Percent', color: '#0052CC', yType: 'Percent' },
  { value: 'Shares', label: 'Volume', color: '#0052CC', yType: 'Price' },
  { value: 'Shares', label: 'Summed Volume', color: '#0052CC', yType: 'Price' },
  { value: 'Price', label: 'Difference in Price', color: '#00B8D9', yType: 'Price' },
  { value: 'Percent', label: 'Percent Change', color: '#00B8D9', yType: 'Percent' },
];

export const unitsMap = {
  'Price': 0,
  'Percent': 5,
  'Shares': 2,
}

export const chartUnitsMap = {
  'candleStick': [units[0], units[1]],
  'line': [units[0], units[2], units[5]],
  'river': [units[1], units[2]],
  'horizontalBar': [units[4], units[5], units[3]],
}

export const calculatorTypes = [
  { value: 'compoundInterestCalculator', label: 'Compound Interest Calculator' },
  { value: 'loanInterestCalculator', label: 'Loan Interest Calculator' },
];

export const calculatorTypesMap = {
  'Compound Interest Calculator': 0,
  'Loan Interest Calculator': 1,
}