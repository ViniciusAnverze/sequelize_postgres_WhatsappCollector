import express from 'express'
import cors from 'cors'
import {whatsappConnection, getIDs, getImageURL} from './whatsappConnection'

const app = express()

whatsappConnection();

app.use(cors())
app.use(express.json())

app.get('/IDs', async(req, res) => {
    const allIDs = await getIDs()
    return res.json(JSON.stringify({
        IDs: allIDs
    }))
})

app.post('/imageURL', async(req, res) => {
    const {id} = req.body
    const imageURL = await getImageURL(id)

    return res.json(JSON.stringify(imageURL))
})

app.listen(5001, () => {
    console.log('backend started. Port: 5001')
})