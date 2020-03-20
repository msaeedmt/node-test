let mongoose = require('mongoose');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://msaeedmt:msaeedmt@cluster0-wtge5.mongodb.net/test?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("Connected to the database...");
}).catch(err => {
    console.log(err);
})

module.exports = {mongoose};

