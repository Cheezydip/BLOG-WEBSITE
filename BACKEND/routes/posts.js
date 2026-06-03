const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Post = require('../models/Post');

// multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: function (req, file, cb) {
    const unique = `${Date.now()}-${Math.round(Math.random()*1e9)}-${file.originalname}`
    cb(null, unique)
  }
})
const upload = multer({ storage })

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a post (supports file uploads)
router.post('/', upload.array('attachments', 8), async (req, res) => {
  try {
    const body = req.body || {}
    const attachments = (req.files || []).map((f) => ({
      filename: f.filename,
      url: `/uploads/${f.filename}`,
      mimetype: f.mimetype,
      size: f.size
    }))

    const data = {
      ...body,
      tags: body.tags ? (Array.isArray(body.tags) ? body.tags : body.tags.split(',').map(t => t.trim()).filter(Boolean)) : [],
      attachments
    }

    const post = new Post(data)
    const newPost = await post.save()
    res.status(201).json(newPost)
  } catch (err) {
    console.error('Create post error:', err)
    res.status(400).json({ message: err.message })
  }
});

// Get single post by slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
