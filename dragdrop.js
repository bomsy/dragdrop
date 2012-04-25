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
	DRAGDROP = (function (e) {
		e = e || window.event; //make sure the window event is set
		var tagElements;
		var _moveHorizontal = true,
			_moveVertical = true;

		onDragBegin = null;
		onDrag = null;
		onDrop = null;

		var _draggables, _dropables,
		_offsetX = 0, _offsetY = 0, //mouse pointer positions.
		_startX = 0, _startY = 0, //to store the start positions of the current source object;
		_dragObject = null,
		_drag = false,
		_selectObject = null;


		_onMouseDown = function (e) {
			console.log("mousedown");
			var src = e.srcElement || e.target;
			var style;
			if (src.className === "drag") {
				_dragObject = src;
				_offsetX = e.clientX;
				_offsetY = e.clientY;

				if (typeof _dragObject.currentStyle !== "undefined") {
					_startX = parseInt(_dragObject.currentStyle.left); //ie
					_startY = parseInt(_dragObject.currentStyle.top); //ie
				} else {
					style = document.defaultView.getComputedStyle(_dragObject, null);
					_startX = parseInt(style.getPropertyValue("left")); //chrome
					_startY = parseInt(style.getPropertyValue("top")); //chrome
				}
				_drag = true;
				_positionDragElements(_dragObject, true); //move element up
				_addEvent(_dragObject, "mousemove", _onMouseMove);
				_addEvent(_dragObject, "mouseup", _onMouseUp);

				if (typeof DRAGDROP.onDragBegin === 'function') {
					DRAGDROP.onDragBegin(_dragObject);
				}
				_dragObject.focus();
			}
			return false;
		};

		_onMouseMove = function (e) {
			console.log("mousemove")
			var elementBelow = null;
			if (_dragObject && _drag) {
				if (_moveVertical) {
					_dragObject.style.top = (e.clientY - _offsetY) + _startY + 'px';
				} else {
					_dragObject.style.top = _startY;
				}
				if (_moveHorizontal) {
					_dragObject.style.left = (e.clientX - _offsetX) + _startX + 'px';
				} else {
					_dragObject.style.left = _startX;
				}
				_dragObject.focus();
				elementBelow = _getElementBelowDrag(e, _dragObject);
				if (typeof DRAGDROP.onDrag === 'function') {
					DRAGDROP.onDrag(elementBelow, _dragObject);
				}
			}
			return false;
		};

		_onMouseUp = function (e) {
			console.log("mouseup");
			var dropElement = null;
			if (_dragObject && _drag) {
				_positionDragElements(_dragObject, false);
				dropElement = _getElementBelowDrag(e, _dragObject);
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
		};
		_onClick = function (e) {

		};

		_getElementBelowDrag = function (e, dragElement) {
			var elmnt;
			dragElement.style.display = "none";
			elmnt = document.elementFromPoint(e.clientX, e.clientY);
			dragElement.style.display = "block";
			return elmnt;
		};

		_positionDragElements = function (element, dragState) {
			var parent = element.parentNode;
			if (dragState) {
				element.style.opacity = "0.5";
				element.style.zIndex = 1000;
			} else {
				element.style.opacity = "1.0";
				element.style.zIndex = 500;
			}
			element.style.position = "absolute";
			element.style.cursor = "move";
			if (parent.style.position !== "relative") {
				parent.style.position = "relative";
			}
		};
		//custom event add and remove event actions
		_addEvent = function (element, event, handler) {
			if (document.attachEvent) {
				element.attachEvent("on" + event, handler); //ie
			} else {
				element.addEventListener(event, handler, false);
			}
		};

		_removeEvent = function (element, event, handler) {
			if (document.detachEvent) {
				element.detachEvent("on" + event, handler); //ie
			} else {
				element.removeEventListener(event, handler, false);
			}
		};

		//get the drag and drop elements
		if (document.getElementsByClassName) { //ie9+, chrome
			_draggables = document.getElementsByClassName("drag");
		} else if (document.querySelectorAll) { //ie8
			_draggables = document.querySelectorAll(".drag")
		} else { //ie7
			var arrs = [];
			tagElements = document.getElementsByTagName("div");
			for (var x = 0; x < tagElements.length; x++) {
				if (tagElements[x].getAttribute("className")=== "drag") {
					arrs.push(tagElements[x]);
				}
			}
			_draggables = arrs;
		}
		//attach Events
		for (var i = 0; i < _draggables.length; i++) {
			_addEvent(_draggables[i], "mousedown", _onMouseDown);
			_positionDragElements(_draggables[i], false);
		}
		return {
			moveHorizontal: function (value) {
				if (value === true || value === false) {
					_moveHorizontal = value;
				} else {
					throw new Error("moveHorizontal: The value must be boolean ");
				}
			},
			moveVertical: function (value) {
				if (value === true || value === false) {
					_moveVertical = value;
				} else {
					throw new Error("moveVertical: The value must be boolean ");
				}
			}
		};
	})(this.event);
}