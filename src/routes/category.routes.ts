import Category from '../models/Category'
import { Router } from 'express'
import passport from 'passport'
import sendResponse from '../utils/sendResponse'
const router = Router()

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find()
    if (!categories) {
      return sendResponse(res, 500, 'Error to find categories')
    }

    return sendResponse(res, 200, { categories })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.post('/', passport.authenticate('admin-token'), async (req, res) => {
  try {
    const { category } = req.body

    if (!category || category === '') {
      return sendResponse(res, 500, 'The category is invalid')
    }

    const verifyCategory = await Category.findOne({ category })

    if (verifyCategory) {
      return sendResponse(res, 400, 'The category exist')
    }

    const newCategory = await Category.create({ category })

    if (!newCategory) {
      return sendResponse(res, 500, 'Error to save category')
    }

    return sendResponse(res, 200, 'Category saved')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.delete('/:id', passport.authenticate('admin-token'), async (req, res) => {
  try {
    const deleteCategory = await Category.remove({ _id: req.params.id })

    if (!deleteCategory || deleteCategory.deletedCount === 0) {
      return sendResponse(res, 500, 'Error to delete category or doesn\'t exist')
    }

    return sendResponse(res, 200, 'Category deleted')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

export default router
