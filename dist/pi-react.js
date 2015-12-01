
(function(){
    var debug=false;
    var retain_changes = true;
    hist=[];


    function equals(nextProps, props, debug){
        //functions are ignored
        if(R.type(nextProps)==="Function")
            return true;

        if(R.type(nextProps)!="Object")
            return nextProps===props;

        var equals = false;
        var where = [];

        if(nextProps===props)
        {
            where="===";
            equals=true;
        }
        else
        {
            var np_keys = R.keys(nextProps);
            var p_keys = R.keys(props);
            if(np_keys.length!==p_keys.length) {
                where.push(["keys.length!=="]);
                equals = false;
            }
            else
            {
                var any = R.filter(function(key){
                        if(R.type(nextProps[key])==="Function") {
                            where.push("Function: ",nextProps[key]);
                            return true;
                        }
                        return nextProps[key]!==props[key];
                    },
                    np_keys
                )
                R.forEach(function(key){
                    where.push(["."+key,nextProps[key]," not === ",props[key]]);
                    }, any)


                equals=any.length==0;
            }
        }
        if(debug && !equals)
            console.log( "        -equals:",equals, where, nextProps, props);
        return equals;
    };


    function shouldComponentUpdate_based_on_each_key(nextProps, nextState) {
                        //this.debug();
                        var eq = true;
                        var self = this;
                        R.forEach(function(key){
                            eq = eq && pi.equals(nextProps[key], self.props[key])
                        }, Object.keys(nextProps))

                        //this.debug("/shouldComponentUpdate",!eq);
                        return !eq;
                    }

    function shouldComponentUpdate_as_whole_props_and_state(nextProps, nextState) {
                        //this.debug();
                        var update_props = equals(nextProps, this.props) && equals(nextState, this.state);
                        //this.debug("/shouldComponentUpdate",!update_props);
                        return !update_props;
                    };

    function component(displayName, render, mixins, shouldComponentUpdate){
                if(!mixins)
                {
                    mixins = []
                }
                if(!shouldComponentUpdate)
                {
                    shouldComponentUpdate = shouldComponentUpdate_based_on_each_key;
                }
                var vrMixins = [{
                    debug:function()
                    {
                        //console.log.apply(console,arguments);
                        //var po = this.props.page_object ? this.props.page_object:{id:"", type:""}

                        console.log("  ",[this.me()], arguments.length>0?arguments:"")
                        if(this.get_rootID().split('.').length <= 3)
                        {
                            console.log("");

                        }
                    },
                    me:function()
                    {
                        return this.get_display_name();
                    },

                    shouldComponentUpdate: shouldComponentUpdate,
                    componentDidUpdate:function(prevProps, prevState){
                        //this.debug();
                    },
                    get_display_name:function()
                    {
                        return this.get_rootID()+" - "+ this._reactInternalInstance._currentElement.type.displayName;
                    },
                    get_rootID:function()
                    {
                        return this._reactInternalInstance._rootNodeID;
                    }
                }]


                return  React.createClass({
                displayName:displayName,
                mixins:vrMixins.concat(mixins),
                render:render

            });


        }


    var stateful_mixin = {
        getStateFromProps:function getStateFromProps(props){
             var stateObj = {};
             R.forEach(function(key){
                 stateObj[key]=props[key];
             }, R.keys(props))
             return stateObj;
        },
        getInitialState:function getInitialState(){
             //transform all props in state
             return this.getStateFromProps(this.props);
        },
        componentWillReceiveProps:function componentWillReceiveProps(nextProps){
             this.setState(this.getStateFromProps(nextProps));
             this.forceUpdate();
        }
    }

    function get_random(){
        return Math.floor(Math.random()*100000);
    }

    function simple_ajax(url,  method, what)
    {
        return $.ajax(
            {
                type: method ? method: "POST",
                url:url+"?random="+get_random(),
                data:JSON.stringify(what),
                dataType:'json',
                contentType: 'application/json'
            }
        )
    }


    function ajax(url, state, method, what, after_callback) {
        var dfd = simple_ajax(url, method, what)
        .then(function after_ajax_done(data){
                pi.info("after_ajax_done", data);//, state)
                var after_ajax = pi.pi_change(state, "data", data.data);
                return after_ajax;
            },
            function after_ajax_fail(error){
                var errors = (error && error.responseText) ? eval('('+error.responseText+')') : eval('('+error+')') ;
                pi.info("after_ajax_fail", errors);//, state)
                var after_ajax = pi.pi_change(state, "errors", errors.errors);

                return after_ajax;
            });
        return dfd.promise();
    }



    function ajax_no_promise(url, method, what) {
        var dat=null;
        $.ajax(
            {
                async:false,
                type: method ? method: "POST",
                url:url+"?random="+get_random(),
                data:JSON.stringify(what),
                dataType:'json',
                contentType: 'application/json',
                success:    function(data) {
                    if(data.data)
                        data = data["data"]
                    dat = data;
                },
                error: function(error)
                {
                    if(errorCallback)
                        errorCallback(error);
                    else {
                    }
                }
            });
        return dat;
    }



    function shallow_clone(obj) {
        if(obj === null || typeof(obj) !== 'object')
            return obj;

        var temp = obj.constructor(); // changed

        for(var key in obj) {
            if(Object.prototype.hasOwnProperty.call(obj, key)) {
                //temp[key] = clone(obj[key]);
                temp[key] = obj[key];
            }
        }
        return temp;
    }



     function deepFreeze(o) {
            var isObject = (typeof o === "object" );
            var isNull = (o === null);
            var isAlreadyFrozenObject = (isObject && !isNull ? Object.isFrozen(o) : false);
            var isUndefined = (typeof o === "undefined");
            if ( !isObject || isNull || isAlreadyFrozenObject || isUndefined ) {
                return o;
            }
            var prop, propKey;
            for (propKey in o) {
                try {
                    if ( o.hasOwnProperty(propKey) ) {
                        prop = o[propKey];
                        deepFreeze(prop);
                    }
                } catch (error) {
                    throw new Error("Can't freeze property with key "+propKey+" and value "+prop+" because:\n " + error.message);
                }
            }
            try {
                return Object.freeze(o);
            } catch (error) {
                throw new Error("Can't freeze object "+o+" because of error:\n"+error);
            }
        }




        function startWith(state, func){
            info("")
            info(func, "startWith:", state)
            var dfd = $.Deferred();
            if(pi.retain_changes) {
                state =pi.pi_change(state,"_changes",{})
            }
            dfd.resolve(state);
            return dfd.promise();
        }

        function get_promise() {

        }


        var debounce = function(delay) {
          var lastd;
          lastd = $.Deferred();
          return function(state) {
    ;        var  d;
            lastd.reject();
            d = $.Deferred();
            lastd = d;
            setTimeout(function() {
              return d.resolve(state);
            }, delay || 100);
            return d.promise();
          };
        };



        function assert(condition, message) {
            if (!condition) {
                message = message || "Assertion failed";
                if (typeof Error !== "undefined") {
                    throw new Error(message);
                }
                throw message; // Fallback
            }
        }


        function pi_do(obj, path,val, xcallback){
    //        info(obj,path);

            assert(arguments.length==4, "pi_do needs 4 arguments!!!")
            assert(obj instanceof Object, ["pi_do obj needs to be Object or {} but was:",obj, path, val] )
            assert(typeof path == 'string' || path instanceof String, "pi_do path (cursor) needs to be string!!!")
            assert(R.type(xcallback)==="Function", "pi_do xcallback needs to be a function!!!")


            var new_obj = shallow_clone(obj);
            var path = path.replace("[",".").replace("]","");
            var levels = path.split(".");
            if(levels.length>1)
            {
                var head = levels[0];
                var tail = path.replace(head+".","")
                new_obj[head] = pi_do(obj[head],tail,val, xcallback)
            }
            else
            {
                if(xcallback) xcallback(new_obj,path, val);
            }
            return deepFreeze(new_obj);
        }



        function pi_change_multi(obj, changes)
        {

            R.forEach( function(key){
                    obj = pi_change(obj, key, changes[key])
                },
                Object.keys(changes)
            )
            return obj;
        }

    function log_changes(obj, path, val)
    {
        var changes = {};
        //if(!obj.changes)
        //    obj = pi_do(obj,"changes", {},do_change);
        changes = shallow_clone(obj["_changes"]);

        changes[path]=val;
        obj = pi_do(obj,"_changes", changes,do_change)
        return obj;
    }

        function do_change(ob,path,val){
            if(ob[path] !== val) ob[path] = val;
        }

        function pi_change(obj,path,val)
        {
            assert(arguments.length==3, "pi_change needs 3 arguments!!!")
            assert(obj instanceof Object, "pi_change obj needs to be Object or {}!!!")
            assert(typeof path == 'string' || path instanceof String, "pi_change path (cursor) needs to be string!!!")


            if(obj["_changes"])
                obj = log_changes(obj, path, val);

            return pi_do(obj, path, val,do_change)
        }




    function pi_push(obj,path,val)
    {
        assert(arguments.length==3, "pi_push needs 3 arguments!!!")
        assert(obj instanceof Object, "pi_push obj needs to be Object or {}!!!")
        assert(typeof path == 'string' || path instanceof String, "pi_push path (cursor) needs to be string!!!")



        var array = pi_value(obj, path);
        assert(array instanceof Array, "pi_push needs to be Array!!!")
        if(array && array instanceof Array)
        {
            var new_array = array.concat([val]);
            if(obj["_changes"])
                obj = log_changes(obj, path, new_array);
            return pi_change(obj, path, new_array);
        }

        return obj;
    }


    function pi_filter_array(obj,path,filter_function)
    {
        assert(arguments.length==3, "pi_filter_array needs 3 arguments!!!")
        assert(obj instanceof Object, "pi_filter_array obj needs to be Object or {}!!!")
        assert(filter_function instanceof Function, "pi_filter_array filter_function needs to be Function!!!")
        assert(typeof path == 'string' || path instanceof String, "pi_filter_array path (cursor) needs to be string!!!")




        var array = pi_value(obj, path);
        assert(array instanceof Array, "pi_filter_array needs to be Array!!!")
        if(array && array instanceof Array)
        {
            var new_array = array.filter(filter_function);
            if(obj["_changes"])
                obj = log_changes(obj, path, new_array);
            return pi_change(obj, path, new_array);
        }

        return obj;
    }







        function pi_delete(obj,path)
        {
            return pi_do(obj, path, undefined,
                function do_delete(ob,p){
                    delete ob[p];
                })
        }

        function pi_copy(obj,path1,path2)
        {
            return pi_change(obj, path2, pi_value(obj, path1));
        }

        function pi_move(obj,path1,path2)
        {
            return pi_delete(
                pi_copy(obj, path1, path2),
                path1
            );
        }

        function pi_value(obj, path)
        {
            assert(arguments.length==2, "pi_value needs 2 arguments!!!")
            assert(obj instanceof Object, ["pi_value obj needs to be Object or {}!!!",obj, path])
            assert(typeof path == 'string' || path instanceof String, "pi_value path (cursor) needs to be string!!!")

    //        info(obj,path);
            var path = path.replace("[",".").replace("]","");
            var levels = path.split(".");
            if(levels.length>1)
            {
                var head = levels[0];
                var tail = path.replace(head+".","")
                return pi_value(obj[head],tail)
            }
            else
            {
                return obj[path];
            }
            return obj;
        }


        function info()
        {
            if(console && pi.debug){
                console.log.apply(console, arguments);
            }
        }






    var swap_model_add_history=R.curry(function (add_to_history, state)
    {
        pi.info("swap_model_add_history", add_to_history);//, state);
        if(add_to_history) hist.push(state);
        if(pi.retain_changes) {
            pi.info("changes", state["_changes"]);
            model = pi_delete(state, "_changes");
        }
        else
            model = state;
        return state;
    }
    )
    var swap_model=R.partial(swap_model_add_history,true);



    function translate(key){
        if(typeof text == "undefined") return key;
        if(text[key])
        {
            return text[key];
        }
        return key;
    }

    pi = {};

    pi.component = component;
    pi.translate=translate;
    pi.deepFreeze = deepFreeze;
    pi.startWith= startWith;
    pi.pi_change= pi_change;
    pi.pi_change_multi= pi_change_multi;
    pi.pi_move= pi_move;
    pi.pi_delete= pi_delete;
    pi.pi_copy= pi_copy;
    pi.pi_value= pi_value;
    pi.info= info;

    pi.shallow_clone = shallow_clone;
    pi.ajax=ajax;
    pi.simple_ajax=simple_ajax;
    pi.ajax_no_promise=ajax_no_promise;
    pi.debug = debug

    pi.change = R.curry(function(path, val, obj){info("pi.change",path, val);return pi_change(obj, path, val)});
    pi.change_multi = R.curry(function(changes, obj){info("pi.change_multi",changes);return pi_change_multi(obj, changes)});
    pi.value = R.curry(function(path, obj){info("pi.value: ",path);return pi_value(obj, path)});
    pi.copy = R.curry(function(path1, path2, obj){info("pi.copy",path1, path2);return pi_copy(obj, path1, path2)});
    pi.delete = R.curry(function(path, obj){info("pi.delete",path);return pi_delete(obj, path)});
    pi.move = R.curry(function(path1, path2, obj){info("pi.move",path1, path2);return pi_move(obj, path1, path2)});
    pi.push = R.curry(function(path, val, obj){info("pi.push",path, val);return pi_push(obj, path, val)});
    pi.filter_array = R.curry(function(path, func, obj){info("pi.filter_array",path);return pi_filter_array(obj, path, func)});

    pi.swap_model_add_history=swap_model_add_history;
    pi.swap_model=swap_model;
    pi.debounce =debounce;

    pi.equals=equals;
    pi.retain_changes=retain_changes;
    pi.id=function(state){console.log("id:", state);return state;}
    pi.stateful_mixin = stateful_mixin;


})("pi")