var express = require('express');
var notion = require('../lib/notion');
var { resources } = require('../middlewares');
var router = express.Router();

router.get('/', resources, async function(req, res, next) {
  const areas = await notion.getAreas();
  const { results: notes } = await notion.getNotes()
  const { properties: { Name } } = notes[0]
  let title = Name.title[0].plain_text
  res.render('index', { title, resources: req.resources });
});

router.post('/add-note', async function(req, res, next) {
  const resource = req.body.resource;
  const content = req.body.content;
  const note_id = req.body.note;
  const values = {
    properties: {
      Name: {
        title: [
          {
            text: {
              content: content
            }
          }
        ]
      },
      Resources: {
        relation: [ { id: resource }]
      },
      Type: {
        select: {
          name: "Fleeting Notes"
        }
      }
    },
    children: [
      {
        "object": "block",
        "paragraph": {
          "rich_text": [
            {
              "text": { "content": content }
            }
          ]
        }
      },
      {
        "object": "block",
        "link_to_page": {
          "type": "page_id",
          "page_id": note_id
        }
      }
    ]
  }
  const response = await notion.newZettel(values)
  res.redirect("/");
  res.end();
});

module.exports = router;
