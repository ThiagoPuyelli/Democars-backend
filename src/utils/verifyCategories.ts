import Category from '../models/Category'

export default async (categories: string|string[]) => {
  const trueCategories: any = await Category.find()
  if (typeof categories === 'string') categories = categories.split('-')

  let contador = 0
  for (const i of categories) {
    if (trueCategories.find(category => category.category === i)) {
      contador++
    }
  }
  if (contador < categories.length) {
    return false
  } else {
    return categories
  }
}
