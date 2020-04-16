var mysqlClient=require('./db_connect')
var multer=require("multer")
var {check,validationResult}=require('express-validator/check');
var {data,sanitize}=require('express-validator/filter');

var Storage=multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,"./user_images");
    },
    filename:function(req,file,callback){
        callback(null,file.originalname);
    }
})

var upload= multer({
    storage:Storage,
    fileFilter:function (req,file,cb){
        var type=file.mimetype
        var typeArray=type.split("/")
        if(typeArray[0]=="video" || typeArray[0]=="image") cb(null,true)
        else cb(null,false)
    }
}).array("imgUploader",5);

exports.handle_request=
function (req,res){
    if(req.session.user){
        return new Promise((resolve,reject)=>{
            var query="SELECT * FROM Relationships WHERE person2=? AND person1=?"
            mysqlClient.query(query,[req.session.user,req.body.rec],function(err,rows,result){
                if(err) return reject(err);
                if(rows.length>0){
                    if(rows[0].status==0){
                        return new Promise((resolve2,reject2)=>{
                            var query="UPDATE Relationships SET status=1 WHERE person2=? AND person1=?;"
                            mysqlClient.query(query,[req.session.user,req.body.rec,],function(err,results){
                                if(err) return reject(err)
                                return resolve("Friends");
                            })
                        })
                    }
                    return resolve("Friends");
                }
                else{
                    return new Promise((resolve3,reject3)=>{
                        var query="INSERT INTO Relationships VALUES (?,?,0)";
                        mysqlClient.query(query,[req.session.user,req.body.rec],
                        function(err,result){
                            if(err) return reject(err);
                            return resolve("Request sent");
                        });
                    /*}).then(()=>{
                            return "Request sent"
                    })*/
                })
                    
                }
            })
        }).then((value)=>{
            console.log(value)
            res.json({message:value})
        }).catch((err)=>{
            console.log(err);
            res.json({message:"error"})
        });
    }
    else res.json({message:"anonymous"})
}


exports.reject_request=function(req,res){
    //pas nécessaire de vérifier si connecté en fait
    return new Promise((resolve,reject)=>{
        var query="UPDATE Relationships SET status=2 WHERE person1=? AND person2=?";
        mysqlClient.query(query,[req.body.rec,req.session.user],
            function(err,result){
                if(err) return reject(err)
                return resolve(result)
            }
        )
        //mysqlClient.end()
        
    }).then(()=>{
        res.json({message:"success"}) 
    }).catch(err=>{
        console.log(err);
        res.json({message:"error"}) 
    })
}

exports.reject_suggestion=function(req,res){
    //pas nécessaire de vérifier si connecté en fait
    return new Promise((resolve,reject)=>{
        var query="INSERT INTO Relationships VALUES(?,?,2) ON DUPLICATE KEY UPDATE status=2";
        mysqlClient.query(query,[req.session.user,req.body.rec],
            function(err,result){
                if(err) return reject(err)
                return resolve(result)
            }
        )
        //mysqlClient.end()
        
    }).then(()=>{
        res.json({message:"success"}) 
    }).catch(err=>{
        console.log(err);
        res.json({message:"error"}) 
    })
    
}


/*exports.send_request=function (req,res){
    if(req.session.user){
        return new Promise((resolve,reject)=>{
            var query="INSERT INTO Requests (sender,recipient) VALUES (?,?)";
            mysqlClient.query(query,[req.session.user,req.body.rec],
                function(err,result){
                    if(err) return reject(err);
                    return resolve(result);
                    });
            mysqlClient.end()
        }).then();
    }
    //Faire en sorte d'apeler la fonction seulement si la redirection n'est pas nécessaire
    else res.redirect("/login")
}
*/

exports.remove_friend=function(req,res){
    return new Promise((resolve,reject)=>{
        var query="DELETE FROM Relationships WHERE (person1=? AND person2=?) OR (person1=? AND person2=?)";
        mysqlClient.query(query,[req.session.user,req.body.p2,req.body.p2,req.session.user],
            function(err,result){
                console.log("Supprimé  "+req.body.p2)
                if(err) return reject(err)
                return resolve(result)
            }
        )
        //mysqlClient.end()
        
    }).then(()=>{
        res.json({message:"success"}) 
    }).catch(err=>{
        console.log(err);
        res.json({message:"error"}) 
    })
}
exports.get_url=function(req,res){
    upload(req,res,function(err){
        if(err) res.json({message:"error"})
        //const host=req.host;
        console.log(req.files)
        if(!req.files){
            res.json({message:"no-file"})
        }
        else{
            const filePath=req.files[0].filename
            console.log(filePath)
            res.json({message:filePath});
        }
        
    })
}

function change_pic(req,res,what){
    upload(req,res,function(err){
        if(err) res.json({message:"error"})
        if(!req.files){
            res.json({message:"no-file"})
        }
        else{
            const filePath=req.files[0].filename;
            return new Promise((resolve,reject)=>{
                var query="UPDATE Users SET "+what+"=? WHERE pseudo=?"
                mysqlClient.query(query,[filePath,req.session.user],function(err,result){
                    if(err) return reject(err)
                    return resolve(result)
                })
            }).then(()=>{
                    res.json({message:"success"})
                }).catch(()=>{
                    res.json({message:"error"})
                })
        }
    })
}
exports.change_pp= function(req,res){
    return change_pic(req,res,"profile_picture")
}

exports.change_cp= function(req,res){
    return change_pic(req,res,"cover_picture")
}

exports.add_picture=[
    check('desc').escape(),
    function(req,res){
    return new Promise((resolve,reject)=>{
        var query="INSERT INTO Images VALUES (?,?,?)";
        mysqlClient.query(query,[req.body.filePath,req.session.user,req.body.desc],function(err,result){
            if(err) return reject(err);
            return resolve(result);
    })
}).then(()=>{
    res.json({status:"success",message:"/profile?section=photos"}) 
}).catch(err=>{
    console.log(err);
    res.json({status:"success",message:"/error"}) 
})
}
]


exports.remove_picture=function(req,res){
    return new Promise((resolve,reject)=>{
        var query="DELETE FROM Images WHERE creator=? AND img_url=?";
        mysqlClient.query(query,[req.session.user,req.body.filePath],function(err,result){
            if(err) return reject(err);
            return resolve(result);
        })
    }).then(()=>{
        res.json({message:"success"}) 
    }).catch(err=>{
        console.log(err);
        res.json({message:"error"}) 
    })
}

exports.change_caption=[check('desc').escape(),
function(req,res){
    console.log("wesh !!!!!")
    return new Promise((resolve,reject)=>{
        var query="UPDATE Images SET caption=? WHERE img_url=?";
        mysqlClient.query(query,[req.body.desc,req.body.filePath],function(err,result){
            if(err) return reject(err);
            return resolve(result);
    })
}).then(()=>{
    res.json({status:"success",message:"/profile?section=photos"}) 
}).catch(err=>{
    console.log(err);
    res.json({status:"success",message:"/error"}) 
})
}
]


exports.add_interest=function(req,res){
    return new Promise((resolve,reject)=>{
        var query="INSERT INTO Interested_in VALUES (?,?)";
        mysqlClient.query(query,[req.session.user,req.body.key],function(err,result){
            if(err) return reject(err);
            return resolve(result);
        })
    }).then(()=>{
        res.json({status:"success",message:"/profile?section=interests"}) 
    }).catch(err=>{
        console.log(err);
        res.json({status:"sucess",message:"/error"}) 
    })
}

exports.remove_interest=function(req,res){
    return new Promise((resolve,reject)=>{
        var query="DELETE FROM Interested_in WHERE pseudo=? AND interest_name=?";
        mysqlClient.query(query,[req.session.user,req.body.int_name],function(err,result){
            if(err) return reject(err);
            return resolve(result);
        })
    }).then(()=>{
        res.json({message:"success"}) 
    }).catch(err=>{
        console.log(err);
        res.json({message:"error"}) 
    })
}

exports.search_i=[
    check('key').trim().escape(),
    function(req,res){
    return new Promise((resolve,reject)=>{
        var esc=req.body.key+'%'
        var query="SELECT interest_name,picture FROM Interests WHERE interest_name LIKE ?";
        mysqlClient.query(query,[esc],function(err,result){
            if(err) return reject(err);
            return resolve(result);
        })
    }).then((rows)=>{
        res.json({message:"success",content:rows}) 
    }).catch(err=>{
        console.log(err);
        res.json({message:"error"}) 
    })
}]


exports.search=[
    check('key').trim().escape(),
    function(req,res){
        return new Promise((resolve,reject)=>{
            var esc=req.body.key+'%'
            console.log(esc)
            var query="SELECT pseudo,nom,prenom FROM Users WHERE pseudo LIKE ? OR nom LIKE ? OR prenom LIKE ?" 
            mysqlClient.query(query,[esc,esc,esc],function(err,result){
                if(err) return reject(err);
                return resolve(result);
            })
        }).then((rows)=>{
            console.log("je suis la")
            console.log(rows);
            res.json({message:"success",content:rows}) 
        }).catch(err=>{
            console.log(err);
            res.json({message:"error"}) 
        })
        //first trim and clean
        
       // const =await mysqlClient.query(query,[])
  //  }).then({
       // res.send
    //})
}
]

//Function add_interest, handle checkboxes
//QWSX

   