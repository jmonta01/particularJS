particularJS
============

A particle engine for html5


Getting Started
ParticularJS was built from the ground up to have a low barrier of entry, at the same time allow for deep customability. Below are a couple of code samples to illustrate both ease of use and how deep a user can customize it.


Simple Demo
The simple demo shows how to quickly get started with ParticularJS.

<!DOCTYPE html>
<html>
  <head>
    <title>Particular JS Setup</title>
    <script>
      //<![CDATA[
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount','UA-34080401-1']);
        _gaq.push(['_setAllowLinker',true]);
        _gaq.push(['_setDomainName','none']);
        _gaq.push(['_trackPageview']);
        (function() {
          var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
          ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
          var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
      //]]>
    </script>
    <script src="/assets/particular/ParticularContexts.min.js?body=1" type="text/javascript"></script>
    <script src="/assets/particular/ParticularExts.min.js?body=1" type="text/javascript"></script>
    <script src="/assets/particular/ParticularCore.min.js?body=1" type="text/javascript"></script>
    <script>
      //<![CDATA[
        var canvas, context, emitter, emitter2;
        
          function initApp(){
              canvas = document.getElementById("mainCanvas");
              context = canvas.getContext("2d");
        
              var stageRenderCtx = new ParticularStageCanvasRenderContext(context);
              var particleRenderCtx = new ParticularImageParticleRenderContext();
              particleRenderCtx.addPhase({asset:document.getElementById('img1'),  alpha:1});
              emitter = new ParticularEmitter();
              emitter.init(
                      stageRenderCtx, particleRenderCtx,
                      {   x:40, y:canvas.height/2,
                          type:ParticularConfigProperties.DIRECTIONAL(),
                          rate:500, speed:3, angle:0, spread:.25,
                          lifeSpan:2, lifeSpanRandom:0}
              );
              emitter.start();
          }
      //]]>
    </script>
  </head>
  <body onload='initApp()'>
    <div>
      <img alt="Dot" id="img1" src="/assets/dot.png" />
    </div>
    <canvas height='600' id='mainCanvas' width='1000'>
      Your browser doesn't support canvas...tisk tisk
    </canvas>
  </body>
</html>

Advanced Demo
The advanced demo builds a sparkler that can be moved around by clicking on the canvas then moving the mouse.
<!DOCTYPE html>
<html>
  <head>
    <title>Sparkler</title>
    <script>
      //<![CDATA[
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount','UA-34080401-1']);
        _gaq.push(['_setAllowLinker',true]);
        _gaq.push(['_setDomainName','none']);
        _gaq.push(['_trackPageview']);
        (function() {
          var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
          ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
          var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
      //]]>
    </script>
    <script src="/assets/particular/ParticularContexts.min.js?body=1" type="text/javascript"></script>
    <script src="/assets/particular/ParticularExts.min.js?body=1" type="text/javascript"></script>
    <script src="/assets/particular/ParticularCore.min.js?body=1" type="text/javascript"></script>
    <script>
      //<![CDATA[
          var canvas, context, emitter, dragging = false;
        
          function initApp(){
              canvas = document.getElementById("mainCanvas");
        
              canvas.addEventListener('mousemove', function(evt) {
                  if(dragging){
                      var mousePos = getMousePos(canvas, evt);
                      emitter.x = mousePos.x;
                      emitter.y = mousePos.y;
                  }
              }, false);
        
        
              context = canvas.getContext("2d");
        
              var stageRenderCtx = new ParticularStageCanvasRenderContext(context);
              var particleRenderCtx = new ParticularImageParticleRenderContext();
              particleRenderCtx.addPhase({asset:document.getElementById('a1'),  alpha:1});
              particleRenderCtx.addPhase({asset:document.getElementById('a1'),  alpha:1});
              particleRenderCtx.addPhase({asset:document.getElementById('a1'),  alpha:.8});
              particleRenderCtx.addPhase({asset:document.getElementById('a3'),  alpha:.7});
              particleRenderCtx.addPhase({asset:document.getElementById('a3'),  alpha:.5});
              particleRenderCtx.addPhase({asset:document.getElementById('a4'),  alpha:.2});
              particleRenderCtx.addPhase({asset:document.getElementById('a2'),  alpha:.1});
              emitter = new ParticularEmitter();
              emitter.init(
                      stageRenderCtx, particleRenderCtx,
                      {   x:canvas.width/2, y:100,
                          type:ParticularConfigProperties.OMNI(),
                          rate:700, speed:2, speedRandom:1, angle:-90, spread:1,
                          lifeSpan:.75, lifeSpanRandom:1},
                      [
                          new ParticularGravityField(ParticularConfigProperties.FIELD_TYPE_VEL(), 0.1, ParticularPoint2D.Y_VEC())
                      ]
              );
              emitter.start();
          }
        
          function handleClick(){
              dragging = !dragging;
          }
        
          function getMousePos(canvas, evt) {
              var rect = canvas.getBoundingClientRect(), root = document.documentElement;
        
              // return relative mouse position
              var mouseX = evt.clientX - rect.top - root.scrollTop;
              var mouseY = evt.clientY - rect.left - root.scrollLeft;
              return {
                  x: mouseX,
                  y: mouseY
              };
          }
      //]]>
    </script>
    <style>
      /*<![CDATA[*/
        body{
            background-color: #000000;
        }
      /*]]>*/
    </style>
  </head>
  <body onload='initApp()'>
    <div>
      <img alt="1" id="a1" src="/assets/sparkler/1.png" />
      <img alt="2" id="a2" src="/assets/sparkler/2.png" />
      <img alt="3" id="a3" src="/assets/sparkler/3.png" />
      <img alt="4" id="a4" src="/assets/sparkler/4.png" />
    </div>
    <canvas height='600' id='mainCanvas' onclick='handleClick()' width='1000'>
      Your browser doesn't support canvas...tisk tisk
    </canvas>
  </body>
</html>