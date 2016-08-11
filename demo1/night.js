function night(starCount, width, height, context) {
	this.starCount = starCount;
	this.width = width;
	this.height = height;
	this.context = context;
	this.meteorImg = new Image();
	this.meteorImg.src = "img/star@2x.png";
	this.stars = [];
	this.meteors = [];
	for (var i = 0 ; i < 4 ; i++) {
		var m = new meteor(-500+100*Math.random()-50, -500+100*Math.random()-50, 30);
		this.meteors.push(m);
	}
	for (var i = 0 ; i < starCount ; i++) {
		var s = new star(Math.random()*this.width,Math.random()*this.height, Math.random()*100);
		this.stars.push(s);
	}
	this.update = function() {
		this.context.clearRect(0, 0, 650, 400);
		for (var i = 0 ; i < starCount ; i++) {
			var s = this.stars[i];
			s.update();
			//console.log(s.opacity/100.0);
			this.context.beginPath(); 
            context.arc(s.x, s.y, 1.5, 0, 2*Math.PI, true); 
            this.context.closePath();  //路径关闭
            this.context.fillStyle = "rgba(255,255,255," + s.opacity/100.0 + ")"; //填充颜色
            this.context.fill();       //绘制
		}	
		for (var i = 0 ; i < 4 ; i++) {
			var m = this.meteors[i];
			m.update();
			cxt.drawImage(this.meteorImg, m.x, m.y, 101, 49);
		}	
	};
}
function star(x, y, opacity) {
	this.x = x;
	this.y = y;
	this.orien = false;
	this.opacity = opacity;
	this.update = function() {
		if (this.opacity < 0) {
			this.orien = true;
		}
		else if (this.opacity > 100) {
			this.orien = false;
		}
		this.opacity = this.orien ? this.opacity + 2 : this.opacity - 2;
	}
}
function meteor(x, y, angle) {
	this.x=x;
	this.y=y;
	this.angle=angle;
	this.acceleration = 0.1;
	this.speed = 5 + Math.random()*3-1.5; 
	this.update = function() {
		this.speed += this.acceleration;
		this.x = this.x + this.speed*Math.cos(this.angle/180*Math.PI);
		this.y = this.y + this.speed*Math.sin(this.angle/180*Math.PI);
		if (this.x > 1000) {
			this.x = -100+50*Math.random()-25;
			this.y = -100+50*Math.random()-25
			this.speed = 5 + Math.random()*3-1.5;
		}

	}
}