var mysqlClient=require('./db_connect');

exports.insertMsg=async function(params){
    try{
        return await mysqlClient.query(
            "INSERT INTO Message (sender,recipient,message) VALUES (?,?,?)",
            [params.sender,params.recipient,params.message]
        )
    }
    catch(err){
        console.log(err);
        return null;
    }
}

exports.select=function(req,res){
    //pas nécessaire de vérifier si connecté en fait
    return new Promise((resolve,reject)=>{
        var query="SELECT sender,recipient,message FROM Messages WHERE (sender=? AND recipient=?) OR (recipient=? AND sender=?) ORDER BY id ASC";
        mysqlClient.query(query,[req.session.user,req.body.rec,req.session.user,req.body.rec],
            function(err,result){
                if(err) return reject(err)
                return resolve(result)
            }
        )
        //mysqlClient.end()
        
    }).then((rows)=>{
        res.json({message:"success",content:rows}) 
    }).catch(err=>{
        console.log(err);
        res.json({message:"error"}) 
    })
    
}