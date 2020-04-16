var check=require('express-validator/check');
var {check,validationResult}=require('express-validator/check');
var {data,sanitize}=require('express-validator/filter');
var mysqlClient=require('./db_connect');
var bcrypt=require('bcrypt')
var Geo=require('node-geocoder')
var age=require('get-age')
var options={
    provider:'google',
    httpAdapter:'https',
    apiKey:'AIzaSyDg1RZ_d3DiSsF_7lnrd7T-kU0m864vRCA',
    formatter:null
}
var geocoder=Geo(options)
var mail;
var user;
var sess_user;
var lat,lon;
const saltRounds=10;



function userExists(user){
  return new Promise((resolve,reject)=>{
      var query="SELECT * FROM Users WHERE pseudo='"+user+"'";
      mysqlClient.query(query,function(err,result){
          if(err) return reject(err);
          if(result.length>0 && result[0].pseudo!=sess_user) return reject(new Error("Username already in use"));
          return resolve(user);
      });
  });
}

function emailExists(mail){
  return new Promise((resolve,reject)=>{
      var query="SELECT * FROM Users WHERE email='"+mail+"'";
      mysqlClient.query(query,function(err,result){
          if(err) return reject(err);
          if(result.length>0 && result[0].pseudo!=sess_user) //return reject(new Error("Email already in use"));
          return reject(new Error("This email is already in use, try to <a href='/login'>sign in</a> instead !"));
          else return resolve(user);
      });
  });
}

function authenticate(id,pwd){
    return new Promise((resolve,reject)=>{
        var query="SELECT mdp,pseudo FROM Users WHERE pseudo=? OR email=?";
        mysqlClient.query(query,[id,id],
            function(err,rows,fields){
                if(err) return reject(err);
                if(rows.length>0){
                    bcrypt.compare(pwd,rows[0].mdp,function(err,res){
                        console.log("ici")
                        if(res) return resolve(rows[0].pseudo,pwd);
                        return reject(new Error("Password and username do not match, have you <a href='forgotten'>forgotten</a> your password ?"))
                    })
                }
                else return reject(new Error("Password and username do not match, have you <a href='forgotten'>forgotten</a> your password ?"));
            }
        );
    })
}

function localize(user,adr){
    return new Promise((resolve,reject)=>{
        var query="SELECT adress FROM Users WHERE pseudo=?";
        mysqlClient.query(query,[user],
            function(err,rows,fields){
                if(err) return reject(err)
                if(rows.length==0 || adr!=rows[0].adress){
                    console.log("ici")
                    geocoder.geocode(adr,function(err,data){
                        if(err) return reject(err)
                        if(!data || data.length==0){
                            console.log("rejet")
                            return reject(new Error("This address is not valid !"))
                        }
                        return resolve(adr)
                    })
                }
                else return resolve(rows)
            })
    })
}

exports.subscription=[
    check('pseudo').trim().escape().isLength({min:4}).withMessage('Oups, not long enough').custom(
        value=>{
            return userExists(value).then(function (){
             // throw new Error("Username already in use")
            })
        })
    ,
    check('mail').isEmail().normalizeEmail().withMessage('Haha, not a real email').custom(
        value=>{
            return emailExists(value).then(function (){
             // throw new Error("Email already in use")
            })
        }
    )
    ,
    check('birthday').custom(
        value=>{
            console.log(value)
            if(age(value)<18) throw new Error("Try again in a few years, kiddo ;)")
            return true;
    }),
    check('adress').custom(
        (value,{req})=>{
            console.log(req.body.pseudo)
            return localize(req.session.user,req.body.adress).then(function(){})
        }
    ),
    check('pwd').isLength({min:5}).withMessage('Oups, not long enough'),
    check('rpwd').custom((
        value,{req})=>{
            if(value!==req.body.pwd){
              throw new Error("Passwords must match")
            }
            return true;
        }
    ),
    function(req,res){
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            res.json({status:"error",message:errors.array()});
        }
        else{
            //Data is correct, add user to the database
            var p=new Promise((resolve,reject)=>{
                    bcrypt.genSalt(saltRounds,function(err,salt){
                        bcrypt.hash(req.body.pwd,salt,function(err,hash){
                            console.log(hash)
                            var query="INSERT INTO Users (pseudo,email,mdp,birthday,adress) VALUES ('"+req.body.pseudo+"','"+req.body.mail+"','"+hash+"','"+req.body.birthday+"','"+req.body.adress+"');"//;INSERT INTO Interested_in(pseudo) VALUES ("+req.body.pseudo+")";
                            mysqlClient.query(query,function(err,rows){
                                console.log(err);
                                if(err) return reject(err);
                                else{
                                    console.log("inserted record");
                                    return resolve(rows);
                                }
                            });     
                        })
                    })
                    //resolve
                })
            console.log(p)
            p.then((rows)=>{
                req.session.user=req.body.pseudo
                req.session.firstVisit=true;
                res.json({status:"success",message:"/setup"})
            }).catch((err)=>{
                console.log(err)
                res.json({status:"success",message:"/error"})
            })
        }
    }
];


exports.modify=[
    check('pseudo').trim().escape().isLength({min:4}).withMessage('Oups, not long enough').custom(
        (value,{req})=>{
            console.log("LE CORPS DU PB ::::::   "+req.body)
            return userExists(value).then(function (){})
        })
    ,
    check('email').isEmail().normalizeEmail().withMessage('Haha, not a real email').custom(
        value=>{
            return emailExists(value).then(function (){})
        }
    )
    ,
    check('birthday').custom(
        value=>{
            if(age(value)<18) throw new Error("Try again in a few years, kiddo ;)")
            return true;
    }),
    check('nom').trim().escape().isAlpha().withMessage("That does not seem to be a real name")
    ,
    check('prenom').trim().escape().isAlpha().withMessage("That does not seem to be a real name")
    ,
    check('country').trim().escape().isAlpha().withMessage("That does not seem to be a real country")
    ,     
    check('phone').trim().escape().isNumeric().withMessage("That does not seem to be a real number")
    , 
    check('adress').custom(
            (value,{req})=>{
                console.log(req.body.pseudo)
                return localize(req.session.user,req.body.adress).then(function(){})
            }
    ),
    function(req,res){
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            res.json({status:"error",message:errors.array()})
        }
        else{
            var promise=new Promise((resolve,reject)=>{
                var query="UPDATE Users SET ? WHERE pseudo=?"
                var set=[req.body,req.session.user];
                if(lat && lon){
                    query+=";INSERT INTO Location(pseudo,lat,lon) VALUES(?,?,?) ON DUPLICATE KEY UPDATE lat=?,lon=?"
                    set=[req.body,req.session.user,req.body.pseudo,lat,lon,lat,lon]
                }
                mysqlClient.query(query,set,function(err,result){
                    if(err) return reject(err)
                    return resolve(result)
                })
            })
            return promise.then(()=>{
                req.session.user=req.body.pseudo
                sess_user=req.session.user
                console.log("Base Url:"+req.baseUrl);
                res.json({status:"success",message:req.baseUrl})
            }).catch((err)=>{
                console.log(err);
                res.json({status:"success",message:"/error"})
            })
        } 
    }
]


exports.login=[
    check('mail').trim().isEmail().custom(
    (value,{req})=>{
        mail=authenticate(req.body.mail,req.body.pwd);
        return mail.then(
            function(ps,pwd){
            user=ps;
            return true;
        });
    }),
    check('pwd').custom(
    ()=>{
        return mail.then((ps,pwd)=>{
            return true;
        })
        
    }),
    function (req,res){
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            res.json({status:"error",message:errors.array()});
        }
        else{
            req.session.user=user;
            sess_user=user;
            console.log("Haha  "+req.session.user);
            res.json({status:"success",message:"/"})
        }
    }
]

exports.criteria=[
    check('max').custom((value,{req})=>{
        if(value<req.body.min) throw new Error("Dude, come on. That's not a range ...")
        return true;
    }),
    async function(req,res){
        try {
            await new Promise((resolve, reject) => {
                var query="INSERT INTO Criteria VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE gender=?,min=?,max=?"
                mysqlClient.query(query, [req.session.user,req.body.gender,req.body.min,req.body.max,req.body.gender,req.body.min,req.body.max], function (err, result) {
                    if (err)
                        return reject(err);
                    return resolve(result);
                });
            });
            res.json({message:"/profile?section=interests"});
        }
        catch (err) {
            console.log(err);
            res.json({ message: "error" });
        }
    }
]