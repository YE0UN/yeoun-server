const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
let User = require('../models/User');
require('dotenv').config();

const hashPassword = require('../utils/hash-password');

module.exports = () => {
    // Local Strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, done) {
            // 저장되어 있는 User 비교
            return User.findOne({email: email, password: hashPassword(password)})
                .then(user => {
                    console.log("user: " + user);
                    if (!user) {
                        return done(null, false, {message: 'Incorrect email or password.'});
                    }
                    return done(null, user, {message: 'Logged In Successfully'});
                })
                .catch(err => done(err));
        }
    ));
    
    // JWT Strategy
    passport.use(new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey   : process.env.JWT_SECRET
        },
        function (jwtPayload, done) {
            return User.findById(jwtPayload._id)
                .then(user => {
                    return done(null, user);
                })
                .catch(err => {
                    return done(err);
                });
        }
    ));
}