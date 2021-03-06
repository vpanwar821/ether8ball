var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    id: {type: String },
    name: { type: String },
    forgotPassswordToken: { type: String},
    forgotPassswordTokenCreatedAt: { type: Date},
    ETHAddress  : {type: String},
    ETHPrivKey  : {type: String},
    secret: {type: String}, // google authnticator secret
    gmailSignin : {type: Boolean, default: false},
    facebookSignin: {type: Boolean, default: false},
    emailVerifyToken: {type: String},
    tokenCreatedAt: {type: Date},
    isVerified: {type: Boolean, default: false},
    addressGenerated: {type: Boolean, default: false},
    otp:{type:Number},
    otpCreatedAt:{type:Date},
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
    },
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
