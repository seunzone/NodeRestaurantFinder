const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    console.log(req.name)
    res.render('index');
}

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add Store'});
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
    //find and update store
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, //returns new store
        runValidatores: true
    }).exec();
    //redirect and flash message
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a>`);
    res.redirect(`/stores/${store._id}/edit`);
}