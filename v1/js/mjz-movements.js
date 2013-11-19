var $$draggable = function(){
    var _self
    , _name
    , _params = {
        "classMove": "mjz-draggable"
    }
    , _addDraggableElements = function(){
        if (_params!==undefined && _params["handler"]!==undefined) {
            _handler = _params["handler"];
            if ($$.core.getType(_handler)=="function"){
                var _elements = _params.elements || _self.elements
                , i=_elements.length
                , _new_handler = new Array
                ;
                while(i--) _new_handler.push(_handler.call(_elements[i]));
                _handler = _new_handler;
            }
            _handler = $$(_handler);
        }
        else _handler = _self;
        _handler.on("mousedown",_mousedown,{stop:true});
    }
    , _removeDraggableElements = function(){
        _handler.off("mousedown",_mousedown);
        _$$doc.off("mousemove",_mousemove);
        _$$doc.off("mouseup",_mouseup);
        //$$.core.setDocumentSelection(true);
        if (_dragger && _dragger["scrollable"]) _dragger["scrollable"]["element"].off("scroll",_scrollcontainer);
    }
    , _handler
    , _$$doc = $$(document)
    , _dragger = null
    , _mousedown = function(e,obj){
        var _this = _self==_handler ? this : _self.elements[this.$$plug.indexes[_handler.unique]]
        , _element_position = $$.core.getPosition(_this)
        , _helper = _this
        ;
        _$$doc.on("mouseup",_mouseup,{stop:true});
        
        //$$.core.setDocumentSelection(false);
        
        _dragger = {origin:_this,start_position:{mouse:$$.core.getMouse(e),element:_element_position},current_position:{mouse:null,element:null}};
        if (_params!==undefined){
            if (_params.container !== undefined) _dragger["container"] = {element:_params.container,offset:$$.core.getOffset(_params.container)};
            if (_params.scrollable !== undefined) {
                _dragger["scrollable"] = {
                    "element": $$(_params.scrollable)
                    , "scroll": [_params.scrollable.scrollLeft,_params.scrollable.scrollTop]
                    , "partial": [_params.scrollable.scrollLeft,_params.scrollable.scrollTop]
                }
                _dragger["scrollable"]["element"].on("scroll",_scrollcontainer);
            }
            if (_params.helper !== undefined){
                _helper = document.createElement("DIV");
                if ($$.core.getType(_params.helper)=="function")_helper.innerHTML = _params.helper.call(_this);
                else _helper.innerHTML = _params.helper;
                _helper = _helper.firstChild;
                for ( ; _helper; _helper = _helper.nextSibling ) if ( _helper.nodeType === 1) break;
                _this.parentNode.appendChild(_helper);
                _dragger["helper"] = true;
            }
            if (_params["classMove"]!==undefined && _params["classMove"].length>0) $$.core.addClass(_helper,_params["classMove"]);
        }
        _dragger["element"] = _helper;
        _self.trigger(_name+"start",{elements:[_dragger.origin],start:_dragger});
        if ($$.core.droppable!==undefined ) _dragger["droppables"] = new Array;
        $$.core.setStyle(_helper,{
            "position": "absolute"
            , "margin-left": "0"
            , "margin-top": "0"
            , "margin-right": "0"
            , "margin-bottom": "0"
        });
        
        _setElementPosition(_dragger,_dragger.start_position.mouse,true);
        _checkDroppables(_dragger);
        _refreshDroppables();
        _$$doc.on("mousemove",_mousemove);
        _this = _element_position = _helper = null;
    }
    , _scrollcontainer = function(e,obj){
        var _this = _self==_handler ? this : _self.elements[this.$$plug.indexes[_handler.unique]]
        , _element_styles = $$.core.getStyle(_dragger.element,["left","top"])
        _element_styles = {
            "left": (parseInt(_element_styles["left"],10)+(_this.scrollLeft-_dragger["scrollable"]["scroll"][0])).toString()+"px"
            , "top": (parseInt(_element_styles["top"],10)+(_this.scrollTop-_dragger["scrollable"]["scroll"][1])).toString()+"px"
        }
        _dragger["scrollable"]["scroll"] = [_this.scrollLeft,_this.scrollTop];
        $$.core.setStyle(_dragger.element,_element_styles);
        _this = _element_styles = null;
    }
    , _mouseup = function(e,obj){
        _$$doc.off("mousemove",_mousemove);
        _$$doc.off("mouseup",_mouseup);
        
        //$$.core.setDocumentSelection(true);
        
        if (_dragger){
            if (_params!==undefined){
                if (_params["classMove"]!==undefined && _params["classMove"].length>0) $$.core.addClass(_dragger["element"],_params["classMove"]);
            }
            if (_dragger["scrollable"]) _dragger["scrollable"]["element"].off("scroll",_scrollcontainer);
            if (_dragger["helper"]) _dragger["element"].parentNode.removeChild(_dragger["element"]);
        }
        _self.trigger(_name+"stop",{elements:[_dragger.origin],stop:_dragger});
        if (_dragger && _dragger["droppables"]!==undefined && _dragger["droppables"].length>0){
            var _$$element,i=_dragger["droppables"].length,ii;
            while(i--){
                _$$element = _dragger["droppables"][i]["$$plug"];
                if (_$$element!==undefined){
                    ii = _$$element.objects.length;
                    while(ii--)_$$element.objects[ii].trigger(_name+"in",{elements:[_dragger["droppables"][i]],dropped:_dragger});
                }
            }
            _$$element = i = ii = null;
        }
        _dragger = null;
    }
    , _mousemove = function(e,obj){
        if (_dragger){
            _setElementPosition(_dragger,$$.core.getMouse(e));
            _checkDroppables(_dragger);
            _self.trigger(_name+"move",{elements:[_dragger.origin],move:_dragger});
        }
    }
    , _setElementPosition = function(dragger,mouse_current,_noblock){
        var _scroll_style = _dragger["scrollable"] ? [(_dragger["scrollable"]["element"].elements[0].scrollLeft-_dragger["scrollable"]["partial"][0]),(_dragger["scrollable"]["element"].elements[0].scrollTop-_dragger["scrollable"]["partial"][1])] : [0,0]
        , _style = {
            "left": (dragger.start_position.element[0]+(mouse_current[0]-dragger.start_position.mouse[0])+_scroll_style[0]).toString()+"px"
            , "top": (dragger.start_position.element[1]+(mouse_current[1]-dragger.start_position.mouse[1])+_scroll_style[1]).toString()+"px"
        }
        , _new_style = {}
        , _element_offset
        , _element_styles
        ;
        if (!_noblock && _params!==undefined){
            if (_params["block-x"]) delete _style["left"];
            if (_params["block-y"]) delete _style["top"];
        }
        _new_style = $$.core.extend(_new_style,_style)
        
        if (dragger.container!==undefined && dragger.container.offset!==undefined){
            _element_styles = $$.core.getStyle(dragger.element,["left","top"])
            _element_styles = {
                "left": parseInt(_element_styles["left"],10)
                , "top": parseInt(_element_styles["top"],10)
            }
        }
        $$.core.setStyle(dragger.element,_style);
        
        if (_element_styles!==undefined){
            _element_offset = $$.core.getOffset(dragger.element);
            if (_style["left"]!==undefined){
                if (_element_offset[0]<=dragger.container.offset[0]) _new_style["left"] = (parseInt(_new_style["left"],10)+(dragger.container.offset[0]-_element_offset[0])).toString()+"px";
                if ((_element_offset[0]+dragger.element.offsetWidth)>=(dragger.container.offset[0]+dragger.container.element.clientWidth+dragger.container.element.scrollLeft)) _new_style["left"] = (parseInt(_new_style["left"],10)-((_element_offset[0]+dragger.element.offsetWidth)-(dragger.container.offset[0]+dragger.container.element.clientWidth+dragger.container.element.scrollLeft))).toString()+"px";
            }
            if (_style["top"]!==undefined){
                if (_element_offset[1]<=dragger.container.offset[1]) _new_style["top"] = (parseInt(_new_style["top"],10)+(dragger.container.offset[1]-_element_offset[1])).toString()+"px";
                if ((_element_offset[1]+dragger.element.offsetHeight)>=(dragger.container.offset[1]+dragger.container.element.clientHeight+dragger.container.element.scrollTop)) _new_style["top"] = (parseInt(_new_style["top"],10)-((_element_offset[1]+dragger.element.offsetHeight)-(dragger.container.offset[1]+dragger.container.element.clientHeight+dragger.container.element.scrollTop))).toString()+"px";
            }
            if(_style["left"]!=_new_style["left"] || _style["top"]!=_new_style["top"]) {
                $$.core.setStyle(dragger.element,_new_style);
                _style = _new_style;
            }
        }
        dragger.current_position = {mouse:mouse_current,element:[parseInt(_style["left"],10),parseInt(_style["top"],10)]};
        _style = _new_style = _element_offset = _element_styles = null;
    }
    , _checkDroppables = function(dragger){
        if ($$.core.droppable!==undefined ) $$.core.droppable.check(dragger);
    }
    , _refreshDroppables = function(){
        if ($$.core.droppable!==undefined) $$.core.droppable.refresh();
    }
    , _method = {
        init: function(params,name){
            _self = this;
            _name = name;
            _params = $$.core.extend(_params,params,true);
            //console.log("draggable created on ", _self)
            _addDraggableElements();
        }
        , destroy: function(params){
            _self = this;
            //console.log("draggable destroyed on ", _self)
            _removeDraggableElements();
            _name = _params = _addDraggableElements = _removeDraggableElements = _handler = _$$doc = _dragger = _mousedown = _mouseup = _mousemove = _setElementPosition = _checkDroppables = _method = null;
        }
    }
    ;
    return _method;
}

var $$droppable = function(){
    var _self
    , _name
    , _params = {
        "tolerance": "intersect"
        , "classOver": "mjz-droppable-over"
    }
    , _addDroppableElements = function(){
        var _elements = (_params && _params.elements ? _params.elements : _self.elements)
        ,i=_elements.length
        ,_element_unique
        ;
        if ($$.core.droppable===undefined) $$.core.droppable = {};
        if ($$.core.droppable.check===undefined) $$.core.droppable.check = _checkDroppables;
        if ($$.core.droppable.refresh===undefined) $$.core.droppable.refresh = _refreshElementsCoords;
        if ($$.core.droppable.elements===undefined) $$.core.droppable.elements = {};
        while(i--){
            _element_unique = _self.unique.toString()+"."+_elements[i].$$plug.indexes[_self.unique].toString();
            $$.core.droppable.elements[_element_unique] = {
                "element":_elements[i]
                , "params":_params
                , "coords":$$.core.getCoords(_elements[i])
                , "over":false
            };
        }
        _elements = i = _element_unique = null;
    }
    , _removeDroppableElements = function(){
        var _elements = (_params && _params.elements ? _params.elements : _self.elements)
        ,i=_elements.length
        ,_element_unique
        ;
        if ($$.core.droppable!==undefined && $$.core.droppable.elements!==undefined){
            while(i--){
                _element_unique = _self.unique.toString()+"."+_elements[i].$$plug.indexes[_self.unique].toString();
                if ($$.core.droppable.elements[_element_unique]!==undefined) delete $$.core.droppable.elements[_element_unique];
            }
            
        }
        _elements = i = _element_unique = null;
    }
    , _checkDroppables = function(dragger){
        var _droppable
        , _droppable_params
        , _droppable_coords
        , _element_coords = $$.core.getCoords(dragger.element)
        ;
        dragger.droppables = new Array;
        for (_droppable in $$.core.droppable.elements){
            if ($$.core.droppable.elements[_droppable]["element"]!=dragger.element){
                _droppable_params = $$.core.droppable.elements[_droppable]["params"];
                _droppable_coords = $$.core.droppable.elements[_droppable]["coords"];
                if (
                    _droppable_params["tolerance"] == "intersect"
                    && (
                        (
                            _element_coords[0][0] >= _droppable_coords[0][0]
                            && _element_coords[0][0] <= _droppable_coords[2][0]
                            && _element_coords[0][1] >= _droppable_coords[0][1]
                            && _element_coords[0][1] <= _droppable_coords[2][1]
                        ) || (
                            _element_coords[1][0] >= _droppable_coords[0][0]
                            && _element_coords[1][0] <= _droppable_coords[2][0]
                            && _element_coords[1][1] >= _droppable_coords[0][1]
                            && _element_coords[1][1] <= _droppable_coords[2][1]
                        ) || (
                            _element_coords[2][0] >= _droppable_coords[0][0]
                            && _element_coords[2][0] <= _droppable_coords[2][0]
                            && _element_coords[2][1] >= _droppable_coords[0][1]
                            && _element_coords[2][1] <= _droppable_coords[2][1]
                        ) || (
                            _element_coords[3][0] >= _droppable_coords[0][0]
                            && _element_coords[3][0] <= _droppable_coords[2][0]
                            && _element_coords[3][1] >= _droppable_coords[0][1]
                            && _element_coords[3][1] <= _droppable_coords[2][1]
                        )

                    )


                ) {
                    if (!$$.core.droppable.elements[_droppable]["over"]){
                        $$.core.droppable.elements[_droppable]["over"] = true;
                        if (_params["classOver"] && _params["classOver"].length>0) $$.core.addClass($$.core.droppable.elements[_droppable]["element"],_params["classOver"]);
                        _self.trigger(_name+"over",{elements:[$$.core.droppable.elements[_droppable]["element"]]});
                    }
                    dragger.droppables.push($$.core.droppable.elements[_droppable]["element"]);
                } else if (
                    _droppable_params["tolerance"] == "contained"
                    && _droppable_coords[0][0] <= _element_coords[0][0]
                    && _droppable_coords[0][1] <= _element_coords[0][1]
                    && _droppable_coords[2][0] >= _element_coords[2][0]
                    && _droppable_coords[2][1] >= _element_coords[2][1]
                ) {
                    if (!$$.core.droppable.elements[_droppable]["over"]){
                        $$.core.droppable.elements[_droppable]["over"] = true;
                        if (_params["classOver"] && _params["classOver"].length>0) $$.core.addClass($$.core.droppable.elements[_droppable]["element"],_params["classOver"]);
                        _self.trigger(_name+"over",{elements:[$$.core.droppable.elements[_droppable]["element"]]});
                    }
                    dragger.droppables.push($$.core.droppable.elements[_droppable]["element"]);
                } else if ($$.core.droppable.elements[_droppable]["over"]){
                    $$.core.droppable.elements[_droppable]["over"] = false;
                    if (_params["classOver"] && _params["classOver"].length>0) $$.core.removeClass($$.core.droppable.elements[_droppable]["element"],_params["classOver"]);
                    _self.trigger(_name+"out",{elements:[$$.core.droppable.elements[_droppable]["element"]]});
                }
            }
        }
        _droppable = _droppable_params = _droppable_coords = _element_coords = null;
    }
    , _refreshElementsCoords = function(){
        var _id;
        for (_id in $$.core.droppable.elements){
            $$.core.droppable.elements[_id]["coords"] = $$.core.getCoords($$.core.droppable.elements[_id]["element"]);
        }
        _id = null;
    }
    , _method = {
        init: function(params,name){
            _self = this;
            _name = name;
            _params = $$.core.extend(_params,params,true);
            //console.log("droppable created on ", _self)
            _addDroppableElements();
        }
        , destroy: function(params){
            _self = this;
            //console.log("droppable destroyed on ", _self)
            _removeDroppableElements();
            _name = _params = _addDroppableElements = _removeDroppableElements = _checkDroppables = _refreshElementsCoords = _method = null;
        }
    }
    ;
    return _method;
}

var $$sortable = function(){
    var _self
    , _name
    , _params
    , _sorter = null
    , _dragStart = function(e,obj){
        //console.log("start",this,e.$$plug,obj)
        var _element,_sorter_html;
        if (_params["sorter"]){
            _element = document.createElement("div");
            _sorter_html = _params["sorter"];
            if ($$.core.getType(_sorter_html)=="function")_sorter_html = _sorter_html.call(this);
            
            _element.innerHTML = _sorter_html;
            _element = _element.firstChild;
            //console.log(_element.firstChild)
        } else{
            _element = this.cloneNode(true);
            $$.core.setStyle(_element,{
                "height": ((this.offsetHeight*3)-2)+"px"
                , "width": (this.offsetWidth-2)+"px"
                , "border": "1px solid green"
                , "display": "block"
            });
            _element.innerHTML = "";
            _element.removeAttribute("id");
        }
//      console.log(_element)
        this.parentNode.insertBefore(_element, this.nextSibling);
        $$.core.setStyle(this,{"display":"none"});
        _sorter = {origin:this,element:_element};
        _element = null;
    }
    , _dragMove = function(e,obj){
        if (e.$$plug.params.move.droppables.length>0) _sorter.element.parentNode.insertBefore(_sorter.element,e.$$plug.params.move.droppables[0]);
    }
    , _dragStop = function(e,obj){
        if (_sorter){
            var _mutational = $$.core.mutational;
            $$.core.mutational = false;
            _sorter["origin"].parentNode.insertBefore(_sorter["origin"],_sorter["element"]);
            $$.core.mutational = _mutational;
            _sorter["element"].parentNode.removeChild(_sorter["element"]);
            $$.core.setStyle(_sorter["origin"],{"display":"block"});
            _mutational = null;
        }
        _sorter = null;
    }
    , _addSortableDroppable = function(){
        _self.install(_name+"drop",$$droppable,{
            "tolerance":"intersect"
            , "classOver": false
        });
    }
    , _addSortableDragging = function(){
        _self.install(_name+"drag",$$draggable,{
            "helper": _params["helper"]
            , "scrollable": _params["scrollable"]
            , "container": _params["container"]
            , "block-x": _params["block-x"]
        });
        _self.on(_name+"dragstart",_dragStart);
        _self.on(_name+"dragmove",_dragMove);
        _self.on(_name+"dragstop",_dragStop);
    }
    , _method = {
        init: function(params,name){
            _self = this;
            _name = name;
            _params = $$.core.extend(_params,params,true);
            _addSortableDroppable();
            _addSortableDragging();
            //console.log("sortable created on ", _self)
        }
        , destroy: function(params){
            _self = this;
            _self.off(_name+"dragstart",_dragStart);
            _self.off(_name+"dragmove",_dragMove);
            _self.off(_name+"dragstop",_dragStop);
            _self.uninstall(_name+"drag");
            _self.uninstall(_name+"drop");
            //console.log("sortable destroyed on ", _self)
            _name = _params = _sorter = _dragStart = _addSortableDroppable = _addSortableDragging = _method = null;
        }
    }
    ;
    return _method;
}