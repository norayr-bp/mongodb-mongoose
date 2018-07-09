const mongoose = require("mongoose");
const moment = require('moment');
const Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/mydb");
const db = mongoose.connection;

db.once("open", function () {
    console.log("Connection oksss.");
})

const userScheme = new Schema({
    name: String,
    age: Number,
    gender: String,
    tasks: [
        { type: mongoose.Schema.ObjectId, ref: 'Task' }
      ]    
});

const taskScheme = new Schema({
    title: String,
    text: String,
    completed: Boolean,
    created: String,
    updated: String
})

userScheme.statics.createUser = function (props) {
    return new User(props);
}

taskScheme.statics.createTask = function (props) {
    return new Task(props);
}

userScheme.statics.getAllUsers = function() {
    this.find({}, 'name', function(err,docs) {
        if (err) {
            console.log(err);
        } else {
            console.log(docs.sort((a,b) => {
                return a.name > b.name ? 1 : -1;
            }));
        }
    });
}

userScheme.statics.getFemales = function() {
    this.find({gender: "Female"}, function(err,docs) {
        if (err) {
            console.log(err);
        } else {
            console.log(docs.sort((a,b) => {
                return a.name > b.name ? 1 : -1;
            }));
        }
    })
}

userScheme.statics.getAllUncompletedTasks = function() {
    this.find({}).populate("tasks").exec(function(err,doc) {console.log(doc[0].tasks.filter((task)=> !task.completed).sort((a,b) => a.created > b.created ? -1 :1))})
}

taskScheme.statics.UpdateTasksToFalse = function () {
    this.updateMany({completed: true}, {$set: {completed: false}}, function(err,doc) {console.log(doc)});
    this.find({}, 'completed', function(err,docs) {console.log(docs)});
}

taskScheme.statics.deleteCompleted = function(option) {
    this.remove({completed: true}).exec();
    this.find({}, 'completed', function(err,docs) {console.log(docs)});
}
// userScheme.statics.updateName = function (id) {
//     this.findOneAndUpdate({_id: id}, {$set: {name: 'Valod'}});
// } 

const User = mongoose.model('User', userScheme);
const Task = mongoose.model('Task', taskScheme);

// creating tasks

const task1 = Task.createTask({title: "node", text: "creating todo app", completed: true, created: moment().format("YYYY-MM-DD HH:mm"), updated: moment().format()});
const task2 = Task.createTask({title: "react", text: "creating weather app", completed: false, created: moment().format("2016-02-02"), updated: moment().format()});
const task3 = Task.createTask({title: "javascript", text: "creating game1", completed: false, created: moment().format("2016-03-03"), updated: moment().format()});
const task4 = Task.createTask({title: "javascript", text: "creating game2", completed: false, created: moment().format("2017-04-04"), updated: moment().format()});
const task5 = Task.createTask({title: "javascript", text: "creating game3", completed: true, created: moment().format("YYYY-MM-DD HH:mm"), updated: moment().format()});

const tasks = [task1,task2,task3,task4,task5];
const tasksIds = tasks.map((task) => task._id);

// creating users
const norayr =  User.createUser({name: "Norayr", age: 25, gender: "Male", tasks: tasksIds});
// const meri =  User.createUser({name: "Meri", age: 20, gender: "Female", tasks: tasksIds});
// const nare =  User.createUser({name: "Nare", age: 24, gender: "Female", tasks: tasksIds});
// const anahit =  User.createUser({name: "Anahit", age: 28, gender: "Female", tasks: tasksIds});
// const vazgenuhi =  User.createUser({name: "Vazgenuhi", age: 2, gender: "Female", tasks: tasksIds});
// const vazgenchik =  User.createUser({name: "Vazgenchik", age: 5, gender: "Male", tasks: tasksIds});
// const abo =  User.createUser({name: "Abo", age: 58, gender: "Male", tasks: tasksIds});
// const grnulik =  User.createUser({name: "Grnulik", age: 45, gender: "Male", tasks: tasksIds});

//const users = [norayr,meri,nare,anahit,vazgenuhi,vazgenchik,abo,grnulik];
const users = [norayr];


Task.create(tasks);
User.create(users);
User.getAllUncompletedTasks();
Task.UpdateTasksToFalse();
Task.deleteCompleted(true);

User.getAllUsers();
User.getFemales();
norayr
    .save()
    .then(({_id}) => {
        return User
        .findByIdAndUpdate(_id, {$set: {name: 'Valoid'}});
    })
    .catch(console.log);
