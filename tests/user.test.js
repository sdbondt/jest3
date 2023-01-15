require('dotenv').config()
const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../app')
const User = require('../models/User')
const { userToken, genericUser, userId, setupDatabase } = require('./db')

beforeEach(setupDatabase)
  
afterEach(async () => {
    await mongoose.connection.close()
})

describe('user tests', () => {
    describe('if signup request is ok', () => {
        it('should signup new user', async () => {
            const response = await request(app).post('/api/auth/signup')
                .send({
                    email: 'test@gmail.com',
                    password: '123TESTtest',
                    confirmPassword: '123TESTtest'
                })
                .expect(201)
            
            const user = await User.findOne({ email: 'test@gmail.com' })
            expect(user).not.toBeNull()
            expect(user.password).not.toBe('123TESTtest')
        })
    })

    describe('if login request is ok', () => {
        it('should login existing user', async () => {
            await request(app).post('/api/auth/login')
                .send({
                    email: genericUser.email,
                    password: genericUser.password
                })
                .expect(200)
            const user = await User.findById(userId)


        })
    })

    describe('if login request is not ok', () => {
        it('should not login non existing user', async () => {
            await request(app).post('/api/auth/login')
                .send({
                    email: 'nonexisting@gmail.com',
                    password: genericUser.password
                })
                .expect(400)
        })

        it('should not login with wfrong password', async () => {
            await request(app).post('/api/auth/login')
                .send({
                    email: genericUser.email,
                    password: 'genericUser.password'
                })
                .expect(400)
        })
    })

    describe('if user is logged in', () => {
        it('user should be able to see his profile', async () => {
            await request(app).get('/api/auth/profile')
                .set('Authorization', `Bearer ${userToken}`)
                .send()
                .expect(200)
        })
    })

    describe('if user is not logged in', () => {
        it('user should not be able to see a profile', async () => {
            await request(app).get('/api/auth/profile')
                .expect(401)
        })
    })
})