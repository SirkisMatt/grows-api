const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')
//const { makeGoalTypeArray } = require('./goal_type.fixtures')
//const { makeGoalsArray } = require('./goals.fixtures')

describe('grow_users Endpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE grow_users RESTART IDENTITY CASCADE'))

  afterEach('cleanup',() => db.raw('TRUNCATE grow_users RESTART IDENTITY CASCADE'))

  describe(`GET /api/users`, () => {
    context(`Given no users`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/users')
          //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, [])
      })
    })

    context('Given there are users in the database', () => {
        const testUsers = makeUsersArray()
        //const testGoals = makeGoalsArray()
        //const goalTypes = makeGoalTypeArray()
  
        beforeEach('insert users', () => {
            return db
            .into('grow_users')
            .insert(testUsers)
        })
  
        it('responds with 200 and all of the grow_users', () => {
          return supertest(app)
            .get('/api/users')
            //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(200, testUsers)
        })
      })
  })

  describe(`GET /api/users/:userId`, () => {
      context(`Given no users`, () => {
          it(`responds with 404`, () => {
              const userId = 123456
              return supertest(app)
                .get(`/api/users/${userId}`)
                //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(404, { error: { message: `User doesn't exist` } })
          })
      })

      context(`Given there are users in the database`, () => {
         const testUsers = makeUsersArray()
        // const testGoals = makeGoalsArray()
        //const goalTypes = makeGoalTypeArray()       
        
        beforeEach('insert testUsers', () => {
            return db
            .into('grow_users')
            .insert(testUsers)
        })

        it(`responds with 200 and the specified User`, () => {
            const userId = 2
            const expectedUser = testUsers[userId - 1]
            return supertest(app)
                .get(`/api/users/${userId}`)
                //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(200, expectedUser)
        })
      })
  })

  describe(`POST /api/users`, () => {
    context(`Given there are testUsers in the database`, () => {
        const testUsers = makeUsersArray()
        //const goalTypes = makeGoalTypeArray()       

        beforeEach('insert testUsers', () => {
            return db
            .into('grow_users')
            .insert(testUsers)
        })

        it(`creates a User, responds with 201 and the new user`, async function () {
            const newUser = {
                username: 'Test',
                email: 'test@fakeemail.com',
                password: 'password',
                role: 'basic',
            }
            await supertest(app)
                .post(`/api/users`)
                //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(newUser)
                expect(201)
                expect(res => {
                    expect(res.body.title).to.eql(newUser.title)
                    expect(res.body.email).to.eql(newUser.email)
                    expect(res.body.password).to.eql(newUser.password)
                    expect(res.body.role).to.eql(newUser.role)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                    expect(actual).to.eql(expected)
                })
        })
    

    // const requiredFields = ['username', 'email', 'password', 'role']

    // requiredFields.forEach(field => {
      

        it(`responds with 400 and an error message when the username is missing`, () => {
            const newUser = {
                username: '',
                email: 'fern@fakeemail.com',
                password: 'password',
            }

            return supertest(app)
                .post('/api/users')
                //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(newUser)
                .expect(400, {
                    error: { message: `Missing 'username' in request body` }
                })
        })
    })
    // })
  })

    describe(`DELETE /api/users/:userId`, () => {
        context(`Given no testUsers`, () => {
            it(`responds with 404`, () => {
                const userId = 123456
                return supertest(app)
                    .delete(`/api/users/${userId}`)
                    //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, { error: { message: `User doesn't exist` } })
            })
        })

        context(`Given there are testUsers in the database`, () => {
             const testUsers = makeUsersArray()
            // const testGoals = makeGoalsArray()
            //const goalTypes = makeGoalTypeArray()       
        
        beforeEach('insert testUsers', () => {
            return db
            .into('grow_users')
            .insert(testUsers)
        })

        it(`responds with 204 and removes the user`, () => {
            const idToRemove = 2
            const expectedUsers = testUsers.filter(user => user.id !== idToRemove)
            return supertest(app)
                .delete(`/api/users/${idToRemove}`)
                //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(204)
                .then(res => 
                    supertest(app)
                        .get(`/api/users`)
                        //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                        .expect(expectedUsers)    
                )
        })
      })
    })

    describe(`PATCH /api/users/:userId`, () => {
        context(`Given no testUsers`, () => {
            it('responds with 404', () => {
                const userId = 123456
                return supertest(app)
                    .patch(`/api/users/${userId}`)
                    //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, { error: { message: `User doesn't exist` } })
            })
        })

        context(`Given there are users in the database`, () => {
             const testUsers = makeUsersArray()
            // const testGoals = makeGoalsArray()
            //const goalTypes = makeGoalTypeArray()       
        
        beforeEach('insert users', () => {
            return db
            .into('grow_users')
            .insert(testUsers)
        })

        it(`responds with 204 and updates the user`, () => {
            const idToUpdate = 2
            const updateUser = {
                username: "New"
            }
            const expectedUsers = {
                ...testUsers[idToUpdate - 1],
                ...updateUser
            }
            return supertest(app)
                .patch(`/api/users/${idToUpdate}`)
                //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(updateUser)
                .expect(204)
                .then(res => 
                    supertest(app)
                        .get(`/api/users/${idToUpdate}`)
                        //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                        .expect(expectedUsers)    
                )
        })
        // const requiredFields = ['username', 'email', 'password', 'role']

        // requiredFields.forEach(field => {
        //     const newUser = {
        //         username: 'Fern',
        //         email: 'fern@fakeemail.com',
        //         password: 'password',
        //         role: 'basic',
        //     }

        it(`responds with 400 when no required fields supplied`, () => {
            const idToUpdate = 2
            return supertest(app)
                .patch(`/api/users/${idToUpdate}`)
                //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send({ irreverantField: 'foo' })
                .expect(400, {
                    error: {
                         message: `Request body must contain either 'username', 'email', or 'password'` 
                    }
                })
        })
    // })

        it(`responds with 204 when updating only a subset of fields`, () => {
            const idToUpdate = 2
            const updateUser = {
                username: 'updated'
            }
            const expectedUsers = {
                ...testUsers[idToUpdate - 1],
                ...updateUser
            }

            return supertest(app)
                .patch(`/api/users/${idToUpdate}`)
                //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send({
                    ...updateUser,
                    fieldToIgnore: 'should not be in GET response'
                })
                .expect(204)
                .then(res => 
                    supertest(app)
                        .get(`/api/users/${idToUpdate}`)
                        //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                        .expect(expectedUsers)
                )
        })
      })
    })
})