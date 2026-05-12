const express = require('express');
const router = express.Router();
const slidesController = require('../controllers/slidesController');
const upload = require('../middleware/upload');

router.get('/', slidesController.getAllSlides);
router.post('/', upload.single('file'), slidesController.addSlide);
router.put('/reorder', slidesController.reorderSlides);
router.delete('/:id', slidesController.deleteSlide);

module.exports = router;
