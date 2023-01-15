const asyncHandler = require('../errorHandlers/asyncHandler')
const User = require('../models/User')
const CustomError = require('../errorHandlers/customError')
const { StatusCodes } = require('http-status-codes')
const { OK, CREATED, UNAUTHORIZED, BAD_REQUEST, NOT_FOUND } = StatusCodes

exports.signup = asyncHandler(async (req, res) => {
    const { email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
        throw new CustomError('Passwords should match.', BAD_REQUEST)
    }

    if (!email || !password) {
        throw new CustomError('You must provide an email and password.', NOT_FOUND)
    }
    const userExists = await User.findOne({ email })
    if (userExists) {
        throw new CustomError('Email address is already in use.', BAD_REQUEST)
    }

    const user = await User.create({
        password,
        email,
    })
    const token = user.getJWT()
    res.status(CREATED).json({
        token
    }) 
})

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new CustomError('Please provide an email and password.', BAD_REQUEST)
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new CustomError('Invalid credentials.', BAD_REQUEST)
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
        throw new CustomError('Invalid credentials.', BAD_REQUEST)
    }
    const token = user.getJWT()
    res.status(OK).json({
        token           
    }) 
})

exports.getProfile = asyncHandler((req, res) => {
    res.status(OK).json({
        user: req.user
    })
})