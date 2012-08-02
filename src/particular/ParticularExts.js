(function (window) {
//ParticularGravityField
    function ParticularGravityField(force, vector) {
        this.force = (force !== undefined) ? force : 0.25;
        this.vector = (vector !== undefined) ? vector : ParticularPoint2D.Y_VEC();
    }
    ParticularGravityField.prototype.process = function (vel) {
        switch (this.vector) {
        case ParticularPoint2D.X_VEC():
            vel.x += this.force;
            break;
        case ParticularPoint2D.Y_VEC():
            vel.y += this.force;
            break;
        }
        return vel;
    };
    window.ParticularGravityField = ParticularGravityField;

//ParticularFrictionField
    function ParticularFrictionField(forceX, forceY) {
        this.force = new ParticularPoint2D();
        this.force.x = (forceX !== undefined) ? forceX : 0.9;
        this.force.y = (forceY !== undefined) ? forceY : 0.9;
    }
    ParticularFrictionField.prototype.process = function (vel) {
        vel.x *= this.force.x;
        vel.y *= this.force.y;
        return vel;
    };
    window.ParticularFrictionField = ParticularFrictionField;

}(window));
