const express = require('express');
const multer = require('multer');
const taskController = require('../controllers/controller');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/tasks', taskController.createTask);
router.get('/tasks', taskController.getTasks);
router.get('/tasks/export', taskController.exportTasks);
router.post('/tasks/import', upload.single('file'), taskController.importTasks);

module.exports = router;
