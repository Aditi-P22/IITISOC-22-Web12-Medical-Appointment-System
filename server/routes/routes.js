const express = require('express');
const router = express.Router();
const services = require('../services/render');
const Patient = require('../model/patient_model');
const Appointment = require("../model/appointment_model");
const Doctor = require("../model/doctor_model");
const Login = require("../../views/login/userSchema");


//adding the html files
router.get('/', (req, res) => {
    res.render('homepage')
});
router.get('/blogs', (req, res) => {
    res.render('blogs')
});
router.get('/contact', (req, res) => {
    res.render('Contact')
});

router.get('/login', async (req, res) => {
    res.render('login')
});

router.get('/appointments', async (req, res) => {
    const doctors = await Doctor.find();
    res.render('booking', {doctors: doctors})
});

router.get('/appointments/:doctor_id', async (req, res) => {
    const doctor = await Doctor.findById(req.params.doctor_id);
    res.render('bookingForm', {doctor: doctor})
});

module.exports = router;