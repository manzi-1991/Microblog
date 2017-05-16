###Welcome to use MarkDown
一，前提准备工作
npm init
npm install --save exprsee express-session ejs formidable gm mongdb
	安装说明：
	express 框架
	mongdb 数据库
	ejs 模板
	
	express-session 记录登录状态
	formidable 拿到上传文件
	gm 裁切图片

文件设置：
	MVC：models views routers	
	静态文件：public avatar
	app.js 最上层控制器
	settings：数据库所在路径 module.exports
	
功能说明：
	注册、登录、个人资料设置（上传头像）
	发表说说、查看别人说说、点赞别人说说	
数据说明：
	一个库，两个集合
	shuoshuo库 users集合储存用户信息  post集合储存评论相关信息
	users集合 eg:{_oid:assa5555sa,"username":"小明","password":MD5多重加密,"avatar":"20170506****","sign":"lonely"}
	post 集合 eg:{"title":"标题","content":"内容","date":"2017-05-06 15:32","author":"小明","comments":"很多的评论"}
业务顺序：
	注册业务
	登录业务
	个人资料设置业务（上传头像、裁切头像）
-----------------------------------------------------------------------------------------------------------------------
二，注册业务
	app.js的路由 
	router的异步操作函数和 返回前台数据res.send res.json 或 返回ejs模板 res.render
	models的底层访问数据库借口DAO
