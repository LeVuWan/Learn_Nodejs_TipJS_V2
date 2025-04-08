const acyncHandle = (fu) => {
    return (req, res, next) => {
        fu(req, res, next).catch((err) => {
            console.error("🔥 Error caught in acyncHandle:", err);
            next(err);
        });
    };
};


module.exports = {
    acyncHandle
}