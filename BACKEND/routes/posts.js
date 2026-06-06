const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Post = require('../models/Post');
const { verifyToken } = require('../middleware/authMiddleware');

// multer storage
const fs = require('fs');
const { uploadToImageKit } = require('../utils/imagekit');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadFields = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'attachments', maxCount: 8 }
]);

const handleUpload = async (file, folder = '/blog') => {
  if (!file) return null;
  try {
    const res = await uploadToImageKit(file.buffer, `${Date.now()}-${file.originalname}`, folder);
    return res.url;
  } catch (err) {
    console.warn('ImageKit upload failed or not configured, falling back to local storage:', err.message);
    const filename = `${Date.now()}-${Math.round(Math.random()*1e9)}-${file.originalname}`;
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const filePath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(filePath, file.buffer);
    return `/uploads/${filename}`;
  }
};

// GET /api/posts — public (all posts)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/posts/:slug — public (single post)
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/posts — protected (create post)
router.post('/', verifyToken, uploadFields, async (req, res) => {
  try {
    const body = req.body || {}
    
    // Process coverImage
    const coverFile = req.files?.coverImage?.[0];
    let imageUrl = body.image || '';
    if (coverFile) {
      const uploadedUrl = await handleUpload(coverFile, '/blog/covers');
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    // Process attachments
    const attachmentFiles = req.files?.attachments || [];
    const attachments = [];
    for (const f of attachmentFiles) {
      const uploadedUrl = await handleUpload(f, '/blog/attachments');
      if (uploadedUrl) {
        attachments.push({
          filename: f.originalname,
          url: uploadedUrl,
          mimetype: f.mimetype,
          size: f.size
        });
      }
    }

    const data = {
      ...body,
      image: imageUrl,
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

// PUT /api/posts/:slug — protected (update post)
router.put('/:slug', verifyToken, uploadFields, async (req, res) => {
  try {
    const body = req.body || {}

    const updates = {
      ...body,
      tags: body.tags ? (Array.isArray(body.tags) ? body.tags : body.tags.split(',').map(t => t.trim()).filter(Boolean)) : [],
    }

    // Process coverImage if a new file is uploaded
    const coverFile = req.files?.coverImage?.[0];
    if (coverFile) {
      const uploadedUrl = await handleUpload(coverFile, '/blog/covers');
      if (uploadedUrl) updates.image = uploadedUrl;
    } else if (body.image !== undefined) {
      updates.image = body.image;
    }

    // Process attachments if new ones are uploaded
    const attachmentFiles = req.files?.attachments || [];
    if (attachmentFiles.length > 0) {
      const newAttachments = [];
      for (const f of attachmentFiles) {
        const uploadedUrl = await handleUpload(f, '/blog/attachments');
        if (uploadedUrl) {
          newAttachments.push({
            filename: f.originalname,
            url: uploadedUrl,
            mimetype: f.mimetype,
            size: f.size
          });
        }
      }
      updates.attachments = newAttachments;
    }

    // Remove internal fields that shouldn't be overwritten
    delete updates._id
    delete updates.__v
    delete updates.createdAt

    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: updates },
      { returnDocument: 'after', runValidators: true }
    )

    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json(post)
  } catch (err) {
    console.error('Update post error:', err)
    res.status(400).json({ message: err.message })
  }
});

// DELETE /api/posts/:slug — protected (delete post)
router.delete('/:slug', verifyToken, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug })
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json({ message: 'Post deleted successfully', slug: req.params.slug })
  } catch (err) {
    console.error('Delete post error:', err)
    res.status(500).json({ message: err.message })
  }
});

// PATCH /api/posts/:slug/status — protected (toggle publish/draft)
router.patch('/:slug/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body
    if (!['published', 'draft'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use "published" or "draft".' })
    }

    const updates = { status }
    if (status === 'published') {
      updates.publishedAt = new Date()
    }

    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: updates },
      { returnDocument: 'after' }
    )

    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json(post)
  } catch (err) {
    console.error('Status update error:', err)
    res.status(500).json({ message: err.message })
  }
});

module.exports = router;
