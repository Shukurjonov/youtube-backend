const registerRoute = require( './register' )
const loginRoute = require( './login' )
const homeRoute = require( './home' )
const userRoute = require( './user' )
const videoRoute = require( './video' )
const uploadRoute = require( './upload' )
const downloadRoute = require( './download' )

module.exports = [ homeRoute, uploadRoute, registerRoute, videoRoute, userRoute, downloadRoute, loginRoute ]