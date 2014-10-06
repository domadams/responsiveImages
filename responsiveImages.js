/**
* Responsive Image Plugin
* @version 1.0.0
* @author Dominic Adams
* @license The MIT License (MIT)
*/

function makeImagesResponsive(){
    var viewport = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    /*============================
            GET ALL IMAGES
    =============================*/
    var images = document.getElementsByTagName('body')[0].getElementsByTagName('img');
    if( images.length === 0 ){
        return;
    }
    /*============================
        HAS ATTR FUNCTION
    =============================*/
    var hasAttr;
    if(!images[0].hasAttribute){ //IE <=7 fix
        hasAttr = function(el, attrName){ //IE does not support Object.Prototype
            return el.getAttribute(attrName) !== null;
        };
    } else {
        hasAttr = function(el, attrName){
            return el.hasAttribute(attrName);
        };
    }

    /*============================
     CHECK IF DISPLAY IS RETINA
    =============================*/

    var retina = window.devicePixelRatio ? window.devicePixelRatio >= 1.2 ? 1 : 0 : 0;

    /*============================
     LOOP ALL IMAGES
    =============================*/
    for (var i = 0; i < images.length; i++) {
        var image = images[i];
        //set attr names
        var srcAttr = ( retina && hasAttr(image, 'data-src2x') ) ? 'data-src2x' : 'data-src';
        var baseAttr = ( retina && hasAttr(image, 'data-src-base2x') ) ? 'data-src-base2x' : 'data-src-base';
        //check image attributes
        if( !hasAttr(image, srcAttr) ){
            continue;
        }
        var basePath = hasAttr(image, baseAttr) ? image.getAttribute(baseAttr) : '';
        //get attributes
        var queries = image.getAttribute(srcAttr);
        //split defined query list
        var queries_array = queries.split(',');
        //loop queries
        for(var j = 0; j < queries_array.length; j++){
            var query = queries_array[j].replace(':','||').split('||');
            var condition = query[0];
            var response = query[1].replace(/(\[|\])/,"");
            var conditionpx;
            var bool;

            //check if condition is below
            if(condition.indexOf('<') !== -1){
                conditionpx = condition.split('<');
                if(queries_array[(j -1)]){
                    var prev_query = queries_array[(j - 1)].split(/:(.+)/);
                    var prev_cond = prev_query[0].split('<');
                    bool =  (viewport <= conditionpx[1] && viewport > prev_cond[1]);
                } else {
                    bool =  (viewport <= conditionpx[1]);
                }
            } else {
                conditionpx = condition.split('>');
                if(queries_array[(j +1)]){
                    var next_query = queries_array[(j +1)].split(/:(.+)/);
                    var next_cond = next_query[0].split('>');
                    bool = (viewport >= conditionpx[1] && viewport < next_cond[1]);
                } else {
                    bool = (viewport >= conditionpx[1]);
                }
            }

            //check if document.width meets condition
            if(bool){
                var isCrossDomain = response.indexOf('//') !== -1 ? 1 : 0;
                var new_source;
                if(isCrossDomain === 1){
                    new_source = response;
                } else {
                    new_source = basePath + response;
                }

                if(image.src !== new_source){
                    //change img src to basePath + response
                    image.setAttribute('src', new_source);
                }

                //break loop
                break;
            }
        }
    }
}

var resizeTimeout;
function resizeThrottler() {
    // ignore resize events as long as an makeImagesResponsive execution is in the queue
    if ( !resizeTimeout ) {
        resizeTimeout = setTimeout(function() {
            resizeTimeout = null;
            makeImagesResponsive();
            // The makeImagesResponsive will execute at a rate of 15fps
        }, 66);
    }
}

function listen(evnt, elem, func) {
    if (elem.addEventListener)  // W3C DOM
        elem.addEventListener(evnt,func,false);
    else if (elem.attachEvent) { // IE DOM
        return elem.attachEvent("on"+evnt, func);
    }
}

if(window.addEventListener){
    listen('DOMContentLoaded', window  ,function(){
        makeImagesResponsive();
    });
    window.addEventListener('resize', resizeThrottler,false);
} else {
    listen('load',window,function(){
        makeImagesResponsive();
    });
}



