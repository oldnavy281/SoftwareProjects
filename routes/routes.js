// var express = require('express');
// var router = express.Router();

// router.get('/', function(req, res, next){
//     return res.render('index', {title:'AH'});
// });

exports.index = (req, res) =>{
    res.render('index',{
        title:"HI"
    });
};

