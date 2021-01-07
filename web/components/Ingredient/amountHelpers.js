export function convertCups(value, cupInGrams, cup, standard) {
  if (cup === 'Weight') {
    if (standard === 'Metric') {
      return {
        unitTitle: 'Grams',
        unitTitlePlural: '',
        value: value * cupInGrams,
      }
    }

    if (standard === 'Imperial') {
      return {
        unitTitle: 'Oz',
        unitTitlePlural: '',
        value: parseInt((cupInGrams * value) / 28.35), // grams to oz
      }
    }
  }

  if (cup === 'Volume') {
    if (standard === 'Metric') {
      return {
        unitTitle: 'mL',
        unitTitlePlural: '',
        value: parseInt((value * 250).toFixed()), // 250mL per cup
      }
    }

    if (standard === 'Imperial') {
      return {
        unitTitle: 'Fl Oz',
        unitTitlePlural: '',
        value: parseInt((value * 8.32674).toFixed()), // fluid oz per cup
      }
    }
  }

  return {}
}
