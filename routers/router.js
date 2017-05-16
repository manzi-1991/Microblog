'use strict';
const formidable = require('formidable');
const gm = require('gm');
const db = require('../models/db.js');
const md5 = require('../models/md5.js');
const fs = require('fs');
const path = require("path");

//显示首页
exports.showIndex = (req,res,next)=>{
	if(req.session.login == '1'){
		db.find('users',{"username":req.session.username},(err,result)=>{
			let avatar = result[0].avatar || 'moren.jpg';
			res.render('index',{
		    	"login":req.session.login == '1'?true:false,
		    	"username":req.session.login == '1'?req.session.username:'',
		    	"active":"首页",
		    	"avatar":avatar
   	 		})
		})
	}else{
		res.render('index',{
		    	"login":req.session.login == '1'?true:false,
		    	"username":req.session.login == '1'?req.session.username:'',
		    	"active":"首页",
		    	"avatar":'moren.jpg'
   	 	})
	}
	
   
}
//显示注册页面
exports.showRegist = (req,res,next)=>{
	res.render('regist',{
		"login":req.session.login == '1'?true:false,
    	"username":req.session.login == '1'?req.session.username:'',
    	"active":"注册"
	})
}
//审查注册并将新用户加入数据库
//别忘记引进formidable，md5,db
exports.doRegist = (req,res,next)=>{
	let form = new formidable.IncomingForm();
	form.parse(req,(err,fields,files)=>{
		if(err){
			res.send('-3')
		}
		//这里可以对username进行正则匹配
		//console.log(username.length)
		let username = fields.username;
		let password = fields.password;
		password = md5(md5(password)+'manzi');
		
		//对新注册用户进行检查，看看数据里有没有这个人
		db.find('users',{'username':username},(err,result)=>{
			if(err){
				//别忘记return
				res.send('-3');
				return;
			}
			if(result != 0){
				res.send('-1');
				return;
			}
			//通过以上验证，该用户可以加入数据库
			db.insertOne(
				'users',
				{
				"username":username,
				"password":password,
				"avatar":"moren.jpg"
				},
				(err,result)=>{
					if(err){
						res.send('-3')
					}
					//注册成功后别忘记设置session
					req.session.log = '1';
					req.session.username = username;
					//注册成功
					res.send('1');
				}
			)
		})
		
	})
}
//显示登录页面
exports.showLogin = (req,res,next)=>{
	res.render('login',{
		"login":req.session.login == '1'?true:false,
    	"username":req.session.login == '1'?req.session.username:'',
    	"active":"登录"
	})
}
//处理登录提交过来的数据
exports.doLogin = (req,res,next)=>{
	let form = new formidable.IncomingForm();
	form.parse(req,(err,fields,files)=>{
		if(err){
			res.send('-5');
			return;
		}
		//获得用户登录的账号密码
		let username = fields.username;
		let password = fields.password;
		console.log(username)
		//将密码进行正面加密，然后与数据库当中的密码匹配
		let md5Crypto = md5(md5(password)+'manzi');
		db.find('users',{'username':username},(err,result)=>{
			if(err){
				res.send('-5');
				return;
			}
			//如过result.length 为0的话，那么用户不存在，返回-1
			if(result.length == 0){
				res.send('-1');
				return;
			}
			//如果用户名存在，但是密码错误的话。返回-2	
			if(md5Crypto != result[0].password){
				res.send('-2');
				return;
			}
			//通过以上的过滤，便可判断用户为真实用户了
			//此时，便可设置session了
			req.session.login = '1';
			req.session.username = username;
			//res返回登录成功值
			res.send('1');
		})
		
	})
}
//登出
exports.doLogout = (req,res,next)=>{
	req.session.login='';
	res.redirect('/');
}
//显示上传头像页面
exports.showSetavatar = (req,res,next)=>{
	//这个页面必然是已经登录过的
	if(req.session.login != '1'){
		res.end('站住，这里是禁地，没有令牌，不得通过，桀桀！');
		return;
	}
	res.render('setavatar',{
		"login":req.session.login == '1'?true:false,
    	"username":req.session.login == '1'?req.session.username:'',
    	"active":"修改头像" 
	})
}
//执行上传头像
exports.doSetavatar = (req,res,next)=>{
	//这个页面必然是已经登录过的
	if(req.session.login != '1'){
		res.end('站住，这里是禁地，没有令牌，不得通过，桀桀！');
		return;
	}
	let form = new formidable.IncomingForm();
	form.uploadDir = path.normalize(__dirname + "/../avatar");
	form.parse(req,(err,fields,files)=>{
		//console.log(files);
		//将存入avatar的文件进行改名
		//upload_903971ea1e8300040a34463ac77ba5ac
		//-----注意：路径很关键，名字也很关键
		let username = req.session.username;
		let oldpath = files.headPic.path;
		let newpath = path.normalize(__dirname + "/../avatar")+'/'+username+'.jpg';
		fs.rename(oldpath,newpath,err=>{
			if(err){
				res.send('上传错误，请重试');
				return;
			}
			//图片改名成功后，req.session.avatar需要改变，这样方便存入数据库
			//扩展名是 .jpg 别忘记   点
			req.session.avatar = req.session.username + '.jpg';
			//跳转裁切页面
			res.redirect('/cut');
		})
	})
}
//显示裁切页面
exports.showCut = (req,res,next)=>{
	//这个页面必然是已经登录过的
	if(req.session.login != '1'){
		res.end('站住，这里是禁地，没有令牌，不得通过，桀桀！');
		return;
	};
	//console.log(req.session.avatar);
	res.render('cut',{
		//要将avatar传入cut.ejs，cut的img.src需要avatar这个路径
		"avatar":req.session.avatar
	})
	
}
//裁切头像并存入数据库，前端收到响应后跳转首页
exports.doCut = (req,res,next)=>{
	
	let form = new formidable.IncomingForm();
	form.parse(req,(err,fields,files)=>{
		//console.log(fields);
		let filename = req.session.avatar;
		let w = fields.w;
		let h = fields.h;
		let x= fields.x;
		let y = fields.y;
		//gm的是从自身出发，而不是文件所在路径
		//注意：理解gm裁切的原理，从后台提取avatar里的图片，按照前台传来的数据，按照约定比例裁切，然后替换原图片
		//  错误：./avatar   正确： ./avatar/
		gm('./avatar/'+filename)
			.crop(w,h,x,y)
			.resize(100,100,'!')
			.write('./avatar/'+filename,err=>{
				if (err) {
					console.log(err);
                	res.send("-1");
                	return;
            	}
				//最后一步，则是将已经裁切好的图片的地址存入数据库
				//不管是更新一个还是更新很多，都用db.updateMany
				//不要写错了底层DAO的方法
				db.updateMany(
					'users',
					{"username":req.session.username},
					{$set:{'avatar':req.session.avatar}},
					(err,result)=>{
						if (err) {
							console.log(err);
                			res.send("-1");
                			return;
            			}
						//裁切并保存成功，
						res.send('1');
					})
			})
	})
}
//发表说说
exports.doDeliver = (req,res,next)=>{
	let form = new formidable.IncomingForm();
	form.parse(req,(err,fields,files)=>{
		let content = fields.content;
		db.insertOne(
			'posts',
			{
				"username":req.session.username,
				"datetime":new Date(),
				"content":content
			},
			(err,result)=>{
				if(err){
					res.send('-1');
					return;
				}
				//发表说说成功，已经存入数据库，给予前端相应
				res.send('1');
			}
		)
		
	})
}
//获取说说总数
exports.getShuoamount = (req,res,next)=>{
	//这个函数最后的回调传参只有count，并且需要toString
	//原因是如果发送数字的话，会以为是发送状态码
	//express deprecated res.send(status): Use res.sendStatus(status) instead routers\router.js:263:7
	db.getAllCount('posts',count=>{
		res.send(count.toString());
	})
}
//获取分页说说的内容
exports.getPageshuo = (req,res,next)=>{
	//从前台ajax传来的第几页的页面内容请求
	let page = req.query.page;
	//寻找相对应页面内容，并且res.json回去，也可以直接send，因为result是数组
	
	db.find(
		'posts',
		{},
		{"pageamount":20,"page":page,"sort":{"datetime":-1}},
		(err,result)=>{
			//console.log(result);
			//这里是res可以用send，也可以用json，注意，如果不是逻辑的最后，最好加上一个json，这样可以避免出错
			res.send(result);
			//console.log('1');
		}
	)
}
//获取分页内容是，还要把对应的用户信息加入其中，进行数据的结合，聚合
exports.getUsersinfo = (req,res,next)=>{
	//获得前台传来的username（是从getPageshuo里面拿到的）
	let username = req.query.username;
	db.find(
		'users',
		{"username":username},
		(err,result)=>{
			if(err || result.length==0){
				res.json('');
			}
			//将获得的密码信息进行过滤
			//result是数组
			let obj = {
				"username":result[0].username,
				"_id":result[0]._id,
				"avatar":result[0].avatar
				
			}
			//将obj发送给前台
			res.json(obj);
			//在res.json之后会执行console.log('1')，所以最好加return
			return;
		}
	)
}
//显示用户所有的说说
exports.showUserposts = (req,res,next)=>{
	//app.get('/user/:user',router.showUserposts);
	//username查posts可能有多条，查users只有一条
	let user = req.params['user'];
	db.find('posts',{"username":user},(err,result)=>{
		db.find('users',{"username":user},(err,result2)=>{	
			res.render(
				'user',
				{
					//login,username,active是用来固定渲染header.ejs
				"login":req.session.login == '1'?true:false,
				"username":req.session.login == "1" ? req.session.username : "",
				"active":"我的说说",
				"user":user,
				"avatar":result2[0].avatar,
				"content":result
				}
				
				
			)
		})//少了一个小括号SyntaxError: missing ) after argument list
	})
}
//展示所有用户
//Error: Route.get() requires callback functions but got a [object Undefined]
//showUserlist 这里写错了就是这个错误
exports.showUserlist = (req,res,next)=>{
	db.find('users',{},(err,result)=>{
		if(err){
			res.send('该页面正在维护中！');
			return;
		}
		res.render(
			'userlist',
			{
			"login":req.session.login == '1'?true:false,
			"username":req.session.login == "1" ? req.session.username : "",
			"active":"成员列表",
			"alluserinfo":result
			}
		)
	})
}