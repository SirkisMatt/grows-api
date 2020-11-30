const ArticlesService = {
    getAllGoals(knex) {
        return knex.select('*').from('grow')
    },
    insertGoal(knex, newGoal) {
        return knex 
            .insert(newGoal)
            .into('grow')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('grow').select('*').where('id', id).first()
    },
    deleteGoal(knex, id) {
        return knex('grow')
            .where({ id })
            .delete()
    },
    updateGoal(knex, id, newGoalFields) {
        return knex('grow')
            .where({ id })
            .update(newGoalFields)
    }
}

module.exports = ArticlesService