const express = require('express');
const app = express();
const router = require('./routers/router.js');
const session = require('express-session');

//使用session
app.use(session({
    secret:'keyboard cat',
     resave: false,
    saveUninitialized: true
}))

//设置静态资源
app.use(express.static('./public'));
app.use('/avatar',express.static('./avatar'));

//设置模板引擎（后端）
app.set('view engine','ejs');

//路由表

app.get('/',router.showIndex); 				//显示首页
app.get('/regist',router.showRegist);		//显示注册页面
app.post('/doregist',router.doRegist);		//执行注册操作
app.get('/login',router.showLogin); 		//显示登录页面
app.get('/logout',router.doLogout);			//登出
app.post('/dologin',router.doLogin);		//执行登录操作
app.get('/setavatar',router.showSetavatar);	//显示上传头像页面
app.post('/dosetavatar',router.doSetavatar);//上传头像
app.get('/cut',router.showCut);				//显示裁切页面
app.post('/docut',router.doCut);			//裁切头像并存入数据库，前端收到响应后跳转首页
app.post('/deliver',router.doDeliver);		//发表说说
app.get('/getshuoamount',router.getShuoamount); //获得posts文档总条数
app.get('/getpageshuo',router.getPageshuo);		//获得当前页数对应条数的说说信息
//Route.get() requires callback functions but got a [object Undefined]
//小心getUsersinfo与exports.getusersinfo  不一样
app.get('/getusersinfo',router.getUsersinfo);	//获得说说内容之后，还要匹配相应的用户信息，比如头像；此时，关系型数据库的外键和聚合优势就出来了
app.get('/user/:user',router.showUserposts);	//展示当前用户的所有说说
app.get('/userlist',router.showUserlist);		//展示所有用户




//监听端口
app.listen(3000);