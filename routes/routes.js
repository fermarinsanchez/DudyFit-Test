const express = require('express')
const router = express.Router()
const generalController = require('../controllers/app.controller')

router.get('/', (req, res) => res.redirect('home')) 

router.get('/home', generalController.renderHome)
router.get('/trainers-config', generalController.trainersConfig)
router.get('/trainers-result', generalController.trainersResult)

module.exports = router