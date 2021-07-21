export default (ratings: Array<number>) => {
  let total = 0
  for (const i of ratings) {
    total += i
  }

  const average: any = (total /= ratings.length).toFixed(1)
  const decimal = average - parseInt(average + '')

  let rating = 0
  if (decimal < 0.3 || decimal > 0.7) {
    rating = Math.round(average)
  } else {
    rating = parseInt(average) + 0.5
  }
  return rating
}
