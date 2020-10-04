// Assistance from https://zellwk.com/blog/endpoint-testing/ 

const app = require('../src/server/server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)


it('Gets the test endpoint', async done => {
    // Sends GET Request to /test endpoint
    const response = await request.get('/test')
  
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('pass!')
    done()
  })

