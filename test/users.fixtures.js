function makeUsersArray() {
    return [
        {
            id: 1,
            username: 'Oak',
            email: 'Oak@fakeemail.com',
            password: 'password',
            role: 'basic',
            date_created: '2100-05-22T16:28:32.615Z'
        },
        {
            id: 2,
            username: 'Fern',
            email: 'fern@fakeemail.com',
            password: 'password',
            role: 'basic',
            date_created: '2100-06-22T16:28:32.615Z'
        }
    ]
}

module.exports = {
    makeUsersArray
}