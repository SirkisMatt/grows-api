const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')
const { makeGoalTypeArray } = require('./goal_type.fixtures')
const { makeGoalsArray } = require('./goals.fixtures')

describe('goals Endpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE grow_users, goal_types, goals RESTART IDENTITY CASCADE'))

  afterEach('cleanup',() => db.raw('TRUNCATE grow_users, goal_types, goals RESTART IDENTITY CASCADE'))

  describe(`GET /api/goals`, () => {
    context(`Given no goals`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/goals')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, [])
      })
    })

    context('Given there are goals in the database', () => {
        const testUsers = makeUsersArray()
        const testGoals = makeGoalsArray()
        const goalTypes = makeGoalTypeArray()
  
        beforeEach('insert goals', () => {
            return db
            .into('grow_users')
            .insert(testUsers)
            .then(() => {
                return db
                .into('goal_types')
                .insert(goalTypes)
            })
                .then(() => {
                return db
                .into('goals')
                .insert(testGoals)
                })
        })
  
        it('responds with 200 and all of the goals', () => {
          return supertest(app)
            .get('/api/goals')
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(200, testGoals)
        })
      })
  })

  describe(`GET /api/goals/:userId/:goals_id`, () => {
      context(`Given no goals`, () => {
          it(`responds with 404`, () => {
              const goalId = 123456
              const userId = 1
              return supertest(app)
                .get(`/api/goals/${userId}/${goalId}`)
                //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(404, { error: { message: `Goal doesn't exist` } })
          })
      })

      context(`Given there are goals in the database`, () => {
        const testUsers = makeUsersArray()
        const testGoals = makeGoalsArray()
        const goalTypes = makeGoalTypeArray()       
        
        beforeEach('insert goals', () => {
            return db
            .into('grow_users')
            .insert(testUsers)
            .then(() => {
                return db
                .into('goal_types')
                .insert(goalTypes)
            })
                .then(() => {
                return db
                .into('goals')
                .insert(testGoals)
                })
        })

        it(`responds with 200 and the specified goal`, () => {
            const goalId = 2
            const userId = 1
            const expectedGoal = testGoals[goalId - 1]
            return supertest(app)
                .get(`/api/goals/${userId}/${goalId}`)
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(200, expectedGoal)
        })
      })
  })

  describe(`POST /api/goals`, () => {
    context(`Given there are goals in the database`, () => {
        const testUsers = makeUsersArray()
        const goalTypes = makeGoalTypeArray()       

        beforeEach('insert goals', () => {
            return db
            .into('grow_users')
            .insert(testUsers)
            .then(() => {
                return db
                .into('goal_types')
                .insert(goalTypes)
            })
        })

        it(`creates a goal, responds with 201 and the new goal`, async function () {
            const newGoal = {
                title: 'Meditate 30min a day',
                description: 'go to bed earlier so you can wake up earlier',
                tree_bet: 5,
                complete_by: 'Fri Dec 11 2020',
                completed: false,
                user_id: 1,
                goal_type_id: 4
            }
            await supertest(app)
                .post(`/api/goals`)
                .send(newGoal)
                expect(201)
                expect(res => {
                    expect(res.body.title).to.eql(newGoal.title)
                    expect(res.body.description).to.eql(newGoal.description)
                    expect(res.body.tree_bet).to.eql(newGoal.tree_bet)
                    expect(res.body.complete_by).to.eql(newGoal.complete_by)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/goals/${res.body.id}`)
                    const expected = new Date().toLocaleString()
                    const actual = new Date(res.body.date_published).toLocaleString()
                    expect(actual).to.eql(expected)
                    expect(res.body.completed).to.eql(newGoal.completed)
                    expect(res.body.user_id).to.eql(newGoal.user_id)
                    expect(res.body.goal_type_id).to.eql(newGoal.goal_type_id)
                })
        })
    })

    const requiredFields = ['title', 'tree_bet', 'complete_by', 'completed', 'user_id', 'goal_type_id']

    requiredFields.forEach(field => {
        const newGoal = {
            //title: 'Meditate 30min a day',
            tree_bet: 5,
            complete_by: 'Fri Dec 11 2020',
            completed: false,
            user_id: 1,
            goal_type_id: 4
        }

        it(`responds with 400 and an error message when the 'title' in missing`, () => {
            //delete newGoal[field]

            return supertest(app)
                .post('/api/goals')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(newGoal)
                .expect(400, {
                    error: { message: `Missing 'title' in request body` }
                })
        })
    })
  })

    describe(`DELETE /api/goals/:goal_id`, () => {
        context(`Given no goals`, () => {
            it(`responds with 404`, () => {
                const goalId = 123456
                const userId = 1
                return supertest(app)
                    .delete(`/api/goals/${userId}/${goalId}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, { error: { message: `Goal doesn't exist` } })
            })
        })

        context(`Given there are goals in the database`, () => {
            const testUsers = makeUsersArray()
            const testGoals = makeGoalsArray()
            const goalTypes = makeGoalTypeArray()       
        
        beforeEach('insert goals', () => {
            return db
            .into('grow_users')
            .insert(testUsers)
            .then(() => {
                return db
                .into('goal_types')
                .insert(goalTypes)
            })
                .then(() => {
                return db
                .into('goals')
                .insert(testGoals)
                })
        })

        it(`responds with 204 and removes the goal`, () => {
            const idToRemove = 2
            const userId = 1
            const expectedGoals = testGoals.filter(goal => goal.id !== idToRemove)
            return supertest(app)
                .delete(`/api/goals/${userId}/${idToRemove}`)
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(204)
                .then(res => 
                    supertest(app)
                        .get(`/api/goals`)
                        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                        .expect(expectedGoals)    
                )
        })
      })
    })

    describe(`PATCH /api/goals/:userId/:goal_id`, () => {
        context(`Given no goals`, () => {
            const testUsers = makeUsersArray()
            const goalTypes = makeGoalTypeArray() 

            beforeEach('insert users and goal_types', () => {
                return db
                .into('grow_users')
                .insert(testUsers)
                .then(() => {
                    return db
                    .into('goal_types')
                    .insert(goalTypes)
                })
            })

            it('responds with 404', () => {
                const goalId = 786467
                const userId = 1
                return supertest(app)
                    .patch(`/api/goals/${userId}/${goalId}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, { error: { message: `Goal doesn't exist` } })
            })
        })

        context(`Given there are goals in the database`, () => {
            const testUsers = makeUsersArray()
            const testGoals = makeGoalsArray()
            const goalTypes = makeGoalTypeArray()       
        
        beforeEach('insert goals', () => {
            return db
            .into('grow_users')
            .insert(testUsers)
            .then(() => {
                return db
                .into('goal_types')
                .insert(goalTypes)
            })
                .then(() => {
                return db
                .into('goals')
                .insert(testGoals)
                })
        })

        it(`responds with 201 and updates the goal`, () => {
            const idToUpdate = 2
            const userId  = 1
            const updateGoal = {
                tree_bet: 10,
                title: 'Finish your coding camp',
                complete_by: 'Sun Dec 20 2020',
                completed: true
            }
            const expectedGoal = {
                ...testGoals[idToUpdate - 1],
                ...updateGoal
            }

            return supertest(app)
                .patch(`/api/goals/${userId}/${idToUpdate}`)
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(updateGoal)
                .expect(201)
                .then(res => 
                    expect(expectedGoal)
                )
        })

        it(`responds with 400 when no required fields supplied`, () => {
            const idToUpdate = 2
            const userId = 1
            return supertest(app)
                .patch(`/api/goals/${userId}/${idToUpdate}`)
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send({ irreverantField: 'foo' })
                .expect(400, {
                    error: {
                        message: `Request body must contain title, description, tree_bet, complete_by, goal_type_id or date_published`
                    }
                })
        })

        it(`responds with 201 when updating only a subset of fields`, () => {
            const idToUpdate = 2
            const userId = 1
            const updateGoal = {
                title: 'updated goal title'
            }
            const expectedGoal = {
                ...testGoals[idToUpdate - 1],
                ...updateGoal
            }

            return supertest(app)
                .patch(`/api/goals/${userId}/${idToUpdate}`)
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send({
                    ...updateGoal,
                    fieldToIgnore: 'should not be in GET response'
                })
                .expect(201)
                .then(res => 
                        expect(expectedGoal)
                )
        })
      })
    })
})