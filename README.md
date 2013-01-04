# particularJS
============

A lightweight, modular, extensible, dependency free, doubly linked, object pooled particle engine for html5 canvas and beyond

Go to http://particularjs.com for more details on how to get up and running with particularjs.

## Getting Started
ParticularJS was built from the ground up to have a low barrier of entry, at the same time allow for deep customability. 
Below is a code samples to get you started quickly.


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
    
    
## Extending
ParticularJS utilizes a common development interface that allows for deep customization and extendability. Below are a couple of examples of how to extend ParticularJS.    

### Creating a Gravity Field

    <script>
      //<![CDATA[
        (function (window) {
          //ParticularGravityField
        
          function ParticularGravityField(force, vector) {
            this.force = (force !== undefined) ? force : 0.25;
            this.vector = (vector !== undefined) ? vector : ParticularPoint2D.Y_VEC();
          }
          ParticularGravityField.prototype.process = function (vel) {
            switch (this.vector) {
              case ParticularPoint2D.X_VEC():
              vel.x += this.force;
              break;
            case ParticularPoint2D.Y_VEC():
              vel.y += this.force;
              break;
            }
            return vel;
          };
          window.ParticularGravityField = ParticularGravityField;
        }(window));
      //]]>
    </script>

### Creating a Friction Field

    <script>
      //<![CDATA[
        (function (window) {
        //ParticularFrictionField
            function ParticularFrictionField(forceX, forceY) {
                this.force = new ParticularPoint2D();
                this.force.x = (forceX !== undefined) ? forceX : 0.9;
                this.force.y = (forceY !== undefined) ? forceY : 0.9;
            }
            ParticularFrictionField.prototype.process = function (vel) {
                vel.x *= this.force.x;
                vel.y *= this.force.y;
                return vel;
            };
            window.ParticularFrictionField = ParticularFrictionField;
        
        }(window));
      //]]>
    </script>