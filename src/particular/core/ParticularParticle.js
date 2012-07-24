(function(window){

    function ParticularParticle(renderContext){
        this.accel = new ParticularPoint2D();
        this.vel = new ParticularPoint2D();
        this.coords = new ParticularPoint2D();
        this.rotation = this.life = 0;
        this.renderContext = renderContext;
    }

    ParticularParticle.prototype.reset = function(){
        this.accel.x = this.accel.y = this.vel.x = this.vel.y = this.coords.x = this.coords.y = this.rotation = this.life = this.randomSeedX =  this.randomSeedY = 0;
    }

    ParticularParticle.prototype.init = function(props){
        this.coords.x = props.coords.x;
        this.coords.y = props.coords.y;
        this.maxLife = (props.lifeSpanRandom > 0) ? props.lifeSpan+(Math.random()*props.lifeSpanRandom*props.lifeSpan) : props.lifeSpan;
        this.randomSeedX = Math.random()*2-1;
        this.randomSeedY = Math.random()*2-1;
        this.angle = props.rotation+props.angle;
        this.renderContext.reset();
    }

    ParticularParticle.prototype.update = function(fields){
        var length = fields.length;

        for(var i=0; i<length; i++){
            if(fields[i] instanceof ParticularLifespanField){
                this.life = fields[i].process(this.life, this.maxLife);
                this.renderContext.updatePhase(this.life);
            }else if(fields[i] instanceof ParticularEmissionImpulseField){
                this.vel = fields[i].process(this.life, this.vel, this.randomSeedX, this.randomSeedY, this.angle);
                this.vel.x *= .5;
                this.vel.y *= .5;
            }else{
                this.vel = fields[i].process(this.vel);
            }
        }

        this.coords.x += this.vel.x;
        this.coords.y += this.vel.y;
        return (this.life > this.maxLife) ? false : true;
    }

    window.ParticularParticle = ParticularParticle;
})(window);

