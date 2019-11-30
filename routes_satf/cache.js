const requestStore = {};
const keepFor = 720000; // 2 hours

module.exports = function requestCache(req, res, next) {
  const key = req.url;
  if (requestStore[key]) {
    res.send(requestStore[key]);
  } else {
    res.sendResponse = res.send;
    res.send = (body) => {
      requestStore[key] = body;
      setTimeout(() => {
        delete requestStore[key];
      }, keepFor);
      res.sendResponse(body);
    };
    next();
  }
};
