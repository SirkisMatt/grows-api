const GoalTypesService = {
    getAllGoalTypes(knex) {
        return knex.select('*').from('goal_types')
    },
    insertGoalType(knex, newGoalType) {
        return knex 
            .insert(newGoalType)
            .into('goal_types')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('goal_types').select('*').where('id', id).first()
    },
    deleteGoalType(knex, id) {
        return knex('goal_types')
            .where({ id })
            .delete()
    },
    updateGoalType(knex, id, newGoalTypeFields) {
        return knex('goal_types')
            .where({ id })
            .update(newGoalTypeFields)
    }
}

module.exports = GoalTypesService