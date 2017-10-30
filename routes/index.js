const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  res.render('hello', {
    title: "We love Food"
  })
});

module.exports = router;
