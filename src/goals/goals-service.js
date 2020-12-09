const GoalsService = {
    getAllGoals(knex) {
        return knex.select('*').from('goals')
    },
    insertGoal(knex, newGoal) {
        return knex 
            .insert(newGoal)
            .into('goals')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, userId, id) {
        return knex('goals')
            .select('*')
            .where({
            'user_id': userId,
            'id': id
        }).first()
    },
    getGoalBasedOnUser(knex, userId) {
        return knex('goals')
        .select('*')
        .where('user_id', userId)
    
    },
    deleteGoal(knex, id) {
        return knex('goals')
            .where({ id })
            .delete()
    },
    updateGoal(knex, id, newGoalFields) {
        return knex('goals')
            .where({ id })
            .update(newGoalFields)
    }
}

module.exports = GoalsService