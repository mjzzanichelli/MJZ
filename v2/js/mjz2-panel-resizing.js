var $$panelResizable = function(){
    var _self
    , _name
    , _params = {
        "classResize": "mjz-resizable"
    }
    , _handler = null
    , _resizer = null
    
    , _setResizable = function(){
        var _width
        , _height
        , _left
        , _top
        ;
        _handler = _self.append('<div class="mjz-handler resizable-se"/>');
        _self.install(_name+"dragsoutheast",$$draggable,{"handler":function(){
                var _subs = $$.getSubNodes(this)
                , i = _subs.length
                ;
                while(i--) if ($$.hasClass(_subs[i],"mjz-handler") && $$.hasClass(_subs[i],"resizable-se")) break;
                return _subs[i];
            }
        });
        
        _self.on(_name+"dragsoutheaststart",function(e,obj){
            _resizer = {"start_size":[this.clientWidth,this.clientHeight],"start_offset":$$.getOffset(this)};
            if (_params && _params!==undefined && _params.container !== undefined) _resizer["container"] = {element:_params.container,offset:$$.getOffset(_params.container),size:[_params.container.clientWidth,_params.container.clientHeight]};
            _self.trigger(_name+"start",{elements:[this],start:_resizer});
        });
        
        _self.on(_name+"dragsoutheastmove",function(e,obj){
            $$.setStyle(this,{
                "position": "relative"
                , "margin-top": "5px"
                , "margin-right": "5px"
                , "margin-bottom": "5px"
                , "margin-left": "5px"
                , "left": "0"
                , "width": _width ? _width.toString()+"px" : undefined
                , "top": "0"
                , "height": _height ? _height.toString()+"px" : undefined
            });
            _width = _resizer["start_size"][0]+(e.$$plug["params"]["move"]["current_position"]["mouse"][0]-e.$$plug["params"]["move"]["start_position"]["mouse"][0]);
            if (_width<0)_width=0;
            _left = e.$$plug["params"]["move"]["start_position"]["element"][0];
            _height = _resizer["start_size"][1]+(e.$$plug["params"]["move"]["current_position"]["mouse"][1]-e.$$plug["params"]["move"]["start_position"]["mouse"][1]);
            if (_height<0)_height=0;
            _top = e.$$plug["params"]["move"]["start_position"]["element"][1];
            
            if (_resizer["container"]){
                _resizer["dragger"]={
                    "element": this
                    , "style": $$.getStyle(this,["height","width"])
                };
            }
            
            $$.setStyle(this,{
                /*"left": _left.toString()+"px"
                , */"width": _width.toString()+"px"
                //, "top": _top.toString()+"px"
                , "height": _height.toString()+"px"
            });
            
            if (_resizer["dragger"]){
                //Limiting SOUTH to container
                if ((_resizer["start_offset"][1]+_height)>=(_resizer["container"]["offset"][1]+_resizer["container"]["size"][1])){
                    _resizer["dragger"]["style"] = {
                        "height": ((_resizer["container"]["offset"][1]+_resizer["container"]["size"][1])-_resizer["start_offset"][1]).toString()+"px"
                    };
                    $$.setStyle(_resizer["dragger"]["element"],_resizer["dragger"]["style"]);
                }
                //Limiting EAST to container
                if ((_resizer["start_offset"][0]+_width)>=(_resizer["container"]["offset"][0]+_resizer["container"]["size"][0])){
                    _resizer["dragger"]["style"] = {
                        "width": ((_resizer["container"]["offset"][0]+_resizer["container"]["size"][0])-_resizer["start_offset"][0]).toString()+"px"
                    };
                    $$.setStyle(_resizer["dragger"]["element"],_resizer["dragger"]["style"]);
                }
            }
        });
        
        _width = _height = _left = _top = null;
    }
    
    , _removeResizable = function(){
        var i = _handler.length;
        while(i--)_handler[i].parentNode.removeChild(_handler[i]);
        _self.uninstall(_name+"dragsoutheast");
        i = null;
    }
    , _method = {
        init: function(params,name){
            _self = this;
            _name = name;
            _params = $$.extend(_params,params,true);
            //console.log("resizable created on ", _self)
            _setResizable();
        }
        , destroy: function(params){
            _self = this;
            _removeResizable();
            //console.log("resizable destroyed on ", _self)
            _name = _params = _handler = _resizer = _setResizable = _method = null;
        }
    };
    return _method;
};