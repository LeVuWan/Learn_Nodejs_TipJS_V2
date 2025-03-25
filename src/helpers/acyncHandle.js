const acyncHandle = (fu) => {
    return (req, res, next) => {
        console.log("Check request:", req.method, req.url); // Log request
        fu(req, res, next).catch((err) => {
            console.error("🔥 Error caught in acyncHandle:", err); // Hiển thị lỗi
            next(err); // Chuyển lỗi đến middleware xử lý lỗi
        });
    };
};


module.exports = {
    acyncHandle
}