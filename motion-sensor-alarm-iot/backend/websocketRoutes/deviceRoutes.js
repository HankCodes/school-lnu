'use strict'

module.exports = (socket, io) => {
    socket.on('/sensor/motion/events/triggered', () => {
        console.log('Motion is triggered search the database for the owner and send event')
    })

    socket.on('/sensor/motion/events/code-change', (data) => {
        const d = JSON.parse(data)
        console.log('code changed', d.state)
        console.log('search the database for the owner and send event')
    })

    socket.on('/sensor/motion/events/on', (data) => {
        const d = JSON.parse(data)
        console.log('is the alarm on?', d.state)
        console.log('search the database for the owner and send event')
    })
}