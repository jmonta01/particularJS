(function(window){
    function ParticularConfigProperties(){}

    ParticularConfigProperties.DIRECTIONAL = function(){return "directional";}
    ParticularConfigProperties.OMNI = function(){return "omni";}

    ParticularConfigProperties.prototype.coords = new ParticularPoint2D();
    ParticularConfigProperties.prototype.rotation = 0;

    //emitter
    ParticularConfigProperties.prototype.type =  ParticularConfigProperties.DIRECTIONAL();
    ParticularConfigProperties.prototype.rate = 60;
    ParticularConfigProperties.prototype.angle = 0;
    ParticularConfigProperties.prototype.speed = 1;
    ParticularConfigProperties.prototype.spread = 0;
    //emitter dynamic props
    ParticularConfigProperties.prototype.lastEmit = 0;

    //particle
    ParticularConfigProperties.prototype.lifeSpan = 1;
    ParticularConfigProperties.prototype.lifeSpanRandom = 0;

    ParticularConfigProperties.prototype.override = function(overrides){
        if(overrides.x !== undefined)
            this.coords.x = overrides.x;
        if(overrides.y !== undefined)
            this.coords.y = overrides.y;
        if(overrides.rotation !== undefined)
            this.rotation = overrides.rotation;

        if(overrides.type !== undefined)
            this.type = overrides.type;
        if(overrides.rate !== undefined)
            this.rate = overrides.rate;
        if(overrides.angle !== undefined)
            this.angle = overrides.angle;
        if(overrides.speed !== undefined)
            this.speed = overrides.speed;
        if(overrides.spread !== undefined)
            this.spread = overrides.spread;

        if(overrides.lifeSpan !== undefined)
            this.lifeSpan = overrides.lifeSpan;
        if(overrides.lifeSpanRandom !== undefined)
            this.lifeSpanRandom = overrides.lifeSpanRandom;
    }


    window.ParticularConfigProperties = ParticularConfigProperties;
})(window);
