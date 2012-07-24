(function (window) {
//ParticularGravityField
    function ParticularGravityField(amount, vector) {
        this.amount = (amount !== undefined) ? amount : 1.79;
        this.vector = (vector !== undefined) ? vector : ParticularPoint2D.Y_VEC();
    }
    ParticularGravityField.prototype.process = function (coords) {
        switch (this.vector) {
        case ParticularPoint2D.X_VEC():
            coords.x += this.amount;
            break;
        case ParticularPoint2D.Y_VEC():
            coords.y += this.amount;
            break;
        }
        return coords;
    };
    window.ParticularGravityField = ParticularGravityField;

})(window);
