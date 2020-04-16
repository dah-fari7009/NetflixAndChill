var mysql=require('mysql');
var mysqlClient=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"7009",
    database:"netflix",
    multipleStatements: true
});
mysqlClient.connect(function (err){
    if(err) console.log(err)
    //res.render("error");
    else{
        console.log("Connected !");
  }
});

module.exports=mysqlClient;
