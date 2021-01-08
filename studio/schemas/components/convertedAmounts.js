import { units } from './amountSettings'

const convert = require('convert-units')

/**
 * Take base amount and return conversions
 * @param {float} value Amount to base conversions from
 * @param {string} unit Unit to base conversions from
 * @param {string} standard Standard to base conversions from
 */
export default function convertedAmounts(value, unit) {
  // Cups
  // Cups are a bit different to all others because we always provide a volume
  if (unit === 'cup') {
    return [
      {
        value,
        unit: 'cup',
      },
      {
        value: parseInt((value * 250).toFixed()),
        unit: 'ml',
      },
      {
        value: parseInt((value * 8.32674).toFixed()),
        unit: 'fl-oz',
      },
    ]
  }

  // Setup array
  const amounts = []

  // Find out what conversions need to happen
  const doNotConvert = ['Traditional', 'Fuzzy']
  const thisUnit = units[unit]
  const conversionMatches = []
  if (thisUnit) {
    Object.keys(units).forEach((key) => {
      if (
        !doNotConvert.includes(units[key].standard) &&
        units[key].standard !== thisUnit.standard &&
        units[key].type === thisUnit.type
      ) {
        conversionMatches.push({ unit: key, ...units[key] })
      }
    })
  }

  amounts.push({
    value,
    unit,
  })

  conversionMatches.forEach((match) => {
    amounts.push({
      value: parseFloat(convert(value).from(unit).to(match.unit).toFixed(2)),
      unit: match.unit,
    })
  })

  // 'Fuzzy' standard has no conversions
  return amounts
}
