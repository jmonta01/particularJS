(function (window) {
//ParticularStageCanvasRenderContext
    "use strict";
    function ParticularStageCanvasRenderContext(stage) {
        this.stage = stage;
    }
    ParticularStageCanvasRenderContext.prototype.clear = function () {
        this.stage.clearRect(0, 0, this.stage.canvas.width, this.stage.canvas.height);
    };
    ParticularStageCanvasRenderContext.prototype.render = function (node) {
        if (node.renderContext.activeAsset !== undefined) {
            var angle = (node.coords.rotation * Math.PI / 180) | 0;
            var x = (node.coords.x) | 0; //(0.5 + node.coords.x) << 0;
            var y = (node.coords.y) | 0; //(0.5 + node.coords.y) << 0;
            this.stage.globalAlpha = node.renderContext.alpha;
            this.stage.translate(x, y);
            this.stage.rotate(angle);
            if (node.renderContext instanceof ParticularImageParticleRenderContext) {
                this.stage.drawImage(node.renderContext.activeAsset, 0, 0);
            }
            this.stage.rotate(-angle);
            this.stage.translate(-x, -y);
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
    ParticularImageParticleRenderContext.prototype.updatePhase = function (life, maxLife) {
        var activePhase = this.phases[Math.floor(this.phases.length * life / maxLife)];
        if (activePhase) {
            this.activeAsset = activePhase.asset;
            this.alpha = activePhase.alpha;
        }
    };
    window.ParticularImageParticleRenderContext = ParticularImageParticleRenderContext;

}(window));
