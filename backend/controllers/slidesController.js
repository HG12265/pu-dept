const db = require('../config/db');
const path = require('path');
const fs = require('fs');

const defaults = require('../config/defaults');

exports.getAllSlides = async (req, res) => {
  try {
    const slides = await db.query('SELECT * FROM slides ORDER BY orderIndex ASC');
    res.json(slides && slides.length > 0 ? slides : defaults.slides);
  } catch (err) {
    console.error('Database error fetching slides, using defaults:', err.message);
    res.json(defaults.slides);
  }
};

exports.addSlide = async (req, res) => {
  try {
    const { alt } = req.body;
    let type = req.body.type;
    let src = req.body.src;

    if (req.file) {
      src = '/uploads/slides/' + req.file.filename;
      type = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    }

    if (!src || !type || !alt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [maxOrderRow] = await db.pool.query('SELECT MAX(orderIndex) as maxOrder FROM slides');
    const nextOrder = (maxOrderRow[0].maxOrder || 0) + 1;

    const result = await db.query(
      'INSERT INTO slides (type, src, alt, orderIndex) VALUES (?, ?, ?, ?)',
      [type, src, alt, nextOrder]
    );

    res.status(201).json({ id: result.insertId, type, src, alt, orderIndex: nextOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.reorderSlides = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'Invalid data' });

    for (let index = 0; index < orderedIds.length; index++) {
      await db.query('UPDATE slides SET orderIndex = ? WHERE id = ?', [index, orderedIds[index]]);
    }

    res.json({ message: 'Reordered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const slides = await db.query('SELECT src FROM slides WHERE id = ?', [id]);
    const slide = slides[0];

    const result = await db.query('DELETE FROM slides WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      if (slide && slide.src && slide.src.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', slide.src);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      res.json({ message: 'Deleted successfully' });
    } else {
      res.status(404).json({ error: 'Slide not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
