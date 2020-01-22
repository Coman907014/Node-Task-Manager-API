const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('./db/mongoose');

const userRouter = require('./routes/User');
const taskRouter = require('./routes/Task')

app.use(express.json())
// Routing
app.use(userRouter)
app.use(taskRouter)


//
// Without middleware: new request -> run route handler
//
//
// With middleware: new request -> do something -> run route handler
//
//

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})