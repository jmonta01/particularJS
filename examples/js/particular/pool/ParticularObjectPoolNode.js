(function(window){

    function ParticularObjectPoolNode(){
        this.isValid = false;
        this.next = this.prev = this.particle = null;
    }

    ParticularObjectPoolNode.prototype.reset = function(){
        this.next = this.prev = null;
            this.isValid = true;
       this.particle.reset();
    }

    ParticularObjectPoolNode.prototype.init = function(props){
        if(this.particle !== null)
            this.particle.init(props);
    }

    ParticularObjectPoolNode.prototype.update = function(props, fields){
        if(this.particle !== null)
            this.isValid = this.particle.update(props, fields);
    }

    window.ParticularObjectPoolNode = ParticularObjectPoolNode;
})(window);
