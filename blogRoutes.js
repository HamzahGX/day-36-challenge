const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Sample array for storing blog posts
const blogPosts = [];

// Create a new blog post
router.post('/create', (req, res) => {
  const { title, content } = req.body;
  
  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Simulate storing the blog post in a database
  const newBlogPost = { title, content };
  blogPosts.push(newBlogPost);

  res.status(201).json({ message: 'Blog post created successfully' });
});

// Retrieve all blog posts
router.get('/all', (req, res) => {
  res.status(200).json(blogPosts);
});

// Retrieve a specific blog post by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const post = blogPosts[id];

  if (!post) {
    return res.status(404).json({ message: 'Blog post not found' });
  }

  res.status(200).json(post);
});

// Update a blog post by ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!blogPosts[id]) {
    return res.status(404).json({ message: 'Blog post not found' });
  }

  // Update the blog post
  blogPosts[id] = { title, content };

  res.status(200).json({ message: 'Blog post updated successfully' });
});

// Delete a blog post by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  if (!blogPosts[id]) {
    return res.status(404).json({ message: 'Blog post not found' });
  }

  // Delete the blog post
  blogPosts.splice(id, 1);

  res.status(200).json({ message: 'Blog post deleted successfully' });
});

module.exports = router;
