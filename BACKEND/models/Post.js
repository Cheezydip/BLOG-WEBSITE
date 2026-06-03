const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: String,
  category: String,
  category_color: String,
  tags: [String],
  attachments: [
    {
      filename: String,
      url: String,
      mimetype: String,
      size: Number
    }
  ],
  content: { type: String, required: true },
  image: String,
  author: { type: String, default: 'Anonymous' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  publishedAt: Date,
  readingTime: String,
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
