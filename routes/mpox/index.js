const csv = require('csvtojson');
const path = require('path');
const downloadLinks = require('../../downloadLinks');
const router = require('express').Router();

const baseDir = path.join(process.cwd(), 'downloads', 'mpox');

downloadLinks['mpox'].forEach(link => {
    router.get(`/${link.filename.split('.')[0]}`, async (req, res) => {
        const filePath = path.join(baseDir, link.filename);
        console.log('Sending file:', filePath);
        try {
            const jsonData = await csv().fromFile(filePath);
            res.json(jsonData);
        } catch (error) {
            res.status(500).json({ error: 'Failed to process the CSV file. ' + error });
        }
    });
});

module.exports = router;
