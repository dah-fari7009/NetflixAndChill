var mysqlClient=require('./db_connect')
var extend=require('extend')
var init=null

function getQuery(what){
    if(what=="infos") return "SELECT * FROM Users WHERE pseudo=?"
    if(what=="requests") return "SELECT person1 as ps,nom as n,prenom as pr,profile_picture as pp,cover_picture as cv,bio as b FROM Relationships JOIN Users ON person1=pseudo WHERE person2=? AND status=0"
    if(what=="friends") return "SELECT person2 AS person FROM Relationships WHERE person1=? and status=1 UNION SELECT person1 AS person FROM Relationships WHERE person2=? and status=1"
   if(what=="interests") return "SELECT interest_name,picture FROM Interested_in NATURAL JOIN Interests WHERE pseudo=?"
    if(what=="photos") return "SELECT img_url,caption FROM Images WHERE creator=?"
    return "SELECT pseudo,email,nom,prenom,profile_picture,cover_picture,bio FROM Users WHERE pseudo=?"
}

function getStatus(req,res){
    return new Promise((resolv1,rejec1)=>{
        var user=req.query.user_searched
        var query="SELECT person1,person2,status FROM Users JOIN Relationships WHERE (person1=? AND person2=?) OR (person2=? AND person1=?)"
        mysqlClient.query(query,[user,req.session.user,user,req.session.user],function(err,rows,result){
            if(err) return reject(err)
            if(rows.length>0){
                console.log("Je suis ici")
                extend(true,init[0],rows[0])
            }
            return resolv1(init)
        })
    })  
}



function whatYouWant(req,res,query,setup){
    return new Promise((resolve,reject)=>{
        var user=(req.query.user_searched)?req.query.user_searched:req.session.user;
        mysqlClient.query(query,[user,user,user,user,user],function(err,rows,result){
            console.log("Query "+query)
            console.log(req.session.user)
            if(err) return reject(err);
            console.log("Ici: "+init);
            if(setup){
                init=rows
                if(req.query.user_searched){
                    return getStatus(req,res).
                    then(()=>{
                        return resolve(rows)
                    })
                }
                console.log("Ensuite: "+init)
                return resolve(rows);
            }
            else if(init==null){
                mysqlClient.query(getQuery("init"),[user],function(err,fields,result){
                    if(err) return reject(err);
                    init=fields;
                    if(req.query.user_searched){
                        return getStatus(req,res).
                        then(()=>{
                            console.log("Ce qui s'est passé")
                            if(rows.length==0) rows=init
                            else extend(true,rows[0],init[0])
                            console.log(rows)
                            return resolve(rows)
                        })
                    } 
                })
            }
            console.log("Ce qui s'est passé")
            if(rows.length==0) rows=init
            else extend(true,rows[0],init[0])
            console.log(rows)
            return resolve(rows)
        })
    })
    //return resolve(rows);
}
        
function matches(req,res){
    return new Promise((resolve,reject)=>{
        var query=algorithm();
        mysqlClient.query(query,[req.session.user,req.session.user,req.session.user,req.session.user,req.session.user],function(err,result){
            if(err) return reject(err)
            var query2="SELECT U.pseudo as ps,nom as n,prenom as pr,profile_picture as pp,cover_picture as cv,common_interest,CAST (distance AS UNSIGNED INTEGER) AS distance,(common_interest*0.35+(30-distance)*0.65) as factor FROM Matches M JOIN Users U ON U.pseudo=M.pseudo ORDER BY factor desc";
            return new Promise((resolv,rejec)=>{
                mysqlClient.query(query2,[],function(err,rows,result){
                    if(err) return reject(err)
                    return new Promise((resolv2,rejec2)=>{
                        var query3="DROP VIEW Fit;DROP VIEW Common;DROP View Matches"
                        mysqlClient.query(query3,[],function(err,result){
                            if(err) return reject(err)
                            if(init==null){
                                mysqlClient.query(getQuery("init"),[user],function(err,rows,result){
                                    if(err) return reject(err);
                                    init=rows;
                                    //return resolve(init)
                                })
                            }
                            if(rows.length==0) rows=init
                            else extend(true,rows[0],init[0])
                            return resolve(rows)
                        })
                    })
                    //return resolve(rows);
                })
            })
            
        })
    })
}

function algorithm(){
    var query0="CREATE VIEW Fit AS (SELECT U2.pseudo FROM (Users U1 NATURAL JOIN Criteria C) JOIN Users U2 ON U1.pseudo=? AND U2.pseudo<>U1.pseudo AND (C.gender='a' OR U2.genre=C.gender) AND TIMESTAMPDIFF(year,U2.birthday,CURDATE()) BETWEEN C.min AND C.max AND NOT EXISTS (SELECT * FROM Relationships WHERE (person1=U1.pseudo and person2=U2.pseudo) OR (person2=U1.pseudo AND person1=U2.pseudo AND status=1)));"
    var query1="CREATE VIEW Common AS (SELECT I2.pseudo as pseudo,count(*) AS common_interest FROM Interested_in I1 JOIN (Interested_in I2 NATURAL JOIN Fit F) ON I1.pseudo=? AND I1.interest_name=I2.interest_name group by I2.pseudo order by common_interest desc);"
    var query2="CREATE VIEW Matches AS (SELECT C.pseudo,common_interest,ST_Distance_Sphere(POINT(L2.lon,L2.lat),POINT(L1.lon,L1.lat))/1000 as distance FROM Location L1 JOIN (Common C NATURAL JOIN Location L2) WHERE L1.pseudo=?);"
    return query0+query1+query2
    //+query3+query4;
}

exports.profile=function(req,res){
    var what=(req.query.section)?req.query.section:"init"
    console.log("WHAT :"+what)
    var setup=(what=="init" || what=="infos")?true:false;
    if(what=="matches") return matches(req,res)
    return whatYouWant(req,res,getQuery(what),setup)
}

exports.setup=function(req,res){
    return new Promise((resolve,reject)=>{
        var query=getQuery("interests")
        mysqlClient.query(query,[req.session.user],function(err,rows,result){
            console.log("Query "+query)
            console.log(req.session.user)
            if(err) return reject(err);
            console.log("Ici: ");
            return new Promise((resolve2,reject2)=>{
                mysqlClient.query(getQuery("infos"),[req.session.user],function(err,rows2,result){
                    if(err) return reject(err);
                    if(rows.length==0) return resolve(rows2)
                    else{
                        extend(true,rows[0],rows2[0])
                        return resolve(rows)
                    }
            })
            })
            
        })
    })
}
























/*function whatYouWant(req,res,query){
    return new Promise((resolve,reject)=>{
        var user=(req.query.user_searched)?req.query.user_searched:req.session.user;
        mysqlClient.query(query,[user],function(err,rows,result){
            console.log("Query "+query)
            console.log(req.session.user)
            if(err) return reject(err);
            console.log("Ici: "+rows);
            return resolve(rows);
        })
    }).then((rows)=>{
        res.json({message:"success",result:rows})
    }).catch((error)=>{
        res.json({message:"error"})
    })
}
*/
/*exports.init=async function(req,res){
    var user=(req.query.user_searched)?req.query.user_searched:req.session.user;
    var query="SELECT pseudo,email,nom,prenom,profile_picture,cover_picture,bio FROM Users WHERE pseudo=?"
    var result=await mysqlClient.query(query,[user],function(err,rows,result){
        if(err) throw err;
        console.log("ROWS/ "+rows)
        return rows;
    })
    return result;
}*/

/*exports.init=function(req,res){
    return new Promise((resolve,reject)=>{
        var user=(req.query.user_searched)?req.query.user_searched:req.session.user;
        var query="SELECT pseudo,email,nom,prenom,profile_picture,cover_picture,bio FROM Users WHERE pseudo=?"
        mysqlClient.query(query,[user],function(err,rows,result){
            if(err) return reject(err)
            return resolve(rows)
        })
    })
}

exports.infos=function(req,res){
   return whatYouWant(req,res,"SELECT * FROM Users WHERE pseudo=?")
}*/

/*exports.infos= function(req,res){
    const result={};
    (async()=>{
        console.log(result);
        result=await whatYouWant(req,res,"SELECT * FROM Users WHERE pseudo=?")
    })()
    return result;
}*/



//Here, what I look for as well

/*exports.pictures=function(req,res){
    return whatYouWant(req,res,"SELECT url FROM Images WHERE creator=?")
}*/
/*function(req,res){
    new Promise((resolve,reject)=>{
        var query="SELECT url FROM Images WHERE creator=?";
        var user=(req.query.user_searched)?req.query.user_searched:req.session.user
        mysqlClient.query(query,[user],function(err,rows,result){
            if(err) return reject(err);
            return resolve(rows);
           
        })
    }).then((rows)=>{
        res.json({message:"success",result:rows})
    }).catch((error)=>{
        res.json({message:"error"})
    })
}*/

/*exports.interests=function(req,res){
    return whatYouWant(req,res,"SELECT interest_name FROM Interested_in WHERE pseudo=?")
}
function(req,res){
    new Promise((resolve,reject)=>{
        var query="SELECT interest_name FROM Interested_in WHERE pseudo=?";
        mysqlClient.query(query,[],function(err,rows,result){
            if(err) return reject(err);
            return resolve(rows);
            
            //return reject(new Error("This user does not exist"));
        })
    }).then((rows)=>{
        res.json({message:"success",result:rows})
    }).catch((error)=>{
        res.json({message:"error"})
    })
}*/

/*exports.friends=function(req,res){
    return whatYouWant(req,res,"SELECT person2 AS person FROM Friends WHERE person1=? UNION SELECT person1=? AS person FROM Friends WHERE person2=?")
}
function(req,res){
    new Promise((resolve,reject)=>{
        var query="SELECT person2 AS person FROM Friends WHERE person1=? UNION SELECT person1=? AS person FROM Friends WHERE person2=?";
        var user=(req.query.user_searched)?req.query.user_searched:req.session.user
        mysqlClient.query(query,[user],function(err,rows,result){
            if(err) return reject(err);
            return resolve(rows);
        })
    }).then((rows)=>{
        res.json({message:"success",result:rows})
    }).catch((error)=>{
        res.json({message:"error"})
    })
}*/

/*exports.requests=function(req,res){
    return whatYouWant(req,res,"SELECT sender as pseudo,nom,prenom,profile_picture FROM Request JOIN Users ON sender=pseudo WHERE recipient=?")
}
function(req,res){
    new Promise((resolve,reject)=>{
        var query="SELECT sender as pseudo,nom,prenom,profile_picture FROM Request JOIN Users ON sender=pseudo WHERE recipient=?";
        var user=(req.query.user_searched)?req.query.user_searched:req.session.user
        mysqlClient.query(query,[user],function(err,rows,result){
            if(err) return reject(err);
            return resolve(rows);
        })
    }).then((rows)=>{
        res.json({message:"success",result:rows})
    }).catch((error)=>{
        res.json({message:"error"})
    })
}*/




/*exports.matches=function(req,res){
    return whatYouWant(req,res,algorithm())
}
function(req,res){
    return new Promise((resolve,reject)=>{
        var query=algorithm();
        mysqlClient.query(query,[req.session.user,req.session.user],function(err,rows,fields){
            if(err) return reject(err)
            resolve(rows);
        })
    }).then((rows)=>{
        res.json({message:"success",result:rows})

    }).catch((err)=>{
        res.json({message:"error"})
    })
   
}*/
