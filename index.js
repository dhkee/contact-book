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

// Routes
app.use('/', require('./routes/home'));
app.use('/contacts', require('./routes/contacts'));

// Port Setting
var port = 3000;
app.listen(port, function(){
    console.log('server on! http://localhost:' + port);
});