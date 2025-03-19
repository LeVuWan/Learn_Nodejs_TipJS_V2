const StatusCode = {
    CREATED: 201,
    OK: 200
}

const ReasonStatusCode = {
    CREATED: "Created!",
    OK: "Success"
}

class SuccessRespone {
    constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {} }) {
        this.message = !message ? reasonStatusCode : message
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessRespone {
    constructor({ message, metadata }) {
        super({ message, metadata })
    }
}

class CREATED extends SuccessRespone {
    constructor({ message, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata }) {
        super({ message, statusCode, metadata })
    }
}

module.exports = {
    OK,
    CREATED,
    SuccessRespone
}