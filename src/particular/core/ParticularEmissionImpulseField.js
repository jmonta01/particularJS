(function(window){

    function ParticularEmissionImpulseField(speed, type, spread){
        this.speed = speed; this.type = type; this.spread = spread;
    }

    ParticularEmissionImpulseField.prototype.process = function(life, acceleration, randomSeedX, randomSeedY, angle){
        if(this.type === ParticularConfigProperties.OMNI()){
            acceleration.x = life * this.speed * randomSeedX;
            acceleration.y = life * this.speed * randomSeedY;
        }else{
            acceleration.x = (life * this.speed * Math.cos(angle*Math.PI/180)) + (life*randomSeedX*this.spread*this.speed * Math.sin(angle*Math.PI/180));
            acceleration.y = (life * this.speed * Math.sin(angle*Math.PI/180)) + (life*randomSeedY*this.spread*this.speed * Math.cos(angle*Math.PI/180));
        }
        return acceleration;
    }

    window.ParticularEmissionImpulseField = ParticularEmissionImpulseField;
})(window);
