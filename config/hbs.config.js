const hbs = require('hbs')


hbs.registerHelper('matched', (trainers, clients) => {
    let sortTrainers = trainers.trainers.sort((a,b) => a.reputation - b.reputation)
    let sortClients = clients.clients.sort((a,b) => a.trainerRep - b.trainerRep)
    let result = [...sortTrainers]
    for(let i = 0; i < sortTrainers.length; i++) {
     if (sortTrainers[i].available !== 0) {
      const cli = sortClients.splice(0, sortTrainers[i].available)
      sortTrainers[i].clients = cli
     }
    }
    return result
  })