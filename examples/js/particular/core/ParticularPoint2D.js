(function(window){

    function ParticularPoint2D(x, y){
        this.x = (x !== undefined) ? x : 0;
        this.y = (y !== undefined) ? y : 0;
    }

    ParticularPoint2D.prototype.toString = function(){
        return "x: "+this.x+", y: "+this.y;
    }

    ParticularPoint2D.prototype.clone = function(){
        return new ParticularPoint2D(this.x, this.y);
    }

    ParticularPoint2D.X_VEC = function(){ return "x"; }
    ParticularPoint2D.Y_VEC = function(){ return "y"; }

    window.ParticularPoint2D = ParticularPoint2D;
})(window);
