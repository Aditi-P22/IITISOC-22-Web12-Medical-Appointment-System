const express = require('express');
const router = express.Router();
const services = require('../services/render');
const Patient = require('../model/patient_model');
const Appointment = require("../model/appointment_model");
const Doctor = require("../model/doctor_model");


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


router.get('/appointments', async (req, res) => {
    const doctors = await Doctor.find();
    res.render('booking', {doctors: doctors})
});

router.get('/appointments/:doctor_id', async (req, res) => {
    const doctor = await Doctor.findById(req.params.doctor_id);
    res.render('bookingForm', {doctor: doctor})
});

router.get('/your_appointments', async (req, res) => {
    let appointments = await Appointment.find();
    console.log(appointments)
    for (let i = 0; i < appointments.length; i++) {
        const doctor = await Doctor.findById(appointments[i].doctor_id);
        const patient = await Patient.findById(appointments[i].patient_id);

        appointments[i] = {...appointments[i].toObject(), doctor, patient};
    }
    console.log(appointments)

    res.render('your_appointments', {appointments})
});

router.get('/your_appointments/:appointment_id', async (req, res) => {
    let appointment = await Appointment.findById(req.params.appointment_id);

    const doctor = await Doctor.findById(appointment.doctor_id);
    const patient = await Patient.findById(appointment.patient_id);

    appointment = {...appointment.toObject(), doctor, patient};

    console.log(appointment)

    res.render('cancelAppointments', {appointment})
});

module.exports = router;