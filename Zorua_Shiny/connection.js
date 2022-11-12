const config = require('./config.json')
const request = require('request')

/*GETTING TOKEN*/

const getToken = (url, callback) => {
    const options = {
        url: config.GET_TOKEN,
        json: true,
        body: {
            client_id: config.CLIENT_ID,
            client_secret: config.CLIENT_SECRET,
            grant_type: 'client_credentials'
        }
    }

    request.post(options, (err,res,body) => {
        if (err) return console.log(err)
        console.log(`Status: ${res.statusCode}`)
        console.log(body)
    
        callback(res)
    })
}


getToken(config.GET_TOKEN, (res) => {
    console.log(res)
})