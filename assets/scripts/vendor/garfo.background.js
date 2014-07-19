// Live Background
function LiveBackground(el, opts){

    opts = opts || {};
    opts.pixels = 7;
    opts.innerPixels = 200;

    var childs = el.children();

    var imageSize = function(){

        var width = $(window).width() + opts.pixels * 2;

        for(var i=childs.length - 1; i >= 0; i--){
            var current = childs.eq(i);
            var scale = width / current.width();
            current.width(width);
            current.css('left', opts.pixels * -1);
            current.data('left', opts.pixels * -1)
            if(i == childs.length - 1){
                if(current.hasClass('no-move')){
                    current.css('bottom', 0);
                    current.data('bottom', 0);
                }else{
                    current.css('bottom', opts.pixels * -1);
                    current.data('bottom', opts.pixels * -1);
                }
            }else{
                var prev = childs.eq(i + 1);
                var bottom = (prev.height() + parseInt(prev.css('bottom'))) - (opts.innerPixels * scale);
                current.css('bottom', bottom);
                current.data('bottom', bottom);
            }
        }
    };

    var getGForce = function(x, y){
        var cx = $(window).width() / 2;
        var cy = $(window).height() / 2;

        return [(x - cx) / cx, 
                (y - cy) / cy]
                
    }

    var moveImages = function(gx, gy){
        for(var i=0; i < childs.length; i++){
            var current = childs.eq(i);

            if(!current.hasClass('no-move')){
                if(i % 2){
                    current.css('left', current.data('left') + (gx * opts.pixels)); 
                    current.css('bottom', current.data('bottom') + (gy * opts.pixels) * -1); 
                }else{
                    current.css('left', current.data('left') + (gx * opts.pixels) * -1); 
                    current.css('bottom', current.data('bottom') + (gy * opts.pixels)); 
                }
            }
        }
    }

    imageSize();
    $(window).resize(imageSize);
    $(window).mousemove(function(e){
        var g = getGForce(e.pageX, e.pageY);
        moveImages(g[0], g[1]);
    });
    
}

