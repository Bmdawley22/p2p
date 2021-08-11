const express = require('express');
const router = express.Router();

const authRouter = require('../controllers/auth');


router.get('/login', authRouter.rendLogin)
router.get('/signup', authRouter.rendSignup)

module.exports = router;