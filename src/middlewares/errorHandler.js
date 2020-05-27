module.exports = (error, req, res, next) => {
    if(error.error && error.error_description && error.status){
        return res.status(error.status).send(error);
    }

    return res.status(500).send({error: 'internal_error', error_description: "Something went bad, please call administrator", status: 500});
}