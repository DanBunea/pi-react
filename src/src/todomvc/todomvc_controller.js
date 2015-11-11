/**
 * User: Dan Bunea
 * Date: 11/11/2015
 * Time: 15:18
 */
$ = require('jquery');
R = require("ramda");
views = require('./todomvc_view.jsx');
pi = require('../pi-react/pi-react.js');

TodoController.prototype = new Object;
TodoController.prototype.constructor = TodoController;
function TodoController(user_preferences, display_filters, date_format, company_fields, last_saved_search_id) {

    var initial_state = pi.deepFreeze({
        data:null,
        errors:[],
        context:{
            status:"edit"
        }
    });

    //our first model
    pi.swap_model(initial_state);
};


TodoController.prototype.index = function(){
    pi.startWith(model, "INDEX")
    .then(views.render)

}



exports.TodoController = TodoController;
