const express = require('express');
const router = express.Router();
const services = require('../services/render');
const Patient = require('../model/patient_model');
const Appointment = require("../model/appointment_model");
const Doctor = require("../model/doctor_model");


router.get('/:appointment_id', async (req, res) => {
    const id = req.params.appointment_id;
    try {
        const data = await Appointment.findById(id);
        if (!data) {
            res.status(404).send({message: `Cannot find with id ${id}. Maybe id is wrong`})
        } else {
            res.send({
                message: "Information is retrieved",
                data
            })
        }
    } catch {
        res.status(500).send({
            message: "Could not find User with id=" + id
        });
    }
});


router.post('/', async (req, res, next) => {
    console.log(req.body);
    const {email, doctorId, slot} = req.body;
    if (!email) {
        return res.status(400).json({
            message: 'email id required',
        });
    } else if (!doctorId) {
        return res.status(400).json({
            message: 'Doctor id is required',
        });
    } else if (!slot) {
        return res.status(400).json({
            message: 'slot is required',
        });
    }
    // new user
    const patient = await Patient.findOne({email});
    const doctor = await Doctor.findById(doctorId);
    if(patient == null || !patient) {
        return res.status(200).json({
            message: 'No patient found with the email. Please signup',
        });
    }

    if (slot.from < doctor.timings.from || slot.to > doctor.timings.to) {
        return res.status(200).json({
            message: 'Given slot is not available in doctor timing',
            timings: doctor.timings
        });
    }
    const doctorAppointment = await Appointment.find({doctor_id: doctor._id});

    console.log(patient, doctor, doctorAppointment);
    for (let i = 0; i < doctorAppointment.length; i++) {
        const appointment = doctorAppointment[i];

        const fromNotOk = slot.from >= appointment.slot.from && slot.from <= appointment.slot.to;
        const toNotOk = slot.to >= appointment.slot.from && slot.to <= appointment.slot.to;
        const equal = slot.from === appointment.slot.from && slot.to === appointment.slot.to;
        if (fromNotOk || toNotOk || equal) {
            return res.status(200).json({
                message: 'slot is already booked',
            });
        }
    }
    const model = new Appointment({
        patient_id: patient._id,
        doctor_id: doctor._id,
        slot: slot
    })
    await model.save();

    return res.status(200).json({
        message: 'booking confirmed',

    });

// save user in the database
});

router.delete('/:appointment_id' ,async (req, res, next) => {
        const id = req.params.appointment_id;
        try {
            const data = await Appointment.findByIdAndDelete(id);
            if (!data) {
                res.status(404).send({message: `Cannot Delete with id ${id}. Maybe id is wrong`})
            } else {
                res.send({
                    message: "Appointment was deleted successfully!"
                })
            }
        } catch {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        }

    }
)
;

module.exports = router;