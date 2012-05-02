dragdrop
========
A small javascript dragdrop library that handles drag n drop  and let you focus on implementation details

## Loading the javscript file

    (function(){
      if(document.getElementById(id)) {
          var js,
        	id = "dragdrop-js",
      		ref = document.getElementsByTagName('script')[0];
      		js = document.createElement("script");
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
    })()