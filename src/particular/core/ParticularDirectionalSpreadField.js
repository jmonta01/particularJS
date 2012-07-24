(function(window){

    function ParticularDirectionalSpreadField(percent, vector){
        this.percent = (percent !== undefined) ? percent : 0;
        this.vector = (vector !== undefined) ? vector : ParticularPoint2D.X_VEC();
    }

    ParticularDirectionalSpreadField.prototype.process = function(coords){
        var dif = 1-this.percent;
        switch(this.vector){
            case ParticularPoint2D.X_VEC():
                coords.y = coords.y;
                break;
            case ParticularPoint2D.Y_VEC():
                coords.x = coords.x;
                break;
        }
        return coords;
    }

    window.ParticularDirectionalSpreadField = ParticularDirectionalSpreadField;
})(window);
