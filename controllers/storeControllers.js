const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter: function(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if(isPhoto){
            next(null, true);
        } else {
            next ({ message: 'That file type is not allowed!'}, false)
        }
    }
};

exports.homePage = (req, res) => {
    console.log(req.name)
    res.render('index');
}

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add Store'});
}

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    // check for is there is no new file to resize
    if(!req.file){
        next(); //skip to the next middleware
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    //resizing the image
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    next();
}

exports.createStore = async (req, res) => {
    const store = new Store(req.body);
    await store.save();
    req.flash('success', `Succesfully Created ${store.name}. Do leave a review`);
    res.redirect('/');
}

exports.getStores = async (req, res) => {
    //Query Database for Store Lists
    const stores = await Store.find();
    res.render('stores', { title: 'Stores', stores })
}

exports.editStore = async (req, res) => {
// //find store with provided ID
const store = await Store.findOne({ _id: req.params.id })
//Authenticate that they own the store

//render the edit form
res.render('editStore', { title: `Edit ${store.name}`, store })
}

exports.updateStore = async (req, res) =>{
    //set the location data to be a point
    req.body.location.type = "Point";
    //find and update store
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, //returns new store
        runValidatores: true
    }).exec();
    //redirect and flash message
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a>`);
    res.redirect(`/stores/${store._id}/edit`);
}