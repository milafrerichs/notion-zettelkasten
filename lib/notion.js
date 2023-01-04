const { Client } = require("@notionhq/client");
var { ZETTELKASTEN_DB, NOTES_DB, RESOURCES_DB, AREAS_DB } = require('./databases');

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_SECRET
})

const getNotes = async function(filter) {
  const databaseId = NOTES_DB;
  const queryParams = {
    database_id: databaseId,
  }
  if(filter) {
    queryParams["filter"] = filter;

  }
  const response = await notion.databases.query(queryParams);
  return response;
}
const getResources = async function() {
  const databaseId = RESOURCES_DB;
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  return response.results || [];
}
const getAreas = async function() {
  const databaseId = AREAS_DB;
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  return response.results || [];
}
const getRandomTitleNote = async function(filter = {}) {
  const { results: notes } = await getNotes(filter)
  const note = notes[~~(Math.random() * notes.length)]
  const { id: notes_id, properties: { Name, URL } } = note
  let title = Name.title[0].plain_text
  const response = await notion.blocks.children.list({
    block_id: notes_id,
  });
  return { title, id: notes_id, url: URL.url, notion_url: note.url, blocks: response.results }
}
const newZettel = async function(values) {
  const response = await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: ZETTELKASTEN_DB,
    },
    ...values
  })
  return response

}
module.exports = {
  getRandomTitleNote,
  getNotes,
  getResources,
  getAreas,
  newZettel,
}
