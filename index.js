const logman = require('./vendor/logs.js');
process.on('uncaughtException', (err) => {
  logman.log('Глобальный косяк приложения!!! ', err.stack);
}); //Если все пошло по пизде, спасет ситуацию
const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const exphbs = require('express-handlebars');
const session = require('express-session');

var ActiveDirectory = require('activedirectory');
var config = { url: 'ldap://panspb.local',
               baseDN: 'dc=panspb,dc=local',
               username: 'v.diakonov@panspb.local',
               password: '147258000' }
var ad = new ActiveDirectory(config);  

const app = express();
var i_count = 1
const hbs = exphbs.create({
defaultLayout: 'main',
extname: 'hbs',
helpers: {
  OK: function(){
    i_count = 1
  },
  I_C: function (opts){
    let anso = ''
    for (let i = 0; i < i_count; i++) {
      anso = anso + "I"
    }
    i_count++
    return anso
  },
  if_eq: function (a, b, opts) {
      if (a == b){ // Or === depending on your needs
         // logman.log(opts);
          return opts.fn(this);
       } else
          return opts.inverse(this);
  },
  if_more: function (a, b, opts) {
    if (a >= b){ // Or === depending on your needs
       // logman.log(opts);
        return opts.fn(this);
     } else
        return opts.inverse(this);
}
}
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views','views');
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({resave:false,saveUninitialized:false, secret: 'keyboard cat', cookie: {  }}))


var auth = false;
var usrinfo = false;
var autinfo = false;
app.use(function (req, res, next) {
  let page = req._parsedOriginalUrl.pathname;
  var ipinfo = getcurip(req.socket.remoteAddress)
  auth = isAuth(req);
    logman.log(`На ${page}\n IP: ${ipinfo} \n Auth: ${auth}`);
    console.dir(req.session.auth)
  if (page!='/auth'){
    if (!auth && ipinfo!=1){ //Я ИСКЛЮЧЕНИЕ
      if (page!='/') {
        res.redirect("/")
      } else
      res.render('auth',{
        title: 'Авторизация',
      });
    } else {
      next();
      }
  } else next();
});
app.get('/',(req,res)=>{
  let set = {s:12,m:3,h:3,l:3}
  var menu = [{
    link: "http://stud.pansion.spb.ru:502/",
    text: "Индивидуальный маршрут",
    pic: "stud.png",
  },
  {
    link: "http://news.pansion.spb.ru:500/",
    text: "Менеджер новостей",
    pic: "news.png",
  },
  {
    link: "https://ps01.pansion.spb.ru/owa/",
    text: "Почта Пансиона",
    pic: "outlook.png",
  },
  {
    link: "http://cloud.pansion.spb.ru:9008",
    text: "Общий ресурс",
    pic: "cloud.png",
  },
  {
    link: "http://otrs.pansion.spb.ru:7750/otrs/customer.pl",
    text: "Система электронных заявок",
    pic: "otrs.png",
  },
  {
    link: "http://otrs.pansion.spb.ru:7750/otrs/customer.pl",
    text: "Инструкции",
    pic: "manu.png",
  },
  {
    link: "/tel",
    text: "Телефонный справочник",
    pic: "phone.png",
  },
  ]
  
  res.render('index',{
    title: 'Сервисы',
    auth: auth,
    set: set,
    menu:menu
    //stat: statusarr,
    //content: news_resul   
  });
})
app.get('/tel',(req,res)=>{
  res.render('tel',{
    title: 'TEST',
    auth: auth,
    //stat: statusarr,
    //content: news_resul   
  });
})
app.get('/form',(req,res)=>{
  res.render('form',{
    title: 'TEST',
    auth: auth,
    //stat: statusarr,
    //content: news_resul   
  });
})
app.get('/auth', function(req, res) {
    logman.log('На сервер пришел пароль: '+req.query.pass);
    if (req.query.pass!=undefined) {
      ad.findUser(req.query.pass, function(err, user) {
        if (err) {
          logman.log('ERROR: ' +JSON.stringify(err));
          return;
        }
      
        if (!user) {
          logman.log('Пользователя:',req.query.pass,'нет в системе');
          req.session.auth = false;
          res.send('nok');
        }
        else {
          let arrn = user.displayName.split(" ")
          //dbworker.addipname(ipinfo.ip,`${arrn[0]} ${arrn[1]}`)
          console.dir(`${arrn[0]} ${arrn[1]}`);
          req.session.auth = getadmin(req.query.pass);
          res.send('ok');
          return true;
        }
      });  
    } else{
      logman.log('Зашел на страницу auth, отправлен на главную')
      req.session.auth = false;
      res.redirect("/")
      //res.send('nok');
    }
    
  
  })
app.get('*', function(req, res){
res.render('404', { 
    url: req.url,
    title: '404 Not Found',   
});
});
function isAuth(req){
  if (req.session.auth!=undefined){
    return req.session.auth;
  } else 
    return false; // ПЕРЕПИШИ
  } 
function getcurip(str) {
  let arr = str.split(':');
  arr = arr[arr.length-1];
  return arr;
}
function getadmin(str){
  switch (str) {
    case "v.diakonov":
      return 3
    break;
  }
  return 1
}

var PORT = process.env.PORT || 501; 
async function start(){
    try {
        app.listen(PORT,()=> {
          logman.log('Распределительный портал - запущен')
          logman.log('Порт:',PORT);
        })
    } catch (e) {
        logman.log(e);
    }
}
start()


