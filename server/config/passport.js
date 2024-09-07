const GoogleStrategy=require('passport-google-oauth20') // Allows users to Login using the Google Account
const mongoose=require('mongoose');
const User = require('../models/User.js')

module.exports=function (passport) {
    // Defining the new authentication strategy in Passport.js
    // passport.use(
    //     new GoogleStrategy(
    //         {
    //             clientID:process.env.GOOGLE_CLIENT_ID,
    //             clientSecret:process.env,GOOGLE_CLIENT_SECRET,
    //             callbackURL:'/api/auth/google/callback'

    //         },
    //         async (accessToken, refreshToken, profile, done)=>{
    //             const newUser={
    //                 googleId: profile.id,
    //                 name: profile.displayName,
    //                 email: profile.emails[0].value,
    //                 avatar: profile.photos[0].value
    //             };

    //             try{
    //                 let user=await User.findOne({googleId: profile.id});

    //                 if(user){
    //                     done(null,user);
    //                 }
    //                 else{
    //                     user = await User.create(newUser);
    //                     done(null, user);
    //                 }
    //             }
    //             catch(err){
    //                 console.log(err);
    //                 done(err,false,err.message);
    //             }
    //         }
    //     )
    // );

    // passport.serializeUser((user, done) => {
    //     done(null, user.id);
    // });

    // passport.deserializeUser((id, done) => {
    //     User.findById(id, (err, user) => done(err, user));
    // });
}

/*
Providing two functionalities: Authentication via Passport.js and GoogleOAuth 2.0
*/