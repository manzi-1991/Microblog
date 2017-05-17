# 首先是下载使用说明
1. git clone之后，先用npm安装好所需要的第三方包，package.json我已经配置好了，只需要在app.js所在目录打开cmd，输入npm install便可安装所需包
2. 安装mongoDB，并且如何配置配置环境变量，使用全局命令，可能需要您自己进行学习了
3. 将shushuo文件夹的内容清空；我在settings设定了数据库的数据库名称  'dburl':'mongodb://localhost:27017/shuoshuo'
4. 开机数据库：安装好包之后，app.js所在目录另开一个命令行，输入mongod --dbpath [shuoshuo的绝对路径]
5. 使用mongoDB：app.js所在目录再另开一个命令行，输入mongo
6. 运行app.js：在第一步所在cmd输入 node app.js  便可前往浏览器了
7. 输入  http://127.0.0.1:3000/  便可以进行登录了
8. 以上步骤如果没有出错的话，那就是运行成功了，么么哒，哈哈
  
# Microblog前提准备工作与说明
## 初始化
* npm init
* npm install --save exprsee express-session ejs formidable gm mongdb
## 安装第三方包
* express 框架
* mongdb 数据库
* ejs 模板
* express-session 记录登录状态
* formidable 拿到上传文件
* gm 裁切图片

## 文件设置：
* MVC：models views routers	
* 静态文件：public avatar
* app.js 最上层控制器
* settings：数据库所在路径 module.exports
##功能说明：
* 注册、登录、退出、个人资料设置（上传头像）
* 发表说说、展示所有人说说、查看别人说说
## 数据说明：
* 一个库，两个集合
* shuoshuo库 users集合储存用户信息  post集合储存评论相关信息
* users集合 eg:{_oid:assa5555sa,"username":"小明","password":MD5多重加密,"avatar":"20170506****","sign":"lonely"}
* post 集合 eg:{"title":"标题","content":"内容","date":"2017-05-06 15:32","author":"小明","comments":"很多的评论"}
## 业务顺序：
1. 注册业务
2. 登录业务
3. 退出	
4. 个人资料设置业务（上传头像、裁切头像）
5.	发表说说、展示所有人说说、查看别人说说
## 数据接口的封装
* mdels数据接口的封装
***
# 注册业务
1. 渲染注册页面  app.get('/regist',router.showRegist);
1. 点击注册按钮	app.post('/doregist',router.doRegist);	
2. router的异步操作函数调用 models的底层访问数据库接口
3. 返回前台数据‘1’，说明注册成功，并且设置好req.session.login和req.session.username，跳转首页
***
# 登录业务
1. 渲染登录页面  app.get('/login',router.showLogin); 
2. 点击登录按钮	app.get('/logout',router.doLogout);	
3. router的异步操作函数调用 models的底层访问数据库接口
4. 返回前台数据‘1’，说明注册成功，并且设置好req.session.login和req.session.username，跳转首页
5. `难点在于：md5将获得的密码进行正面加密，并与数据库进行比对`
***
# 退出业务
1. 直接点击首页导航栏的退出按钮，清除session，跳转首页，便是退出了
***
# 个人资料设置业务
1. 渲染设置头像页面 	app.get('/setavatar',router.showSetavatar);
2. 点击上传图片按钮  	app.post('/dosetavatar',router.doSetavatar);
3. 跳转裁切页面         	app.get('/cut',router.showCut);	
4. 进行裁切头像操作 	app.post('/docut',router.doCut);
5. 裁切完毕 ，头像路径存入数据库，发送响应，前台跳转首页
6. `难点：获取上传照片并进行存储和将前台放的裁切数据进行服务器处理`
***
# 发表说说业务
1. 首先登陆，显示发表说说的页面，通过req.session.login来控制是否显示
2. 点击发表说说 app.post('/deliver',router.doDeliver);
3. 将说说存入数据库，获得响应后，再次触发ajax，请求该用户刚才发表的说说，插入页面
4. `难点：第三步，我还没写，按照最新发表的时间进行检索数据库编号`
***
# 展示所有人说说
1. 现获取数据库posts的所有条数，然后按照20条说说一页，在前台生成页码；当然默认第一页就有数据
2. 点击页码，触发ajax，请求页码所对应的数据
3. `难点：获得posts数据后，还要根据result[i].username来请求头像，异步套同步不成功，所以采用了迭代器`
***
# 查看别人说说
1. 首页登录成功后会出现一个`我的说说`,点击我的说说，变会请求到用户所发过的所有说说
2. 然后用户列表会列出所有的用户，点击该用户，便会出现该用户的所有说说
3. 用户列表的用户的详情模块与`我的说说`模块是通用的
***
# 总结
* models层的数据接口封装还不是很熟悉
* 头像的设置和裁切，还有点生疏
* 展示所有用户的说说并且分页，这个逻辑需要重点掌握
* 前后端分离，前端这块尽量用ajax和模板引擎，node这块尽量只负责发送数据






