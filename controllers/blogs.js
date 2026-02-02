import { Profile } from "../models/profile.js"
import { Blog } from "../models/blog.js"

async function create(req, res) {
  try {
    req.body.author = req.user.profile
    const blog = await Blog.create(req.body)
    const profile = await Profile.findByIdAndUpdate(
      req.user.profile,
      { $push: { blogs: blog } },
      { new: true }
    )
    blog.author = profile
    res.status(201).json(blog)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function index(req, res) {
  try {
    const blogs = await Blog.find({})
      .populate('author')
      .sort({ createdAt: 'desc' })
    res.status(200).json(blogs)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function show(req, res) {
  try {
    const blog = await Blog.findById(req.params.blogId)
      .populate(['author', 'comments.author'])
    res.status(200).json(blog)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

export {
  create,
  index,
  show,

}