const masterRouter = require('express').Router()
const authRouter = require("./auth/router");
const buyerRouter = require('./buyer/router');
const sellerRouter = require('./seller/router');

masterRouter.use('/auth', authRouter)
masterRouter.use('/seller', sellerRouter)
masterRouter.use('/buyer', buyerRouter)

module.exports = masterRouter