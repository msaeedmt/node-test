const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username number required'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password number required'],
        trim: true,
        minlength: [6, "too weak!"]
    },
    phoneNumber: {
        type: String,
        length: 11,
        required: [true, 'PhoneNumber number required']
    }
});

userSchema.statics.findUser = function (username, password) {
    let User = this;

    return User.findOne({username}).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    console.log(user);
                    return resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};


userSchema.pre('save', function (next) {
    let user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

let User = mongoose.model('User', userSchema);

module.exports = {User};