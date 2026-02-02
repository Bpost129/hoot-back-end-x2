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
router.post('/', checkAuth, blogsCtrl.create)
router.delete('/:blogId', checkAuth, blogsCtrl.delete)


export { 
  router
}