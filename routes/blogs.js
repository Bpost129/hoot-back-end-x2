import { Router } from "express"
import * as blogsCtrl from '../controllers/blogs.js'
import { decodeUserFromToken, checkAuth } from "../middleware/auth.js"

const router = Router()

// Unprotected Routes

// Protected Routes
router.use(decodeUserFromToken)
router.get('/', checkAuth, blogsCtrl.index)
router.get('/:blogId', checkAuth, blogsCtrl.show)
router.put('/:blogId', checkAuth, blogsCtrl.update)
router.put('/:blogId/comments/:commentId', checkAuth, blogsCtrl.updateComment)
router.post('/', checkAuth, blogsCtrl.create)
router.post('/:blogId/comments', checkAuth, blogsCtrl.createComment)
router.delete('/:blogId', checkAuth, blogsCtrl.delete)
router.delete('/:blogId/comments/:commentId', checkAuth, blogsCtrl.deleteComment)


export { 
  router
}