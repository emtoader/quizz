const request = require('supertest')
const {server} = require('../server.js')

const auth = async () => {
    const res = await request(server)
    .post('/login')
    .send({
      email: 'emtoader@gmail.com',
      password: 'test',
    })
  expect(res.statusCode).toEqual(200)

  let token = JSON.parse(res.text).accessToken

  const cookies = res.headers['set-cookie']
  const refreshToken = getCookie('refreshToken',cookies)

  //console.log('resp',res)
  return {'token': token, 'refreshToken':refreshToken}
}

function getCookie(name, cookies) {
    const value = `; ${cookies}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

describe('Post Endpoints', () => {

  it('should not log in', async () => {
    const res = await request(server)
      .post('/login')
      .send({
        email: 'test@test.com',
        password: 'incorrectpassword',
      })
    expect(res.statusCode).toEqual(400)
  })


  it('should create quizz', async () => {

    let token = await auth()

    const res = await request(server)
      .post('/quizzes')
      .set('Cookie', [`refreshToken=${token.refreshToken}`])
      .set('Authorization', `Bearer ${token.token}`)
      .send({
        title: 'test string',
        questions: {
            0: {
                'title': 'question 1',
                'type': 'singleChoice',
                'answers': {
                    0: {
                        'text':'answer 1',
                        'isTrue': 1
                    },
                    1: {
                        'text':'answer 2',
                        'isTrue': 0
                    }
                }
            }
        }
      })

    expect(res.statusCode).toEqual(200)
    expect(res._body.success).toEqual(1)
    
  })
  

})