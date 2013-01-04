# particularJS
============

A particle engine for html5. Go to http://particularjs.com for a more detailed getting started and some demos.

## Getting Started
ParticularJS was built from the ground up to have a low barrier of entry, at the same time allow for deep customability. Below are a couple of code samples to illustrate both ease of use and how deep a user can customize it.
'''html
    <!DOCTYPE html>
    <html>
      <head>
        <title>Particular JS Setup</title>
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
'''