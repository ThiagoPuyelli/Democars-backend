import { Router } from 'express'
import sendResponse from '../utils/sendResponse'
import Product from '../models/Product'
import { saveProductJoi, updateProductJoi } from '../validators/products'
import validateReq from '../middlewares/validateReq'
import pagination from '../utils/pagination'
import passport from 'passport'
import verifyCategories from '../utils/verifyCategories'

const router = Router()

router.get('/:amount/:page?', async (req, res) => {
  try {
    let { page, amount } = req.params
    if (!page) {
      page = '1'
    }

    if (!parseInt(amount)) {
      return sendResponse(res, 500, 'The amount is invalid')
    }

    let products = await Product.find()
    const pages: number = Math.round(products.length / parseInt(amount))
    products = products.sort((a, b) => {
      return a.date - b.date
    })
    products = pagination(parseInt(amount), products, parseInt(page))

    return sendResponse(res, 200, { products, pages })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server Error')
  }
})

router.get('/id/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return sendResponse(res, 404, 'Doesn\'t find product')
    }
    return sendResponse(res, 200, { product })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server Error')
  }
})

router.get('/categories/:categories', async (req, res) => {
  try {
    const { categories } = req.params

    if (!categories || categories === '') {
      return sendResponse(res, 404, 'The categories is failed')
    }

    const categoriesFind = categories.split('-')

    const totalProducts = await Product.find()

    const products = []

    totalProducts.forEach((product, i) => {
      let reference: boolean = false
      for (const category of categoriesFind) {
        const indexProduct = product.categories.indexOf(category)
        if (indexProduct > -1 && reference === false) {
          products.push(product)
          reference = true
        }
      }
    })

    if (products.length <= 0) {
      return sendResponse(res, 404, 'Dont find products with your categories')
    }

    return sendResponse(res, 200, { products })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.get('/search/:title', async (req, res) => {
  try {
    let { title } = req.params

    if (!title || title === '') {
      return sendResponse(res, 404, 'The search is invalid')
    }

    title = title.toLowerCase()
    const options = title.split(' ')

    const products = await Product.find()

    const productsFind = []

    for (const i of products) {
      const lowerCase = i.title.toLowerCase()
      const titlesSplit = lowerCase.split(' ')
      const titleExist = titlesSplit.indexOf(title)

      if (titleExist >= 0) {
        productsFind.push(i)
      } else {
        if (options.length > 1) {
          for (const option of options) {
            if (titlesSplit.indexOf(option) >= 0) {
              productsFind.push(i)
            }
          }
        }
      }
    }

    if (productsFind.length === 0) {
      return sendResponse(res, 404, 'Doesn\'t find products')
    }

    return sendResponse(res, 200, { products: productsFind })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.post('/', passport.authenticate('admin-token'), validateReq(saveProductJoi, 'body'), async (req, res) => {
  try {
    let categories = req.body.categories
    const realCategories = await verifyCategories(categories)
    if (!realCategories) {
      return sendResponse(res, 400, 'The categories is undefined')
    }
    categories = realCategories

    const { stock, price } = req.body
    const cost: number = price - (15 * price / 100)
    if (stock) {
      req.body.stock = parseInt(stock)
    }
    const product = new Product({ ...req.body, cost, categories })

    const newProduct = await product.save()

    if (!newProduct) {
      return sendResponse(res, 500, 'Error to save product')
    }

    return sendResponse(res, 200, 'Product saved')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.put('/:id', passport.authenticate('admin-token'), validateReq(updateProductJoi, 'body'), async (req, res) => {
  try {
    if (req.body.categories) {
      const categories = req.body.categories
      const realCategories = await verifyCategories(categories)
      if (!realCategories) {
        return sendResponse(res, 400, 'The categories is undefined')
      }
    }

    const newProduct = await Product.findByIdAndUpdate(req.params.id, { ...req.body })

    if (!newProduct) {
      return sendResponse(res, 500, 'Error to update new product')
    }

    return sendResponse(res, 500, 'Product modified')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.delete('/:id', passport.authenticate('admin-token'), async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id)

    if (!product) {
      return sendResponse(res, 500, 'Error to delete product or doesn\'t exist')
    }

    return sendResponse(res, 200, 'Product deleted')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

export default router
