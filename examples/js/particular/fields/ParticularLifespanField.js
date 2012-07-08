(function(window){

    function ParticularLifespanField(fpsCounter){
        this.fpsCounter = fpsCounter;
    }

    ParticularLifespanField.prototype.process = function(life, maxLife){
        life +=  (maxLife/this.fpsCounter.fps)/2;
        return life;
    }

    window.ParticularLifespanField = ParticularLifespanField;
})(window)