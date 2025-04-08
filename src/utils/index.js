const _ = require("lodash");
const { Types } = require("mongoose");

const getInfoData = ({ fileds = [], object = {} }) => {
    return _.pick(object, fileds)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]));
};

const unGetSelectData = (select = []) => {
    if (typeof select === "string") {
        select = select.split(",");
    }

    return Object.fromEntries(select.map(el => [el, 0]));
}

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(k => {
        if (obj[k] == null || obj[k] == undefined) {
            delete obj[k]
        }
    })
    return obj
}

// const updateNestedObjectParser = obj => {

// }

const convertToObjId = id => Types.ObjectId(id)

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    convertToObjId
}