const mongoose = require('mongoose')
const Schema = mongoose.Schema

const attendeeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isAttended: {
        type: Boolean, 
        default: false
    },
    phone: {
        type: String,
        required: true
    },
    uniquecode: {
        type: String,
        default: ""
    },
    company: {
        type: String,
        required: true
    }
})

const Attendee = mongoose.model('Attendee', attendeeSchema)

module.exports = Attendee