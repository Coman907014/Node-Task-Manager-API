// CRUD operations

const { MongoClient, ObjectID } = require('mongodb')
const connectionURL = 'mongodb://127.0.0.1:27017';
const taskManagerDataBaseName = 'task-manager-app';
const theObjectID = new ObjectID();
console.log(theObjectID)
console.log(theObjectID.getTimestamp());
MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
      return  console.log(`Unable to connect to the database.`)
    }
    const db = client.db(taskManagerDataBaseName);

    // const tasks = [
    //     {
    //         description: 'Buy groceries',
    //         completed: true
    //     },
    //     {
    //         description: 'Pet dog',
    //         completed: false
    //     },
    //     {
    //         description: 'Cook dinner',
    //         completed: true
    //     }
    // ]
    // db.collection('tasks').insertMany(tasks, (error, result) => {
    //     if (error) {
    //         return console.log(`Couldn't save the tasks`);
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('users').findOne({ _id: new ObjectID('5e203f4f1a8de73fc3d6a5a0') }, (error, user) => {
    //     if (error) {
    //         return console.log(`User cannot be found`)
    //     }
    //     console.log(user)
    //     console.log(`---------------------------------------------------`);
    // })
    

    // db.collection('users').find({ name: 'Alex' }).count((error, count) => {
    //     if (error) {
    //         return console.log(`User cannot be found`)
    //     }
    //     console.log(count)
    // })

    // db.collection('tasks').findOne({ _id: new ObjectID('5e2042f5696e0d43106f49da')}, (error, task) => {
    //     if (error) {
    //                 return console.log(`User cannot be found`)
    //             }
        
    //     console.log(task)
    //     console.log(`---------------------------------------------------`);
    // })

    // db.collection('tasks').find({ completed: false}).toArray((error, task) => {
    //     if (error) {
    //                 return console.log(`User cannot be found`)
    //             }
        
    //     console.log(task)
    //     console.log(`---------------------------------------------------`);
    // })

    // db.collection('users').updateOne({
    //     _id: new ObjectID('5e203f4f1a8de73fc3d6a5a1')
    // }, {
    //     $inc: {
    //         age: 3000
    //     }
    // }).then(result => console.log(result)).catch(error => console.log(error))

    // db.collection('tasks').updateMany({
    //     completed: false
    // },{
    //     $set: {
    //         isLie: true
    //     }
    // }).then(result => console.log('Everything went fine!', result)).catch(error => console.log('There has been an error', error))
    
    db.collection('tasks').deleteMany({
        completed: false
    }).then(result => console.log(`!completed tasks were removed`, result)).catch(error => console.log(`Couldn't delete the tasks!`))

    db.collection('tasks').deleteOne({
        description: "Eat junk food"
    }).then(result => console.log(`Junk food task was removed`, result)).catch(error => console.log(`Couldn't delete the junk food task!`))
})