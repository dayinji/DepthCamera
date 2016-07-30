# DepthCamera
A Js Plugin for Web Parallax Effect

###Usage
**HTML**
import js file

        <script src="DepthCamera.js"></script>
add "layer" class name and depth attribute

        <div class="layer bg" depth="5"></div>
        <div class="layer tree" depth="4"></div>
        <div class="layer dog" depth="2"></div>
        <div class="layer role layer" depth="1"></div>
**JS**

        var p = new DepthCamera();
        p.set([0, 300]).moveTo([0, 0], 2000, p.MoveType.EASE);

![](http://i4.piimg.com/567571/b2b68b495aacd0ab.gif)

**JS**

        function cameraMove(t) {
            return [20*Math.sin(t/200.0), 20*Math.cos(t/200.0)];
        }
        var p = new DepthCamera();
        p.exec(cameraMove, 5000);

![](http://i4.piimg.com/567571/39e10d47e8a46cbf.gif)

###More
DepthCamera support Chained calls as follow:

`depthcamera.pause(2000).moveTo([100, 100]).exec(f, 2000).set([0, 0]);`

| Function      |
| :-------- |
| set([x, y])  |
| moveTo([x, y], duration = 1000, type = this.MoveType.EASE, callback = null)     | 
| pause(duration = 1000, callback = null)      | 
| exec(f, duration = 1000, callback = null)      | 
| isRunning()      |
 
| DepthCamera.MoveType      |
| :-------- |
| LINEAR  |
| EASE     | 
| ELASTIC      | 
| SWING      | 
| BOUNCE      | 
