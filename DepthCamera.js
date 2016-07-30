(function() {
	"use strict";
	function DepthCamera() {
		this.layers = document.getElementsByClassName('layer');
		this.cameraMoveFunction = null;
		this.startTime = Date.now();
		this.startPos = [0, 0];
		this.targetPos = [0, 0];
		this.duration = -1;
		this.callback = new Array();
	}
	DepthCamera.prototype.update = function() {
		var location;
		var now = Date.now();
		// 有动画
		if (this.isRunning()) {
			// 函数驱动
			if (this.cameraMoveFunction != null) {
				var location = this.cameraMoveFunction(now - this.startTime);
			}
			// 非函数驱动
			else {
				var factor = (now - this.startTime)/parseFloat(this.duration);
				var factorResult;
				switch (this.type) {
					case this.MoveType.LINEAR:
						factorResult = AnimCurve.linear(factor);
						break;
					case this.MoveType.EASE:
						factorResult = AnimCurve.ease(factor);
						console.log("EASE!!!!!!!!!");
						break;
					case this.MoveType.ELASTIC:
						factorResult = AnimCurve.elastic(factor);
						console.log("ELASTIC!!!!!!!!!");
						break;
					case this.MoveType.SWING:
						factorResult = AnimCurve.swing(factor);
						console.log("SWING!!!!!!!!!");
						break;
					case this.MoveType.BOUNCE:
						factorResult = AnimCurve.bounce(factor);
						console.log("BOUNCE!!!!!!!!!");
						break;
					default:
						factorResult = AnimCurve.linear(factor);
						break;
				}
				var x = this.startPos[0] + (this.targetPos[0] - this.startPos[0])*factorResult;
				var y = this.startPos[1] + (this.targetPos[1] - this.startPos[1])*factorResult;
				console.log("" + factor + "       " + factorResult);
				location = [x, y];
			}
			this.updatePos(location);
			requestAnimationFrame(this.update.bind(this));
		} else {
			// 时间结束且存在回调，执行回调
			if (this.callback.length != 0){
				this.reset();
				console.log("callback" + this.callback[0]);
				(this.callback.shift())();
			}
		}
	};
	DepthCamera.prototype.updatePos = function(pos) {
		// 更新各layer属性
		for (var i = 0 ; i < this.layers.length ; i++) {
			var layer = this.layers[i];
			try {
				var depth = parseFloat(layer.attributes["depth"].value);
			} catch(err) {
				console.error(layer);
				console.error("请给该标签添加[depth]属性");
			}
			setVendor(layer, "transform", "translate3d(" + (pos[0] / depth) + "px, " + (pos[1] / depth) +"px, " + (-depth*100) + "px)");
		}
	}
	DepthCamera.prototype.set = function(target) {
		if (this.isRunning()) {
			var camera = this;
			this.callback.push(function() {camera.set(target);});
			return this;
		}
		this.targetPos = target;
		this.updatePos(target);
		// 存在回调，执行回调
		this.reset();
		if (this.callback.length != 0){
			console.log("callback" + this.callback[0]);
			(this.callback.shift())();
		}
		return this;
	};
	DepthCamera.prototype.moveTo = function(target, duration, type = this.MoveType.LINEAR, callback = null) {
		if (this.isRunning()) {
			var camera = this;
			this.callback.push(function() {camera.moveTo(target, duration, type, callback);});
			return this;
		}
		this.targetPos = target;
		this.startTime = Date.now();
		this.duration = duration;
		this.type = type;
		if (callback != null)
			this.callback.push(callback);
		console.log("MoveTo" + this.duration);
		this.update();
		return this;
	};
	DepthCamera.prototype.exec = function(f, duration, callback = null) {
		if (this.isRunning()) {
			var camera = this;
			this.callback.push(function() {camera.exec(f, duration, callback);});
			return this;
		}
		this.cameraMoveFunction = f;
		this.duration = duration;
		this.startTime = Date.now();
		if (callback != null)
			this.callback.push(callback);
		this.update();
		return this;
	};
	DepthCamera.prototype.cancel = function() {
		this.cameraMoveFunction = null;
	};
	DepthCamera.prototype.MoveType = {
		"LINEAR": 0,
		"EASE": 1,
		"ELASTIC": 2,
		"SWING": 3,
		"BOUNCE": 4
	};
	DepthCamera.prototype.reset = function() {
		this.cameraMoveFunction = null;
		this.startTime = Date.now();
		// 重置初始位和目标位一致
		this.startPos = this.targetPos;
		this.duration = -1;
		this.type = this.MoveType.LINEAR;
	};
	DepthCamera.prototype.isRunning = function() {
		return (this.duration >= (Date.now() - this.startTime));
	};

	function setVendor(element, property, value) {
	  element.style["webkit" + property] = value;
	  element.style["moz" + property] = value;
	  element.style["ms" + property] = value;
	  element.style["o" + property] = value;
	  element.style[property] = value;
	}
	var AnimCurve = {
		"linear" : function(factor) {
			return factor;
		}, 
		"ease" : function(factor) {
			if ((factor/=0.5) < 1) return 0.5*Math.pow(factor,4);
    		return -0.5 * ((factor-=2)*Math.pow(factor,3) - 2);
		},
		"elastic": function(factor) {
		    return -1 * Math.pow(4,-8*factor) * Math.sin((factor*6-1)*(2*Math.PI)/2) + 1;
		},
		"swing": function(factor) {
		    var s = 1.70158;
    		return (factor-=1)*factor*((s+1)*factor + s) + 1;
		},
		"bounce": function(factor) {
			if (factor < (1/2.75)) {
		      return (7.5625*factor*factor);
		    } else if (factor < (2/2.75)) {
		      return (7.5625*(factor-=(1.5/2.75))*factor + 0.75);
		    } else if (factor < (2.5/2.75)) {
		      return (7.5625*(factor-=(2.25/2.75))*factor + 0.9375);
		    } else {
		      return (7.5625*(factor-=(2.625/2.75))*factor + 0.984375);
		    }
		}
	};
	window['DepthCamera'] = DepthCamera;
})();