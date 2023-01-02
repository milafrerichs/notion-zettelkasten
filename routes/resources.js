var express = require('express');
var notion = require('../lib/notion');
var router = express.Router();

router.get('/:resourceId', async function(req, res, next) {
  const resource_id = req.params.resourceId
  const filter = { property: "Resources", relation: { contains: resource_id } }
  const note = await notion.getRandomTitleNote(filter)
  res.render('note', { note, resource_id });
});

module.exports = router;
