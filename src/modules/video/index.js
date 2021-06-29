const express = require('express')
const {GET, SEARCH, DELETE, PUT} = require('./controller')

const videoRoute = express.Router()

videoRoute.route('/video')
    .get(GET)

videoRoute.route('/video/search')
    .get(SEARCH)

videoRoute.route('/video/:videoId')
    .delete(DELETE)
    .put(PUT)


module.exports = videoRoute