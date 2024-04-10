// const router = require("express").Router()
// const { User,OrganisationModel } = require("../models")
const express = require('express');
const router = express.Router();
const { User,OrganisationModel } = require("../models")
const Organisation = OrganisationModel;
//const Organisation = require('../models/OrganisationModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/organisation_logos'); // Define the destination folder for storing logos
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationFolder = 'uploads/organisation_logos';
        // Check if the destination folder exists, if not, create it
        if (!fs.existsSync(destinationFolder)) {
            fs.mkdirSync(destinationFolder, { recursive: true }); // Create destination folder recursively
        }
        cb(null, destinationFolder);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const originalName = path.basename(file.originalname, ext);
        cb(null, originalName  + ext);//+ '-' + Date.now()
    }
});
const upload = multer({ storage: storage });

// Get all organisations
router.get('/', async (req, res) => {
    try {
       // const organisations = await Organisation.find();
        const organisation = await Organisation.findOne().sort({ _id: 1 })
        res.json(organisation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create an organisation
router.post('/', upload.single('logo'), async (req, res) => {
    const organisation = new Organisation({
        organisationName: req.body.organisationName,
        email: req.body.email,
        businessDomain: req.body.businessDomain,
        website: req.body.website,
        startedOn: req.body.startedOn,
        fax: req.body.fax,
        poBox: req.body.poBox,
        primaryNo: req.body.primaryNo,
        secondaryNo: req.body.secondaryNo,
        currency: req.body.currency,
        symbol: req.body.symbol,
        address: req.body.address,
        country: req.body.country,
        state: req.body.state,
        district: req.body.district,
        city: req.body.city,
        zipCode: req.body.zipCode,
        logo: req.file ? req.file.path.replace(/\\/g, '/') : null // Save the logo path if provided
    });
    console.log(req.file.path.replace(/\\/g, '/'));
    try {
        const newOrganisation = await organisation.save();
        res.status(201).json(newOrganisation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update an organisation
router.patch('/:id', upload.single('logo'), async (req, res) => {
    try {
        const organisation = await Organisation.findById(req.params.id);
        if (organisation == null) {
            return res.status(404).json({ message: 'Organisation not found' });
        }

        organisation.organisationName = req.body.organisationName;
        organisation.email = req.body.email;
        organisation.businessDomain = req.body.businessDomain;
        organisation.website = req.body.website;
        organisation.startedOn = req.body.startedOn;
        organisation.fax = req.body.fax;
        organisation.poBox = req.body.poBox;
        organisation.primaryNo = req.body.primaryNo;
        organisation.secondaryNo = req.body.secondaryNo;
        organisation.currency = req.body.currency;
        organisation.symbol = req.body.symbol;
        organisation.address = req.body.address;
        organisation.country = req.body.country;
        organisation.state = req.body.state;
        organisation.district = req.body.district;
        organisation.city = req.body.city;
        organisation.zipCode = req.body.zipCode;

        // Update logo only if a new logo is provided
        if (req.file) {
            organisation.logo =req.file.path.replace(/\\/g, '/');
        }

        const updatedOrganisation = await organisation.save();
        //console.log(updatedOrganisation);
        res.json(updatedOrganisation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;