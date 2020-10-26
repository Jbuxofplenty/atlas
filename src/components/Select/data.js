export const chartTypes = [
  { value: 'CandleStickPrice', label: 'Candle Stick (Price)', color: '#00B8D9', yType: 'Price', chartType: 'candleStick' },
  { value: 'CandleStickPercent', label: 'Candle Stick (Percentage)', color: '#0052CC', yType: 'Percent', chartType: 'candleStick' },
  { value: 'riverVolume', label: 'River Volume (Shares)', color: '#0052CC', yType: 'Price', chartType: 'river' },
  { value: 'riverVolumePercent', label: 'River Volume (Percentage)', color: '#0052CC', yType: 'Percent', chartType: 'river' },
];

export const chartTypesMap = {
  'Candle Stick (Price)': 0,
  'Candle Stick (Percentage)': 1,
  'River Volume (Shares)': 2,
  'River Volume (Percentage)': 3,
}
export const calculatorTypes = [
  { value: 'compoundInterestCalculator', label: 'Compound Interest Calculator' },
  { value: 'loanInterestCalculator', label: 'Loan Interest Calculator' },
];

export const calculatorTypesMap = {
  'Compound Interest Calculator': 0,
  'Loan Interest Calculator': 1,
}