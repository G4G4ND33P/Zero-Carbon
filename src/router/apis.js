const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

//Get Record
router.get('/', async (req, res) => {
    const barcodes = await loadCollection();
    res.send(await barcodes.find({}).toArray());
});

//Add Record
router.post('/', async (req, res) => {
    const barcodes = await loadCollection();
    await barcodes.insertOne({
        class: req.body.class, 
        code: req.body.code, 
        company: req.body.company, 
        description: req.body.description, 
        image_url: req.body.image_url, 
        size: req.body.size, 
        status: req.body.status,
        createdAt: new Date()
    });
    res.status(201).send();
});

//Delete Record
router.delete('/:code', async (req, res) => {
    const barcodes = await loadCollection();
    await barcodes.deleteOne({
        code: new mongodb.ObjectID(req.params.code)
    });
    res.status(200).send();
});

async function loadCollection() {
    const client = await mongodb.MongoClient.connect
    ('mongodb+srv://ggn-18:G4g4n-ZeroCarbon@zccluster.pewfg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
        useNewUrlParser: true
    })

    return client.db('ZeroCarbon').collection('Barcode');
} 

module.exports = router;