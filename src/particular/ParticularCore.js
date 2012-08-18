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
    ParticularPoint2D.prototype.add = function (point) {
        this.x += point.x;
        this.y += point.y;
    };
    ParticularPoint2D.prototype.subtract = function (point) {
        this.x -= point.x;
        this.y -= point.y;
    };
    ParticularPoint2D.prototype.toString = function () {
        return "x: " + this.x + ", y: " + this.y;
    };
    ParticularPoint2D.prototype.clone = function () {
        return new ParticularPoint2D(this.x, this.y);
    };
    ParticularPoint2D.X_VEC = function () { return "x"; };
    ParticularPoint2D.Y_VEC = function () { return "y"; };
    window.ParticularPoint2D = ParticularPoint2D;


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
    ParticularConfigProperties.prototype.speedRandom = 0;
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
        if (overrides.speedRandom !== undefined) { this.speedRandom = overrides.speedRandom; }
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
        this.properties.fpsCounter = fpsCounter;
        this.fields = fields;
        lifespanField = new ParticularLifespanField(fpsCounter);
        impulseField = new ParticularEmissionImpulseField(this.properties.speed, this.properties.type, this.properties.spread);
        if (this.fields) {
            this.fields.unshift(lifespanField, impulseField);
        } else {
            this.fields = [lifespanField, impulseField];
        }
        var buffer = this.properties.lifeSpan * this.properties.rate * 2;
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
    function update(time) {
        emitterContext.renderContext.clear();
        var nextNode, node = emitterContext.rootNode;
        while (node !== null) {
            node.update(emitterContext.fields, time);
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
            var count, interval = 1 / fpsCounter.fps, count = emitterContext.properties.rate / fpsCounter.fps;
                if (count > 0) {
                    while (count > 0) {
                        append();
                        count -= 1;
                    }
                } else {
                    append();
                }

        }
        update(interval*1000);
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
        this.randomSeed = new ParticularPoint2D();
        this.accel = new ParticularPoint2D();
        this.vel = new ParticularPoint2D();
        this.coords = new ParticularPoint2D();
        this.rotation = this.life = 0;
        this.renderContext = renderContext;
        this.fired = false;
    }
    ParticularParticle.prototype.reset = function () {
        this.fired = false;
        this.randomSeed.x = this.randomSeed.y = this.accel.x = this.accel.y = this.vel.x = this.vel.y = this.coords.x = this.coords.y = this.rotation = this.life = this.randomSeedX =  this.randomSeedY = 0;
    };
    ParticularParticle.prototype.init = function (props) {
        this.coords.x = props.coords.x;
        this.coords.y = props.coords.y;
        this.speedRandom = props.speedRandom;
        this.maxLife = (props.lifeSpanRandom > 0) ? props.lifeSpan + (Math.random() * props.lifeSpanRandom * props.lifeSpan) : props.lifeSpan;
        this.randomSeed.x = Math.random();
        this.randomSeed.y = Math.random();
        this.angle = props.rotation + props.angle;
        this.fpsCounter = props.fpsCounter;
        this.renderContext.reset();
    };
    ParticularParticle.prototype.update = function (fields, time) {
        var i, field, length = fields.length;
        for (i = 0; i < length; i++) {
            field = fields[i];
            if (field instanceof ParticularLifespanField) {
                this.life = field.process(this.life, time);
                this.renderContext.updatePhase(this.life, this.maxLife);
            } else if (field instanceof ParticularEmissionImpulseField) {
                if (this.fired === false) {
                    this.accel = field.process(this.accel, this.speedRandom, this.randomSeed, this.angle, this.maxLife);
                    this.fired = true;
                } else {
                    this.accel.x = this.accel.y = 0;
                }
                this.vel.add(this.accel);
            } else {
                this.vel = field.process(this.vel);
            }
        }
        this.coords.add(this.vel);

//        this.rotation += this.vel.rotation;
        return (this.life <= this.maxLife);
    };
    window.ParticularParticle = ParticularParticle;

//ParticularLifespanField
    function ParticularLifespanField() {}
    ParticularLifespanField.prototype.process = function (life, time) {
        life +=  time/1000;
        return life;
    };
    window.ParticularLifespanField = ParticularLifespanField;

//ParticularEmissionImpulseField
    function ParticularEmissionImpulseField(speed, type, spread) {
        this.speed = speed;
        this.type = type;
        this.spread = spread;
    }
    ParticularEmissionImpulseField.prototype.process = function (acceleration, accelerationSeed, randomSeed, initAngle) {
        var angle = Math.random() * Math.PI * 2;
        var radius = this.speed +  randomSeed.x * accelerationSeed;

        if (this.type === ParticularConfigProperties.OMNI()) {
            acceleration.x = Math.cos(angle) * radius;
            acceleration.y = Math.sin(angle) * radius;
        } else {
            var sAngle = initAngle - (this.spread * 90) / 2;
            var eAngle = initAngle + (this.spread * 90) / 2;
            angle = Math.abs(eAngle - sAngle) * Math.random();
            acceleration.x = Math.cos((angle + sAngle) * Math.PI / 180) * radius;
            acceleration.y = Math.sin((angle + sAngle) * Math.PI / 180) * radius;
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