const mongoose = require('mongoose')

const {PID_APP_HOST, PID_APP_DATABASE} = process.env;
const MONGODB_URI = `mongodb://${PID_APP_HOST}/${PID_APP_DATABASE}`;

//mongoose.set('useFindAndModify', false);
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(db => console.log(`Database is connected`))
.catch(err => console.log(err));
