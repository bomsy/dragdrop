dragdropjs
==========
A small javascript library that handles drag n drop, letting you focus on your implementation details
Aim to ease the difficulties in implementing drag n drop.
## Progress
Still  under development
## Cross browser support
Currently supports ie7+, chrome, firefox, opera and safari.
## Loading the javscript file

    (function(d){
      if(d.getElementById(id)) {
          var js,
        	id = "dragdrop-js",
      		ref = d.getElementsByTagName('script')[0];
      		js = d.createElement("script");
      		js.id = id;
      		js.type = "text/javascript";
      		js.src = "/js/dragdrop/dragdrop.js";
      		js.async = false;
      		js.onreadystatechange = function () {
      			if (js.readyState === "loaded" || js.readyState === "complete") {
      				js.onreadystatechange = null;
        			DRAGDROP.onDragBegin = function (dragElement) {
        	            //your code to run on drag begin
                    };
            	    DRAGDROP.onDrag = function (elementBelow, dragElement) {
                        //your code to run on drag
            	    };
            	    DRAGDROP.onDrop = function (dropElement, dragElement) {
                        //your code to run on drop
            	    };
                }
      		}
      		ref.parentNode.insertBefore(js, ref);
      }
    })(document)
## Examples
