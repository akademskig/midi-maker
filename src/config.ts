export const config = {
    "PORT": process.env.PORT || 4321,
    "mongoUri": process.env.MONGODB_URI ||
        process.env.MONGO_HOST ||
        'mongodb://' + (process.env.IP || 'localhost') + ':' +
        (process.env.MONGO_PORT || '27017') +
        '/midimaker'
}

