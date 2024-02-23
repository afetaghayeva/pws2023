module.exports = wsInstance => (ws, req) => {
    ws.on('message', rawData => {
        let data = {}
        try {
            data = JSON.parse(rawData)
        } catch(err) {
            console.error('WS error:', err.message)
            return
        }
        if(data.event == 'INIT') {
            console.log('WS init session:', data.session)
            ws.session = data.session
            return
        }
        data.sender = null
        if(req.session && req.session.passport && req.session.passport.user)
            data.sender = req.session.passport.user
        data.timestamp = new Date()
        console.log('WS data:', data)
        req.sessionStore.all((err, sessions) => {
            if(err) {
                console.error('SESSIOSTORE not accessible')
                return
            }
            wsInstance.getWss().clients.forEach(client => {
                if(client.session) {
                    let target = sessions[client.session]
                    if(!target) return
                    let recipient = { username: target.passport ? target.passport.user : null, roles: target.roles || [] }
                    if(!data.recipient || data.sender == recipient.username || data.recipient == recipient.username) {
                        console.log('WS send to', recipient)
                        client.send(JSON.stringify(data))
                    }
                }
            })
        })
    })
}