const passport = require('passport')
const {Strategy: LocalStrategy} = require('passport-local');
const { hashSync, compareSync} = require('bcrypt')

const users = [];

passport.serializeUser(function(user, done) {
   

    done(null, user.username)

})

passport.deserializeUser(function(username, done) {
    const existentUser = users.find(user => user.username === username);

    done(null, existentUser)

})

passport.use('login', new LocalStrategy( (username, password, done) => {
const user = users.find(user => user.username === username && compareSync(password, user.password))

if(user) {
     done(null, user);
     return;
}
 done(null, false);
    return;
}));

passport.use('signup',new LocalStrategy( (username,password, done)=> {
    const existentUser = users.find(user => user.username === username);
    if(existentUser) {
        done(new Error('user already exists'))
        return
    }
    const user = {username, password: hashSync(password, 10)}
    users.push(user)
    done(null, user)
}))