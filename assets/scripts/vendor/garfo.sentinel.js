function Sentinel(opt){
    'use strict';
    
    var el = opt.obj;
    var file = opt.file;
    var ppf = opt.ppf || 7000; // Pixel per Frame
    var size = opt.size || 1;
    var completeCallback = opt.completeCallback || function(){};
    var animation = opt.animation || 'in';
    var maxNpof = opt.maxNpof || 500;
    var autoRender = opt.autoRender === false ? false : true;

    var scope = this;
    var img = scope.img = new Image();
    var ctx = el.getContext('2d');
    var pixeled = {};
    var count = -1;
    var canvasImageData;
    var data;
    var imageData;
    var _stop = false;
    var reRender = false;
    var npof = 0; // No pixel on frame
    var _i = 0;
    var _j = 0;

    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var getImageData = function(){
        var canvas = document.createElement('canvas');
        canvas.width = el.width;
        canvas.height = el.height;
        var _ctx = canvas.getContext('2d');
        _ctx.drawImage(img, 0, 0 );
        return _ctx.getImageData(0, 0, el.width, el.height).data;
    }

    var isPixeled = function(x, y){
        if(pixeled[x] === undefined)
            return false;
        return pixeled[x][y] || false;
    }

    var setPixel = function(x, y){
        if(x >= img.width || y >= img.height) 
            return false;
        if(isPixeled(x, y))
            return false;
        if(pixeled[x] === undefined)
            pixeled[x] = {};
        pixeled[x][y] = true;
        count++;
        var index = (x + y * img.width) * 4;
        
        if(animation == 'in'){
            canvasImageData.data[index] = imageData[index];
            canvasImageData.data[index + 1] = imageData[index + 1];
            canvasImageData.data[index + 2] = imageData[index + 2];
            canvasImageData.data[index + 3] = imageData[index + 3];
        }else{
            canvasImageData.data[index + 3] = 0;
        }

        return true;
    }

    var isComplete = function(){
        return count == img.width * img.height; 
    }    

    var draw = function(){
        if(isComplete()){
            completeCallback();
            for(var i=0; i < imageData.length; i++)
                if(animation == 'in')
                    canvasImageData.data[i] = imageData[i];
                else
                    canvasImageData.data[i] = 0

            ctx.putImageData(canvasImageData, 0, 0);
            return;
        }
       
        if(npof < maxNpof){
            var has_pixeled = false;
            for(var i=0; i < ppf; i++){
                var x = parseInt((parseInt(Math.random() * img.width)) / size) * size;
                var y = parseInt((parseInt(Math.random() * img.height)) / size) * size;

                for(var j=0; j < size; j++)
                    for(var h=0; h < size; h++){
                        if(setPixel(x + j, y + h)){
                            has_pixeled = true;
                        }
                    }
            }

            if(has_pixeled == false)
                npof++;
        }else{
            for(var j=0; j < size; j++)
                for(var h=0; h < size; h++){
                    if(setPixel(_i + j, _j + h)){
                        has_pixeled = true;
                        count++;
                    }
                }

            if(_i < img.width){
                if(_j < img.height){
                    _j += size;
                }else{
                    _j = 0;
                    _i += size;
                }
            }
        }

        ctx.putImageData(canvasImageData, 0, 0);

        if(_stop){
            _stop = false;
            if(reRender){
                reRender = false;
                render();
            }
        }else{
            requestAnimationFrame(draw);
        }
    }

    var reset = function(){
        pixeled = {};
        count = 0;
    }

    img.onload = function(){
        reset();
        el.width = img.width;
        el.height = img.height;

        if(animation === 'out')
            ctx.drawImage(img, 0, 0);

        canvasImageData = ctx.getImageData(0, 0, img.width, img.height);
        data = canvasImageData.data;
        imageData = getImageData();
        draw();
    }
    
    var stop = scope.stop = function(){
        _stop = true;
    }

    var _reRender = function(){
        if(isComplete())
            render();
        else{
            reRender = true;
            stop();
        }

    }

    var toggle = scope.toggle = function(){
        animation = animation === 'in' ? 'out' : 'in';
        _reRender();
    }

    var sentinelIn = function(){
        if(animation !== 'in'){
            animation = 'in';
            _reRender();
        }
    }

    var sentinelOut = function(){
        if(animation !== 'out'){
            animation = 'out';
            _reRender();
        }
    }

    var setPpf = scope.setPpf = function(value){
        ppf = value;
    }

    var render = scope.render = function(){
        img.src = '';
        img.src = file;
    }

    if(autoRender)
        render();
}

