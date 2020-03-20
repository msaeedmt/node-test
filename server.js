const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const bcrypt = require("bcrypt");

const {mongoose} = require("./mongoose");
const {User} = require("./UserSchema");

let app = express();

app.use(bodyParser.json());

app.get('/:id', getById);
app.get('/', getAll);
app.post('/register', register);
app.post('/signIn', signIn);
app.patch('/:id', update);
app.delete('/:id', remove);


function getById(req, res, next) {
    let id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).send();
    }

    User.findById(id, {useFindAndModify: false})
        .then(user => user ? res.send(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    User.find().then(docs => {
        res.send(docs);
    }).catch(err => {
        res.status(400).send(err);
    });
}

function register(req, res, next) {
    let body = _.pick(req.body, ["username", "password", "phoneNumber"]);
    let user = new User(body);

    user.save().then((doc) => {
        res.send(doc);
    }).catch(err => {
        console.log(err);
    });
}

function signIn(req, res, next) {
    let {username, password} = req.body;
    User.findUser(username, password).then((user) => {
        res.send(user);
    }).catch(err => {
        res.sendStatus(400).send(err);
    });
}

function remove(req, res, next) {
    let id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).send();
    }

    User.findByIdAndRemove(id, {useFindAndModify: false})
        .then(user => user ? res.send(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    let id = req.params.id;
    let body = _.pick(req.body, ["username", "password", "phoneNumber"]);

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).send();
    }

    if (body.password) {
        const salt = bcrypt.genSaltSync(10);
        body.password = bcrypt.hashSync(body.password, salt);
    }

    User.findByIdAndUpdate(id, {$set: body}, {new: true, useFindAndModify: false})
        .then(user => user ? res.send(user) : res.sendStatus(404))
        .catch(err => next(err));
}


app.listen(3000, () => {
    console.log('Connected to the server...')
});
