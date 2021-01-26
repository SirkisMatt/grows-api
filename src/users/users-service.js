const UsersService = {
    getAllUsers(knex) {
        return knex.select('*').from('grow_users')
    },


    insertUser (knex, newUser) {
        return knex 
            .insert(newUser)
            .into('grow_users')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex
            .from('grow_users')
            .select('*')
            .where('id', id)
            .first()
    },

    getByLogin(knex, email, password) {
        return knex
            .from('grow_users')
            .select('*')
            .where({
                'email': email,
                'password': password
            })
            // .andWhere('password', password)
            .first()
    },

    deleteUser(knex, id) {
        return knex('grow_users')
            .where({ id })
            .delete()
    },

    updateUser(knex, id, newUserFields) {
        return knex('grow_users')
            .where({ id })
            .update(newUserFields)
    },
}

module.exports = UsersService