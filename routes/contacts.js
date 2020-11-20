var express = require('express');
var router = express.Router();
var Contact = require('../models/Contact');

// Contacts - Index
router.get('/', function(req, res){
    Contact.find({}, function(err, contacts){       // DB에서 검색조건에 맞는 모델을 찾고 콜백함수를 호출하는 함수
        if(err) return res.json(err);
        res.render('contacts/index', {contacts : contacts});
    });
});
// Contacts - New
router.get('/new', function(req, res){
    res.render('contacts/new');
});
// Contacts - create
router.post('/', function(req, res){
    Contact.create(req.body, function(err, contact){// DB에 data를 생성하는 함수
        if(err) return res.json(err);
        res.redirect('/contacts');
    });
});
// Contacts - Show
router.get('/:id', function(req, res){        // route에 콜론(:)을 사용하면 해당 위치의 값을 받아 req.params에 넣음.
    Contact.findOne({_id : req.params.id}, function(err, contact){  // DB에서 해당 model의 document를 하나 찾는 함수
        if(err) return res.json(err);
        res.render('contacts/show', {contact : contact});
    });
});
// Contacts - Edit
router.get('/:id/edit', function(req, res){
    Contact.findOne({_id : req.params.id}, function(err, contact){
        if(err) return res.json(err);
        res.render('contacts/edit', {contact : contact});
    });
});
// Contacts - Update
router.post('/:id/update', function(req, res){
    Contact.findOneAndUpdate({_id : req.params.id}, req.body, function(err, contact){   // DB에서 해당 model의 document를 하나 찾아 그 data를 수정하는 함수
        if(err) return res.json(err);
        res.redirect('/contacts/'+req.params.id);
    });
});
// Contacts - Destroy
router.post('/:id/destroy', function(req, res){
    Contact.deleteOne({_id : req.params.id}, function(err){         // DB에서 해당 model의 document를 하나 찾아 삭제하는 함수
        if(err) return res.json(err);
        res.redirect('/contacts');
    });
});

module.exports = router;