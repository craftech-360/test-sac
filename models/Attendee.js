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
        required: true
    },
    company: {
        type: String,
        required: true
    },
    jobtitle:{
        type:String,
        required:true
    },
    shippinglookup:{
        type: String,
        default:''
    }
   
})

const Attendee = mongoose.model('Attendee', attendeeSchema)

module.exports = Attendee