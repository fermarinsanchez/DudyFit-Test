const trainers = require('../data/trainers.json')
const clients = require('../data/clients.json');
const { jsonCopy } = require('../helpers/JSONhelper')


module.exports.renderHome = (req, res, next) => {
    res.render('home')
}

module.exports.trainersConfig = (req, res, next) => {
    const configData = { trainers: trainers.trainers, clients: clients.clients }

    res.render('trainers', configData)
}

module.exports.trainersResult = (req, res, next) => {

    const valueToStars = (value) => {

        if (value <= 0) {
            return 6
        } else if (value > 0 && value <= 0.2) {
            return 5
        } else if (value > 0.2 && value <= 0.4) {
            return 4
        } else if (value > 0.4 && value <= 0.6) {
            return 3
        } else if (value > 0.6 && value <= 0.8) {
            return 2
        } else if (value > 0.8 && value < 1) {
            return 1
        } else {
            return 0
        }
    }

    const matchingAndClientsSatisf = (trainers, clients) => {

        let newTrainers = jsonCopy(trainers)
        let newClients = jsonCopy(clients)
        let sortTrainers = newTrainers.trainers.sort((a, b) => a.reputation - b.reputation)
        let sortClients = newClients.clients.sort((a, b) => a.trainerRep - b.trainerRep)
        let result = [...sortTrainers]
        for (let i = 0; i < sortTrainers.length; i++) {
            if (sortTrainers[i].available !== 0) {
                const cli = sortClients.splice(0, sortTrainers[i].available)
                sortTrainers[i].clients = cli
            }
        }

        let reputationValue
        result.map(elem => {
            reputationValue = elem.reputation
            elem.clients.map(client => {
                client.satisfValue = Number(((client.trainerRep / 2) - reputationValue).toFixed(2))
                client.satisfStars = valueToStars(client.satisfValue)
            })
        })
        console.log(clients)
        return result
    }

    let matched = matchingAndClientsSatisf(trainers, clients)

    const satisfTrainerMedia = (obj) => {

        for (let i = 0; i < obj.length; i++) {
            let starsPerTrainer = obj[i].clients.map(elem => elem.satisfStars)
            let starsPerTrainerSum = starsPerTrainer.reduce((acc, curr) => acc + curr, 0)
            let starsPerTrainerMedia = starsPerTrainerSum / starsPerTrainer.length
            obj[i].starsMedia = starsPerTrainerMedia
        }
        return obj
    }

    let matchedWithTrainerMedia = satisfTrainerMedia(matched)

    const satisfGlobalMedia = (obj) => {

        let totalStars = obj.map(elem => elem.starsMedia)
        let totalStarsSum = totalStars.reduce((acc, curr) => acc + curr, 0)
        let totalStarsMedia = totalStarsSum / totalStars.length
        return totalStarsMedia
    }

    const satisfGlobalMediaValue = satisfGlobalMedia(matchedWithTrainerMedia)

    const data = { matched: matchedWithTrainerMedia, globalMedia: satisfGlobalMediaValue }
  
    res.render('result', data)
}
