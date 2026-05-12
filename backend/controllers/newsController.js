const db = require('../config/db');

const defaults = require('../config/defaults');

exports.getAllNews = async (req, res) => {
  try {
    const news = await db.query('SELECT * FROM news ORDER BY createdAt DESC, id DESC');
    res.json(news && news.length > 0 ? news : defaults.news);
  } catch (err) {
    console.error('Database error fetching news, using defaults:', err.message);
    res.json(defaults.news);
  }
};

exports.addNews = async (req, res) => {
  try {
    const { date, title, url } = req.body;
    if (!date || !title || !url) return res.status(400).json({ error: 'Missing fields' });

    const result = await db.query(
      'INSERT INTO news (date, title, url) VALUES (?, ?, ?)',
      [date, title, url]
    );

    res.status(201).json({ id: result.insertId, date, title, url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM news WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Deleted successfully' });
    } else {
      res.status(404).json({ error: 'News not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
