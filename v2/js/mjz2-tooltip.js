var $$tooltip = function(){
    var _self
    , _name
    , _params = {
        "container": $$(document.body)
        , "body": "<span>tooltip</span>"
        , "open": "mouseover"
        , "close": "mouseout"
        , "effect": "show"
        , "toggle": true
        , "delay": null
        , "wait": null
        , "activate": function(){return true;}
    }
    
    , _private = {
        "element": null
        , "tooltip_contaner": null
        , "body_container": null
        , "fading": null
        , "sliding": null
        , "opening": null
        , "closing": null
    }
    
    , _removeClosing = function(){
    	if (_private["closing"]){
			clearTimeout(_private["closing"]);
			_private["closing"] = null;
		};
    }
    
    , _removeOpening = function(){
    	if (_private["openig"]){
			clearTimeout(_private["openig"]);
			_private["openig"] = null;
		};
    }
    
    , _removeSliding = function(){
    	if (_private["sliding"]){
			clearInterval(_private["sliding"]);
			_private["sliding"] = null;
			_method.container.css({"height":null});
		};
    }
    
    , _removeFading = function(){
    	if (_private["fading"]){
			clearInterval(_private["fading"]);
			_private["fading"] = null;
			_method.container.css({
	    			"opacity":null
	    			, "filter": null
	    		});
		};
    }
    
    , _removeEffect = function(){
    	switch (_params["effect"]){
	    	case "fade":
	    			_removeFading();
	    		break;
	    	case "slide":
	    			_removeSliding();
	    		break;
	    	default:

	    		break;
	    }
    }
    
    , _setTooltipOpenSliding = function(){
    	var _increase = 5
    		, _tootip_height = _method.container.elements[0].offsetHeight
    		, _current_height = function(){
				var _height = parseFloat(_method.container.css("height"),10);
				return isNaN(_height) ? _increase*-1 : _height;
			}
			, _increaseHeight = function(){
	    		var _height = _current_height()+_increase;
	    		if (_height<=0)_method.container.css({"visibility":"visible"});
	    		_method.container.css({"height":(_height).toString()+"px"});
	    		if (_height>=_tootip_height) _removeSliding();
	    	}
	    ;
    	_private["sliding"] = setInterval(_increaseHeight,10);
    }
    
    , _setTooltipOpenFading = function(){
    	var _increase = 0.1
    		, _current_fade = function(){
				var _fade = parseFloat(_method.container.css("opacity"),10);
				return isNaN(_fade) ? _increase*-1 : _fade;
			}
			, _increaseOpacity = function(){
	    		var _fade = _current_fade()+_increase;
	    		if (_fade<=0)_method.container.css({"visibility":"visible"});
	    		_method.container.css({
	    			"opacity":(_fade).toString()
	    			, "filter": "Alpha(opacity="+ (_fade*100).toString() +")"
	    		});
	    		if (_fade>=1) _removeFading();
	    	}
	    ;
    	_private["fading"] = setInterval(_increaseOpacity,50);
    }
    
    , _setTooltipCloseEffect = function(){}
    
    , _setTooltipOpenEffect = function(){
    	var _openTooltip = function(){};
    	switch (_params["effect"]){
	    	case "fade":
	    			_openTooltip  = function(){
	    				_setTooltipOpenFading();
	    				_self.trigger(_name+"open",{elements:[_private["element"]]});
	    			};
	    		break;
	    	case "slide":
	    			_openTooltip  = function(){
	    				_setTooltipOpenSliding();
	    				_self.trigger(_name+"open",{elements:[_private["element"]]});
	    			};
	    		break;
	    	default:
	    			_openTooltip  = function(){
	    				_method.container.css({"visibility":"visible"});
	    				_self.trigger(_name+"open",{elements:[_private["element"]]});
	    			};
	    		break;
	    }
	    if (_params["delay"] && (!isNaN(_params["delay"])) && _params["delay"]>0) _private["opening"] = setTimeout(_openTooltip,_params["delay"]);
	    else _openTooltip();
    }
    
    
    
    , _createTooltipBody = function(body_container){
    	var _body_html = _params["body"];
    	if ($$.getType(_body_html)=="function")_body_html = _body_html.call(_self,_private["element"]);
    	body_container.html(_body_html);
    }

    , _createTooltip = function(){
        _removeEffect();
        /*_removeOpening();
        _removeClosing();*/
        
        var _element_offset = $$.getOffset(_private["element"])
	        , _element_size = [_private["element"].offsetWidth,_private["element"].offsetHeight]
	        , _tooltip_container = $$(_params["container"].append('<div class="mjz-tooltip"/>'))
        ;
        _private["body_container"] = $$(_tooltip_container.append('<div class="body-container"/>'));
        _createTooltipBody(_private["body_container"]);
        _tooltip_container.css({
            "left": (_element_offset[0]+(_element_size[0]/2)-(parseInt(_params["width"],10)/2)).toString()+"px"
            , "top": (_element_offset[1]+_element_size[1]).toString()+"px"
            , "width": _params["width"].toString().replace("px","")+"px"
            , "display": "block"
            , "visibility": "hidden"
        });
        _method.active = true;
        _method.container = _tooltip_container;
        _self.trigger(_name+"active",{elements:[_private["element"]]});
        _setTooltipOpenEffect();
        _element_offset = _element_size = _tooltip_container = null;
    }
	
	, _removeTooltip = function(e,o){
		//console.log(e,this)
        var _element = $$.getType(this.element)=="html" ? this.element : _private["element"];
        var _remove = function(){
	        _removeEffect();
	        _removeClosing();
	        //console.log(_element,_private["element"])
	        //_private["element"] = null;
	        if (_method.container){
	            _method.container.remove({cleandeep:true});
	            _method.container = null;
	        }
	        _method.active = false;
	        if ($$.getType(_element)=="html" && $$.getType(_private["element"])=="html" && _private["element"] !=_element) {
	            _private["element"] = null;
	            _checkTooltipStatus.call(_element,e,o);
	        } else _private["element"] = null;
	        if (_element) _self.trigger(_name+"close",{elements:[_element]});
        };
        if (!this.skip && _params["wait"] && (!isNaN(_params["wait"])) && _params["wait"]>0) _private["closing"] = setTimeout(_remove,_params["wait"]);
	    else _remove();
    }
    
    , _checkTooltipStatus = function(e,o){
        //console.log(_private["element"],this)
        if (!_method.disabled){
			var _activate = _params["activate"](e,_self);
			if (!_method.active){
				if (_activate){
	           		_private["element"] = this;
	                _createTooltip();
               }
			} else if (_params["toggle"] || !_activate)_removeTooltip.call({element:this,skip:true});
			else if(_method.active)_self.trigger(_name+"active",{elements:[this]});
            
        }
    }
	, _setTooltipActions = function(){
        var _open = $$.isArray(_params["open"]) ? _params["open"] : [_params["open"]]
        	, _close = $$.isArray(_params["close"]) ? _params["close"] : [_params["close"]]
        	, i = _open.length
        	, ii = _close.length 
        ;
        while(i--) if (_open[i]) _self.on(_open[i],_checkTooltipStatus);
        while(ii--) if (_close[ii]) _self.on(_close[ii],_removeTooltip);
        
        _open = _close = i = ii = null;
    }
    , _removeTooltipActions = function(){
        var _open = $$.isArray(_params["open"]) ? _params["open"] : [_params["open"]]
        	, _close = $$.isArray(_params["close"]) ? _params["close"] : [_params["close"]]
        	, i = _open.length
        	, ii = _close.length 
        ;
        while(i--) if (_open[i]) _self.off(_open[i],_checkTooltipStatus);
        while(ii--) if (_close[ii]) _self.off(_close[ii],_removeTooltip);
        
        _open = _close = i = ii = null;
    }
    , _method = {
        init: function(params,name){
            _self = this;
            _name = name;
            _params = $$.extend(_params,params,true);
            _setTooltipActions();
            //console.log("tooltip created on ", _self)
        }
        , active: false
        , container: null
        , disabled: false
        , remove: _removeTooltip
        , display: function(element){
        	_checkTooltipStatus.call(element);
        }
        , disable: function(){
            _removeTooltip();
            _method.disabled = true;
        }
        , enable: function(){
            _method.disabled = false;
        }
        , stopOpening : _removeOpening
        , stopClosing : _removeClosing
        , destroy: function(params){
            _self = this;
            _removeTooltipActions();
            _removeTooltip();
            //console.log("tooltip destroyed on ", _self)
            _name = _params = _private = _removeEffect = _removeSliding = _removeFading = _setTooltipOpenSliding = _setTooltipOpenFading = _setTooltipOpenEffect =  _setTooltipCloseEffect = _createTooltipBody = _createTooltip = _removeTooltip = _checkTooltipStatus =_setTooltipActions = _removeTooltipActions = _method = null;
        }
    };
    return _method;
};