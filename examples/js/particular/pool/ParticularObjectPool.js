(function(window){

    function ParticularObjectPool(){}

    var head = null, tail = null, particleRenderCtx, initialPoolSize, initialProps;

    ParticularObjectPool.prototype.populate = function(particleRenderContext, length, props){
        particleRenderCtx = particleRenderContext;
        initialPoolSize = length;
        initialProps = props;

        for(var i=0; i<=initialPoolSize; i++){
            var node = new ParticularObjectPoolNode();
            node.particle = new ParticularParticle(particleRenderCtx);
            node.id = i;

            if(head === null){
                head = tail = node;
            }else{
                tail.next = node;
                node.prev = tail;
                tail = node;
            }
        }
    }

    ParticularObjectPool.prototype.getObject = function(){
        if(head === null || head.next === null)
            this.populate(particleRenderCtx, initialPoolSize, initialProps);
        var startNode = head;
        startNode.next.prev = null;
        head = startNode.next;
        startNode.reset();
        return startNode;
    }

    ParticularObjectPool.prototype.returnObject = function(object){
        object.next = object.prev = null;
        var node = tail;
        tail = object;
        tail.next = null;
        tail.prev = node;
        node.next = tail;
    }

    window.ParticularObjectPool = ParticularObjectPool;
})(window);




