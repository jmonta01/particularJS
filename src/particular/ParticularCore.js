if (window.requestAnimFrame === undefined) {
    window.requestAnimFrame = (function () {
        "use strict";
        return window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    }());
}
(function (window) {
    "use strict";
//ParticularPoint2D
    function ParticularPoint2D(x, y) {
        this.x = (x !== undefined) ? x : 0;
        this.y = (y !== undefined) ? y : 0;
    }
    ParticularPoint2D.prototype.toString = function () {
        return "x: " + this.x + ", y: " + this.y;
    };
    ParticularPoint2D.prototype.clone = function () {
        return new ParticularPoint2D(this.x, this.y);
    };
    ParticularPoint2D.X_VEC = function () { return "x"; };
    ParticularPoint2D.Y_VEC = function () { return "y"; };
    window.ParticularPoint2D = ParticularPoint2D;

//ParticularLifespanField
    function ParticularLifespanField(fpsCounter) {
        this.fpsCounter = fpsCounter;
    }
    ParticularLifespanField.prototype.process = function (life, maxLife) {
        life +=  (maxLife / this.fpsCounter.fps) / 2;
        return life;
    };
    window.ParticularLifespanField = ParticularLifespanField;

//ParticularEmissionImpulseField
    function ParticularEmissionImpulseField(speed, type, spread) {
        this.speed = speed;
        this.type = type;
        this.spread = spread;
    }
    ParticularEmissionImpulseField.prototype.process = function (life, acceleration, randomSeedX, randomSeedY, angle) {
        if (this.type === ParticularConfigProperties.OMNI()) {
            acceleration.x = life * this.speed * randomSeedX;    // TODO - fix acceleration algorithm
            acceleration.y = life * this.speed * randomSeedY;    // TODO - fix acceleration algorithm
        } else {
            acceleration.x = (life * this.speed * Math.cos(angle * Math.PI / 180)) + (life * randomSeedX * this.spread * this.speed * Math.sin(angle * Math.PI / 180)); // TODO - fix acceleration algorithm
            acceleration.y = (life * this.speed * Math.sin(angle * Math.PI / 180)) + (life * randomSeedY * this.spread * this.speed * Math.cos(angle * Math.PI / 180)); // TODO - fix acceleration algorithm
        }
        return acceleration;
    };
    window.ParticularEmissionImpulseField = ParticularEmissionImpulseField;

//ParticularDirectionalSpreadField
    function ParticularDirectionalSpreadField(percent, vector) {
        this.percent = (percent !== undefined) ? percent : 0;
        this.vector = (vector !== undefined) ? vector : ParticularPoint2D.X_VEC();
    }

    window.ParticularDirectionalSpreadField = ParticularDirectionalSpreadField;

//ParticularConfigProperties
    function ParticularConfigProperties() {}
    ParticularConfigProperties.DIRECTIONAL = function () { return "directional"; };
    ParticularConfigProperties.OMNI = function () { return "omni"; };
    ParticularConfigProperties.prototype.coords = new ParticularPoint2D();
    ParticularConfigProperties.prototype.rotation = 0;
    ParticularConfigProperties.prototype.type =  ParticularConfigProperties.DIRECTIONAL();
    ParticularConfigProperties.prototype.rate = 60;
    ParticularConfigProperties.prototype.angle = 0;
    ParticularConfigProperties.prototype.speed = 1;
    ParticularConfigProperties.prototype.spread = 0;
    ParticularConfigProperties.prototype.lastEmit = 0;
    ParticularConfigProperties.prototype.lifeSpan = 1;
    ParticularConfigProperties.prototype.lifeSpanRandom = 0;
    ParticularConfigProperties.prototype.override = function (overrides) {
        if (overrides.x !== undefined) { this.coords.x = overrides.x; }
        if (overrides.y !== undefined) { this.coords.y = overrides.y; }
        if (overrides.rotation !== undefined) { this.rotation = overrides.rotation; }
        if (overrides.type !== undefined) { this.type = overrides.type; }
        if (overrides.rate !== undefined) { this.rate = overrides.rate; }
        if (overrides.angle !== undefined) { this.angle = overrides.angle; }
        if (overrides.speed !== undefined) { this.speed = overrides.speed; }
        if (overrides.spread !== undefined) { this.spread = overrides.spread; }
        if (overrides.lifeSpan !== undefined) { this.lifeSpan = overrides.lifeSpan; }
        if (overrides.lifeSpanRandom !== undefined) { this.lifeSpanRandom = overrides.lifeSpanRandom; }
    };
    window.ParticularConfigProperties = ParticularConfigProperties;


//ParticularEmitter
    var running = false, emitterContext, fpsCounter = {frames: 0, fps: 60}, impulseField, lifespanField;
    function ParticularEmitter() {
        emitterContext = this;
        emitterContext.rootNode = null;
        this.properties = new ParticularConfigProperties();
        this.__defineGetter__('x', function () { return this.properties.coords.x; });
        this.__defineSetter__('x', function (val) { this.properties.coords.x = val; });
        this.__defineGetter__('y', function () { return this.properties.coords.y; });
        this.__defineSetter__('y', function (val) { this.properties.coords.y = val; });
        this.__defineGetter__('rotation', function () { return this.properties.rotation; });
        this.__defineSetter__('rotation', function (val) { this.properties.rotation = val; });
        this.__defineGetter__('angle', function () { return this.properties.angle; });
        this.__defineSetter__('angle', function (val) { this.properties.angle = val; });
        this.__defineGetter__('speed', function () { return this.properties.speed; });
        this.__defineSetter__('speed', function (val) { this.properties.speed = val; });
        this.__defineGetter__('spread', function () { return this.properties.spread; });
        this.__defineSetter__('spread', function (val) { this.properties.spread = val; });
    }
    ParticularEmitter.prototype.init = function (stageRenderContext, particleRenderContext, config, fields) {
        this.renderContext = stageRenderContext;
        this.properties.override(config);
        this.fields = fields;
        lifespanField = new ParticularLifespanField(fpsCounter);
        impulseField = new ParticularEmissionImpulseField(this.properties.speed, this.properties.type, this.properties.spread);
        if (this.fields) {
            this.fields.unshift(lifespanField, impulseField);
        } else {
            this.fields = [lifespanField, impulseField];
        }
        var buffer = (1 / this.properties.lifeSpan) * this.properties.rate;
        this.pool = new ParticularObjectPool();
        this.pool.populate(particleRenderContext, buffer, this.properties);
        tick();
    };
    ParticularEmitter.prototype.start = function () {
        this.properties.lastEmit = Date.now();
        running = true;
    };
    ParticularEmitter.prototype.stop = function () {
        running = false;
    };
    ParticularEmitter.prototype.reset = function () {
        this.properties.lastEmit = Date.now();
        emitterContext.rootNode = null;
        running = false;
    };
    function append() {
        var oldRoot, node = emitterContext.pool.getObject();
        node.init(emitterContext.properties);
        if (emitterContext.rootNode === null) {
            emitterContext.rootNode = node;
        } else {
            oldRoot = emitterContext.rootNode;
            emitterContext.rootNode = node;
            oldRoot.prev = node;
            node.next = oldRoot;
        }
    }
    function update() {
        emitterContext.renderContext.clear();
        var nextNode, node = emitterContext.rootNode;
        while (node !== null) {
            node.update(emitterContext.fields);
            nextNode = node.next;
            if (node.isValid) {
                emitterContext.renderContext.render(node.particle);
            } else {
                releaseNode(node);
            }
            node = nextNode;
        }
    }
    function releaseNode(node) {
        if (node === emitterContext.rootNode) { emitterContext.rootNode = node.next; }
        if (node.prev !== null) { node.prev.next = node.next; }
        if (node.next !== null) { node.next.prev = node.prev; }
        emitterContext.pool.returnObject(node);
    }
    function tick() {
        calcFPS();
        if (running === true && fpsCounter.fps > 0) {
            var count, interval = 1 / fpsCounter.fps, rate = 1 / emitterContext.properties.rate;
            if (Date.now() - emitterContext.properties.lastEmit > rate * 1000) {
                count = Math.floor(interval / rate);
                if (count > 0) {
                    while (count > 0) {
                        append();
                        count -= 1;
                    }
                } else {
                    append();
                }
                emitterContext.properties.lastEmit = Date.now();
            }
        }
        update();
        window.requestAnimFrame(tick);
    }
    function calcFPS() {
        if (fpsCounter.frames === 0) { fpsCounter.startTime = Date.now(); }
        fpsCounter.endTime = Date.now();
        if (fpsCounter.endTime - fpsCounter.startTime >= 1000) {
            fpsCounter.fps = fpsCounter.frames;
            fpsCounter.frames = 0;
        } else {
            fpsCounter.frames += 1;
        }
    }

    if (Math.randomFromTo === undefined) {
        Math.randomFromTo = function (from, to) {
            return Math.floor(Math.random() * (to - from + 1) + from);
        };
    }
    window.ParticularEmitter = ParticularEmitter;


//ParticularParticle
    function ParticularParticle(renderContext) {
        this.accel = new ParticularPoint2D();
        this.vel = new ParticularPoint2D();
        this.coords = new ParticularPoint2D();
        this.rotation = this.life = 0;
        this.renderContext = renderContext;
    }
    ParticularParticle.prototype.reset = function () {
        this.accel.x = this.accel.y = this.vel.x = this.vel.y = this.coords.x = this.coords.y = this.rotation = this.life = this.randomSeedX =  this.randomSeedY = 0;
    };
    ParticularParticle.prototype.init = function (props) {
        this.coords.x = props.coords.x;
        this.coords.y = props.coords.y;
        this.maxLife = (props.lifeSpanRandom > 0) ? props.lifeSpan + (Math.random() * props.lifeSpanRandom * props.lifeSpan) : props.lifeSpan;
        this.randomSeedX = Math.random() * 2 - 1;
        this.randomSeedY = Math.random() * 2 - 1;
        this.angle = props.rotation + props.angle;
        this.renderContext.reset();
    };
    ParticularParticle.prototype.update = function (fields) {
        var i, length = fields.length;
        for (i = 0; i < length; i++) {
            if (fields[i] instanceof ParticularLifespanField) {
                this.life = fields[i].process(this.life, this.maxLife);
                this.renderContext.updatePhase(this.life);
            } else if (fields[i] instanceof ParticularEmissionImpulseField) {
                this.vel = fields[i].process(this.life, this.vel, this.randomSeedX, this.randomSeedY, this.angle);
                this.vel.x *= 0.5;
                this.vel.y *= 0.5;
            } else {
                this.vel = fields[i].process(this.vel);
            }
        }
        this.coords.x += this.vel.x;
        this.coords.y += this.vel.y;
//        this.rotation += this.vel.rotation;
        return (this.life <= this.maxLife);
    };
    window.ParticularParticle = ParticularParticle;

//ParticularObjectPoolNode
    function ParticularObjectPoolNode() {
        this.isValid = false;
        this.next = this.prev = this.particle = null;
    }
    ParticularObjectPoolNode.prototype.reset = function () {
        this.next = this.prev = null;
        this.isValid = true;
        this.particle.reset();
    };
    ParticularObjectPoolNode.prototype.init = function (props) {
        if (this.particle !== null) { this.particle.init(props); }
    };
    ParticularObjectPoolNode.prototype.update = function (props, fields) {
        if (this.particle !== null) { this.isValid = this.particle.update(props, fields); }
    };
    window.ParticularObjectPoolNode = ParticularObjectPoolNode;

//ParticularObjectPool
    function ParticularObjectPool() {}
    var head = null, tail = null, particleRenderCtx, initialPoolSize, initialProps;
    ParticularObjectPool.prototype.populate = function (particleRenderContext, length, props) {
        particleRenderCtx = particleRenderContext;
        initialPoolSize = length;
        initialProps = props;
        var i;
        for (i = 0; i <= initialPoolSize; i++) {
            var node = new ParticularObjectPoolNode();
            node.particle = new ParticularParticle(particleRenderCtx);
            node.id = i;
            if (head === null) {
                head = tail = node;
            } else {
                tail.next = node;
                node.prev = tail;
                tail = node;
            }
        }
    };
    ParticularObjectPool.prototype.getObject = function () {
        if (head === null || head.next === null) { this.populate(particleRenderCtx, initialPoolSize, initialProps); }
        var startNode = head;
        startNode.next.prev = null;
        head = startNode.next;
        startNode.reset();
        return startNode;
    };
    ParticularObjectPool.prototype.returnObject = function (object) {
        object.next = object.prev = null;
        var node = tail;
        tail = object;
        tail.next = null;
        tail.prev = node;
        node.next = tail;
    };
    window.ParticularObjectPool = ParticularObjectPool;


}(window));