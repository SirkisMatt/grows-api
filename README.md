# Grow API

## Scripts

Create a DataBase named: grow

To Migrate: npm migrate

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Docs

### User

GET all users:  /api/users  
GET user by id: /api/users/:id

POST a new user: /api/users (body must include username, email, password)
POST to Login: /api/users/login (body must include email & password)

DELETE user: /api/users/:id

PATCH user: /api/users/:id (Request body must contain either 'username', 'email', or 'password')

### Goals

GET all goals: /api/goals

GET all goals based on user: /api/goals/:userId
GET goal by id for specific user: /api/goals/:userId/:goalId

DELETE goal: /api/goals/:userId/:goalId 

PATCH: /api/goals/:userId/:goalId (Request body must contain title, description, tree_bet, complete_by, goal_type_id or date_published)

### GoalTypes

GET: /api/goal-types

GET goalType by Id: /api/goal-types/:goal_type_id

POST: /api/goal-types (Body must contain title)

DELETE: /api/goal-types/:goal_type_id

PATCH: /api/goal-types/:goal_type_id (Request body must contain 'title')

