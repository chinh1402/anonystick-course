'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { createTokenPair } = require("../auth/authUtils")
const KeyTokenService = require("./keyToken.service")
const { getInfoData} = require("../utils")

const SALTORROUND = 10;

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {

    // use static for direct use (cho no khoe?)
    static _signUp = async ({ name, email, password }) => {
        try {
            // step1: check email availabilities
            // hodelShop return object mongoose, .lean return Javascript object
            // findOne? lean?
            const holderShop = await shopModel.findOne({ email }).lean()
            if (holderShop) {
                return {
                    code: 'xxxx',
                    message: 'Shop already registered:'
                }
            }
            const passwordHash = await bcrypt.hash(password, SALTORROUND)

            const newShop = await shopModel.create({
                name, email, password: passwordHash, rules: [RoleShop.SHOP]
            })

            if (newShop) {
                // complex version

                // using refresh token and access token
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                // })

                // The below version is opted for the simplified version, so rewatch the vid if you interested in the 
                // complex ver
                
                // simple version
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                // public key cryptography standards
                console.log({ privateKey, publicKey }) // save collection keyStore

                // 8:35 section5 reup full
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    return {
                        code: 'xxx',
                        message: 'publicKeyString error'
                    }
                }

                // const publicKeyObject = crypto.createPublicKey(publicKeyString)
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
                console.log('created token success:', tokens)
                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null,
            }

        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
    static get signUp() {
        return AccessService._signUp
    }
    static set signUp(value) {
        AccessService._signUp = value
    }
}

module.exports = AccessService