const { MongoClient } = require('mongodb')

const connectionString =process.env.ATLAS_URI

const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

let dbConnection

module.exports = {
    connectToServer: async (callback) => {
        await client.connect()

        dbConnection = client.db('crm')

        console.log('Conectado a mongo')

        return callback()

    },

    getDb: () => {
        return dbConnection
    }
}