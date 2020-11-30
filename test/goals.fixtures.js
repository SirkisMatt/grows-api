function makeGoalsArray() {
    return [
        {
            id: 1,
            title: 'Run 10 miles',
            description: 'do your best to run a little everyday',
            date_published: '2020-11-07T00:00:00.000Z',
            tree_bet: 2,
            complete_by: '2020-12-10',
            completed: false,
            user_id: 1,
            goal_type_id: 3
        },
        {
            id: 2,
            title: 'Finish your coding camp',
            description: 'do your best to work on it 3 hours everyday',
            date_published: '2020-11-07T00:00:00.000Z',
            tree_bet: 10,
            complete_by: '2020-12-29',
            completed: false,
            user_id: 1,
            goal_type_id: 2
        },
        {
            id: 3,
            title: 'Meditate 30min a day',
            description: 'go to bed earlier so you can wake up earlier',
            date_published: '2020-11-07T00:00:00.000Z',
            tree_bet: 5,
            complete_by: '2020-12-12',
            completed: false,
            user_id: 1,
            goal_type_id: 4
        }
    ]
}

module.exports = {
    makeGoalsArray
}