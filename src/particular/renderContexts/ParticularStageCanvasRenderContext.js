(function(window){

    function ParticularStageCanvasRenderContext(stage){
        this.stage = stage;
    }

    ParticularStageCanvasRenderContext.prototype.clear = function(){
        this.stage.fillStyle = "#000000";
        this.stage.fillRect(0, 0, 800, 800);
    }

    ParticularStageCanvasRenderContext.prototype.render = function(node){
        if(node.renderContext.activeAsset !== undefined){
            var angle = node.rotation * Math.PI/180;
            this.stage.globalAlpha = node.renderContext.alpha;
            this.stage.translate(node.coords.x, node.coords.y);
            this.stage.rotate(angle);
            if(node.renderContext instanceof ParticularImageParticleRenderContext){
                this.stage.drawImage(node.renderContext.activeAsset, 0, 0);
            }else{

            }
            this.stage.rotate(-angle);
            this.stage.translate(-node.coords.x, -node.coords.y);
            this.stage.globalAlpha = 1;
        }
    }


    window.ParticularStageCanvasRenderContext = ParticularStageCanvasRenderContext;
})(window);