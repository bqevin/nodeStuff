var express = require('express');

router = express.Router();
router.get( '/', function (req, res) {
	res.send('this is photos folder');
});

module.exports = router;