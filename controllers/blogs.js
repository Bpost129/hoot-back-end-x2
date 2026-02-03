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

async function update(req, res) {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.blogId,
      req.body,
      { new: true }
    ).populate('author')
    res.status(200).json(blog)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function deleteBlog(req, res) {
  try {
    const blog = await Blog.findById(req.params.blogId)
    if (blog.author.equals(req.user.profile)) {
      await Blog.findByIdAndDelete(req.params.blogId)
      const profile = await Profile.findById(req.user.profile)
      profile.blogs.remove({ _id: req.params.blogId })
      await profile.save()
      res.status(200).json(blog)
    } else {
      res.status(500).json({error: 'Not Authorized'})
    }
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function createComment(req, res) {
  try {
    req.body.author = req.user.profile
    const blog = await Blog.findById(req.params.blogId)
    blog.comments.push(req.body)
    await blog.save()
    //find the new comment
    const newComment = blog.comments.at(-1)
    //temporarily append profile object to new comment.author
    const profile = await Profile.findById(req.user.profile)
    newComment.author = profile
    //respond with new comment
    res.status(201).json(newComment)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function deleteComment(req, res) {
  try {
    const blog = await Blog.findById(req.params.blogId)
    const comment = blog.comments.id(req.params.commentId)
    if (comment.author.equals(req.user.profile)) {
      blog.comments.remove({ _id: req.params.commentId })
      await blog.save()
      res.status(200).json(blog)
    } else {
      res.status(500).json({error: 'Not Authorized'})
    }
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function updateComment(req, res) {
  try {
    const blog = await Blog.findById(req.params.blogId)
    const comment = blog.comments.id(req.body._id)
    comment.text = req.body.text
    await blog.save()
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
  update,
  deleteBlog as delete,
  createComment,
  deleteComment,
  updateComment,

}