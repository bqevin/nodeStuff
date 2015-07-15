var express = require('express');

router = express.Router();
router.get( '/', function (req, res) {
	res.send('this is blog folder');
});

module.exports = router;