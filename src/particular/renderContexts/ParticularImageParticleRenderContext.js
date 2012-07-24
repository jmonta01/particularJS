(function(window){

    function ParticularImageParticleRenderContext(){
        this.phases = [];
    }

    //asset, ratio, alpha, rotation?
    ParticularImageParticleRenderContext.prototype.addPhase = function(phase){
        this.phases.push(phase);
        this.reset();
    }

    ParticularImageParticleRenderContext.prototype.reset = function(){
        this.activeAsset = this.phases[0].asset;
        this.alpha = this.phases[0].alpha;
    }

    ParticularImageParticleRenderContext.prototype.updatePhase = function(life){
        var activePhase = this.phases[Math.floor(this.phases.length * life)];
        if(activePhase){
           this.activeAsset = activePhase.asset;
           this.alpha = activePhase.alpha;
        }
    }

    window.ParticularImageParticleRenderContext = ParticularImageParticleRenderContext;
})(window);
