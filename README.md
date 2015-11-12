# pi-react
DIY next generation MVC framework, using promises in controllers, immutable persistent data structures as the model and Facebook React as the view

A framework that is simple enough for me is like this:

1. I have some data
2. I perform some transformations on it
3. I render on screen




Then repeat :)


Now if the data is the model, I do all the transformations in the controller, and display the result on the screen using the view.

Any action in the view will trigger the same steps, but starting from the data that was transformed already.


In MVC words

I have a model generic object which represents the application state. A controller objects which transforms the model and calls the view to render the state (using Facebook React).

Because I need the controller to be simple and robust, I want to be able to see the flow of the transformations very easily, be able to do async calls (ajax) be able to handle errors and be able to go to the previous state, in case there was an error. Now Promises in javascript do all that. It's easy to see the flow:

new Promise()
.then transform
.then render


They can handle all async code beautifully.

new Promise
.then transform
.then ajax
.then transform again
.then render


They can handle errors:

new Promise()
.then transform
.then render
.fail render_errors


If I combine the promises with immutability of the data (model). For instance, if we have a list of todos (immutable):

model = pi.deepFreeze({
 todos:[]
})


Adding a new one would be in pi-react:

pi.startWith(model)
.then(pi.change("todos",[{title:"new todo"}]); //transform data - new todo
.then(views.render)  //render using React
.then(pi.swap_model) 


The last line will replace the model with the new value. Since it is done at the end, it means all was alright. If not, the model will remain unchanged, which means that a views.render(model) will show us the previous page.

a console.log(model)

will show:

{
    todos:[{
                   title:"new todo"
              }]
}
