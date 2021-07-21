import { Router } from 'express'
import Article from '../models/Article'
import { saveArticle, updateArticle } from '../validators/articles'
import validateReq from '../middlewares/validateReq'
import passport from 'passport'
import sendResponse from '../utils/sendResponse'
import pagination from '../utils/pagination'
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

    let articles = await Article.find()
    const pages: number = Math.round(articles.length / parseInt(amount))

    articles = articles.sort((a, b) => {
      return a.date - b.date
    })

    articles = pagination(parseInt(amount), articles, parseInt(page))

    return sendResponse(res, 200, { articles, pages })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.post('/',
  passport.authenticate('admin-token'),
  validateReq(saveArticle, 'body'),
  async (req, res) => {
    try {
      const newArticle = await Article.create({ ...req.body })

      if (!newArticle) {
        return sendResponse(res, 500, 'Error to save new article')
      }

      return sendResponse(res, 200, 'Article saved')
    } catch (err) {
      return sendResponse(res, 500, err.message || 'Server error')
    }
  }
)

router.put('/:id',
  passport.authenticate('admin-token'),
  validateReq(updateArticle, 'body'),
  async (req, res) => {
    try {
      const article = await Article.findByIdAndUpdate(req.params.id, { ...req.body })

      if (!article) {
        return sendResponse(res, 500, 'Error to modify article')
      }

      return sendResponse(res, 200, 'Article modified')
    } catch (err) {
      return sendResponse(res, 500, err.message || 'Server error')
    }
  }
)

router.delete('/:id', passport.authenticate('admin-token'), async (req, res) => {
  try {
    const deleteArticle = await Article.findByIdAndRemove(req.params.id)

    if (!deleteArticle) {
      return sendResponse(res, 500, 'Error to delete article')
    }

    return sendResponse(res, 200, 'Article deleted')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

export default router
