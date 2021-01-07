import { getUnitDetails } from './amountSettings'

const convert = require('convert-units')

/**
 * Take base amount and return conversions
 * @param {float} value Amount to base conversions from
 * @param {string} unit Unit to base conversions from
 * @param {string} standard Standard to base conversions from
 */
export default function convertedAmounts(value, unit, standard) {
  const amounts = []

  // Cups
  // Cups are a bit different to all others because we always provide a volume
  if (unit === 'cup' && standard === 'Traditional') {
    return [
      {
        standard: 'Traditional',
        value,
        unit: 'cup',
        ...getUnitDetails('Traditional', 'cup'),
      },
      {
        standard: 'Metric',
        value: parseInt((value * 250).toFixed()),
        unit: 'ml',
        ...getUnitDetails('Metric', 'ml'),
      },
      {
        standard: 'Imperial',
        value: parseInt((value * 8.32674).toFixed()),
        unit: 'fl-oz',
        ...getUnitDetails('Imperial', 'fl-oz'),
      },
    ]
  }

  // Metric/imperial conversions
  if (standard === 'Metric') {
    amounts.push({
      standard: 'Metric',
      value,
      unit,
      ...getUnitDetails(standard, unit),
    })

    if (unit === 'ml') {
      amounts.push({
        standard: 'Imperial',
        value: parseFloat(convert(value).from(unit).to('fl-oz').toFixed(2)),
        unit: 'fl-oz',
        ...getUnitDetails('Imperial', 'fl-oz'),
      })
    } else if (unit === 'g') {
      amounts.push({
        standard: 'Imperial',
        value: parseFloat(convert(value).from(unit).to('oz').toFixed(2)),
        unit: 'oz',
        ...getUnitDetails('Imperial', 'oz'),
      })
    }
  } else if (standard === 'Imperial') {
    amounts.push({
      standard: 'Imperial',
      value,
      unit,
      ...getUnitDetails(standard, unit),
    })

    if (unit === 'fl-oz') {
      amounts.push({
        standard: 'Metric',
        value: parseFloat(convert(value).from(unit).to('ml').toFixed(2)),
        unit: 'ml',
        ...getUnitDetails('Metric', 'ml'),
      })
    } else if (unit === 'oz') {
      amounts.push({
        standard: 'Metric',
        value: parseFloat(convert(value).from(unit).to('g').toFixed()),
        unit: 'g',
        ...getUnitDetails('Metric', 'g'),
      })
    }
  }

  // 'Fuzzy' standard has no conversions
  return amounts
}
