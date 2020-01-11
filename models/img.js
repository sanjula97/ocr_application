const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({

    user_id:String,
    image_url:String,
    img_result:String


});

module.exports = mongoose.model('Image', imageSchema);