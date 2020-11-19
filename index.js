var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');    // body-parser module를 bodyParser 변수에 담음
var app = express();

// DB Setting
// mongoose의 몇몇 글로벌 설정
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_DB);     // process.env는 환경변수들을 가지고 있는 객체, 'MONGO_DB'라는 이름의 환경변수 값을 불러옴
var db = mongoose.connection;               // mongoose의 db object를 가져와 db변수에 선언

// DB가 성공적으로 열렸을 경우
db.once('open', function(){
    console.log('DB Connected');
});

// DB 연결중 에러난 경우
db.on('error', function(){
    console.log('DB Error : ', err);
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());                 // json 형식의 데이터를 받겠다.
app.use(bodyParser.urlencoded({extended:true}));    // urlencoded data를 extended 알고리즘을 사용해 분석하겠다.

// DB schema
// DB에서 사용할 schema 설정
var contactSchema = mongoose.Schema({
    name : {type : String, required : true, unique : true},
    email : {type : String},
    phone : {type : String}
});
var Contact = mongoose.model('contact', contactSchema);// contact schema의 model을 생성

// Routes
// Route 설정
// Home
app.get('/', function(req, res){
    res.redirect('/contacts');
});
// Contacts - Index
app.get('/contacts', function(req, res){
    Contact.find({}, function(err, contacts){       // DB에서 검색조건에 맞는 모델을 찾고 콜백함수를 호출하는 함수
        if(err) return res.json(err);
        res.render('contacts/index', {contacts : contacts});
    });
});
// Contacts - New
app.get('/contacts/new', function(req, res){
    res.render('contacts/new');
});
// Contacts - create
app.post('/contacts', function(req, res){
    Contact.create(req.body, function(err, contact){// DB에 data를 생성하는 함수
        if(err) return res.json(err);
        res.redirect('/contacts');
    });
});
// Contacts - Show
app.get('/contacts/:id', function(req, res){        // route에 콜론(:)을 사용하면 해당 위치의 값을 받아 req.params에 넣음.
    Contact.findOne({_id : req.params.id}, function(err, contact){  // DB에서 해당 model의 document를 하나 찾는 함수
        if(err) return res.json(err);
        res.render('contacts/show', {contact : contact});
    });
});
// Contacts - Edit
app.get('/contacts/:id/edit', function(req, res){
    Contact.findOne({_id : req.params.id}, function(err, contact){
        if(err) return res.json(err);
        res.render('contacts/edit', {contact : contact});
    });
});
// Contacts - Update
app.post('/contacts/:id/update', function(req, res){
    Contact.findOneAndUpdate({_id : req.params.id}, req.body, function(err, contact){   // DB에서 해당 model의 document를 하나 찾아 그 data를 수정하는 함수
        if(err) return res.json(err);
        res.redirect('/contacts/'+req.params.id);
    });
});
// Contacts - Destroy
app.post('/contacts/:id/destroy', function(req, res){
    Contact.deleteOne({_id : req.params.id}, function(err){         // DB에서 해당 model의 document를 하나 찾아 삭제하는 함수
        if(err) return res.json(err);
        res.redirect('/contacts');
    });
});

// Port Setting
var port = 3000;
app.listen(port, function(){
    console.log('server on! http://localhost:' + port);
});