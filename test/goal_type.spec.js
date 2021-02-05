const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
//const { makeUsersArray } = require('./users.fixtures')
const { makeGoalTypeArray } = require('./goal_type.fixtures')
//const { makeGoalsArray } = require('./goals.fixtures')

describe('goal_types Endpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE goal_types RESTART IDENTITY CASCADE'))

  afterEach('cleanup',() => db.raw('TRUNCATE goal_types RESTART IDENTITY CASCADE'))

  describe(`GET /api/goal-types`, () => {
    context(`Given no goalTypes`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/goal-types')
          //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, [])
      })
    })

    context('Given there are goalTypes in the database', () => {
        //const testUsers = makeUsersArray()
        //const testGoals = makeGoalsArray()
        const goalTypes = makeGoalTypeArray()
  
        beforeEach('insert goal-types', () => {
            return db
            .into('goal_types')
            .insert(goalTypes)
        })
  
        it('responds with 200 and all of the goal_types', () => {
          return supertest(app)
            .get('/api/goal-types')
            //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(200, goalTypes)
        })
      })
  })

  describe(`GET /api/goal-types/:goal_type_id`, () => {
      context(`Given no goal-types`, () => {
          it(`responds with 404`, () => {
              const goalTypeId = 123456
              return supertest(app)
                .get(`/api/goal-types/${goalTypeId}`)
                //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(404, { error: { message: `Goal Type doesn't exist` } })
          })
      })

      context(`Given there are goals in the database`, () => {
        // const testUsers = makeUsersArray()
        // const testGoals = makeGoalsArray()
        const goalTypes = makeGoalTypeArray()       
        
        beforeEach('insert goalTypes', () => {
            return db
            .into('goal_types')
            .insert(goalTypes)
        })

        it(`responds with 200 and the specified goalType`, () => {
            const goalTypeId = 2
            const expectedGoalType = goalTypes[goalTypeId - 1]
            return supertest(app)
                .get(`/api/goal-types/${goalTypeId}`)
                //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(200, expectedGoalType)
        })
      })
  })

  describe(`POST /api/goal-types`, () => {
    context(`Given there are goalTypes in the database`, () => {
        //const testUsers = makeUsersArray()
        const goalTypes = makeGoalTypeArray()       

        beforeEach('insert goalTypes', () => {
            return db
            .into('goal_types')
            .insert(goalTypes)
        })

        it(`creates a goalType, responds with 201 and the new goalType`, async function () {
            const updateGoalTypes = {
                title: "New"
            }
            await supertest(app)
                .post(`/api/goal-types`)
                //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(updateGoalTypes)
                expect(201)
                expect(res => {
                    expect(res.body.title).to.eql(newGoalType.title)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/goal-types/${res.body.id}`)
                    expect(actual).to.eql(expected)
                })
        })
    

    //const requiredFields = ['title']

    //requiredFields.forEach(field => {
       

        it(`responds with 400 and an error message when the title is missing`, () => {
            //delete newGoalType[field]
            const newGoalType = {
                //title: 'New Type of Goal',
            }

            return supertest(app)
                .post('/api/goal-types')
                //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(newGoalType)
                .expect(400, {
                    error: { message: `Missing 'title' in request body` }
                })
        })
    })
  })

    describe(`DELETE /api/goal-types/:goal_type_id`, () => {
        context(`Given no goalTypes`, () => {
            it(`responds with 404`, () => {
                const goalTypeId = 123456
                return supertest(app)
                    .delete(`/api/goal-types/${goalTypeId}`)
                    //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, { error: { message: `Goal Type doesn't exist` } })
            })
        })

        context(`Given there are goalTypes in the database`, () => {
            // const testUsers = makeUsersArray()
            // const testGoals = makeGoalsArray()
            const goalTypes = makeGoalTypeArray()       
        
        beforeEach('insert goalTypes', () => {
            return db
            .into('goal_types')
            .insert(goalTypes)
        })

        it(`responds with 204 and removes the goalType`, () => {
            const idToRemove = 2
            const expectedGoalTypes = goalTypes.filter(goalType => goalType.id !== idToRemove)
            return supertest(app)
                .delete(`/api/goal-types/${idToRemove}`)
                //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(204)
                .then(res => 
                    supertest(app)
                        .get(`/api/goal-types`)
                        //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                        .expect(expectedGoalTypes)    
                )
        })
      })
    })

    describe(`PATCH /api/goal-types/:goal_type_id`, () => {
        context(`Given no goalTypes`, () => {
            it('responds with 404', () => {
                const goalTypeId = 123456
                return supertest(app)
                    .patch(`/api/goal-types/${goalTypeId}`)
                    //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, { error: { message: `Goal Type doesn't exist` } })
            })
        })

        context(`Given there are goal-types in the database`, () => {
            // const testUsers = makeUsersArray()
            // const testGoals = makeGoalsArray()
            const goalTypes = makeGoalTypeArray()       
        
        beforeEach('insert goal-types', () => {
            return db
            .into('goal_types')
            .insert(goalTypes)
        })

        it(`responds with 204 and updates the goal-types`, () => {
            const idToUpdate = 2
            const updateGoalType = {
                title: "New Goal Type"
            }
            const expectedGoalTypes = {
                ...goalTypes[idToUpdate - 1],
                ...updateGoalType
            }
            return supertest(app)
                .patch(`/api/goal-types/${idToUpdate}`)
                //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(updateGoalType)
                .expect(204)
                .then(res => 
                    supertest(app)
                        .get(`/api/goal-types/${idToUpdate}`)
                        //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                        .expect(expectedGoalTypes)    
                )
        })

        it(`responds with 400 when no required fields supplied`, () => {
            const idToUpdate = 2
            return supertest(app)
                .patch(`/api/goal-types/${idToUpdate}`)
                //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send({ irreverantField: 'foo' })
                .expect(400, {
                    error: {
                        message: `Request body must contain 'title'`
                    }
                })
        })

        it(`responds with 204 when updating only a subset of fields`, () => {
            const idToUpdate = 2
            const updateGoalType = {
                title: 'updated goalType title'
            }
            const expectedGoalTypes = {
                ...goalTypes[idToUpdate - 1],
                ...updateGoalType
            }

            return supertest(app)
                .patch(`/api/goal-types/${idToUpdate}`)
                //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send({
                    ...updateGoalType,
                    fieldToIgnore: 'should not be in GET response'
                })
                .expect(204)
                .then(res => 
                    supertest(app)
                        .get(`/api/goal-types/${idToUpdate}`)
                        //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                        .expect(expectedGoalTypes)
                )
        })
      })
    })
})