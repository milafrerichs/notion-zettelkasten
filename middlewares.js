const { getResources } = require('./lib/resources');

const resources = async function(req, res, next) {
  try {
    const r = await getResources();
    req.resources = r;
    next();
  } catch (error) {
    return next(err);
  }
}

module.exports = {
  resources
}
