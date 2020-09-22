module.exports = function ResponseData (res,code = 200, message, meta, data){

    let response = {
        message: message
    };

    if (meta !== null) {
        response.meta = meta
    }

    if (data !== null) {
        response.data = data
    }

    res.status(code).send(
        response
    );
}
