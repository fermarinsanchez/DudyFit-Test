const express = require('express');
const app = express();
const path = require('path')
require('./config/hbs.config')

const trainers = require('./data/trainers.json');
const clients = require('./data/clients.json')


app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.get('/home', (req, res, next) => {
    res.render('home')
});

app.get('/trainers-config', (req, res, next) => {
    const data = { trainers: trainers.trainers, clients: clients.clients }
    res.render('trainers', data)
});

app.get('/trainers-result', (req, res, next) => {

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
        let sortTrainers = trainers.trainers.sort((a, b) => a.reputation - b.reputation)
        let sortClients = clients.clients.sort((a, b) => a.trainerRep - b.trainerRep)
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
        return result
    }

    let matched = matchingAndClientsSatisf(trainers, clients)

    const satisfTrainerMedia = (obj) => {
        for (let i = 0; i < obj.length; i++) {
            let starsPerTrainer = obj[i].clients.map(elem => elem.satisfStars)
            let starsPerTrainerSum = starsPerTrainer.reduce((acc, curr) => (acc + curr))
            let starsPerTrainerMedia = starsPerTrainerSum / starsPerTrainer.length
            obj[i].starsMedia = starsPerTrainerMedia
        }
        return obj
    }

    let matchedWithTrainerMedia = satisfTrainerMedia(matched)

    const satisfGlobalMedia = (obj) => {
        let totalStars = obj.map(elem => elem.starsMedia)
        let totalStarsSum = totalStars.reduce((acc, curr) => (acc + curr))
        let totalStarsMedia = totalStarsSum / totalStars.length
        return totalStarsMedia
    }

    const satisfGlobalMediaValue = satisfGlobalMedia(matchedWithTrainerMedia)

    const data = { matched: matchedWithTrainerMedia, globalMedia: satisfGlobalMediaValue }
    res.render('result', data)
});

app.listen(3000, () => console.log('My first app listening on port 3000! '));