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
    React.render(<Todos app_state={state} />,document.getElementById('main'));
    return state;
}

var Todos = pi.component(
    "Todos",
    function render() {
    	var main=null;
    	var app_state_todos = this.props.app_state.todos || [];
    	var todos = R.isNil(this.props.app_state.filter)?app_state_todos:R.filter(R.propEq("completed", this.props.app_state.filter),app_state_todos);
		  var todoItems = todos.map(function(todo, index){
			return <TodoItem key={index} index={index} todo={todo} />
		})

		var footer = this.props.app_state.todos && todos.length>=0?<TodoFooter count={todos.length} filter={this.props.app_state.filter}/>:null;
		if (todos.length) {
			main = (
				<section className="main">
					<input
						className="toggle-all"
						type="checkbox"
						onChange={this.toggleAll}
					/>
					<ul className="todo-list">
						{todoItems}
					</ul>
				</section>
			);
		}

        return(
			<div>
				<header className="header">
					<h1>todos</h1>
					<input
						className="new-todo"
						placeholder="What needs to be done?"
						onKeyDown={this.handleNewTodoKeyDown}
						onChange={this.handleChange}
						autoFocus={true}
						value={this.state.text}
					/>
				</header>
				{main}
				{footer}
			</div>
        );
    },
    [{
    	getInitialState:function(){
    		return {text:""};
    	},
    	handleChange: function (event) {
			this.setState({text: event.target.value});
			this.forceUpdate();
		},
		handleNewTodoKeyDown: function (event) {
			if (event.keyCode !== 13 || event.keyCode==32)
				return;
			var val = this.state.text.trim();
			this.setState({text: ""});
			this.forceUpdate();
			controller.add(val);
		},

    }]

);


var TodoItem = pi.component("TodoItem",
	function renderTodoItem(){
		var self = this;
		return (
				<li >
					<div className="view">
						<input
							className="toggle"
							type="checkbox"
							checked={self.props.todo.completed}
							onChange={function(){controller.mark(self.props.index,self.props.todo.completed==false)}}
						/>
						<label onDoubleClick={this.handleEdit}>
							{this.props.todo.title}
						</label>
						<button className="destroy" onClick={function(){controller.delete(self.props.index)}} />
					</div>
					<input
						ref="editField"
						className="edit"
					/>
				</li>
			);
	}
);

var TodoFooter = pi.component("TodoFooter",
	function renderFooter(){
    var self = this;
    var filter = this.state.filter;
    var allSelected = filter==null ? "selected" : "";
    var activeSelected = filter != null && !filter ? "selected" : "";
    var completedSelected = filter != null && filter ? "selected" : "";

		return (
			<footer className="footer">
				<span className="todo-count">
					<strong>{this.props.count}</strong> left
				</span>
				<ul className="filters">
					<li>
						<a onClick={function(){self.displayAll();}} className={allSelected}>All</a>
					</li>
					{' '}
					<li>
						<a onClick={function(){self.displayActive();}} className={activeSelected}>Active</a>
					</li>
					{' '}
					<li>
						<a onClick={function(){self.displayCompleted();}} className={completedSelected}>Completed</a>
					</li>
				</ul>
				<button
						className="clear-completed"
						onClick={controller.undo}>
						&nbsp;Undo
				</button>
				<button
						className="clear-completed"
						onClick={controller.clear_completed}>
						Clear completed
				</button>

			</footer>
			);
},[{
  getInitialState: function(){
    var st = {filter: this.props.filter};
    return st;
  },
  displayAll: function(){
    controller.filter();
    this.setState({filter: null});
    this.forceUpdate();
  },
  displayActive: function(){
    controller.filter(false);
    this.setState({filter: false});
    this.forceUpdate();
  },
  displayCompleted: function(){
    controller.filter(true);
    this.setState({filter: true});
    this.forceUpdate();
  }
}]

)


exports.render = render;
exports.Todos = Todos;
