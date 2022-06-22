const mongoose = require('mongoose')

let PID_APP_HOST='127.0.0.1'
let PID_APP_DATABASE='PID_DB'

const MONGODB_URI = `mongodb://${PID_APP_HOST}/${PID_APP_DATABASE}`;

//mongoose.set('useFindAndModify', false);
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(db => console.log(`Database is connected`))
.catch(err => console.log(err));
