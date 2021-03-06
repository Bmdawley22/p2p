
const fs = require('fs')
const { getData, reWriteData } = require('../utils')


const rendLogin = (req, res, next) => {
    res.render('login.ejs', {
        authMsg: false
    })
}
const rendSignup = (req, res, next) => {
    res.render('signup.ejs', {
        authMsg: false
    })
}

const login = async (req, res, next) => {
    let data = await getData()

    //used for when using userData.js
    const usernameFound = data.users.findIndex(user => {
        return user.username === req.body.username;
    })
    if(usernameFound !== -1) {
        if(data.users[usernameFound].password === req.body.password) {
            data.users[usernameFound]["active"] = true;
            
            reWriteData(data)
            res.redirect('/user/home')
        }
        else {
            res.render('login.ejs', {
                auth: false,
                authMsg: 'Password is incorrect'
            })
        }
    } else {
        res.render('login.ejs', {
            auth: false,
            authMsg: 'Username not found'
        })
    }
}

const signup = async (req,res,next) => {
    try {
        let data = await getData()

        //gets input data in users.json format
        const newUser = req.body;
        newUser.id = String(data.users.length);
        newUser.active = true;
        newUser.bal = "$0"
        let check = {nameCheck: true, emailCheck: true, userCheck: true}

        for(i=0;i<data.users.length; i++) {
            if(newUser.fName === data.users[i].fName && newUser.lName === data.users[i].lName) {
                check.nameCheck = false;
            }      
            if(newUser.email == data.users[i].email) {
                check.emailCheck = false;
            }
            if(newUser.username === data.users[i].username) {
                check.userCheck = false
            }
        }

        if(check.nameCheck && check.emailCheck) {
            if(check.userCheck) {
                //adds data to users.json
                data.users.push(newUser)
                reWriteData(data)
                res.redirect('/user/home')
            } else {
                res.render('signup.ejs', {
                    auth: false,
                    authMsg: 'Username is taken'
                })
            }
        } else {
            res.render('signup.ejs', {
                auth: false,
                authMsg: "You've already created an account, please login"
            })
        }
        
         
    } catch(error) {
        console.log(error);
    }
}

const signOut = async (req,res,next) => {

    let data = await getData()
    
    for(i=0; i < data.users.length ; i++) {
        if (data.users[i]["active"] === true) {
            data.users[i]["active"] = false
        }
    }
    reWriteData(data)
    res.redirect('/')
}

module.exports = {
    rendLogin,
    rendSignup, 
    login,
    signup,
    signOut
}