const express = require('express');
const router = express.Router();

const program = require('../../controllers/search');

router.post('/search', program.search);

module.exports = router;