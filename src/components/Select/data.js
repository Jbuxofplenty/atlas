export const chartTypes = [
  { value: 'CandleStickPrice', label: 'Candle Stick (Price)', color: '#00B8D9', yType: 'Price' },
  { value: 'CandleStickPercent', label: 'Candle Stick (Percentage)', color: '#0052CC', yType: 'Percent' },
];

export const chartTypesMap = {
  'Candle Stick (Price)': 0,
  'Candle Stick (Percentage)': 1,
}
export const calculatorTypes = [
  { value: 'compoundInterestCalculator', label: 'Compound Interest Calculator' },
  { value: 'loanInterestCalculator', label: 'Loan Interest Calculator' },
];

export const calculatorTypesMap = {
  'Compound Interest Calculator': 0,
  'Loan Interest Calculator': 1,
}