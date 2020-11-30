const ArticlesService = require('../src/articles-service')
const knex = require('knex')

describe(`Articles service object`, function() {
    let db

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    describe(`getAllGoals()`, () => {
        it(`resovles all articles from 'grow' table`, () => {

        })
    })
  })