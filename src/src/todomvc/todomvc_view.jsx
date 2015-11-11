/**
 * User: Dan Bunea
 * Date: 11/11/2015
 * Time: 15:18
 */
var pi = require('../pi-react/pi-react.js');
var R = require('ramda');
var React = require('react/addons');
var $=require('jquery');


function render(state){
    pi.info("render");
    React.render(<Todos state={state} />,document.getElementById('main'));
    return state;
}

var Todos = pi.component(
            "Todos",
            function render() {
                
                return(
                    <div>Todos</div>
                );
              }
);


exports.render = render;
exports.Todos = Todos;
