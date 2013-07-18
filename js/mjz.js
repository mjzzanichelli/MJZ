var $$ = (
    function(){
        var $$ = function(selector,params) {
            return new $$.core.select(selector,params);
        };
		
        var ready = function(callback){
            var _eventName = document.addEventListener ? "DOMContentLoaded" : "readystatechange"
            , _helper = function(){
                removeEvent(document,_eventName,_helper)
                if (callback) callback();
            }
            addEvent(document,_eventName,_helper);
        };
        
        var install = function(name,fn,params){
            if (params && params.destroy) $$.core.uninstall(name);
            $$.core.plugins[name] = {setup:fn,objects:new Array};
        };
		
        var uninstall = function(name,params){
            if ($$.core.plugins[name]) {
                if ($$.core.plugins[name].objects.length>0){
                    var i=$$.core.plugins[name].objects.length;
                    while(i--)$$.core.plugins[name].objects.uninstall(name,params);
                }
                delete $$.core.plugins[name];
            }
        };
        
        var setClean = function(params){
            //cleandeep true overwrite clean
            $$.core.cleandeep =  (params!==undefined && params.cleandeep!==undefined ? params.cleandeep : $$.core.cleandeep);
            $$.core.clean = (!$$.core.cleandeep ? (params!==undefined && params.clean!==undefined ? params.clean : $$.core.clean) : $$.core.cleandeep);
            $$.core.cleanremove =  (params!==undefined && params.cleanremove!==undefined ? params.cleanremove : $$.core.cleanremove);
            $$.core.allowclean =  (params!==undefined && params.allowclean!==undefined ? params.allowclean : $$.core.allowclean);
        };
        
        var extend = function(base,add,overwrite){
            var _extend = {},key;
            for (key in base) _extend[key] = base[key];
            for (key in add) if (overwrite || !base[key])_extend[key] = add[key];
            return _extend
        };
	
        var stringify = function(obj){
            var t = typeof (obj);
            if (t != "object" || obj === null) {
                // simple data type
                if (t == "string") obj = '"'+obj+'"';
                return String(obj);
            }
            else {
                // recurse array or object
                var n, v, json = [], arr = (obj && obj.constructor == Array);
                for (n in obj) {
                    v = obj[n]; t = typeof(v);
                    //if (t == "string") v = '"'+v.replace(/\"/gi,'%22')+'"';
                    if (t == "string") v = '"'+v+'"';
                    else if (t == "object" && v !== null) v = this.stringify(v);
                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }
                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        };
                        
        var getType = function(object){
            var stringConstructor = "".constructor
            , arrayConstructor = [].constructor
            , objectConstructor = {}.constructor
            , functionConstructor = function(){}.constructor
            , _type = "";

            if (object === null) {
                _type = "null";
            }
            else if (object === undefined) {
                _type = "undefined";
            }
            else if (object.constructor === stringConstructor) {
                _type = "string";
            }
            else if (object.constructor === arrayConstructor) {
                _type = "array";
            }
            else if (object.constructor === objectConstructor) {
                _type = "object";
            }
            else if (object.constructor === functionConstructor) {
                _type = "function";
            }
            else if (object.nodeType !== undefined) {
                _type = "html";
            }
            stringConstructor = arrayConstructor =  objectConstructor = null;
            return _type;
        };
		
        var isArray = function(object){
            return (typeof object == "object" && object.length!==undefined);
        };
        
        var isInArray = function(object,value){
        	var _isInArray = false,i;
        	if (isArray(object)){
        		i = object.length;
        		while(i--){
        			if (object[i]==value){
        				_isInArray = true;
        				break;
        			}
        		}
        	}
            return _isInArray
        };
		
        var toArray = function(nodelist){
            var _subs=[],l=nodelist.length>>>0;
            for( ; l--;_subs[l]=nodelist[l]);
            return _subs;
        };
        
        var getMouse = function(e){
            var  _pos = new Array;
            if (!$$.core.isIE) {
                _pos[0] = e.pageX;
                _pos[1] = e.pageY;
            } else {
                _pos[0] = e.clientX + document.body.scrollLeft;
                _pos[1] = e.clientY + document.body.scrollTop;
            }
            return _pos;
        };
        
        var getPosition = function(object, offset){
            var _offset = offset || [0,0],_ret = _offset;
            if (object) {
                _offset[0] += object.offsetLeft;
                _offset[1] += object.offsetTop;
            }
            return _ret;
        };
        
        var getOffset = function(object, offset){
            var _offset = offset || /*getScrolled(object)*/[0,0],_ret = _offset;
            if (object) {
                _offset[0] += object.offsetLeft;
                _offset[1] += object.offsetTop;
                _offset = getOffset (object.offsetParent,_offset);
            }
            return _ret;
        };
        
        var getCoords = function(element){
            var _element_offset = $$.core.getOffset(element),_element_coords=new Array;
            _element_coords.push(_element_offset);
            _element_coords.push([(_element_offset[0]+element.clientWidth),_element_offset[1]]);
            _element_coords.push([(_element_offset[0]+element.clientWidth),(_element_offset[1]+element.clientHeight)]);
            _element_coords.push([_element_offset[0],(_element_offset[1]+element.clientHeight)]);
            _element_offset = null;
            return _element_coords;
        };
        
        var getScrolled = function(object, scrolled) {
            var _scrolled = scrolled || [0,0],_ret = _scrolled;
            if (object && object.tagName.toLowerCase () != "body"){
                _scrolled[0] += object.scrollLeft;
                _scrolled[1] += object.scrollTop;
                _scrolled = getScrolled(object.parentNode, _scrolled);
            }
            return _ret;
        };
        
        var getOverlappedElements = function(coords,elements,params){
            var intersectors = []
            , _params = params || "xy"
            , i = elements.length
            , _element_coords
            ;
            
            switch(getType(coords)){
                case "array":
            
                    while(i--){
                        _element_coords = getCoords(elements[i]);
                        if (
                            (_params.indexOf("x")<0 || (coords[0] > _element_coords[0][0] && coords[0] < _element_coords[2][0]))
                            && (_params.indexOf("y")<0 || (coords[1] > _element_coords[0][1] && coords[1] < _element_coords[2][1]))
                        )
                        {
                            intersectors.push(elements[i]);
                        }
                    }
                    
                    break;
                default:

                    coords = getCoords(coords);
                    while(i--){
                        _element_coords = getCoords(elements[i]);
                        if (
                            (
                                _element_coords[0][0] >= coords[0][0]
                                && _element_coords[0][0] <= coords[2][0]
                                && _element_coords[0][1] >= coords[0][1]
                                && _element_coords[0][1] <= coords[2][1]
                            ) || (
                                _element_coords[1][0] >= coords[0][0]
                                && _element_coords[1][0] <= coords[2][0]
                                && _element_coords[1][1] >= coords[0][1]
                                && _element_coords[1][1] <= coords[2][1]
                            ) || (
                                _element_coords[2][0] >= coords[0][0]
                                && _element_coords[2][0] <= coords[2][0]
                                && _element_coords[2][1] >= coords[0][1]
                                && _element_coords[2][1] <= coords[2][1]
                            ) || (
                                _element_coords[3][0] >= coords[0][0]
                                && _element_coords[3][0] <= coords[2][0]
                                && _element_coords[3][1] >= coords[0][1]
                                && _element_coords[3][1] <= coords[2][1]
                            )
                        )
                        {
                            intersectors.push(elements[i]);
                        }
                    }
                    
                    break;
            }
            _element_coords = i = null;
            return intersectors;
        };
        
        var getElementIndex = function(element,group){
            var _group = group || getSubNodes(element.parentNode)
            , i=_group.length;
            ;
            while (i--) if (_group[i]==element) break;
            _group = null;
            return i;
        };
        
        var setAttributes = function(element,params){
            var attr;
            for (attr in params)element.setAttribute(attr,params[attr]);
            attr = null;
        };
        
        var getAttributes = function(element,params){
            var _attributes={},params = (isArray(params) ? params : [params]),i=params.length;
            while(i--) _attributes[params[i]] = element.getAttribute(params[i]);
            params = i = null;
            return _attributes;
        };
        
        var setFunctionFormat = function(string){
            for(var exp=/-([a-z])/;exp.test(string);string=string.replace(exp,RegExp.$1.toUpperCase()));
            return string;
        };
        
        var setStyle = function(element,params){
            var attr,attr_fn;
            for (attr in params){
                attr_fn = setFunctionFormat(attr);
                element.style[attr_fn] = params[attr];
            }
            attr = attr_fn = null;
        };
        
        var getStyle = function(element,params){
            var attr_fn,_style={},params = (isArray(params) ? params : [params]),i=params.length;
            while(i--){
                attr_fn = setFunctionFormat(params[i]);
                _style[params[i]] = element.style[attr_fn]
            }
            attr_fn = params = i = null;
            return _style;
        };
        
        var addClass = function(element,className){
            removeClass(element,className);
            element.className = trim((element.className||"")+" "+className).replace(/ +(?= )/g,'');
        };
        
        var removeClass = function(element,className){
            element.className = trim((element.className||"").replace( new RegExp('(?:^|\\s)'+ className +'(?!\\S)'),''));
        };
        
        var hasClass = function(element,className){
            return  RegExp('(?:^|\\s)'+ className +'(?!\\S)').test((element.className||""));
        };
        
        var trim = function(string){
          return string.replace(/^\s+|\s+$/g, '');
        };
        
        
        var getSubNodes = function(element,deep){
            var _subs = arguments[2] || [],start;
            if (element.hasChildNodes()){
                start = element.firstChild;
                for ( ; start; start = start.nextSibling ) {
                    if ( start.nodeType === 1) {
                        _subs.push( start );
                        if (deep) _subs = getSubNodes(start,deep,_subs);
                    }
                }
            }
            return _subs;
        };
        
        var filterElements = function(elements,condition){
            var _elements = elements, i = _elements.length;
            while(i--) {
                if (!condition.call(_elements[i]))_elements.splice(i,1);
            }
            i = null;
            return _elements;
        };
        
        var loopEach = function(elements,action){
            var _elements = elements, i = _elements.length;
            while(i--) action.call(_elements[i],i);
        };
        
        var getMonthName = function(index){
            var _months = ["january","february","march","april","may","june","july","august","september","october","november","december"]
            return _months[index];
        };
        
        var setDocumentSelection = function(status){
            if (document.onselectstart!=="undefined") document.onselectstart=function(){return status;}
            else document.onmousedown=function(){return status;}
        };
        
        var getSelection = function(selector){
            selector = (isArray(selector) ? selector : [selector]);
            return selector;
        };
		
        var setElements = function(self){
            var i = self.elements.length;
            while(i--) {
                if (!self.elements[i].$$plug) {
                    self.elements[i].$$plug = {
                        methods: {}
                        , objects: new Array
                        , indexes: {}
                        , listeners: {}
                    }
                }
                self.elements[i].$$plug.objects.push(self);
                self.elements[i].$$plug.indexes[self.unique] = i;
            }
            i = null;
        };
		
        var setNodeRemoved = function(self,callback){
            if($$.core.mutational){
                var i = self.elements.length
                , _helper = function(e){
                    if ($$.core.mutational){
                        e = e || window.event;
                        var _target = e.target || e.srcElement;
                        if (self.elements && (!self.removed)){
                            setNodeCleanUp(_target,self);
                        }
                        removeEvent(_target,"DOMNodeRemoved",_helper);
                        if (callback) callback();
                        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                    }
                }
                while(i--) addEvent(self.elements[i],"DOMNodeRemoved",_helper);
                i = null;
            }
        };
		
        var setNodeCleanUp = function(element,self){
            if ($$.core.allowclean){
            	if (element){
	                var _$$element = element.$$plug,i,inst;
	                if (_$$element){
	                    i = _$$element.objects.length;
	                    while(i--) {
	                        if (_$$element.objects[i].installations) for (inst in _$$element.objects[i].installations) _$$element.objects[i].uninstall(inst);
	                        _$$element.objects[i].off(undefined,undefined,{elements: [element]});
	                    }
	                    if (self!==undefined) self.elements.splice(_$$element.indexes[self.unique],1);
	                }
	                _$$element = i = inst = null;
               }
            }
        };
		
        var cleanChildNodes = function(element,params){
            if((!$$.core.mutational) && $$.core.allowclean){
                var _clean=(params!==undefined && params.clean!==undefined ? params.clean : $$.core.clean)
                , _cleandeep=(params!==undefined && params.cleandeep!==undefined ? params.cleandeep : $$.core.cleandeep)
                , _cleanremove=(params!==undefined && params.cleanremove!==undefined ? params.cleanremove : $$.core.cleanremove)
                , _nodelist = []
                , i
                , ii
                , inst
                , _$$element
                ;
                _clean = _cleandeep ? true : _clean
                if (element.hasChildNodes() && _clean){
                    if (_cleandeep){
                        _nodelist = getSubNodes(element,true);
                        if (_nodelist.length>0){
                            i = _nodelist.length;
                            while (i--){
                                _$$element = _nodelist[i].$$plug;
                                if (_$$element && _$$element.objects){
                                    ii = _$$element.objects.length;
                                    while(ii--){
                                        if (_$$element.objects[ii].installations) for (inst in _$$element.objects[ii].installations) _$$element.objects[ii].uninstall(inst);
                                        _$$element.objects[ii].off(undefined,undefined,{elements: [_nodelist[i]]});
                                        if (_cleanremove) _nodelist[i].parentNode.removeChild(_nodelist[i]);
                                        _$$element.objects[ii].elements.splice(_$$element.indexes[_$$element.objects[ii].unique],1);
                                    }
                                }
                            }
                        }
                    } else {
                        _nodelist = getSubNodes(element);
                        if (_nodelist.length>0){
                            _$$element = _nodelist[0].$$plug;
                            if (_$$element && _$$element.objects){
                                ii = _$$element.objects.length;
                                while(ii--){
                                    if (_$$element.objects[ii].installations) for (inst in _$$element.objects[ii].installations) _$$element.objects[ii].uninstall(inst);
                                    _$$element.objects[ii].off(undefined,undefined,{elements: _nodelist});
                                }
                            }
                            i = _nodelist.length;
                            while (i--){
                                _$$element = _nodelist[i].$$plug;
                                if (_cleanremove) _nodelist[i].parentNode.removeChild(_nodelist[i]);
                                ii = _$$element.objects.length;
                                while(ii--){
                                    _$$element.objects[ii].elements.splice(_$$element.indexes[_$$element.objects[ii].unique],1);
                                }
                            }
                        }
                    }
                }
                _clean = _cleandeep = _nodelist = _$$element = i = ii = inst = null;
            }
        };
        
        var setObjectPlugins = function(self,params){
            if (params!==undefined && params.install !==undefined){
                if (!isArray(params.install)) params.install = [params.install];
                var i = params.install.length
                , _type
                , _name
                , _params = {}
                ;
                while(i--) {
                    _type = getType(params.install[i]);
                    if (_type=="string"){
                        _name = params.install[i];
                    } else if (_type=="object"){
                        for (_name in params.install[i]) break;
                        if (getType(params.install[i][_name])=="object") _params = params.install[i][_name];
                    }
                    if (_name!==undefined && $$.core.plugins[_name]) self.install(_name,$$.core.plugins[_name].setup,_params);
                }
                i = _type = _name = _params = null;
            }
        };
		
        var addEvent = function(element,eventName,helper){
            if(element.addEventListener){
                element.addEventListener(eventName,helper,false);
            }else if(element.attachEvent && htmlEvents['on'+eventName]){// IE < 9
                element.attachEvent('on'+eventName,helper);
            }else{
                element['on'+eventName]=helper;
            }
        };
		
        var removeEvent = function(element,eventName,helper){
            if(element.removeEventListener){
                element.removeEventListener(eventName,helper,false);
            }else if(element.detachEvent && htmlEvents['on'+eventName]){// IE < 9
                element.detachEvent('on'+eventName,helper);
            }else{
                element['on'+eventName]=null;
            }
        };
		
        var setEvent = function(eventName,params){
            var _event;
            if(document.createEvent){
                _event = document.createEvent('HTMLEvents');
                _event.initEvent(eventName,true,true);
            }else if(document.createEventObject){// IE < 9
                _event = document.createEventObject();
                _event.eventType = eventName;
            }
            _event.eventName = eventName;
            if (params) _event["$$plug"] = {"params":params};
            return _event;
        };
		
        var triggerEvent = function(element,eventName,event){
            if(element.dispatchEvent){
                element.dispatchEvent(event);
            }else if(element.fireEvent && htmlEvents['on'+eventName]){// IE < 9
                element.fireEvent('on'+event.eventType,event);// can trigger only real event (e.g. 'click')
            }else if(element[eventName]){
                element[eventName](event);
            }else if(element['on'+eventName]){
                element['on'+eventName](event);
            }
        };

        var getEventIndex = function(listener,helper){
            var i=listener.length;
            while (i--){
                if (listener[i][0]==helper) break;
            }
            return i;
        };
		
        var htmlEvents = {
            onload:1,
            onunload:1,
            onblur:1,
            onchange:1,
            onfocus:1,
            onreset:1,
            onselect:1,
            onsubmit:1,
            onabort:1,
            onkeydown:1,
            onkeypress:1,
            onkeyup:1,
            onclick:1,
            ondblclick:1,
            onmousedown:1,
            onmousemove:1,
            onmouseout:1,
            onmouseover:1,
            onmouseup:1
        };
		
        var setElementMethods = function(self){
            var _methods = {

                install: function(name,fn,params){
                    if (params && params.destroy) self.uninstall(name);
                    if (!self[name]) self[name] = fn();
                    if (self[name].init) self[name].init.call(self,params,name);
                    self.installations[name] = fn;
                }
				
                , uninstall: function(name,params){
                    if (self[name]) {
                        if (self[name].destroy) self[name].destroy.call(self,params);
                        self[name] = null;
                        delete self[name];
                        delete self.installations[name];
                    }
                }
				
                , on: function(eventName,helper,params){
                    if (eventName && helper){
                        var _element, i=self.elements.length,_helper;
                        while (i--){
                            _element = self.elements[i];
                            _helper = (function(element){
                                return function(e){
                                   helper.call(element,e,self);
                                    if (params && params.stop) {
                                        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                                    }
                                }
                            })(_element);
                            //console.log(_helper)
                            if (!_element.$$plug.listeners[self.unique]) _element.$$plug.listeners[self.unique] = {};
                            if (!_element.$$plug.listeners[self.unique][eventName]) _element.$$plug.listeners[self.unique][eventName] = new Array;
                            _element.$$plug.listeners[self.unique][eventName].push([helper,_helper])
                            addEvent(_element,eventName,_helper)
                        }
                    }
                }

                , off: function(eventName,helper,params){
                    var _element
                    , _elements = (params && params.elements ? params.elements : self.elements)
                    , i=_elements.length
                    , ii
                    , _element_listener
                    , _index;

                    while (i--){
                        _element = _elements[i];
                        _element_listener = _element.$$plug.listeners[self.unique];
                        if (_element_listener){
                            if (helper===undefined){
                                if (eventName!==undefined){
                                    _element_listener = _element_listener[eventName];
                                    if (_element_listener){
                                        ii=_element_listener.length;
                                        while(ii--) removeEvent(_element,eventName,_element_listener[1]);
                                        delete _element_listener[eventName];
                                    }
                                } else {
                                    for (var l in _element_listener) {
                                        ii=_element_listener[l].length;
                                        while(ii--) removeEvent(_element,l,_element_listener[l][ii][1]);
                                    }
                                    delete _element.$$plug.listeners[self.unique];
                                }
                            } else {
                                _element_listener = _element_listener[eventName];
                                if (_element_listener && _element_listener.length>0){
                                    _index = getEventIndex(_element_listener,helper);
                                    if (_index>=0){
                                        var _helper = _element_listener[_index][1];
                                        removeEvent(_element,eventName,_helper);
                                        _element_listener.splice(_index,1)
                                    }
                                }
                            }
                        }
                    }
                    _element = _elements = i = ii = _element_listener = _index = null;
                }

                , trigger: function(eventName,params){
                    var _elements = (params && params.elements ? params.elements : self.elements)
                    , _event=setEvent(eventName,params)
                    , i=_elements.length;
                    while (i--)triggerEvent(_elements[i],eventName,_event);
                    _elements = _event = i = null;
                }

                , html: function(value,params){
                    var _elements = (params && params.elements ? params.elements : self.elements)
                    ,i=_elements.length;
                    if (value!==undefined){
                        while (i--){
                            cleanChildNodes(_elements[i],params)
                            _elements[i].innerHTML = value;
                        }
                    }
                    _elements = i = null;
                    return self.elements[0].innerHTML
                }
                
                , append: function(value,params){
                    var _elements = (params && params.elements ? params.elements : self.elements)
                    , _new_element
                    , _new_element_html
                    , _new_elements=new Array(_elements.length)
                    , i=_elements.length
                    ;
                    if (value!==undefined){
                        while (i--){
                            _new_element = document.createElement("div");
                            _new_element_html = value;
                            if ($$.core.getType(_new_element_html)=="function")_new_element_html = _new_element_html.call(_elements[i]);
                            switch($$.core.getType(_new_element_html)){
                            	case "string":
                            		_new_element.innerHTML = _new_element_html;
                            		_new_element = _new_element.firstChild;
                        			break;
                        		case "html":
                        			_new_element = _new_element_html; 
                        			break;
                            }
                            for ( ; _new_element; _new_element = _new_element.nextSibling ) if ( _new_element.nodeType === 1) break;
                            _elements[i].appendChild(_new_element);
                            _new_elements[i] = _new_element;
                        }
                    }
                    _elements = _new_element = _new_element_html = i = null;
                    return _new_elements;
                }
                
                , insertAfter: function(value,params){
                    var _elements = (params && params.elements ? params.elements : self.elements)
                    , _parent
                    , _new_element
                    , _new_element_html
                    , _new_elements=new Array(_elements.length)
                    , i=_elements.length
                    ;
                    if (value!==undefined){
                        while (i--){
                            _new_element = document.createElement("div");
                            _new_element_html = value;
                            if ($$.core.getType(_new_element_html)=="function")_new_element_html = _new_element_html.call(_elements[i]);
                            switch($$.core.getType(_new_element_html)){
                            	case "string":
                            		_new_element.innerHTML = _new_element_html;
                            		_new_element = _new_element.firstChild;
                        			break;
                        		case "html":
                        			_new_element = _new_element_html; 
                        			break;
                            }
                            for ( ; _new_element; _new_element = _new_element.nextSibling ) if ( _new_element.nodeType === 1) break;
                            
                            _parent = _elements[i].parentNode;
                            if(_parent.lastchild == _elements[i])_parent.appendChild(_new_element);
                            else _parent.insertBefore(_new_element, self.next({element:_elements[i]}));
                            //_elements[i].appendChild(_new_element);
                            _new_elements[i] = _new_element;
                        }
                    }
                    _elements = _new_element = _new_element_html = i = null;
                    return _new_elements;
                }

                , remove: function(params){
                    var _elements = (params && params.elements ? params.elements : self.elements)
                    ,i=_elements.length;
                    self.removed=true;
                    while (i--){
                        cleanChildNodes(_elements[i],params)
                        setNodeCleanUp(_elements[i]);
                        _elements[i].parentNode.removeChild(_elements[i]);
                        self.elements.splice(_elements[i].$$plug.indexes[self.unique],1);
                        _elements[i] = null;
                    }
                    _elements = i = null;
                }

                , parent: function(params){
                	var _element = (params && params.element ? params.element : self.elements[0]);
                    return _element.parentNode;
                }
                
                , children: function(params){
                	var _element = (params && params.element ? params.element : self.elements[0]);
                    return self.sibling(_element.firstChild);
                }
                
                , index: function(params){
                    var _element = (params && params.element ? params.element : self.elements[0])
                    , _group = (params && params.group ? params.group : undefined)
                    ;
                    return getElementIndex(_element,_group);
                }

                , sibling: function(start,exclude){
                    var _elements = [];
                    for ( ; start; start = start.nextSibling ) if ( start.nodeType === 1 && start !== exclude) _elements.push( start );
                    return _elements;
                }

                , siblings: function(){
                    return self.sibling((self.elements[0].parentNode||{}).firstChild,self.elements[0]);
                }
                
                , next: function(params){
                    var _element = (params && params.element ? params.element : self.elements[0]) 
                    	, _next = _element
                	;
                    while ( (_next = _next.nextSibling) && _next.nodeType !== 1 ) {}
                    return (_next!=self.elements[0]?_next:null);
                    
                }
                
                , prev: function(params){
                    var _element = (params && params.element ? params.element : self.elements[0]) 
                    	, _prev = _element
                	;
                    while ( (_prev = _prev.previousSibling) && _prev.nodeType !== 1 ) {}
                    return (_prev!=self.elements[0]?_prev:null);
                }
                
                , filter: function(params){
                    var _elements = (params && params.elements ? params.elements : self.elements.slice(0));
                    if (params){
                        if (getType(params)=="function") _elements = filterElements(_elements,params);
                        else if (params.condition) _elements = filterElements(_elements,params.condition);
                    }
                    return _elements
                }
            
                , each: function(params){
                    var _elements = (params && params.elements ? params.elements : self.elements)
                    , i = _elements.length
                    , _action = (getType(params)=="function" ? params : (params && params.action && getType(params)=="function" ? params.action : undefined))
                    ;
                    loopEach(_elements,_action);
                }
                
                , attr: function(attrs,params){
                    var _elements = (params && params.elements ? params.elements : self.elements)
                    ,i=_elements.length;
                    while (i--){
                        switch(getType(attrs)){
                            case "object":
                                setAttributes(_elements[i],attrs);
                                break;
                            case "array":
                                return getAttributes(_elements[i],attrs);
                            case "string":
                                return getAttributes(_elements[i],attrs)[attrs];
                                break;
                        }
                    }
                    _elements = i = null;
                }
                
                , css: function(css,params){
                    var _elements = (params && params.elements ? params.elements : self.elements)
                    ,i=_elements.length;
                    while (i--){
                        
                        switch(getType(css)){
                            case "object":
                                setStyle(_elements[i],css);
                                break;
                            case "array":
                                return getStyle(_elements[i],css);
                            case "string":
                                return getStyle(_elements[i],css)[css];
                                break;
                        }
                    }
                    _elements = i = null;
                }
                
                , addClass: function(className,params){
                    var _elements = (params && params.elements ? params.elements : self.elements)
                    , i=_elements.length
                    , _classes= (className!==undefined?className.replace(/ +(?= )/g,'').split(" "):[])
                    , ii = _classes.length
                    ;
                    if (ii>0){
                        while (i--){
                            while (ii--) addClass(_elements[i],_classes[ii]);
                            ii = _classes.length;
                        }
                    }
                    _elements = i = _classes = ii = null;
                }
                
                , removeClass: function(className,params){
                    var _elements = (params && params.elements ? params.elements : self.elements)
                    , i=_elements.length
                    , _classes= (className!==undefined?className.replace(/ +(?= )/g,'').split(" "):[])
                    , ii = _classes.length
                    ;
                    if (ii>0){
                        while (i--){
                            while (ii--) removeClass(_elements[i],_classes[ii]);
                            ii = _classes.length;
                        }
                    }
                    _elements = i = _classes = ii = null;
                }
                
                , position: function(params){
                    var _element = (params && params.element ? params.element : self.elements[0])
                    return getPosition(_element);
                }
            }
            return _methods;
        };
		
        var setElementProperties = function(){
            var _properties = {
            	installations:{}
                , removed: false
            };
            return _properties;
        };

        var setLibraryMethods = function(){
            var _methods = {
                select: select
                , ready: ready
                , install: install
                , uninstall: uninstall
                , setClean: setClean
                , extend: extend
                , stringify: stringify
                , getType: getType
                , isArray: isArray
                , isInArray: isInArray
                , toArray: toArray
                , getMouse: getMouse
                , getPosition: getPosition
                , getOffset: getOffset
                , getCoords: getCoords
                , getOverlappedElements : getOverlappedElements
                , getElementIndex: getElementIndex
                , loopEach: loopEach
                //, setFunctionFormat: setFunctionFormat
                , setAttributes: setAttributes
                , getAttributes: getAttributes
                , setStyle: setStyle
                , getStyle: getStyle
                , addClass: addClass
                , removeClass: removeClass
                , hasClass: hasClass
                , trim: trim
                , getSubNodes: getSubNodes
                , filterElements: filterElements
                , getMonthName: getMonthName
                , setDocumentSelection: setDocumentSelection
            };
            return _methods;
        };

        var setLibraryProperties = function(){
            var _properties = {
                elements: new Array
                , unique: 0
                , mutational: (document.implementation.hasFeature('MutationEvents','2.0') || window.MutationEvent)
                //, mutational: false
                , allowclean: true
                , isIE: (document.all ? true : false)
                , clean: false
                , cleandeep: false
                , cleanremove: false
                , plugins: {}
            };
            return _properties;
        };

        var select = function(selector,params){
            var _select = {},_methods = {},_properties = {},m,p;
            if (selector) {
                $$.core.unique++;
                var _elements = getSelection(selector);
                _select =  {
                    elements: _elements
                    , unique: $$.core.unique
                    , "$$": "true"
                    };
                _methods = setElementMethods(_select);
                _properties = setElementProperties(_select);
                for (m in _methods) _select[m] = _methods[m];
                for (p in _properties) _select[p] = _properties[p];
                setElements(_select);
                setNodeRemoved(_select);
                setObjectPlugins(_select,params);
            } else {
                _methods = setLibraryMethods();
                _properties = setLibraryProperties();
                for (m in _methods) _select[m] = _methods[m];
                for (p in _properties) _select[p] = _properties[p];
            }

            //console.log("selecting",_select.elements)
            return _select;
        };

        $$.core = $$.prototype = select();

        return $$;
    }
)();
