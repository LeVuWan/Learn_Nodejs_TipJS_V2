const acyncHandle = fu => {
    return (req, res, next) => {
        fu(req, res, next).catch(next)
    }
}

module.exports = {
    acyncHandle
}