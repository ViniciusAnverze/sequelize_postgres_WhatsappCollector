import makeWASocket, {useMultiFileAuthState, DisconnectReason} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import {Model, Sequelize, DataTypes} from 'sequelize'

const sequelize = new Sequelize('whatsapp', 'postgres', 'password', {
    host: 'localhost',
    dialect: 'postgres'
})



async function connectionMaster(){

    
    class Contact extends Model {}

    Contact.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        photourl: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Contact',
        tableName: 'contacts',
        timestamps: false
    })

    const {state, saveCreds} = await useMultiFileAuthState('baileys-auth-file')

    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if(shouldReconnect) {
                connectionMaster()
            }
        } else if(connection === 'open') {
            console.log('opened connection')
        }
    })

    sock.ev.on('messages.upsert', async(messages) => {

        const id =  messages.messages[0].key.participant ? messages.messages[0].key.participant : messages.messages[0].key.remoteJid

        try {
            const oldUser = await Contact.findOne({
                where: {
                    id: id
                }
            })

            if(!oldUser){
                const photoUrl = await sock.profilePictureUrl(String(id))
                Contact.create({id: id, photourl: photoUrl})
            }
        } 
        catch (error) {
            console.log('ERROR: '+error)
        }
    })
}

connectionMaster()