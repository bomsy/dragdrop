//************************************************************
// dragdrop.js
// 17/04/2012
// A simple library to easily implement drag and drop functionality.
// Cross browser compatibility and functionality
// Currently supports ie7,ie8,ie9+,chrome, firefox, opera and safari
// can replace html5 drag and drop

// v 1.0.0 - hbm - 17/04/2012 - release basic with support for ie9+
// v 1.0.1 - hbm - 18/04/2012 - chrome,safari, firefox and opera basic working
// v 1.0.2 - hbm - 23/04/2012 - ie7,ie8 support
//**********************************************************
if (!this.DRAGDROP) {
	this.DRAGDROP = (function (global) {
		var e = global.event, //make sure the window event is set
			body = global.document.body,
			tagElements,
			_moveHorizontal = true,
			_moveVertical = true,
			_draggables,
			_dropables,
			_offsetX = 0,
			_offsetY = 0, //mouse pointer positions.
			_startX = 0,
			_startY = 0, //to store the start positions of the current source object;
			_dragObject = null,
			_drag = false,
			_selectObject = null,
			_dragParent = null,
			_clone = null,

		_onMouseDown = function (e) {
			console.log("down");
			var src = e.srcElement || e.target,
				style, w, h;
			if (src.className === "drag") {
				_dragObject = src;
				style = document.defaultView.getComputedStyle(_dragObject, null);
				_dragParent = _dragObject.parentNode;
				//cache width & height
				w = style.getPropertyValue("width");
				h = style.getPropertyValue("height");

				_offsetX = e.clientX;
				_offsetY = e.clientY;

				//grab the dragObject for the drag operation
				if (typeof _dragObject.currentStyle !== "undefined") {
					_startX = _getActualLeft(_dragObject) - _dragObject.parentNode.scrollLeft; //ie
					_startY = _getActualTop(_dragObject) - _dragObject.parentNode.scrollTop; //ie
				} else {
					_startX = parseInt(style.getPropertyValue("left")); //chrome
					_startY = parseInt(style.getPropertyValue("top")); //chrome
				}
				_drag = true;
				_addEvent(document.body, "mousemove", _onMouseMove);
				_addEvent(document.body, "mouseup", _onMouseUp);



				if (typeof DRAGDROP.onDragBegin === 'function') {
					DRAGDROP.onDragBegin(_dragObject);
				}

				_dragParent.removeChild(_dragObject);
				_clone = _dragObject.cloneNode(true);
				body.appendChild(_clone);
				_positionDragElements(_clone, true);
				//preserve the width and height for the drag
				_clone.style.width = w;
				_clone.style.height = h;
				_clone.style.left = _startX + "px";
				_clone.style.top = _startY + "px";
				_clone.focus();
			}

			return false;
		},

		_onMouseMove = function (e) {
			console.log("move");
			var elementBelow = null;
			if (_dragObject && _clone && _drag) {
				if (_moveVertical) {
					_clone.style.top = (e.clientY - _offsetY) + _startY + 'px';
				} else {
					_clone.style.top = _startY + "px";
				}
				if (_moveHorizontal) {
					_clone.style.left = (e.clientX - _offsetX) + _startX + 'px';
				} else {
					_clone.style.left = _startX + "px";
				}
				_clone.focus();
				elementBelow = _getElementBelowDrag(e, _clone);
				if (typeof DRAGDROP.onDrag === 'function') {
					DRAGDROP.onDrag(elementBelow, _dragObject);
				}
			}
			return false;
		},

		 _onMouseUp = function (e) {
		 	var dropElement = null;
		 	if (_dragObject && _clone && _drag) {
		 		_positionDragElements(_dragObject, false);
		 		dropElement = _getElementBelowDrag(e, _clone);
		 		dropElement.appendChild(_dragObject);
		 		body.removeChild(_clone);
		 		if (typeof DRAGDROP.onDrop === 'function') {
		 			DRAGDROP.onDrop(dropElement, _dragObject);
		 		}
		 		_drag = false;
		 		_startX = 0;
		 		_startY = 0;
		 		_offsetX = 0;
		 		_offsetY = 0;
		 		_removeEvent(_dragObject, "mousemove", _onMouseMove);
		 		_removeEvent(_dragObject, "mouseup", _onMouseUp);
		 		_dragObject = null;
		 	}
		 	return false;
		 },

		_getElementBelowDrag = function (e, dragElement) {
			var elmnt;
			dragElement.style.display = "none";
			elmnt = document.elementFromPoint(e.clientX, e.clientY);
			dragElement.style.display = "block";
			return elmnt;
		},

		_positionDragElements = function (element, dragState) {
			var parent = element.parentNode;
			if (dragState) {
				element.style.opacity = "0.5";
				element.style.position = "absolute";
			} else {
				element.style.opacity = "1.0";
				element.style.position = "static";
			}
			element.style.cursor = "move";
		},
		//custom event add and remove event actions
		_addEvent = function (element, event, handler) {
			if (document.attachEvent) {
				element.attachEvent("on" + event, handler); //ie
			} else {
				element.addEventListener(event, handler, true);
			}
		},

		_removeEvent = function (element, event, handler) {
			if (document.detachEvent) {
				element.detachEvent("on" + event, handler); //ie
			} else {
				element.removeEventListener(event, handler, true);
			}
		},

		_checkAndSetDraggables = function () {
			//get the drag and drop elements
			if (document.getElementsByClassName) { //ie9+, chrome
				_draggables = document.getElementsByClassName("drag");
			} else if (document.querySelectorAll) { //ie8
				_draggables = document.querySelectorAll(".drag")
			} else { //ie7
				var arrs = [];
				tagElements = document.getElementsByTagName("div");
				for (var x = 0; x < tagElements.length; x++) {
					if (tagElements[x].getAttribute("className") === "drag") {
						arrs.push(tagElements[x]);
					}
				}
				_draggables = arrs;
			}
		},
		_attachAndPosition = function () {
			//attach Events
			for (var i = 0; i < _draggables.length; i++) {
				_addEvent(_draggables[i], "mousedown", _onMouseDown);
				_positionDragElements(_draggables[i], false);
			}
		},
		_topmostParent = function () {
			var a = [],
				l,
				o;
			a = document.getElementsByClassName("drag");
			l = a.length;
			o = a[l - 1];
			console.log(o.id);
			return o.parentNode;
		},
		_getActualTop = function (element) {
			var top = element.offsetTop,
				p = element.offsetParent;
			while (p) {
				top += p.offsetTop;
				p = p.offsetParent;
			}
			return top;
		},
		_getActualLeft = function (element) {
			var left = element.offsetLeft,
				p = element.offsetParent;
			while (p) {
				left += p.offsetLeft;
				p = p.offsetParent;
			}
			return left;
		},
		_initialize = function () {
			_checkAndSetDraggables();
			_attachAndPosition();
			console.log("sdk in play");
		};
		//automatically run once the SDK has been loaded;
		_initialize();

		return {
			onDragBegin: null,
			onDrag: null,
			onDrop: null,
			reInit: function () {
				_initialize();
			},
			moveHorizontal: function (value) {
				if (typeof value === 'boolean') {
					_moveHorizontal = value;
					return value;
				} else {
					throw new Error("moveHorizontal: The value must be boolean ");
				}
			},
			moveVertical: function (value) {
				if (typeof value === 'boolean') {
					_moveVertical = value;
					return value;
				} else {
					throw new Error("moveVertical: The value must be boolean ");
				}
			}
		};
	})(this);
}