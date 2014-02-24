var $$ = (
    function(){

    	if ($$) return $$;
    	
    	var _self = function(selector,params){
    		return _private.setInstance(selector,params);
    	};

//$$ private members
    	var _private = {
    		unique : 0
            , mutational: (document.implementation.hasFeature('MutationEvents','2.0') || window.MutationEvent)
            //, mutational: false
            , allowclean: true
            , isIE: (document.all ? true : false)
            , features:{}
            , clean: false
            , cleandeep: false
            , cleanremove: false
            , plugins: {}
    		
    		, setSeparatorAction: function(string,sep) {
				var _idxs = _private.setSelectionIndexes(string)
					, _sep = {
						"sep":string
						, "idx": 0
					}
					, _action
					, _value = string
				;
				if (_idxs["separator"]){
					_sep = _idxs["separator"];
					if (_sep["idx"]>0)_value = _value.substring(0,_sep["idx"]);
				}
				switch(sep["sep"]){
					case "#":
						_action = function(elms){
							var _elements = _public.getElementsByAttributeValue(elms,"id",_value);
							return _elements;
						};
						break;
					case ".":
						_action = function(elms){
							var _elements = _public.getElementsByClassName(elms,_value);
							return _elements;
						};
						break;
					case "]":
						_action = function(elms){
							return elms;
						};
						break;
					case "[":
						_action = function(elms){
							var 
								_value_arr = _value.split("=")
								, _elements = _public.getElementsByAttributeValue(elms,_value_arr[0],_value_arr[1].toString())
							;
							return _elements;
						};
						break;
					case ":":
						_action = function(elms){
							var _elements = _public.getElementsByPseudo(elms,string);
							return _elements;
						};
						break;
				}
				return {"action": _action, "string":string.substring(_sep["idx"]+_sep["sep"].length), "sep": _sep};
			}
			
			, setSelectionIndexes: function(string) {
				var _idxs = {
						".": null
						,"#": null
						,"[": null
						,"]": null
						,":": null
					}
					, _sep
					, _idx
				;
				for (_sep in _idxs) {
					_idxs[_sep] = string.indexOf(_sep);
					if (_idxs[_sep] >= 0 && (_idx=== undefined || _idxs[_sep]<_idx["idx"]))_idx = {"sep": _sep,"idx":_idxs[_sep]};
				}
					
				return {
					"indexes": _idxs
					, "separator": _idx  
				};
			}

    		, setInstance: function(selector,params){
    			return new Instance(selector,params);
		     }
	        
	        , setInstanceProperties : function(){

//$$() instance members
	        	var _properties = {
	                installations:{}
                	, removed: false
	                , install: function(name,fn,params){
	                    if (params && params.destroy) this.uninstall(name);
	                    if (!this[name]) this[name] = fn();
	                    if (this[name].init) this[name].init.call(this,params,name);
	                    this.installations[name] = fn;
	                }
					
	                , uninstall: function(name,params){
	                    if (this[name]) {
	                        if (this[name].destroy) this[name].destroy.call(this,params);
	                        this[name] = null;
	                        delete this[name];
	                        delete this.installations[name];
	                    }
	                }
	                
	                , on: function(eventName,helper,params){
	                    if (eventName && helper){
	                        var _element, i=this.elements.length,_helper,self=this;
	                        while (i--){
	                            _element = this.elements[i];
	                            _helper = (function(element){
	                                return function(e){
	                                   helper.call(element,e,self);
	                                    if (params && params.stop) {
	                                        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
	                                    }
	                                };
	                            })(_element);
	                            if (!_element.$$plug.listeners[this.unique]) _element.$$plug.listeners[this.unique] = {};
	                            if (!_element.$$plug.listeners[this.unique][eventName]) _element.$$plug.listeners[this.unique][eventName] = new Array;
	                            _element.$$plug.listeners[this.unique][eventName].push([helper,_helper]);
	                            _private.addEvent(_element,eventName,_helper);
	                        }
	                    }
	                }
	
	                , off: function(eventName,helper,params){
	                    var _element
	                    , _elements = (params && params.elements ? params.elements : this.elements)
	                    , i=_elements.length
	                    , ii
	                    , _element_listener
	                    , _index;
	
	                    while (i--){
	                        _element = _elements[i];
	                        _element_listener = _element.$$plug.listeners[this.unique];
	                        if (_element_listener){
	                            if (helper===undefined){
	                                if (eventName!==undefined){
	                                    _element_listener = _element_listener[eventName];
	                                    if (_element_listener){
	                                        ii=_element_listener.length;
	                                        while(ii--)_private.removeEvent(_element,eventName,_element_listener[ii][1]);
	                                        delete _element_listener[eventName];
	                                    }
	                                } else {
	                                    for (var l in _element_listener) {
	                                        ii=_element_listener[l].length;
	                                        while(ii--) _private.removeEvent(_element,l,_element_listener[l][ii][1]);
	                                    }
	                                    delete _element.$$plug.listeners[this.unique];
	                                }
	                            } else {
	                                _element_listener = _element_listener[eventName];
	                                if (_element_listener && _element_listener.length>0){
	                                    _index = _private.getEventIndex(_element_listener,helper);
	                                    if (_index>=0){
	                                        var _helper = _element_listener[_index][1];
	                                        _private.removeEvent(_element,eventName,_helper);
	                                        _element_listener.splice(_index,1);
	                                    }
	                                }
	                            }
	                        }
	                    }
	                    _element = _elements = i = ii = _element_listener = _index = null;
	                }
	
	                , trigger: function(eventName,params){
	                    var _elements = (params && params.elements ? params.elements : this.elements)
	                    , _event=_private.setEvent(eventName,params)
	                    , i=_elements.length;
	                    while (i--)_private.triggerEvent(_elements[i],eventName,_event);
	                    _elements = _event = i = null;
	                }

	                , html: function(value,params){
	                    var _elements = (params && params.elements ? params.elements : this.elements)
	                    	, i=_elements.length
	                    ;
	                    if (value!==undefined){
	                        while (i--){
	                            _private.cleanChildNodes(_elements[i],params);
	                            _elements[i].innerHTML = value;
	                        }
	                    }
	                    _elements = i = null;
	                    return this.elements[0].innerHTML;
	                }
	                
	                , val: function(value,params){
	                    var _elements = (params && params.elements ? params.elements : this.elements)
	                    	, i=_elements.length
	                    ;
	                    if (value!==undefined) while (i--) _elements[i].value = value;
	                    _elements = i = null;
	                    return this.elements[0].value;
	                }
	                
	                , append: function(value,params){
	                    var _elements = (params && params.elements ? params.elements : this.elements)
	                    , _new_element
	                    , _new_element_html
	                    , _new_elements=new Array(_elements.length)
	                    , i=_elements.length
	                    ;
	                    if (value!==undefined){
	                        while (i--){
	                            _new_element = document.createElement("div");
	                            _new_element_html = value;
	                            if (_public.getType(_new_element_html)=="function")_new_element_html = _new_element_html.call(_elements[i]);
	                            switch(_public.getType(_new_element_html)){
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
	                    var _elements = (params && params.elements ? params.elements : this.elements)
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
	                            if (_public.getType(_new_element_html)=="function")_new_element_html = _new_element_html.call(_elements[i]);
	                            switch(_public.getType(_new_element_html)){
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
	                            else _parent.insertBefore(_new_element, this.next({element:_elements[i]}));
	                            //_elements[i].appendChild(_new_element);
	                            _new_elements[i] = _new_element;
	                        }
	                    }
	                    _elements = _new_element = _new_element_html = i = null;
	                    return _new_elements;
	                }
	
	                , remove: function(params){
	                    var _elements = (params && params.elements ? params.elements : this.elements)
	                    	, i=_elements.length
	                    	, _element=null;
	                    this.removed=true;
	                    while (i--){
	                        _element = _elements[i];
	                        _private.cleanChildNodes(_element,params);
	                        _private.setNodeCleanUp.call(this,_element);
	                        _element.parentNode.removeChild(_element);
	                        this.elements.splice(_element.$$plug.indexes[this.unique],1);
	                        _element = null;
	                    }
	                    _elements = i = null;
	                }
	
	                , parent: function(params){
	                	var _element = (params && params.element ? params.element : this.elements[0]);
	                    return _element.parentNode;
	                }
	                
	                , children: function(params){
	                	var _element = (params && params.element ? params.element : this.elements[0]);
	                    return this.sibling(_element.firstChild);
	                }
	                
	                , index: function(params){
	                    var _element = (params && params.element ? params.element : this.elements[0])
	                    , _group = (params && params.group ? params.group : undefined)
	                    ;
	                    return _public.getElementIndex(_element,_group);
	                }
	
	                , sibling: function(start,exclude){
	                    var _elements = [];
	                    for ( ; start; start = start.nextSibling ) if ( start.nodeType === 1 && start !== exclude) _elements.push( start );
	                    return _elements;
	                }
	
	                , siblings: function(){
	                    return this.sibling((this.elements[0].parentNode||{}).firstChild,this.elements[0]);
	                }
	                
	                , next: function(params){
	                    var _element = (params && params.element ? params.element : this.elements[0]) 
	                    	, _next = _element
	                	;
	                    while ( (_next = _next.nextSibling) && _next.nodeType !== 1 ) {}
	                    return (_next!=this.elements[0]?_next:null);
	                    
	                }
	                
	                , prev: function(params){
	                    var _element = (params && params.element ? params.element : this.elements[0]) 
	                    	, _prev = _element
	                	;
	                    while ( (_prev = _prev.previousSibling) && _prev.nodeType !== 1 ) {}
	                    return (_prev!=this.elements[0]?_prev:null);
	                }
	                
	                , filter: function(params){
	                    var _elements = (params && params.elements ? params.elements : this.elements.slice(0));
	                    if (params){
	                        if (_public.getType(params)=="function") _elements = _public.filterElements(_elements,params);
	                        else if (params.condition) _elements = _public.filterElements(_elements,params.condition);
	                    }
	                    return _elements;
	                }
	            
	                , each: function(params){
	                    var _elements = (params && params.elements ? params.elements : this.elements)
	                    , i = _elements.length
	                    , _action = (_public.getType(params)=="function" ? params : (params && params.action && _public.getType(params)=="function" ? params.action : undefined))
	                    ;
	                    _public.loopEach(_elements,_action);
	                }
	                
	                , attr: function(attrs,params){
	                    var _elements = (params && params.elements ? params.elements : this.elements)
	                    ,i=_elements.length;
	                    while (i--){
	                        switch(_public.getType(attrs)){
	                            case "object":
	                                _public.setAttributes(_elements[i],attrs);
	                                if (i == 0) return this;
	                                break;
	                            case "array":
	                                return _public.getAttributes(_elements[i],attrs);
	                                break;
	                            case "string":
	                                return _public.getAttributes(_elements[i],attrs)[attrs];
	                                break;
	                        }
	                    }
	                    _elements = i = null;
	                }
	                
	                , css: function(css,params){
	                    var _elements = (params && params.elements ? params.elements : this.elements)
	                    ,i=_elements.length;
	                    while (i--){
	                        
	                        switch(_public.getType(css)){
	                            case "object":
	                                _public.setStyle(_elements[i],css);
	                                if (i==0) return this;
	                                break;
	                            case "array":
	                                return _public.getStyle(_elements[i],css);
	                                break;
	                            case "string":
	                                return _public.getStyle(_elements[i],css)[css];
	                                break;
	                        }
	                    }
	                    _elements = i = null;
	                }
	                
	                , addClass: function(className,params){
	                    var _elements = (params && params.elements ? params.elements : this.elements)
	                    , i=_elements.length
	                    , _classes= (className!==undefined?className.replace(/ +(?= )/g,'').split(" "):[])
	                    , ii = _classes.length
	                    ;
	                    if (ii>0){
	                        while (i--){
	                            while (ii--) _public.addClass(_elements[i],_classes[ii]);
	                            ii = _classes.length;
	                        }
	                    }
	                    _elements = i = _classes = ii = null;
	                    return this;
	                }
	                
	                , removeClass: function(className,params){
	                    var _elements = (params && params.elements ? params.elements : this.elements)
	                    , i=_elements.length
	                    , _classes= (className!==undefined?className.replace(/ +(?= )/g,'').split(" "):[])
	                    , ii = _classes.length
	                    ;
	                    if (ii>0){
	                        while (i--){
	                            while (ii--) _public.removeClass(_elements[i],_classes[ii]);
	                            ii = _classes.length;
	                        }
	                    }
	                    _elements = i = _classes = ii = null;
	                    return this;
	                }
	                
	                , hasClass: function(className,params){
	                	var _elements = (params && params.elements ? params.elements : this.elements)
	                	, i=_elements.length
	                    , _classes= (className!==undefined?className.replace(/ +(?= )/g,'').split(" "):[])
	                    , ii = _classes.length
	                    , _hasClass = true
	                    ;
	                    if (ii>0){
	                    	while (i--){
		                        while (ii--) {
		                        	_hasClass = _public.hasClass(_elements[i],_classes[ii]);
		                        	if (!_hasClass)ii=0;
		                        }
		                        ii = _classes.length;
	                       }
	                    }
	                    _elements = i = _classes = ii = null;
	                    return _hasClass;
	                }

	                , position: function(params){
	                    var _element = (params && params.element ? params.element : this.elements[0]);
	                    return _public.getPosition(_element);
	                }
	                
               };
               return _public.extend(this.prototype,_properties);
	        }
	        
	        , setInstanceElements: function(){
	            var i = this.elements.length;
	            while(i--) {
	                if (!this.elements[i].$$plug) {
	                    this.elements[i].$$plug = {
	                        methods: {}
	                        , objects: new Array
	                        , indexes: {}
	                        , listeners: {}
	                    };
	                }
	                this.elements[i].$$plug.objects.push(this);
	                this.elements[i].$$plug.indexes[this.unique] = i;
	            }
	            i = null;
	            return this.elements;
	        }
	        
			, addEvent: function(element,eventName,helper){
	            if(element.addEventListener){
	                element.addEventListener(eventName,helper,false);
	            }else if(element.attachEvent && _private.htmlEvents['on'+eventName]){// IE < 9
	                element.attachEvent('on'+eventName,helper);
	            }else{
	                element['on'+eventName]=helper;
	            }
	        }
			
	        , removeEvent: function(element,eventName,helper){
	            if(element.removeEventListener){
	                element.removeEventListener(eventName,helper,false);
	            }else if(element.detachEvent && _private.htmlEvents['on'+eventName]){// IE < 9
	                element.detachEvent('on'+eventName,helper);
	            }else{
	                element['on'+eventName]=null;
	            }
	        }
			
	        , setEvent: function(eventName,params){
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
	        }
			
	        , triggerEvent: function(element,eventName,event){
	            if(element.dispatchEvent){
	                element.dispatchEvent(event);
	            }else if(element.fireEvent && _private.htmlEvents['on'+eventName]){// IE < 9
	                element.fireEvent('on'+event.eventType,event);// can trigger only real event (e.g. 'click')
	            }else if(element[eventName]){
	                element[eventName](event);
	            }else if(element['on'+eventName]){
	                element['on'+eventName](event);
	            }
	        }
	
	        , getEventIndex: function(listener,helper){
	            var i=listener.length;
	            while (i--){
	                if (listener[i][0]==helper) break;
	            }
	            return i;
	        }
			
	        , htmlEvents: {
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
	            onmouseup: 1,
	            onresize:1
	        }
	        
	        , setNodeRemoved: function(callback){
	            if(_private.mutational){
	                var i = this.elements.length
	                , _helper = function(e){
	                    if (_private.mutational){
	                        e = e || window.event;
	                        var _target = e.target || e.srcElement;
	                        if (this.elements && (!this.removed)){
	                            _private.setNodeCleanUp.call(this,_target);
	                        }
	                        _private.removeEvent(_target,"DOMNodeRemoved",_helper);
	                        if (callback) callback();
	                        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
	                    }
	                };
	                while(i--) _private.addEvent(this.elements[i],"DOMNodeRemoved",_helper);
	                i = null;
	            }
	        }
			
	        , setNodeCleanUp: function(element){
	            if (_private.allowclean){
	            	if (element){
		                var _$$element = element.$$plug,i,inst;
		                if (_$$element){
		                    i = _$$element.objects.length;
		                    while(i--) {
		                        if (_$$element.objects[i].installations) for (inst in _$$element.objects[i].installations) _$$element.objects[i].uninstall(inst);
		                        _$$element.objects[i].off(undefined,undefined,{elements: [element]});
		                    }
		                    if (this!==undefined) this.elements.splice(_$$element.indexes[this.unique],1);
		                }
		                _$$element = i = inst = null;
	               }
	            }
	        }
			
	        , cleanChildNodes: function(element,params){
	            if((!_private.mutational) && _private.allowclean){
	                var _clean=(params!==undefined && params.clean!==undefined ? params.clean : _private.clean)
	                , _cleandeep=(params!==undefined && params.cleandeep!==undefined ? params.cleandeep : _private.cleandeep)
	                , _cleanremove=(params!==undefined && params.cleanremove!==undefined ? params.cleanremove : _private.cleanremove)
	                , _nodelist = []
	                , i
	                , ii
	                , inst
	                , _$$element
	                ;
	                _clean = _cleandeep ? true : _clean;
	                if (element.hasChildNodes() && _clean){
	                    if (_cleandeep){
	                        _nodelist = _public.getSubNodes(element,true);
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
	                        _nodelist = _public.getSubNodes(element);
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
	        }
	        
	        , setObjectPlugins: function(params){
	            if (params!==undefined && params.install !==undefined){
	                if (!_public.isArray(params.install)) params.install = [params.install];
	                var i = params.install.length
	                , _type
	                , _name
	                , _params = {}
	                ;
	                while(i--) {
	                    _type = _public.getType(params.install[i]);
	                    if (_type=="string"){
	                        _name = params.install[i];
	                    } else if (_type=="object"){
	                        for (_name in params.install[i]) break;
	                        if (_public.getType(params.install[i][_name])=="object") _params = params.install[i][_name];
	                    }
	                    if (_name!==undefined && _private.plugins[_name]) this.install(_name,_private.plugins[_name].setup,_params);
	                }
	                i = _type = _name = _params = null;
	            }
	        }
	        
    	};

//$$ public members    	
    	var _public = {
    		ready: function(callback){
            	if (document.readyState == "complete")callback(document.readyState);
            	else {
	            	var _eventName = document.addEventListener ? "DOMContentLoaded" : "readystatechange"
		            , _helper = function(){
		            	if (document.readyState == "complete"){
			                _private.removeEvent(document,_eventName,_helper);
							_private.removeEvent(window,"load",_helper);
			                if (callback) callback(document.readyState);
		               }
		            };
		            _private.addEvent(document,_eventName,_helper);
					_private.addEvent(window,"load",_helper);
	            }
	        }
	        
            , addEvent: _private.addEvent
    		
	        , install: function(name,fn,params){
	            if (params && params.destroy) _public.uninstall(name);
	            _private.plugins[name] = {setup:fn,objects:new Array};
	            return _public.extend({},_private.plugins[name]);
	        }
			
	        , uninstall: function(name,params){
	            if (_private.plugins[name]) {
	                if (_private.plugins[name].objects.length>0){
	                    var i=_private.plugins[name].objects.length;
	                    while(i--)_private.plugins[name].objects.uninstall(name,params);
	                }
	                delete _private.plugins[name];
	            }
	        }
	        
	        , getInstallations: function(name){
	        	return _public.extend({},(name ? _private.plugins[name] : _private.plugins));
	        }

	        , setClean: function(params){
	            //cleandeep true overwrite clean
	            _private.cleandeep =  (params!==undefined && params.cleandeep!==undefined ? params.cleandeep : _private.cleandeep);
	            _private.clean = (!_private.cleandeep ? (params!==undefined && params.clean!==undefined ? params.clean : _private.clean) : _private.cleandeep);
	            _private.cleanremove =  (params!==undefined && params.cleanremove!==undefined ? params.cleanremove : _private.cleanremove);
	            _private.allowclean =  (params!==undefined && params.allowclean!==undefined ? params.allowclean : _private.allowclean);
	            return _public.getClean();
	        }
	        
	        , getClean: function(){
	            //cleandeep true overwrite clean
	            var _clean = {
	            	allowclean: _private.allowclean
	            	, clean: _private.clean 
	            	, cleandeep: _private.cleandeep
	            	, cleanremove: _private.cleanremove
	            };
	            return _clean;
	        }
	        
    		, extend: function(base,add,overwrite){
	            var _extend = {},key;
	            for (key in base) _extend[key] = base[key];
	            for (key in add) if (overwrite || !base[key])_extend[key] = add[key];
	            return _extend;
	        }
	        
	        , stringify: function(obj){
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
	        }
	        
	        , getType: function(object){
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
	            stringConstructor = arrayConstructor =  objectConstructor = functionConstructor = null;
	            return _type;
	        }
	        
	        , isArray: function(object){
	            return (typeof object == "object" && object.length!==undefined);
	        }
	        
	        , isInArray: function(object,value){
	        	var _isInArray = false,i;
	        	if (_public.isArray(object)){
	        		i = object.length;
	        		while(i--){
	        			if (object[i]==value){
	        				_isInArray = true;
	        				break;
	        			}
	        		}
	        	}
	            return _isInArray;
	        }
			
	        , toArray: function(nodelist){
	            var _subs=[],l=nodelist.length>>>0;
	            for( ; l--;_subs[l]=nodelist[l]);
	            return _subs;
	        }
	        
	        , getAttributes: function(element,params){
	            var _attributes={},params = (_public.isArray(params) ? params : [params]),i=params.length;
	            while(i--) _attributes[params[i]] = element.getAttribute(params[i]);
	            params = i = null;
	            return _attributes;
	        }
	        
	        , setAttributes: function(element,params){
	            var attr;
	            for (attr in params)element.setAttribute(attr,params[attr]);
	            attr = null;
	        }
	        
	        , getElementIndex: function(element,group){
	            var _group = group || _public.getSubNodes(element.parentNode)
	            , i=_group.length;
	            ;
	            while (i--) if (_group[i]==element) break;
	            _group = null;
	            return i;
	        }
	        
	        , setFunctionFormat: function(string){
	            for(var exp=/-([a-z])/;exp.test(string);string=string.replace(exp,RegExp.$1.toUpperCase()));
	            return string;
	        }
	        
	        , setStyle: function(element,params){
	            var attr,attr_fn;
	            for (attr in params){
	                attr_fn = _public.setFunctionFormat(attr);
	                element.style[attr_fn] = params[attr];
	            }
	            attr = attr_fn = null;
	        }
	        
			, getStyle:  function(element,params){
	            var attr_fn,_style={},params = (_public.isArray(params) ? params : [params]),i=params.length;
	            while(i--){
	                attr_fn = _public.setFunctionFormat(params[i]);
	                _style[params[i]] = element.style[attr_fn];
	            }
	            attr_fn = params = i = null;
	            return _style;
	        }
	        
	        , addClass: function(element,className){
	            _public.removeClass(element,className);
	            element.className = _public.trim((element.className||"")+" "+className).replace(/ +(?= )/g,'');
	        }
	        
	        , removeClass:  function(element,className){
	            element.className = _public.trim((element.className||"").replace( new RegExp('(?:^|\\s)'+ className +'(?!\\S)'),''));
	        }
	        
	        , hasClass: function(element,className){
	            return  RegExp('(?:^|\\s)'+ className +'(?!\\S)').test((element.className||""));
	        }
	        
	        , trim: function(string){
	          return (string || "").replace(/^\s+|\s+$/g, '');
	        }
        	
        	, loopEach: function(elements,action){
	            var _elements = elements, i = _elements.length;
	            while(i--) action.call(_elements[i],i);
	        }
	        
	        , getMonthName: function(index){
	            var _months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
	            return _months[index];
	        }
        	
        	, getMouse: function(e){
	            var  _pos = new Array;
	            if (!_private.isIE) {
	                _pos[0] = e.pageX;
	                _pos[1] = e.pageY;
	            } else {
	                _pos[0] = e.clientX + document.body.scrollLeft;
	                _pos[1] = e.clientY + document.body.scrollTop;
	            }
	            return _pos;
	        }
	        
            , getPageSize: function() {
                var body = document.body,
                    html = document.documentElement,
                    width = Math.max(body.scrollWidth, body.offsetWidth,html.clientWidth, html.scrollWidth, html.offsetWidth),
                    height = Math.max(body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight);
                return [width, height];
            }
            
    		, getPosition: function (object, offset) {
	            var _offset = offset || [0,0],_ret = _offset;
	            if (object) {
	                _offset[0] += object.offsetLeft;
	                _offset[1] += object.offsetTop;
	            }
	            return _ret;
	        }
	        
	        , getOffset: function(object, offset){
	            //var _offset = offset || getScrolled(object),_ret = _offset;
	            var _offset = offset || [0,0],_ret = _offset;
	            if (object) {
	                _offset[0] += object.offsetLeft;
	                _offset[1] += object.offsetTop;
	                _offset = _public.getOffset (object.offsetParent,_offset);
	            }
	            return _ret;
	        }
	        
	        , getCoords: function(element){
	            var _element_offset = _public.getOffset(element),_element_coords=new Array;
	            _element_coords.push(_element_offset);
	            _element_coords.push([(_element_offset[0]+element.clientWidth),_element_offset[1]]);
	            _element_coords.push([(_element_offset[0]+element.clientWidth),(_element_offset[1]+element.clientHeight)]);
	            _element_coords.push([_element_offset[0],(_element_offset[1]+element.clientHeight)]);
	            _element_offset = null;
	            return _element_coords;
	        }
	        
	        , getScrolled: function(object, scrolled) {
	            var _scrolled = scrolled || [0,0],_ret = _scrolled;
	            if (object && object.tagName.toLowerCase () != "body"){
	                _scrolled[0] += object.scrollLeft;
	                _scrolled[1] += object.scrollTop;
					_scrolled = _public.getScrolled(object.parentNode, _scrolled);
	            }
	            return _ret;
	        }
	        
	        , getOverlappedElements: function(coords,elements,params){
	            var intersectors = []
	            , _params = params || "xy"
	            , i = elements.length
	            , _element_coords
	            ;
	            
	            switch(_public.getType(coords)){
	                case "array":
	            
	                    while(i--){
	                        _element_coords = _public.getCoords(elements[i]);
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
	
	                    coords = _public.getCoords(coords);
	                    while(i--){
	                        _element_coords = _public.getCoords(elements[i]);
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
	        }
        
        	, getSubNodes: function(element,deep){
	            var _subs = arguments[2] || [],start;
	            if (element.hasChildNodes()){
	                start = element.firstChild;
	                for ( ; start; start = start.nextSibling ) {
	                    if ( start.nodeType === 1) {
	                        _subs.push( start );
	                        if (deep) _subs = _public.getSubNodes(start,deep,_subs);
	                    }
	                }
	            }
	            return _subs;
	        }
	        
	        , filterElements: function(elements,condition){
	            var _elements = elements, i = _elements.length;
	            while(i--) {
	                if (!condition.call(_elements[i],i))_elements.splice(i,1);
	            }
	            i = null;
	            return _elements;
	        }
        
	        , getElementsByPseudo: function(elms,pseudo){
				var i=elms.lengths;
				if (isNaN(pseudo)){
					switch(pseudo){
						case "first":
							break;
						case "last":
							break;
					}
				}
				return elms;
			}
			
			, getElementsByClassName: function(elms, className){
				var i = elms.length;
				while (i--) if (!_public.hasClass(elms[i],className)) elms.splice(i, 1);
				return elms;
			}
			
			, getElementsByAttributeValue: function(elms, attr,value){
				var i = elms.length;
				while (i--)
				if (_public.getAttributes(elms[i],attr)[attr]!==value) elms.splice(i, 1);
				return elms;
			}
			
	        , selectElements: function(selector,container) {
				if (_public.getType(selector)=="html") return [selector];
				else if(_public.getType(selector)=="array") return selector;
				var 
					_selector_arr = _public.trim(selector).split(" ")
					, _container = container || document
					, i = 0
					, ii
					, l = _selector_arr.length
					, ll
					, _sel
					, _idxs
					, _sep
					, _dom_type
					, _actions
					, _elements = []
					, _separator
				;
				_container = (_public.isArray(_container) ? _container : [_container]);
				for (;i<l;i++){
					if (!_container.length) break;
					_sel = _selector_arr[i].replace(/ /g,"");
					if (_sel.length>0){
						_idxs = _private.setSelectionIndexes(_sel);
						_elements = [];
						_actions = [];
						_dom_type = "*";
						if (_idxs["separator"]){
							_sep = _idxs["separator"];
							if (_sep["idx"]>0)_dom_type = _sel.substring(0,_sep["idx"]);
							_sel = _sel.substring(_sep["idx"]+_sep["sep"].length);
							_separator = _private.setSeparatorAction(_sel,_sep);
							_sel = _separator["string"];
							_sep = _separator["sep"];
							_actions.push(_separator["action"]);
							while(_sel.length){
								_separator = _private.setSeparatorAction(_sel,_sep);
								if (_sel==_separator["string"])break;
								_sel = _separator["string"];
								_sep = _separator["sep"];
								_actions.push(_separator["action"]);
							}
						} else _dom_type = _sel;
						ii = 0;
						ll = _container.length;
						for (;ii<ll;ii++) {
							_elements = _elements.concat(_public.toArray(_container[ii].getElementsByTagName(_dom_type)));
						}
						ii = 0;
						ll = _actions.length;
						for (;ii<ll;ii++) {
							if (_elements.length) {
								_elements = _actions[ii](_elements);
							}
						}
					}
					_container = _elements;
				}
				return _elements;
			}
			
			, send: function(params,success,error) {
				params["success"] = params["success"] || success;
				params["error"] = params["error"] || error;
				params = $$.extend({
					"method" : "GET"
					, "dataType": "application/x-www-form-urlencoded"
					, "stringify": true
				}, params, true);
				if (params["url"]) {
					var xmlhttp;
					if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
						xmlhttp = new XMLHttpRequest();
					} else {// code for IE6, IE5
						xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
					}
					xmlhttp.onreadystatechange = function() {
						if (xmlhttp.readyState == 4) {
							if (xmlhttp.status == 200){
								if (params["success"]) params["success"](xmlhttp.responseText);
							}
							else {
								if (params["error"]) params["error"](xmlhttp);
							}
						} else if (xmlhttp.readyState == 2 && xmlhttp.status !== 200 && params["error"]) {
							params["error"](xmlhttp);
							params["error"] = null;
						}
					};
					try {
					    xmlhttp.open(params["method"], params["url"], true);
					    xmlhttp.withCredentials = params["withCredentials"] || false;
						if (params["method"].toUpperCase()=="POST" && params["data"]){
							xmlhttp.setRequestHeader("Content-type",params["dataType"]);
							xmlhttp.send(params["stringify"] ? $$.stringify(params["data"]) : params["data"]);
						} else xmlhttp.send();
					} catch(e) {
						if (params["error"]) params["error"](e);
					}
				}
			}
		
			, addJS: function(params,callback) {
				if (params && params["path"]) {
					var _script = document.createElement("SCRIPT"), _cont = params["cont"] || document.getElementsByTagName("HEAD")[0];
					_script.src = params["path"];
					_script.type = "text/javascript";
					if (params["id"])
						_script.id = params["id"];
					params["callback"] = params["callback"] || callback;
					if (params["callback"]) {
						_script.onreadystatechange = function() {
							if (this.readyState == 'complete') params["callback"]();
						};
						_script.onload = params["callback"];
					}
					_cont.appendChild(_script);
				}
			}
		
			, addCSS: function(params,callback) {
				if (params && params["path"]) {
					var _css = document.createElement("LINK"), _cont = params["cont"] || document.getElementsByTagName("HEAD")[0];
					_css.href = params["path"];
					_css.type = "text/css";
					_css.rel = "stylesheet";
					if (params["id"])
						_css.id = params["id"];
					params["callback"] = params["callback"] || callback;
					if (params["callback"]) {
						_css.onreadystatechange = function() {
							if (this.readyState == 'complete') params["callback"]();
						};
						_css.onload = params["callback"];
					}
					_cont.appendChild(_css);
				}
			}
			
			, FS: (function(properties,methods){
				var _FS = {"obj":null,"www":{},"upload":null,"err":function(e) {console.log(e);}}
					, errorHandler = function(e) {
						  var msg = '';
						  switch (e.code) {
						    case FileError.QUOTA_EXCEEDED_ERR:
						      msg = 'QUOTA_EXCEEDED_ERR';
						      break;
						    case FileError.NOT_FOUND_ERR:
						      msg = 'NOT_FOUND_ERR';
						      break;
						    case FileError.SECURITY_ERR:
						      msg = 'SECURITY_ERR';
						      break;
						    case FileError.INVALID_MODIFICATION_ERR:
						      msg = 'INVALID_MODIFICATION_ERR';
						      break;
						    case FileError.INVALID_STATE_ERR:
						      msg = 'INVALID_STATE_ERR';
						      break;
						    default:
						      msg = 'Unknown Error';
						      break;
						  };
						  console.log('Error: ' + msg);
						};
				;

				_FS.www.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
		    	_FS.www.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
				_FS.www.URL = window.URL || window.webkitURL;
		
				if (_FS.www.requestFileSystem) {
					_FS.www.requestFileSystem.call(window,window.TEMPORARY, 1024*1024, function(fs) {
						
						_FS.upload = function(params,success,error){
							params = {
								"url": params["url"]
								, "file": params["file"]
								, "name": params["name"] || "fileName"
								, "method": params["method"] || "POST"
								, "folder": (params["folder"] ? params["folder"]+"/" : "")
								, "success": params["success"] || success
								, "error": params["error"] || error
							};
							if (params && params["url"] && params["file"]){
								fs.root.getFile(
									params["file"].name
									, { create: true }
									, function(fileEntry) {
										fileEntry.createWriter(function(writer) {
											writer.onerror = _FS.err;
											var fr = new FileReader;
											fr.onloadend = function(a) {
												var boundary=Math.random().toString().substr(2);
												var body = "";
											 	body += "--" + boundary
													+ "\r\nContent-Disposition: form-data; name="+ params["name"] +"; filename="+ params["folder"] + params["file"].name
										           	+ "\r\nContent-type: application/octet-stream"
										           	+ "\r\n\r\n" + this.result + "\r\n"
										           	+ "\r\n\r\n--" + boundary + "--\r\n";
												_dataType = "multipart/form-data; boundary="+boundary;
												_public.send({
													"method" : params["method"],
													"url" : params["url"],
													"data": body,
													"dataType": _dataType,
													"error" : function(data) {
														if (params["error"]) {
															data = eval('(' + data + ')');
															params["error"](data);
														}
													},
													"success": function(data){
														if (params["success"]) {
															data = eval('(' + data + ')');
															params["success"](data);
														}
													}
												});
											};
											fr.onerror = _FS.err;
						                    fr.readAsBinaryString(params["file"]);
										},_FS.err);
									},_FS.err
								);
							} else return;
						};
						_FS.obj = fs;
					},errorHandler);
				}
				
				return _FS;
		
			})()
			
			, hasFeature: function (featurename) {
				if (_private["features"].hasOwnProperty(featurename)) return _private["features"][featurename];
				else{
				
					var feature = false,
					domPrefixes = 'Webkit Moz ms O'.split(' '),
					elm = document.createElement('div'),
					featurenameCapital = null;
					featurename = featurename.toLowerCase();
					if (elm.style[featurename]) { feature = true; }
					if (feature === false) {
						featurenameCapital = featurename.charAt(0).toUpperCase() + featurename.substr(1);
						for (var i = 0; i < domPrefixes.length; i++) {
							if (elm.style[domPrefixes[i] + featurenameCapital] !== undefined) {
								feature = true;
								break;
							}
						}
					}
					
					_private["features"][featurename] = feature;
				}
				return _private["features"][featurename];
			}
    	};
    	
    	var Instance = (function(){
			var Instance = function(selector,params){
	            this.unique = _private.unique;
	            this.elements = _public.selectElements(selector);
				this.elements = _private.setInstanceElements.call(this);
				_private.setObjectPlugins.call(this,params);
				_private.setNodeRemoved.call(this);
				this["$$"] = "true";
				_private.unique++;
	            return this;
	        };
	        Instance.prototype = _private.setInstanceProperties.call(Instance);
		
	        return Instance;
	     })();
		     
    	for (var key in _public) _self[key] = _public[key];
    	
    	return _self;

    }
)();