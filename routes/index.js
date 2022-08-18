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
        if (ten.indexOf('.jpg') > -1) {
            cb(null, true);
        } else {
            cb(new Error("Duoi file phai la JPG"), false);
        }

        if (ten.length > 14) {
            cb(new Error("Ten File phai duoi 10 ky tu"), false);
        }

    }
}).array('_anh', 3);

const uri = "mongodb+srv://YingMing:01672545642Aa@cluster0.b8mwo.mongodb.net/Thi?retryWrites=true&w=majority";
mongoose.connect(uri).catch(err => console.log(err));


const BAIVIET = mongoose.model('baiviets', new Schema({
    _tieude: String,
    _noidung: String,
    _baiviet: String,
    _anh: String,
}))


/* GET home page. */
router.get('/', function (req, res, next) {
    // BAIVIET.find({}, function (err, result) {
    //     if (err != null) throw err;
    //     res.render('index', {data: result});
    // })
    BAIVIET.find({}, function (err, result) {
        if (err != null) throw err;
        res.render('index', {data: result});
    })
});

router.get('/danhSach', function (req, res, next) {
    BAIVIET.find({}, function (err, result) {
        if (err != null) throw err;
        res.render('danhsach', {data: result});
    })
});

router.get('/insertForm/', function (req, res) {
    res.render('insert', {title: 'Insert'})
});

router.post('/insert', function (req, res, next) {

    upload(req, res, function (err) {
        if (err != null) {
            res.send(err.message)
        } else {
            let _tieude = req.body._tieude;
            let _noidung = req.body._noidung;
            let _baiviet = req.body._baiviet;
            let _anh = req.files[0].path;
            _anh = _anh.replace('public', '');
            console.log(_anh);
            BAIVIET.insertMany({
                _tieude: _tieude,
                _noidung: _noidung,
                _baiviet: _baiviet,
                _anh: _anh
            }, function (error, result) {
                if (error) throw error;
                // res.json({
                //     _tieude: _tieude,
                //     _noidung: _noidung,
                //     _baiviet: _baiviet,
                //     _anh: _anh
                // })
                res.redirect('/');
            })
        }
    })
});
router.get('/delete/', function (req, res) {
    const id = req.query.id;
    BAIVIET.deleteOne({_id: id}, function (error) {
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
