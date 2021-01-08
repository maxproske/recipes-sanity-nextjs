export function convertCups(value, cupInGrams, cup, standard) {
  if (cup === 'Weight') {
    return {
      value:
        standard === 'Metric'
          ? value * cupInGrams
          : parseInt((cupInGrams * value) / 28.35), // grams to oz
    }
  }

  if (cup === 'Volume') {
    return {
      value:
        standard === 'Metric'
          ? parseInt((value * 250).toFixed()) // 250ml per cup
          : parseInt((value * 8.32674).toFixed()), // fluid oz per cup
    }
  }

  return {}
}

export function valueFraction(value) {
  let withFraction

  const valueString = value.toFixed(2)
  const amountEnd = valueString.split('.').pop()

  switch (amountEnd) {
    case '25':
      withFraction = valueString.replace('.25', `¼`)
      break
    case '33':
      withFraction = valueString.replace('.33', `⅓`)
      break
    case '50':
      withFraction = valueString.replace('.50', `½`)
      break
    case '66':
      withFraction = valueString.replace('.66', `⅔`)
      break
    case '75':
      withFraction = valueString.replace('.75', `¾`)
      break
    default:
      break
  }

  // Get rid of any leading zero
  if (withFraction[0] === '0') {
    withFraction = withFraction.slice(1)
  }

  return withFraction
}

/**
 * Return one 'amount' object from an array of 'amount' objects
 * If one meets the key:value pairs in filters
 *
 * @param {array} arr Array of 'amount' objects
 * @param {object} filters Key:Value pairs to compare against each object in the array
 */
export function filterAmounts(arr = [], filters = {}) {
  // For every `object` in `arr`
  const filtered = arr.filter((item) => {
    // Check every key in `filters`
    const keyCheck = Object.keys(filters).filter(
      (key) => item[key] === filters[key]
    )

    // Only return true if as many filter keys returned true as we passed on
    return keyCheck.length === Object.keys(filters).length
  })

  // console.log(arr, filters, filtered[0])

  return filtered.length ? filtered[0] : {}
}
