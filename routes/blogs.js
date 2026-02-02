import { Router } from "express"
import * as blogsCtrl from '../controllers/blogs.js'
import { decodeUserFromToken, checkAuth } from "../middleware/auth.js"

const router = Router()



router.use(decodeUserFromToken)

export { 
  router
}