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
    //our initial state
    pi.swap_model(pi.deepFreeze({
        todos:[],
        filter:null 
    }));
};


TodoController.prototype.index = function(){
    pi.startWith(model, "INDEX")
    .then(views.render)

}

TodoController.prototype.add = function(title){
    pi.startWith(model, "ADD")
    .then(state=> pi.pi_change(state,"todos", [{title:title, completed:false}].concat(state.todos)))
    .then(views.render)
    .then(pi.swap_model)

}

TodoController.prototype.mark = function(index, completed){
    pi.startWith(model, "MARK")
    .then(pi.change("todos["+index+"].completed", completed))
    .then(views.render)
    .then(pi.swap_model)
}

TodoController.prototype.filter = function(filter){
    pi.startWith(model, "filter")
    .then(pi.change("filter", filter))
    .then(views.render)
    .then(pi.swap_model)
}

TodoController.prototype.clear_completed = function(){
    pi.startWith(model, "filter")
    .then(state=>pi.pi_change(state,"todos", R.filter(todo=>!todo.completed,state.todos)))
    .then(views.render)
    .then(pi.swap_model)
}


TodoController.prototype.delete = function(index){
    pi.startWith(model, "DELETE")
    .then(state=> {
        var to_delete = pi.pi_value(state, "todos["+index+"]");
        return pi.pi_change(state,"todos", R.filter(todo=>todo!=to_delete,state.todos));
    })
    .then(views.render)
    .then(pi.swap_model)
}

TodoController.prototype.undo = function() {
    pi.startWith(model,"UNDO")
        .then(function(state){
            if(hist.length > 1) hist.pop();
            model = R.last(hist);
            return model
        })
        .then(views.render)
};

exports.TodoController = TodoController;
