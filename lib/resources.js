var notion = require('../lib/notion');

const getResources = async function() {
  const notion_resources  = await notion.getResources();
  return notion_resources.map((r) => { return { type: "resource", id: r.id, title: r.properties.Name.title[0].plain_text }})
}

module.exports = {
  getResources
}
