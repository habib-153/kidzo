const parseBody = async (req, res, next) => {
  if (!req.body.data) {
    res.status(400).send("Please provide data in the body under data key");
    return;
  }
  req.body = JSON.parse(req.body.data);
  next();
};

module.exports = {
  parseBody,
};