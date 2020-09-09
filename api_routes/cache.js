/*
    This script saves the outgoing request from webserver for two hours.
    If the same url is requested, it serves the saved request.
*/

const requestStore = {};
const keepFor = 7200000; // 2 hours

module.exports = function requestCache(req, res, next) {
    const key = req.url;

    // If key exists, send old reply. Does not refresh cache.
    if (requestStore[key]) {
        res.send(requestStore[key]);

    // Save the response in the keystore and go to the next function in the chain.
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
