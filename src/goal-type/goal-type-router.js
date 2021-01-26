const path = require('path')
const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const GoalTypesService = require('./goal-type-service')

const goalTypesRouter = express.Router()
const jsonParser = express.json()

const serializeGoalType = goalType => ({
    id: goalType.id,
    title: xss(goalType.title)
  })

goalTypesRouter
  .route('/')
  .get((req, res, next) => {
      const knexInstance =  req.app.get('db')
      GoalTypesService.getAllGoalTypes(knexInstance)
        .then(goalTypes => {
            res.json(goalTypes.map(serializeGoalType))
        })
        .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
      const { title } = req.body
      const newGoalType = { title }

        for (const [key, value] of Object.entries(newGoalType))
                if (value == null) {
                    return res.status(400).json({
                        error: { message: `Missing '${key}' in request body` }
                    })
                }
    
    
        GoalTypesService.insertGoalType(
            req.app.get('db'),
            newGoalType
        )
            .then(goalType => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${goalType.id}`))
                    .json(serializeGoalType(goalType))
            })
            .catch(next)
        
  })

  goalTypesRouter
    .route('/:goal_type_id')
    .all((req, res, next) => {
        GoalTypesService.getById(
            req.app.get('db'),
            req.params.goal_type_id
        )
            .then(goalType => {
                if (!goalType) {
                    return res.status(404).json({
                        error: { message: `Goal Type doesn't exist` }
                    })
                }
                res.goalType = goalType
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeGoalType(res.goalType))
    })
    .delete((req, res, next) => {
        GoalTypesService.deleteGoalType(
            req.app.get('db'),
            req.params.goal_type_id
        )
            .then(numRowsAffected => {
               res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { title } = req.body
        const goalTypeToUpdate = { title }

        if (!title) {
            logger.error('Title is required');
            return res  
                .status(400)
                .json({
                    error: {
                        message: `Request body must contain 'title'`
                    }
                })
        }

        GoalTypesService.updateGoalType(
            req.app.get('db'),
            req.params.goal_type_id,
            goalTypeToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })



module.exports = goalTypesRouter