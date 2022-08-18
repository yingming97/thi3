var express = require('express');
var router = express.Router();
var multer = require('multer');
var mongoose = require('mongoose')
const {Schema} = require("mongoose");
/* GET home page. */

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + Math.random() + file.originalname);
    },

});

var upload = multer({
    storage: storage,
    limits: {fileSize: 2 * 1024 * 1024},
    fileFilter: function (req, file, cb) {
        var ten = file.originalname;
        if (ten.indexOf('.jpg') > -1 || ten.indexOf('.png') > -1) {
            cb(null, true);
        } else {
            cb(new Error("Duoi file phai la JPG/PNG"), false);
        }

        if (ten.length > 14) {
            cb(new Error("Ten File phai duoi 10 ky tu"), false);
        }

    }
}).array('_image', 1);

const uri = "mongodb+srv://YingMing:01672545642Aa@cluster0.b8mwo.mongodb.net/hienpvph18604?retryWrites=true&w=majority";
mongoose.connect(uri).catch(err => console.log(err));

<!--(room_id, room_name, image, intro, description, number, price, type_id)-->
const rooms = mongoose.model('rooms', new Schema({
    _room_name: String,
    _intro: String,
    _description: String,
    _number: Number,
    _price: Number,
    _image: String,
    _type: String,
}))
const types = mongoose.model('types', new Schema({
    type_name: String
}))


/* GET home page. */
router.get('/', function (req, res, next) {
    // BAIVIET.find({}, function (err, result) {
    //     if (err != null) throw err;
    //     res.render('index', {data: result});
    // })
    rooms.find({}, function (err, result) {
        if (err != null) throw err;
        res.render('index', {data: result});
        console.log(result[0]._image)
    })
});

router.get('/danhSach', function (req, res, next) {
    BAIVIET.find({}, function (err, result) {
        if (err != null) throw err;
        res.render('danhsach', {data: result});
    })
});

router.get('/insertForm/', function (req, res) {
    types.find({}, function (error, result) {
        if (error != null) throw error;
        res.render('insert', {title: 'Insert', data: result})
        console.log(result.length)
    })
});

router.post('/insert', function (req, res, next) {

    upload(req, res, function (err) {
        if (err != null) {
            res.send(err.message)
        } else {
            // _room_name: String,
            //     _intro: String,
            //     _description: String,
            //     _number: Number,
            //     _price: Number,
            //     _image: String,
            let _room_name = req.body._room_name;
            let _intro = req.body._intro;
            let _description = req.body._description;
            let _number = req.body._number;
            let _price = req.body._price;
            let _type = "single room"
            let _image = req.files[0].path;
            _image = _image.replace('public', '');
            console.log(_image);
            rooms.insertMany({
                _room_name: _room_name,
                _intro: _intro,
                _description: _description,
                _number: _number,
                _price: _price,
                _image: _image,
                _type: _type
            }, function (error, result) {
                if (error) throw error;
                // res.json({
                //     _room_name: _room_name,
                //     _intro: _intro,
                //     _description: _description,
                //     _number: _number,
                //     _price: _price,
                //     _image: _image,
                //     _type: _type
                // })
                res.redirect('/');
            })
        }
    })
});
router.get('/updateForm/', function (req, res) {
    const id = req.query.id;
    rooms.findOne({_id: id}, function (error, result) {
        res.render('upload', {TieuDe:'Update',data: result})
    })
})
router.post('/update', async function (req, res) {
    let id = req.body._id
    let _room_name = req.body._room_name;
    let _intro = req.body._intro;
    let _description = req.body._description;
    let _number = req.body._number;
    let _price = req.body._price;
    let _type = "double room";
    let _image = req.body._image;
await rooms.updateOne({_id:id},{
    _room_name: _room_name,
    _intro: _intro,
    _description: _description,
    _number: _number,
    _price: _price,
    _image: _image,
    _type: _type
})
    res.redirect('/')
})
router.get('/delete/', function (req, res) {
    const id = req.query.id;
    rooms.deleteOne({_id: id}, function (error) {
        if (error) throw error;
        res.redirect('/')
    })
})
router.get('/getUser', function (req, res) {
    BAIVIET.find({}, function (err, result) {
        if (err) throw err;
        res.send(result);
    })
})


module.exports = router;
