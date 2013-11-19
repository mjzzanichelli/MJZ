var $$resizable = function(){
    var _self
    , _name
    , _params = {
        "classResize": "mjz-resizable"
        , "points": ["n","s"]
    }
    , _handlers = {}
    , _resizer = null
    , _setResizableNorth = function(){
        var _height
        , _top
        ;
        
        _handlers["n"] = _self.append(function(){return '<div class="mjz-handler resizable-n" style="width:'+ (this.clientWidth-4).toString() +'px"/>';});
        
        _self.install(_name+"dragnorth",$$draggable,{"block-x":true,"handler":function(){
                var _subs = $$.core.getSubNodes(this)
                , i = _subs.length
                ;
                while(i--) if ($$.core.hasClass(_subs[i],"mjz-handler") && $$.core.hasClass(_subs[i],"resizable-n")) break;
                return _subs[i];
            }
        });
        
        _self.on(_name+"dragnorthstart",function(e,obj){
            _resizer = {"start_size":[this.clientWidth,this.clientHeight],"start_offset":$$.core.getOffset(this)};
            if (_params!==undefined && _params.container !== undefined) _resizer["container"] = {element:_params.container,offset:$$.core.getOffset(_params.container),size:[_params.container.clientWidth,_params.container.clientHeight]};
            _self.trigger(_name+"start",{elements:[this],point:"n",start:_resizer});
        });
        
        _self.on(_name+"dragnorthmove",function(e,obj){
            _height = _resizer["start_size"][1]+(e.$$plug["params"]["move"]["start_position"]["mouse"][1]-e.$$plug["params"]["move"]["current_position"]["mouse"][1]);
            if (_height<0)_height=0;
            _top = _height==0 ? e.$$plug["params"]["move"]["start_position"]["element"][1]+_resizer["start_size"][1] : e.$$plug["params"]["move"]["current_position"]["element"][1]
            
            if (_resizer["container"]){
                _resizer["dragger"]={
                    "element": this
                    , "style": $$.core.getStyle(this,"top")
                }
            }
            
            $$.core.setStyle(this,{
                "top": _top.toString()+"px"
            });
            
            if (_resizer["dragger"]){
                //Limiting NORTH to container
                _resizer["dragger"]["offset"] = $$.core.getOffset(_resizer["dragger"]["element"])
                if (_resizer["dragger"]["offset"][1]<=_resizer["container"]["offset"][1]){
                    _resizer["dragger"]["style"] = {
                        "top": (parseInt(_resizer["dragger"]["style"]["top"],10)+(_resizer["container"]["offset"][1]-_resizer["dragger"]["offset"][1])).toString()+"px"
                        , "height": (_resizer["start_size"][1]+(_resizer["start_offset"][1]-_resizer["container"]["offset"][1])).toString()+"px"
                    }
                    $$.core.setStyle(_resizer["dragger"]["element"],_resizer["dragger"]["style"]);
                } else $$.core.setStyle(_resizer["dragger"]["element"],{"height":_height.toString()+"px"});
            } else $$.core.setStyle(this,{"height":_height.toString()+"px"});
        });
        
        _height = _top = null;
    }
    , _setResizableSouth = function(){
        var _height
        , _top
        ;
        
        _handlers["s"] = _self.append(function(){return '<div class="mjz-handler resizable-s" style="width:'+ (this.clientWidth-4).toString() +'px"/>';});
        _self.install(_name+"dragsouth",$$draggable,{"block-x":true,"handler":function(){
                var _subs = $$.core.getSubNodes(this)
                , i = _subs.length
                ;
                while(i--) if ($$.core.hasClass(_subs[i],"mjz-handler") && $$.core.hasClass(_subs[i],"resizable-s")) break;
                return _subs[i];
            }
        });
        
        _self.on(_name+"dragsouthstart",function(e,obj){
            _resizer = {"start_size":[this.clientWidth,this.clientHeight],"start_offset":$$.core.getOffset(this)};
            if (_params!==undefined && _params.container !== undefined) _resizer["container"] = {element:_params.container,offset:$$.core.getOffset(_params.container),size:[_params.container.clientWidth,_params.container.clientHeight]};
            _self.trigger(_name+"start",{elements:[this],point:"s",start:_resizer});
        });
        
        _self.on(_name+"dragsouthmove",function(e,obj){
            _height = _resizer["start_size"][1]+(e.$$plug["params"]["move"]["current_position"]["mouse"][1]-e.$$plug["params"]["move"]["start_position"]["mouse"][1]);
            if (_height<0)_height=0;
            _top = e.$$plug["params"]["move"]["start_position"]["element"][1];
            
            if (_resizer["container"]){
                _resizer["dragger"]={
                    "element": this
                    , "style": $$.core.getStyle(this,"height")
                }
            }
            
            $$.core.setStyle(this,{
                "top": _top
                , "height": _height.toString()+"px"
            });
            
            if (_resizer["dragger"]){
                //Limiting SOUTH to container
                if ((_resizer["start_offset"][1]+_height)>=(_resizer["container"]["offset"][1]+_resizer["container"]["size"][1])){
                    _resizer["dragger"]["style"] = {
                        "height": ((_resizer["container"]["offset"][1]+_resizer["container"]["size"][1])-_resizer["start_offset"][1]).toString()+"px"
                    }
                    $$.core.setStyle(_resizer["dragger"]["element"],_resizer["dragger"]["style"]);
                }
            }
        });
        
        _height = _top = null;
    }
    , _setResizableEast = function(){
        var _width
        , _left
        ;
        
        _handlers["e"] = _self.append(function(){return '<div class="mjz-handler resizable-e" style="height:'+ (this.clientHeight-4).toString() +'px"/>';});
        _self.install(_name+"drageast",$$draggable,{"block-y":true,"handler":function(){
                var _subs = $$.core.getSubNodes(this)
                , i = _subs.length
                ;
                while(i--) if ($$.core.hasClass(_subs[i],"mjz-handler") && $$.core.hasClass(_subs[i],"resizable-e")) break;
                return _subs[i];
            }
        });
        
        _self.on(_name+"drageaststart",function(e,obj){
            _resizer = {"start_size":[this.clientWidth,this.clientHeight],"start_offset":$$.core.getOffset(this)};
            if (_params!==undefined && _params.container !== undefined) _resizer["container"] = {element:_params.container,offset:$$.core.getOffset(_params.container),size:[_params.container.clientWidth,_params.container.clientHeight]};
            _self.trigger(_name+"start",{elements:[this],point:"e",start:_resizer});
        });
        
        _self.on(_name+"drageastmove",function(e,obj){
            _width = _resizer["start_size"][0]+(e.$$plug["params"]["move"]["current_position"]["mouse"][0]-e.$$plug["params"]["move"]["start_position"]["mouse"][0]);
            if (_width<0)_width=0;
            _left = e.$$plug["params"]["move"]["start_position"]["element"][0];
            
            if (_resizer["container"]){
                _resizer["dragger"]={
                    "element": this
                    , "style": $$.core.getStyle(this,"width")
                }
            }
            
            $$.core.setStyle(this,{
                "left": _left.toString()+"px"
                , "width": _width.toString()+"px"
            });
            
            if (_resizer["dragger"]){
                //Limiting EAST to container
                if ((_resizer["start_offset"][0]+_width)>=(_resizer["container"]["offset"][0]+_resizer["container"]["size"][0])){
                    _resizer["dragger"]["style"] = {
                        "width": ((_resizer["container"]["offset"][0]+_resizer["container"]["size"][0])-_resizer["start_offset"][0]).toString()+"px"
                    }
                    $$.core.setStyle(_resizer["dragger"]["element"],_resizer["dragger"]["style"]);
                }
            }
        });
        
        _width = _left = null;
    }
    , _setResizableWest = function(){
        var _width
        , _left
        ;
        
        _handlers["w"] = _self.append(function(){return '<div class="mjz-handler resizable-w" style="height:'+ (this.clientHeight-4).toString() +'px"/>';});
        _self.install(_name+"dragwest",$$draggable,{"block-y":true,"handler":function(){
                var _subs = $$.core.getSubNodes(this)
                , i = _subs.length
                ;
                while(i--) if ($$.core.hasClass(_subs[i],"mjz-handler") && $$.core.hasClass(_subs[i],"resizable-w")) break;
                return _subs[i];
            }
        });
        
        _self.on(_name+"dragweststart",function(e,obj){
            _resizer = {"start_size":[this.clientWidth,this.clientHeight],"start_offset":$$.core.getOffset(this)};
            if (_params!==undefined && _params.container !== undefined) _resizer["container"] = {element:_params.container,offset:$$.core.getOffset(_params.container),size:[_params.container.clientWidth,_params.container.clientHeight]};
            _self.trigger(_name+"start",{elements:[this],point:"w",start:_resizer});
        });
        
        _self.on(_name+"dragwestmove",function(e,obj){
            _width = _resizer["start_size"][0]+(e.$$plug["params"]["move"]["start_position"]["mouse"][0]-e.$$plug["params"]["move"]["current_position"]["mouse"][0]);
            if (_width<0)_width=0;
            _left = _width==0 ? e.$$plug["params"]["move"]["start_position"]["element"][0]+_resizer["start_size"][0] : e.$$plug["params"]["move"]["current_position"]["element"][0]
            if (_resizer["container"]){
                _resizer["dragger"]={
                    "element": this
                    , "style": $$.core.getStyle(this,"left")
                }
            }
            $$.core.setStyle(this,{
                "left": _left.toString()+"px"
            });
            if (_resizer["dragger"]){
                //Limiting WEST to container
                _resizer["dragger"]["offset"] = $$.core.getOffset(_resizer["dragger"]["element"])
                if (_resizer["dragger"]["offset"][0]<=_resizer["container"]["offset"][0]){
                    _resizer["dragger"]["style"] = {
                        "left": (parseInt(_resizer["dragger"]["style"]["left"],10)+(_resizer["container"]["offset"][0]-_resizer["dragger"]["offset"][0])).toString()+"px"
                        , "width": (_resizer["start_size"][0]+(_resizer["start_offset"][0]-_resizer["container"]["offset"][0])).toString()+"px"
                    }
                    $$.core.setStyle(_resizer["dragger"]["element"],_resizer["dragger"]["style"]);
                } else $$.core.setStyle(_resizer["dragger"]["element"],{"width":_width.toString()+"px"});
            } else $$.core.setStyle(this,{"width":_width.toString()+"px"});
        });
        
        _width = _left = null;
    }
    , _setResizableNorthEast = function(){
        var _width
        , _height
        , _left
        , _top
        ;
        
        _handlers["ne"] = _self.append('<div class="mjz-handler resizable-ne"/>');
        _self.install(_name+"dragnortheast",$$draggable,{"handler":function(){
                var _subs = $$.core.getSubNodes(this)
                , i = _subs.length
                ;
                while(i--) if ($$.core.hasClass(_subs[i],"mjz-handler") && $$.core.hasClass(_subs[i],"resizable-ne")) break;
                return _subs[i];
            }
        });
        
        _self.on(_name+"dragnortheaststart",function(e,obj){
            _resizer = {"start_size":[this.clientWidth,this.clientHeight],"start_offset":$$.core.getOffset(this)};
            if (_params!==undefined && _params.container !== undefined) _resizer["container"] = {element:_params.container,offset:$$.core.getOffset(_params.container),size:[_params.container.clientWidth,_params.container.clientHeight]};
            _self.trigger(_name+"start",{elements:[this],point:"ne",start:_resizer});
        });
        
        _self.on(_name+"dragnortheastmove",function(e,obj){
            _width = _resizer["start_size"][0]+(e.$$plug["params"]["move"]["current_position"]["mouse"][0]-e.$$plug["params"]["move"]["start_position"]["mouse"][0]);
            if (_width<0)_width=0;
            _left = e.$$plug["params"]["move"]["start_position"]["element"][0];
            _height = _resizer["start_size"][1]+(e.$$plug["params"]["move"]["start_position"]["mouse"][1]-e.$$plug["params"]["move"]["current_position"]["mouse"][1]);
            if (_height<0)_height=0;
            _top = _height==0 ? e.$$plug["params"]["move"]["start_position"]["element"][1]+_resizer["start_size"][1] : e.$$plug["params"]["move"]["current_position"]["element"][1];
            
            if (_resizer["container"]){
                _resizer["dragger"]={
                    "element": this
                    , "style": $$.core.getStyle(this,["top","width"])
                }
            }
            
            $$.core.setStyle(this,{
                "left": _left.toString()+"px"
                , "width": _width.toString()+"px"
                , "top": _top.toString()+"px"
            });
            
            if (_resizer["dragger"]){
                //Limiting NORTH to container
                _resizer["dragger"]["offset"] = $$.core.getOffset(_resizer["dragger"]["element"])
                if (_resizer["dragger"]["offset"][1]<=_resizer["container"]["offset"][1]){
                    _resizer["dragger"]["style"] = {
                        "top": (parseInt(_resizer["dragger"]["style"]["top"],10)+(_resizer["container"]["offset"][1]-_resizer["dragger"]["offset"][1])).toString()+"px"
                        , "height": (_resizer["start_size"][1]+(_resizer["start_offset"][1]-_resizer["container"]["offset"][1])).toString()+"px"
                    }
                    $$.core.setStyle(_resizer["dragger"]["element"],_resizer["dragger"]["style"]);
                } else $$.core.setStyle(_resizer["dragger"]["element"],{"height":_height.toString()+"px"});
                //Limiting EAST to container
                if ((_resizer["start_offset"][0]+_width)>=(_resizer["container"]["offset"][0]+_resizer["container"]["size"][0])){
                    _resizer["dragger"]["style"] = {
                        "width": ((_resizer["container"]["offset"][0]+_resizer["container"]["size"][0])-_resizer["start_offset"][0]).toString()+"px"
                    }
                    $$.core.setStyle(_resizer["dragger"]["element"],_resizer["dragger"]["style"]);
                }
            } else $$.core.setStyle(this,{"height":_height.toString()+"px"});
        });
        
        _width = _height = _left = _top = null;
    }
    , _setResizableNorthWest = function(){
        var _width
        , _height
        , _left
        , _top
        ;
        
        _handlers["nw"] = _self.append('<div class="mjz-handler resizable-nw"/>');
        _self.install(_name+"dragnorthwest",$$draggable,{"handler":function(){
                var _subs = $$.core.getSubNodes(this)
                , i = _subs.length
                ;
                while(i--) if ($$.core.hasClass(_subs[i],"mjz-handler") && $$.core.hasClass(_subs[i],"resizable-nw")) break;
                return _subs[i];
            }
        });
        
        _self.on(_name+"dragnorthweststart",function(e,obj){
            _resizer = {"start_size":[this.clientWidth,this.clientHeight],"start_offset":$$.core.getOffset(this)};
            if (_params!==undefined && _params.container !== undefined) _resizer["container"] = {element:_params.container,offset:$$.core.getOffset(_params.container),size:[_params.container.clientWidth,_params.container.clientHeight]};
            _self.trigger(_name+"start",{elements:[this],point:"nw",start:_resizer});
        });
        
        _self.on(_name+"dragnorthwestmove",function(e,obj){
            _width = _resizer["start_size"][0]+(e.$$plug["params"]["move"]["start_position"]["mouse"][0]-e.$$plug["params"]["move"]["current_position"]["mouse"][0]);
            if (_width<0)_width=0;
            _left = _width==0 ? e.$$plug["params"]["move"]["start_position"]["element"][0]+_resizer["start_size"][0] : e.$$plug["params"]["move"]["current_position"]["element"][0];
            _height = _resizer["start_size"][1]+(e.$$plug["params"]["move"]["start_position"]["mouse"][1]-e.$$plug["params"]["move"]["current_position"]["mouse"][1]);
            if (_height<0)_height=0;
            _top = _height==0 ? e.$$plug["params"]["move"]["start_position"]["element"][1]+_resizer["start_size"][1] : e.$$plug["params"]["move"]["current_position"]["element"][1];
            
            if (_resizer["container"]){
                _resizer["dragger"]={
                    "element": this
                    , "style": $$.core.getStyle(this,["top","left"])
                }
            }
            
            $$.core.setStyle(this,{
                "left": _left.toString()+"px"
                , "top": _top.toString()+"px"
            });
            
            if (_resizer["dragger"]){
                //Limiting NORTH to container
                _resizer["dragger"]["offset"] = $$.core.getOffset(_resizer["dragger"]["element"])
                if (_resizer["dragger"]["offset"][1]<=_resizer["container"]["offset"][1]){
                    _resizer["dragger"]["style"]["top"] = (parseInt(_resizer["dragger"]["style"]["top"],10)+(_resizer["container"]["offset"][1]-_resizer["dragger"]["offset"][1])).toString()+"px";
                    _resizer["dragger"]["style"]["height"] = (_resizer["start_size"][1]+(_resizer["start_offset"][1]-_resizer["container"]["offset"][1])).toString()+"px";
                    $$.core.setStyle(_resizer["dragger"]["element"],{"top":_resizer["dragger"]["style"]["top"],"height":_resizer["dragger"]["style"]["height"]});
                } else $$.core.setStyle(_resizer["dragger"]["element"],{"height":_height.toString()+"px"});
                //Limiting WEST to container
                if (_resizer["dragger"]["offset"][0]<=_resizer["container"]["offset"][0]){
                    _resizer["dragger"]["style"]["left"] = (parseInt(_resizer["dragger"]["style"]["left"],10)+(_resizer["container"]["offset"][0]-_resizer["dragger"]["offset"][0])).toString()+"px";
                    _resizer["dragger"]["style"]["width"] = (_resizer["start_size"][0]+(_resizer["start_offset"][0]-_resizer["container"]["offset"][0])).toString()+"px";
                    $$.core.setStyle(_resizer["dragger"]["element"],{"left":_resizer["dragger"]["style"]["left"],"width":_resizer["dragger"]["style"]["width"]});
                } else $$.core.setStyle(_resizer["dragger"]["element"],{"width":_width.toString()+"px"});
            } else $$.core.setStyle(this,{"height":_height.toString()+"px","width":_width.toString()+"px"});
        });
        
        _width = _height = _left = _top = null;
    }
    , _setResizableSouthEast = function(){
        var _width
        , _height
        , _left
        , _top
        ;
        
        _handlers["se"] = _self.append('<div class="mjz-handler resizable-se"/>');
        _self.install(_name+"dragsoutheast",$$draggable,{"handler":function(){
                var _subs = $$.core.getSubNodes(this)
                , i = _subs.length
                ;
                while(i--) if ($$.core.hasClass(_subs[i],"mjz-handler") && $$.core.hasClass(_subs[i],"resizable-se")) break;
                return _subs[i];
            }
        });
        
        _self.on(_name+"dragsoutheaststart",function(e,obj){
            _resizer = {"start_size":[this.clientWidth,this.clientHeight],"start_offset":$$.core.getOffset(this)};
            if (_params!==undefined && _params.container !== undefined) _resizer["container"] = {element:_params.container,offset:$$.core.getOffset(_params.container),size:[_params.container.clientWidth,_params.container.clientHeight]};
            _self.trigger(_name+"start",{elements:[this],point:"se",start:_resizer});
        });
        
        _self.on(_name+"dragsoutheastmove",function(e,obj){
            _width = _resizer["start_size"][0]+(e.$$plug["params"]["move"]["current_position"]["mouse"][0]-e.$$plug["params"]["move"]["start_position"]["mouse"][0]);
            if (_width<0)_width=0;
            _left = e.$$plug["params"]["move"]["start_position"]["element"][0];
            _height = _resizer["start_size"][1]+(e.$$plug["params"]["move"]["current_position"]["mouse"][1]-e.$$plug["params"]["move"]["start_position"]["mouse"][1]);
            if (_height<0)_height=0;
            _top = e.$$plug["params"]["move"]["start_position"]["element"][1];
            
            if (_resizer["container"]){
                _resizer["dragger"]={
                    "element": this
                    , "style": $$.core.getStyle(this,["height","width"])
                }
            }
            
            $$.core.setStyle(this,{
                "left": _left.toString()+"px"
                , "width": _width.toString()+"px"
                , "top": _top.toString()+"px"
                , "height": _height.toString()+"px"
            });
            
            if (_resizer["dragger"]){
                //Limiting SOUTH to container
                if ((_resizer["start_offset"][1]+_height)>=(_resizer["container"]["offset"][1]+_resizer["container"]["size"][1])){
                    _resizer["dragger"]["style"] = {
                        "height": ((_resizer["container"]["offset"][1]+_resizer["container"]["size"][1])-_resizer["start_offset"][1]).toString()+"px"
                    }
                    $$.core.setStyle(_resizer["dragger"]["element"],_resizer["dragger"]["style"]);
                }
                //Limiting EAST to container
                if ((_resizer["start_offset"][0]+_width)>=(_resizer["container"]["offset"][0]+_resizer["container"]["size"][0])){
                    _resizer["dragger"]["style"] = {
                        "width": ((_resizer["container"]["offset"][0]+_resizer["container"]["size"][0])-_resizer["start_offset"][0]).toString()+"px"
                    }
                    $$.core.setStyle(_resizer["dragger"]["element"],_resizer["dragger"]["style"]);
                }
            }
        });
        
        _width = _height = _left = _top = null;
    }
    , _setResizableSouthWest = function(){
        var _width
        , _height
        , _left
        , _top
        ;
        
        _handlers["sw"] = _self.append('<div class="mjz-handler resizable-sw"/>');
        _self.install(_name+"dragsouthwest",$$draggable,{"handler":function(){
                var _subs = $$.core.getSubNodes(this)
                , i = _subs.length
                ;
                while(i--) if ($$.core.hasClass(_subs[i],"mjz-handler") && $$.core.hasClass(_subs[i],"resizable-sw")) break;
                return _subs[i];
            }
        });
        
        _self.on(_name+"dragsouthweststart",function(e,obj){
            _resizer = {"start_size":[this.clientWidth,this.clientHeight],"start_offset":$$.core.getOffset(this)};
            if (_params!==undefined && _params.container !== undefined) _resizer["container"] = {element:_params.container,offset:$$.core.getOffset(_params.container),size:[_params.container.clientWidth,_params.container.clientHeight]};
            _self.trigger(_name+"start",{elements:[this],point:"sw",start:_resizer});
        });
        
        _self.on(_name+"dragsouthwestmove",function(e,obj){
            _width = _resizer["start_size"][0]+(e.$$plug["params"]["move"]["start_position"]["mouse"][0]-e.$$plug["params"]["move"]["current_position"]["mouse"][0]);
            if (_width<0)_width=0;
            _left = _width==0 ? e.$$plug["params"]["move"]["start_position"]["element"][0]+_resizer["start_size"][0] : e.$$plug["params"]["move"]["current_position"]["element"][0];
            _height = _resizer["start_size"][1]+(e.$$plug["params"]["move"]["current_position"]["mouse"][1]-e.$$plug["params"]["move"]["start_position"]["mouse"][1]);
            if (_height<0)_height=0;
            _top = e.$$plug["params"]["move"]["start_position"]["element"][1];
            
            if (_resizer["container"]){
                _resizer["dragger"]={
                    "element": this
                    , "style": $$.core.getStyle(this,["height","left"])
                }
            }
            
            $$.core.setStyle(this,{
                "left": _left.toString()+"px"
                , "top": _top.toString()+"px"
                , "height": _height.toString()+"px"
            });
            
            if (_resizer["dragger"]){
                //Limiting WEST to container
                _resizer["dragger"]["offset"] = $$.core.getOffset(_resizer["dragger"]["element"])
                if (_resizer["dragger"]["offset"][0]<=_resizer["container"]["offset"][0]){
                    _resizer["dragger"]["style"] = {
                        "left": (parseInt(_resizer["dragger"]["style"]["left"],10)+(_resizer["container"]["offset"][0]-_resizer["dragger"]["offset"][0])).toString()+"px"
                        , "width": (_resizer["start_size"][0]+(_resizer["start_offset"][0]-_resizer["container"]["offset"][0])).toString()+"px"
                    }
                    $$.core.setStyle(_resizer["dragger"]["element"],_resizer["dragger"]["style"]);
                } else $$.core.setStyle(_resizer["dragger"]["element"],{"width":_width.toString()+"px"});
                //Limiting SOUTH to container
                if ((_resizer["start_offset"][1]+_height)>=(_resizer["container"]["offset"][1]+_resizer["container"]["size"][1])){
                    _resizer["dragger"]["style"] = {
                        "height": ((_resizer["container"]["offset"][1]+_resizer["container"]["size"][1])-_resizer["start_offset"][1]).toString()+"px"
                    }
                    $$.core.setStyle(_resizer["dragger"]["element"],_resizer["dragger"]["style"]);
                }
            } else $$.core.setStyle(this,{"width":_width.toString()+"px"});
            
        });
        
        _width = _height = _left = _top = null;
    }
    , _setResizable = function(){
        var i = _params.points.length
        , _element_position = $$.core.getPosition(_self.elements[0])
        , _style = {
            "position": "absolute"
            , "margin-left": "0"
            , "margin-top": "0"
            , "margin-right": "0"
            , "margin-bottom": "0"
            , "left": _element_position[0].toString()+"px"
            , "top": _element_position[1].toString()+"px"
        }
        ;
        _self.css(_style);
        if (_params.points!==undefined && i>0){
            while(i--){
                switch(_params.points[i]){
                    case "n":
                        _setResizableNorth();
                        break;
                    case "s":
                        _setResizableSouth();
                        break;
                    case "e":
                        _setResizableEast();
                        break;
                    case "w":
                        _setResizableWest();
                        break;
                    case "ne":
                        _setResizableNorthEast();
                        break;
                    case "nw":
                        _setResizableNorthWest();
                        break;
                    case "se":
                        _setResizableSouthEast();
                        break;
                    case "sw":
                        _setResizableSouthWest();
                        break;
                }
            }
        }
        i = null;
    }
    , _removeResizable = function(){
        var i,ii;
        for (i in _handlers) {
            ii = _handlers[i].length;
            while(ii--)_handlers[i][ii].parentNode.removeChild(_handlers[i][ii]);
            switch(i){
                case "n":
                    _self.uninstall(_name+"dragnorth");
                    break;
                case "s":
                    _self.uninstall(_name+"dragsouth");
                    break;
                case "e":
                    _self.uninstall(_name+"drageast");
                    break;
                case "w":
                    _self.uninstall(_name+"dragwest");
                    break;
                case "ne":
                    _self.uninstall(_name+"dragnortheast");
                    break;
                case "nw":
                    _self.uninstall(_name+"dragnorthwest");
                    break;
                case "se":
                    _self.uninstall(_name+"dragsoutheast");
                    break;
                case "sw":
                    _self.uninstall(_name+"dragsouthwest");
                    break;
            }
        }
        i = ii = null;
    }
    , _method = {
        init: function(params,name){
            _self = this;
            _name = name;
            _params = $$.core.extend(_params,params,true);
            //console.log("resizable created on ", _self)
            _setResizable();
        }
        , destroy: function(params){
            _self = this;
            _removeResizable();
            //console.log("resizable destroyed on ", _self)
            _name = _params = _handlers = _resizer = _setResizableNorth = _setResizableSouth = _setResizableEast = _setResizableWest = _setResizableNorthEast = _setResizableNorthWest = _setResizableSouthEast = _setResizableSouthWest = _setResizable = _method = null;
        }
    }
    return _method;
}

