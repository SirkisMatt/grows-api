const path = require('path')
const express = require('express')
const xss = require('xss')
const { authUser } = require('../basicAuth')
const ArticlesService = require('../articles-service')

const goalsRouter = express.Router()
const jsonParser = express.json()

const serializeGoal = goal => ({
    id: goal.id,
    title: xss(goal.title),
    description: xss(goal.description),
    date_published: goal.date_published,
    tree_bet: goal.tree_bet,
    complete_by: goal.complete_by.toDateString(),
    completed: goal.completed,
    user_id: goal.user_id,
    goal_type_id: goal.goal_type_id
  })

goalsRouter 
    .route('/')
    .get((req, res, next) => {
        ArticlesService.getAllGoals(
            req.app.get('db')
        )
        .then(goals => {
            res.json(goals.map(serializeGoal))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { title, description, tree_bet, complete_by, completed, user_id, goal_type_id, date_published } = req.body
        const newGoal = { title, tree_bet, complete_by, completed, user_id, goal_type_id }

        for (const [key, value] of Object.entries(newGoal))
        if (value == null) {
            return res.status(400).json({
                error: { message: `Missing '${key}' in request body` }
            })
        }

        newGoal.date_published = date_published
        newGoal.description = description

        ArticlesService.insertGoal(
            req.app.get('db'),
            newGoal
        )

            .then(goal => {
                res 
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${goal.id}`))
                    .json(serializeGoal(goal))
            })
            .catch(next)
    })

goalsRouter
    .route('/:goal_id')
    .all((req, res, next) => {
        ArticlesService.getById(
            req.app.get('db'),
            req.params.goal_id
        )
            .then(goal => {
                if (!goal) {
                    return res.status(404).json({
                        error: { message: `Goal doesn't exist` }
                    })
                }
                res.goal = goal
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeGoal(res.goal))
    })
    .delete((req, res, next) => {
        ArticlesService.deleteGoal(
            req.app.get('db'),
            req.params.goal_id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { title, description, tree_bet, complete_by, completed, date_published } = req.body
        const goalToUpdate = { title, description, tree_bet, complete_by, completed, date_published }

        const numberOfValues = Object.values(goalToUpdate).filter(Boolean).length
        if(numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must contain title, description, tree_bet, complete_by or date_published`
                }
            })

        ArticlesService.updateGoal(
            req.app.get('db'),
            req.params.goal_id,
            goalToUpdate
        )
            .then(numberOfRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })


    module.exports = goalsRouter