(function (window) {
//ParticularStageCanvasRenderContext
    function ParticularStageCanvasRenderContext(stage) {
        this.stage = stage;
    }
    ParticularStageCanvasRenderContext.prototype.clear = function () {
        this.stage.fillStyle = "#000000";
        this.stage.fillRect(0, 0, 800, 800);
    };
    ParticularStageCanvasRenderContext.prototype.render = function (node) {
        if (node.renderContext.activeAsset !== undefined) {
            var angle = node.rotation * Math.PI / 180;
            this.stage.globalAlpha = node.renderContext.alpha;
            this.stage.translate(node.coords.x, node.coords.y);
            this.stage.rotate(angle);
            if (node.renderContext instanceof ParticularImageParticleRenderContext) {
                this.stage.drawImage(node.renderContext.activeAsset, 0, 0);
            }
            this.stage.rotate(-angle);
            this.stage.translate(-node.coords.x, -node.coords.y);
            this.stage.globalAlpha = 1;
        }
    };
    window.ParticularStageCanvasRenderContext = ParticularStageCanvasRenderContext;

//ParticularStageCanvasRenderContext
    function ParticularImageParticleRenderContext() {
        this.phases = [];
    }
    ParticularImageParticleRenderContext.prototype.addPhase = function (phase) {
        this.phases.push(phase);
        this.reset();
    };
    ParticularImageParticleRenderContext.prototype.reset = function () {
        this.activeAsset = this.phases[0].asset;
        this.alpha = this.phases[0].alpha;
    };
    ParticularImageParticleRenderContext.prototype.updatePhase = function (life) {
        var activePhase = this.phases[Math.floor(this.phases.length * life)];
        if (activePhase) {
            this.activeAsset = activePhase.asset;
            this.alpha = activePhase.alpha;
        }
    };
    window.ParticularImageParticleRenderContext = ParticularImageParticleRenderContext;

})(window);
