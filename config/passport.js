const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const AnonymousStrategy = require('passport-anonymous').Strategy;
require('dotenv').config();

const User = require('../models/User');

const hashPassword = require('../utils/hash-password');

const cookieExtractor = (req) => {
    const { token } = req.cookies;
    return token;
}

module.exports = () => {
    // Local Strategy
    passport.use(new LocalStrategy({
        usernameField: 'email', 
        passwordField: 'password'
        }, 
        async (email, password, done) => {
            try {
            const user = await User.findOne({email: email, password: hashPassword(password)});
            if (!user) {
                done(null, false, { error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
                return;
            }
            done (null, user, { message: '로그인 성공' });
            } catch (err) {
            console.error(err);
            done(err);
            }
        }
    ));
    
    // JWT Strategy
    passport.use(new JWTStrategy({
            jwtFromRequest: cookieExtractor,
            secretOrKey   : process.env.JWT_SECRET
        },
        async (jwtPayload, done) => {
            try {
                const user = await User.findById(jwtPayload.id);
                if (user) {
                    return done(null, user);
                }
            }
            catch (err) {
                console.log(err);
                done(err);
            }
        }
    ));

    passport.use(new AnonymousStrategy());
}