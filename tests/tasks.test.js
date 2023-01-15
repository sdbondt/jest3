require('dotenv').config()
const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../app')
const Task = require('../models/Task')
const { userToken, genericUser, userId, userTwoToken, taskOne, setupDatabase } = require('./db')

beforeEach(setupDatabase)
  
afterEach(async () => {
    await mongoose.connection.close()
})

describe('task tests', () => {
    describe('if task create request is correct', () => {
        it('should create a new task', async () => {
            const response = await request(app).post('/api/tasks')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    title: 'test',
                    description: 'test'
                })
                .expect(201)
            
            const task = await Task.findOne({ title: 'test' })
            expect(task).not.toBeNull()
        })
    })

    describe('fetching tasks', () => {
        it('should return users tasks', async () => {
            const response = await request(app).get('/api/tasks')
                .set('Authorization', `Bearer ${userToken}`)
                .send()
                .expect(200)
            
            
            expect(response.body.tasks.length).toEqual(2)
        })
    })

    describe('deleting tasks', () => {
        it('user cannot delete other users tasks', async () => {
            const response = await request(app).delete(`/api/tasks/${taskOne._id}`)
                .set('Authorization', `Bearer ${userTwoToken}`)
                .send()
                .expect(401)
            
            const task = await Task.findById(taskOne._id)
            expect(task).not.toBeNull()
        })

        

    })
})