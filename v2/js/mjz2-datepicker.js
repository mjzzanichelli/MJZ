var $$datepicker = function(){
    var _self
    , _name
    , _params = {
        "default_date": new Date()
        , "start_day": 1
        , "container": $$(document.body)
    }
    , _private = {
        "element": null
        , "menu_container": null
        , "days_container": null
    }
    /*, _setPreviousWeeks = function(){
        
    }
    , _setNextWeeks = function(){
        
    }*/
    , _createDatePickerDays = function(container,weeks){
        container.html("",{cleandeep:true});
        var i = -1
	        , ii
	        , _week
	        , _day
        ;
        while(i++<weeks.length-1){
            ii = -1;
            _week = $$(container.append('<ul class="week-row"/>'));
            while(ii++<weeks[i].length-1){
                _day = $$(_week.append('<li class="week-day"/>'));
                _day.html(weeks[i][ii].getDate());
                (
                    function(day){
                        _day.on("click",function(e,obj){
                            _self.trigger(_name+"selected",{elements:[_private["element"]],day:day});
                        });
                    }
                )(new Date(weeks[i][ii]));
            }
        }
        i = ii = _week = _day = null;
    }
    , _setMenuNavigation = function(step){
        _method.current_date.setDate(_method.current_date.getDate()+step);
        var _weeks = _setWeekDates(_method.current_date);
        _createDatePickerMenu(_private["menu_container"],_weeks);
        _createDatePickerDays(_private["days_container"],_weeks);
    }
    , _createDatePickerMenu = function(container,weeks){
        container.html("",{cleandeep:true});
        var _menu_prev = $$(container.append('<div class="menu-prev"/>'))
        , _menu_next = $$(container.append('<div class="menu-next"/>'))
        , _menu_label = $$(container.append('<div class="menu-label"/>'))
        ;
        
        _menu_label.html($$.getMonthName(_method.current_date.getMonth()));
        _menu_prev.html("prev");
        _menu_next.html("next");

        _menu_prev.on("click",function(e,obj){
            _method.current_date = new Date(weeks[0][0]);
            _setMenuNavigation(-1);
        });
        _menu_next.on("click",function(e,obj){
            _method.current_date = new Date(weeks[weeks.length-1][weeks[weeks.length-1].length-1]);
           _setMenuNavigation(1);
        });
    }
    , _createDatePicker = function(weeks){
        var _element_offset = $$.getOffset(_private["element"])
        , _element_size = [_private["element"].offsetWidth,_private["element"].offsetHeight]
        , _datepicker_container = $$(_params["container"].append('<div class="mjz-datepicker"/>'))
        ;
        
        _private["menu_container"] = $$(_datepicker_container.append('<div class="menu-container"/>'));
        _private["days_container"] = $$(_datepicker_container.append('<div class="days-container"/>'));
            
        _createDatePickerMenu(_private["menu_container"],weeks);
        _createDatePickerDays(_private["days_container"],weeks);
        
        _datepicker_container.css({
            "left": (_element_offset[0]+_element_size[0]).toString()+"px"
            , "top": _element_offset[1].toString()+"px"
            , "display": "block"
        });
        _method.active = true;
        _method.container = _datepicker_container;
        
        _element_offset = _element_size = _datepicker_container = null;
    }
    , _setWeekDates = function(current_date){
        var _default_date = new Date((new Date(current_date || _params["default_date"])).setDate(1))
        , _start_date = new Date(_default_date)
        , _end_date = new Date(_default_date)
        , _weeks = new Array
        ;
        
        _method.current_date = _default_date;
            
        _start_date.setDate((_start_date.getDate()-_start_date.getDay())+_params["start_day"]);
        while(_start_date.getMonth()==_default_date.getMonth() && _start_date.getDate()!=1)_start_date.setDate(_start_date.getDate()-7);
        _end_date.setDate((_end_date.getDate()-_end_date.getDay())+_params["start_day"]+6);
        while(_end_date.getMonth()==_default_date.getMonth() && (new Date((new Date(_end_date)).setDate(_end_date.getDate()+1))).getMonth() == _default_date.getMonth())_end_date.setDate(_end_date.getDate()+7);
        while (_start_date.getTime()<=_end_date.getTime()){
            if (_start_date.getDay()==_params["start_day"]) _weeks.push(new Array);
            _weeks[_weeks.length-1].push(new Date(_start_date));
            _start_date.setDate(_start_date.getDate()+1);
        }
        
        _default_date = _start_date = _end_date = null;
        return _weeks;
    }
    , _checkDatepickerStatus = function(e,obj){
        //console.log(_private["element"],this)
        if (!_method.disabled){
            if (!_method.active) {
                _private["element"] = this;
                //console.log(_private["element"].$$plug)
                var _weeks = _setWeekDates();
                _createDatePicker(_weeks);
            }
            else _removeDatePicker(this);
        }
    }
    , _setDatePicker = function(){
        _self.on("click",_checkDatepickerStatus);
    }
    , _removeDatePicker = function(element){
        element = element || _private["element"];
        //_private["element"] = null;
        if (_method.container){
            _method.container.remove({cleandeep:true});
            _method.container = null;
        }
        _method.active = false;
        _method.current_date = null;
        //console.log(_private["element"],element)
        if (_private["element"] !=element) {
            _private["element"] = null;
            _checkDatepickerStatus.call(element);
        } else _private["element"] = null;
    }
    , _method = {
        init: function(params,name){
            _self = this;
            _name = name;
            _params = $$.extend(_params,params,true);
            _setDatePicker();
            //console.log("datepicker created on ", _self)
        }
        , active: false
        , container: null
        , current_date: null
        , disabled: false
        , remove: _removeDatePicker
        , disable: function(){
            _removeDatePicker();
            _method.disabled = true;
        }
        , destroy: function(params){
            _self = this;
            _self.off("click",_checkDatepickerStatus);
            _removeDatePicker();
            //console.log("datepicker destroyed on ", _self)
            _name = _params = _private = _createDatePickerDays = _setMenuNavigation = _createDatePickerMenu = _createDatePicker = _setWeekDates = _checkDatepickerStatus =_setDatePicker = _method = null;
        }
    };
    return _method;
};