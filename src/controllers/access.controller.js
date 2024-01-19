'use strict'

const AccessService = require("../services/access.service")

class AccessController {
    signUp = async (req, res, next) => {
        try {
            // request body is empty right now
            console.log(`{P}::signUp::`, req.body)
            /*
                200 OK
                201 Created
                (codes for the dev team...)
            */
            return res.status(201).json(await AccessService.signUp(req.body))
        } catch (error) {
            next(error)
        }   
    }
}

module.exports = new AccessController()