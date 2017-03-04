	/**初始化阶段**/
	var canvas=document.getElementById("canvas");//获取canvas元素
	var context=canvas.getContext("2d");
	const WIDTH=canvas.width;//获取canvas宽
	const HEIGHT=canvas.height;//获取canvas高
	const START=0;//游戏的五个状态
	const STARTTING=1;
	const RUNNING=2;
	const PAUSED=3;
	const GAMEOVER=4;
	var state=0;//游戏所处状态
	var score=0;//得分
	var life=3;//游戏生命值
	
	
	/**游戏开始阶段**/
	//背景图片
	var bg=new Image();
	//bg.src="images/background1.png";
	//bg.src="images/background2.jpg";
	bg.src="images/background2_1.png";
	//初始化背景图片数据
	var BG={
		imgs:bg,
		width:480,
		height:852	
	}
	//背景图片构造器
	function Bg(config){
		this.imgs=config.imgs;//接收图片数据
		this.width=config.width;
		this.height=config.height;
		this.y1=0;//图片1 Y坐标
		this.y2=-this.height;//图片2 Y坐标
		this.paint=function(cxt){//绘制背景图片
			cxt.drawImage(this.imgs,0,this.y1);
			cxt.drawImage(this.imgs,0,this.y2);
		}
		//动画方法
		this.step=function(){
			this.y1++;
			this.y2++;
			if(this.y2==0){
				this.y1=-this.height;
			}
			if(this.y1==0){
				this.y2=-this.height;
			}
		}
	}
	//创建背景对象
	var backg=new Bg(BG);
	var logo=new Image();//logo
	logo.src="images/start.png";

	//游戏状态1->2
	canvas.onclick=function(){
		if(state==START){
			state=STARTTING;
		}
	}
	
	
	/**游戏过度阶段**/
	//定义数组存储四张加载图片
	var loadings=[];
	loadings[0]=new Image();
	loadings[0].src="images/game_loading1.png";
	loadings[1]=new Image();
	loadings[1].src="images/game_loading2.png";
	loadings[2]=new Image();
	loadings[2].src="images/game_loading3.png";
	loadings[3]=new Image();
	loadings[3].src="images/game_loading4.png";
	//初始化加载动画图片数据
	var LOADING={
		imgs:loadings,
		width:186,
		height:38,
		sum:loadings.length
	}
	//加载动画图片构造器
	function Loading(config){
		this.imgs=config.imgs;//接收相关数据
		this.width=config.width;
		this.height=config.height;
		this.sum=config.sum;
		this.frameIndex=0;//图片角标
		//绘制方法
		this.paint=function(cxt){
			cxt.drawImage(this.imgs[this.frameIndex],0,HEIGHT-this.height);
		}
		//定义表示相对速度的变量
		this.speed=0;
		this.step=function(){
			this.speed++;//延长加载动画时间
			if(this.speed%2==0){
				this.frameIndex++;
			}
			if(this.frameIndex==4){
				state=RUNNING;
			}
		}
	}
	var loading=new Loading(LOADING);//加载图片对象
	
	
	/**游戏运行阶段**/
	//创建数组存储我方飞机图片
	var heros=[];
	heros[0]=new Image();
	heros[0].src="images/plane1.png";
	heros[1]=new Image();
	heros[1].src="images/plane1.png";
	heros[2]=new Image();
	heros[2].src="images/hero_blowup_n1.png";
	heros[3]=new Image();
	heros[3].src="images/hero_blowup_n2.png";
	heros[4]=new Image();
	heros[4].src="images/hero_blowup_n3.png";
	heros[5]=new Image();
	heros[5].src="images/hero_blowup_n4.png";
	//初始化我方飞机数据
	var HERO={
		imgs:heros,
		width:99,
		height:124,
		sum:heros.length
	}
	//我方飞机构造器
	function Hero(config){
		this.imgs=config.imgs;
		this.width=config.width;
		this.height=config.height;
		this.sum=config.sum;
		//初始化我方飞机的坐标
		this.x = (WIDTH-this.width)/2;
		this.y = HEIGHT-this.height-30;
		this.frameIndex=0;//定义图片数组的索引值
		this.down=false;//定义是否执行爆破的标志
		//绘制方法
		this.paint=function(cxt){
			cxt.drawImage(this.imgs[this.frameIndex],this.x,this.y);
		}
		//动画方法
		this.step=function(){		
			if(this.down){
				this.frameIndex++;
				if(this.frameIndex==this.sum){
					this.frameIndex=this.sum-1;
					life--;
					if(life==0){
						state=GAMEOVER;
					}else{
						hero=new Hero(HERO);
					}					
				}
			}else{
				this.frameIndex = (++this.frameIndex)%2;
			}		
		}
		//射击方法
		this.shoot=function(){
			bullets.push(new Bullet(BULLET));//向数组添加子弹对象
		}
		//撞击后爆破方法
		this.canDown=function(){
			this.down=true;//执行爆破动画
			this.frameIndex=2;//切换图片
		}
	}
	var hero=new Hero(HERO);//我方飞机对象
	
	canvas.onmousemove=function(event){
		//设置我方飞机坐标为鼠标坐标
		if(state==RUNNING){
			hero.x=event.offsetX-hero.width/2;
			hero.y=event.offsetY-hero.height/2;
		}		
	}
	
	
	/**子弹功能**/
	var bullet=new Image();
	//bullet.src="images/bullet1.png";
	//bullet.src="images/shell.png";
	bullet.src="images/shell2c.png";
	var BULLET={//初始化子弹数据
		imgs:bullet,
		width:9,
		height:21
	}
	//定义子弹构造器
	function Bullet(config){
		this.imgs=config.imgs;
		this.width=config.width;
		this.height=config.height;
		//定义子弹坐标
		this.x=hero.x+hero.width/2-this.width/2-10;
		this.y=hero.y-this.height-20;
		//是否允许删除子弹
		this.del=false;
		this.add=0;//定义x每次增加的大小
		this.paint=function(cxt){
			//直弹效果
			cxt.drawImage(this.imgs,this.x,this.y);
			//左右散弹效果
			//cxt.drawImage(this.imgs,this.x-this.add,this.y);
			//cxt.drawImage(this.imgs,this.x+this.add,this.y);
			
		}	

		this.step=function(){
			this.y-=50;
			//this.add+=8;//散弹x偏移量
		}
	}
	//创建存储子弹的数组
	var bullets=[];
	//定义绘制所有子弹的函数
	function paintBullets(){
		for(var i=0;i<bullets.length;i++){
			bullets[i].paint(context);
		}
	}
	//向上移动所有子弹的函数
	function stepBullets(){
		for(var i=0;i<bullets.length;i++){
			bullets[i].step();
		}
	}
	//移除飞出画面子弹的函数
	function delBullets(){
		for(var i=0;i<bullets.length;i++){
			if(bullets[i].y<=-bullets[i].height||bullets[i].del){
				bullets.splice(i,1);
			}
		}
	}
	
	
	/**敌机功能**/
	var enemy1=[];
	var enemy2=[];
	var enemy3=[];
	//小飞机
	enemy1[0]=new Image();
	enemy1[0].src="images/enemy1.png";
	enemy1[1]=new Image();
	enemy1[1].src="images/enemy1_down1.png";
	enemy1[2]=new Image();
	enemy1[2].src="images/enemy1_down2.png";
	enemy1[3]=new Image();
	enemy1[3].src="images/enemy1_down3.png";
	enemy1[4]=new Image();
	enemy1[4].src="images/enemy1_down4.png";
	//中飞机										!!!!!!!
	enemy2[0]=new Image();
	enemy2[0].src="images/enemy2.png";
	enemy2[1]=new Image();
	enemy2[1].src="images/enemy2_down1.png";
	enemy2[2]=new Image();
	enemy2[2].src="images/enemy2_down2.png";
	enemy2[3]=new Image();
	enemy2[3].src="images/enemy2_down3.png";
	enemy2[4]=new Image();
	enemy2[4].src="images/enemy2_down4.png";
	//大飞机
	enemy3[0]=new Image();
	enemy3[0].src="images/enemy3_n1.png";
	enemy3[1]=new Image();
	enemy3[1].src="images/enemy3_n2.png";
	enemy3[2]=new Image();
	enemy3[2].src="images/enemy3_down1.png";
	enemy3[3]=new Image();
	enemy3[3].src="images/enemy3_down2.png";
	enemy3[4]=new Image();
	enemy3[4].src="images/enemy3_down3.png";
	enemy3[5]=new Image();
	enemy3[5].src="images/enemy3_down4.png";
	enemy3[6]=new Image();
	enemy3[6].src="images/enemy3_down5.png";
	enemy3[7]=new Image();
	enemy3[7].src="images/enemy3_down6.png";

	//初始化敌方飞机数据
	var ENEMY1={
		imgs:enemy1,
		width:57,
		height:51,
		sum:enemy1.length,
		type:1,
		life:1,//生命值
		score:1//分数值
	}
	var ENEMY2={
		imgs:enemy2,
		width:69,
		height:95,
		sum:enemy2.length,
		type:2,
		life:5,
		score:3
	}
	var ENEMY3={
		imgs:enemy3,
		width:169,
		height:258,
		sum:enemy3.length,
		type:3,
		life:20,
		score:10
	}
	//敌方飞机构造器
	function Enemy(config){
		this.imgs=config.imgs;
		this.width=config.width;
		this.height=config.height;
		this.sum=config.sum;
		this.type=config.type;
		this.life=config.life;//生命值
		this.score=config.score;//分数值
		//敌方飞机坐标
		this.x=Math.random()*(WIDTH-this.width);
		this.y=-this.height;
		//定义数组索引值
		this.frameIndex=0;
		this.down=false;
		//是否允许删除的标示
		this.del=false;
		//绘制方法
		this.paint=function(cxt){
			cxt.drawImage(this.imgs[this.frameIndex],this.x,this.y);
		}
		//移动方法
		this.step=function(){		
			if(this.down){
				this.add+=8;
				this.frameIndex++;
				if(this.frameIndex==this.sum){
					this.del=true;
					score+=this.score;//加分
					this.frameIndex=this.sum-1;
				}
			}else{
				switch(this.type){
					case 1:
						this.frameIndex=0;
						this.y+=10;
						break;
					case 2:
						this.frameIndex=0;
						this.y+=5;
						break;
					case 3:
						this.frameIndex=(this.frameIndex==0)?1:0;
						this.y++;
						break;
				}
			}				
		}
		//敌方飞机被撞规则
		this.hit=function(compont){
			return (compont.y+compont.height>=this.y&&
				   compont.x+compont.width>=this.x&&
			       compont.y<=this.height+this.y&&
			       compont.x<=this.width+this.x);
		}
		//敌方飞机被撞爆破方法
		this.canDown=function(){
			this.life--;
			if(this.life==0){
				this.down=true;
				if(this.type==3){
					this.frameIndex=2;
				}else{
					this.frameIndex=1;
				}
			}		
		}
	}
	
	
	//创建敌方飞机对象的数组
	var enemies=[];
	//敌方飞机生成函数
	function createEnemy(){
		var num=Math.random()*200;//随机生成的敌机数量
		if(num<=30){//小飞机
			enemies[enemies.length]=new Enemy(ENEMY1);//      !!!!!!!!!!
		}else if(num<=40){//中飞机
			enemies[enemies.length]=new Enemy(ENEMY2);
		}else if(num<=50){//大飞机
			//判断数组第一个元素，如果第一个是大飞机，就不再生成，否则就替代为大飞机
			if(enemies.length>0&&enemies[0].type!=3){
				enemies.splice(0,0,new Enemy(ENEMY3));
			}
		}
	}
	//绘制所有敌机方法
	function paintEnemies(){
		for(var i=0;i<enemies.length;i++){
			enemies[i].paint(context);
		}
	}
	//移动所有敌机方法
	function stepEnemies(){
		for(var i=0;i<enemies.length;i++){
			enemies[i].step();
		}
	}
	//移除飞出画面的敌机方法
function delEnemies(){
		for(var i=0;i<enemies.length;i++){
			if(enemies[i].y == HEIGHT||enemies[i].del){
				enemies.splice(i,1);
			}
		}
	}

	//定义函数判断当前敌机是否被撞
	function checkHit(){
		for(var i=0;i<enemies.length;i++){
			//两种情况  
			if(enemies[i].hit(hero)&&!hero.down&&!enemies[i].down){//1我放飞机撞
				hero.canDown();//我方飞机被撞
				enemies[i].canDown();
			}	
			//被子弹撞击
			for(var j=0;j<bullets.length;j++){//                     !!!!!!!!!!
				if(enemies[i].hit(bullets[j])&&!enemies[i].down){//2子弹撞
					bullets[j].del=true;
					enemies[i].canDown();
				}
			}
		}
	}
	
	//绘制游戏得分
	function paintText(){
		context.font="bold 24px 微软雅黑";
		context.fillStyle="blue";
		context.fillText("SCORE :"+score,10,20);
		context.fillText("LIFE :"+life,380,20);
	}

	//游戏暂停部分
	//鼠标移出
	canvas.onmouseout=function(){
		if(state==RUNNING){
			state=PAUSED;
		}
	}
	//鼠标移回
	canvas.onmouseover=function(){
		if(state==PAUSED){
			state=RUNNING;
		}
	}
	var paused=new Image();
	paused.src="images/game_pause_nor.png";
	paused.width=60;
	paused.height=45;

	//绘制GAMEOVER
	function paintOver(){
		context.font="bold 40px 微软雅黑";
		context.fillText("GAMEOVER",WIDTH/2-120,HEIGHT/2);
	}


	
	//***核心控制器***
	setInterval(function(){
		backg.paint(context);//绘制背景图片
		backg.step();//动画
		switch (state){
			case START:
				context.drawImage(logo,20,0);//绘制logo
				break;
			case STARTTING:
				loading.paint(context);
				loading.step();
				break;
			case RUNNING:
				hero.paint(context);//绘制方法
				hero.step();//动画方法
				hero.shoot();//射击方法
				paintBullets();//绘制所有子弹方法
				stepBullets();//向上移动所有子弹方法
				delBullets();//移除飞出画面的子弹
				createEnemy();//生成所有敌机的方法
				paintEnemies();//绘制所有敌机方法
				stepEnemies();//移动所欲敌机方法
				delEnemies();//移除飞出画面的敌机的方法
				checkHit();//
				paintText();//绘制分数和生命值
				break;
			case PAUSED:
				hero.paint(context);//绘制方法
				paintBullets();//绘制所有子弹方法
				paintEnemies();//绘制所有敌机方法
				paintText();//绘制分数和生命值
				context.drawImage(paused,WIDTH/2-paused.width/2,HEIGHT/2-paused.height/2);
				break;
			case GAMEOVER:
				hero.paint(context);//绘制方法
				paintBullets();//绘制所有子弹方法
				paintEnemies();//绘制敌方飞机的方法

				paintText();//绘制游戏得分和生命值
				paintOver();
				break;
		}
	},100);

/*
  存在问题
  1.部分飞机无法爆破

*/