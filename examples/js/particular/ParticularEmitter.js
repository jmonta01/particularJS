(function(window){

    var running = false;
    var emitterContext;
    var fpsCounter = {frames:0, fps:60}
    var impulseField;
    var lifespanField;


    function ParticularEmitter(){
        emitterContext = this;
        emitterContext.rootNode = null;
        this.properties = new ParticularConfigProperties();

        this.__defineGetter__('x', function(){ return this.properties.coords.x; })
        this.__defineSetter__('x', function(val){ this.properties.coords.x = val; })

        this.__defineGetter__('y', function(){ return this.properties.coords.y; })
        this.__defineSetter__('y', function(val){ this.properties.coords.y = val; })

        this.__defineGetter__('rotation', function(){ return this.properties.rotation; })
        this.__defineSetter__('rotation', function(val){ this.properties.rotation = val })

        this.__defineGetter__('angle', function(){ return this.properties.angle; })
        this.__defineSetter__('angle', function(val){ this.properties.angle = val; })

        this.__defineGetter__('speed', function(){ return this.properties.speed; })
        this.__defineSetter__('speed', function(val){
            this.properties.speed = val;
            //impulseField.speed = this.properties.speed;
        })

        this.__defineGetter__('spread', function(){ return this.properties.spread; })
        this.__defineSetter__('spread', function(val){
            this.properties.spread = val;
            //impulseField.spread = this.properties.spread;
        })

    }

    ParticularEmitter.prototype.init = function(stageRenderContext, particleRenderContext, config, fields){
        this.renderContext = stageRenderContext;


        this.properties.override(config);

        this.fields = fields;
        lifespanField = new ParticularLifespanField(fpsCounter);
        impulseField = new ParticularEmissionImpulseField(this.properties.speed, this.properties.type, this.properties.spread);
        this.fields.unshift(lifespanField, impulseField);

        var buffer = (this.properties.rate*this.properties.speed);

        this.pool = new ParticularObjectPool();
        this.pool.populate(particleRenderContext, buffer*this.properties.rate, this.properties);
        tick();
    }

    ParticularEmitter.prototype.start = function(){
        this.properties.lastEmit = Date.now();
        running = true;
    }

    ParticularEmitter.prototype.stop = function(){
        running = false;
    }

    ParticularEmitter.prototype.reset = function(){
        this.properties.lastEmit = Date.now();
        emitterContext.rootNode = null;
        running = false;
    }

    function append(){
        var node = emitterContext.pool.getObject();
        node.init(emitterContext.properties);
        if(emitterContext.rootNode === null){
            emitterContext.rootNode = node;
        }else{
            var oldRoot = emitterContext.rootNode;
            emitterContext.rootNode = node;
            oldRoot.prev = node;
            node.next = oldRoot;
        }
    }

    function update(){
        emitterContext.renderContext.clear();
        var node = emitterContext.rootNode;
        while(node !== null){
            node.update(emitterContext.fields);
            var nextNode = node.next;
            if(node.isValid)
                emitterContext.renderContext.render(node.particle);
            else
                releaseNode(node);
            node = nextNode;
        }
    }

    function releaseNode(node){
        if(node === emitterContext.rootNode)
            emitterContext.rootNode = node.next;
        if(node.prev !== null)
            node.prev.next = node.next;
        if(node.next !== null)
            node.next.prev = node.prev;
        emitterContext.pool.returnObject(node);
    }


    function tick(){
        calcFPS();
        if(running === true && fpsCounter.fps > 0){
            var interval = 1/fpsCounter.fps;
            var rate = 1/emitterContext.properties.rate;
            if(Date.now()-emitterContext.properties.lastEmit > rate*1000){
                var count = Math.floor(interval/rate);
                if(count > 0){
                    while(count > 0){
                        append();
                        count -= 1;
                    }
                }else{
                    append();
                }
                emitterContext.properties.lastEmit = Date.now();
            }
        }
        update();
        window.requestAnimFrame(tick);
    }



    function calcFPS(){
        if(fpsCounter.frames === 0)
            fpsCounter.startTime = Date.now();
        fpsCounter.endTime = Date.now();
        if(fpsCounter.endTime - fpsCounter.startTime >= 1000){
            fpsCounter.fps = fpsCounter.frames;
            fpsCounter.frames = 0;
        }else{
            fpsCounter.frames ++;
        }
    }

    if(window.requestAnimFrame === undefined){
        window.requestAnimFrame = (function(){
            return window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
    }

    if(Math.randomFromTo === undefined){
        Math.randomFromTo = function(from, to){
            return Math.floor(Math.random() * (to - from + 1) + from);
        };
    }

    window.ParticularEmitter = ParticularEmitter;
})(window);
