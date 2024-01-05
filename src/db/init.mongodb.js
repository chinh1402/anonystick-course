'use strict'

const mongoose = require('mongoose')
const connectString = 'mongodb://127.0.0.1:27017/shopDEV'

const {countConnect} = require('../helpers/check.connect')

class Database {
    constructor() {
        this.connect()
    }

    // connect
    connect(type = 'mongodb') {
        if (1 === 1) {
            // ko quan tâm phần này, về sau sẽ log ra khi query sql
            mongoose.set('debug', true)
            mongoose.set('debug', {color:true})
        }
        mongoose.connect(connectString)
        .then(_ => console.log("Connected Mongodb Success: ", countConnect()))
        .catch(err => console.log ("Error given: ", err))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()