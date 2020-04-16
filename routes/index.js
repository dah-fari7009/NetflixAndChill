var express=require('express');
var router=express.Router();
var form=require('../controllers/form');
var user=require('../controllers/search')
var action=require('../controllers/user_action')
var bcrypt=require('bcrypt')
const saltRounds=10;
var sess;

function authorized_pages(sess){
    if(sess) return ["friends","setup","profile","logout","favicon.ico","error"];
    return ["login","subscribe","favicon.ico","error"];
}

router.get("/",function(req,res){
    /*bcrypt.compare("password","$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi",function(err,r){
        console.log("ici")
        if(r)  res.send("yeeeeeww");
        else{
            bcrypt.genSalt(saltRounds,function(err,salt){
                bcrypt.hash("password",salt,function(err,hash){
                    res.send(hash)
                    if(err) throw err;
                })
            })
        }
        //return reject(new Error("Password and username do not match, have you <a href='forgotten'>forgotten</a> your password ?"))
    })*/
    res.render('index',{page:'site.ejs',username:req.session.user,data:null,dis:null,search:null});
});

router.get("/favicon.ico",function(req,res){
    res.status(204).send("");
})

//Fonction de déconnexion
router.get("/logout",function(req,res,next){
    if(req.session){
        req.session.destroy(function(err){
            if(err) return next(err);
            return res.redirect('/');
        })
        
    }
    else res.redirect("/")
})


/* Les différents éléments du profil d'un utilisateur*/
router.get("/profile",function(req,res){
    console.log("Je vais voir mon profil")
    if(!req.session.user && !req.query.user_searched) res.redirect("/")
    else{
        user.profile(req,res).
        then((rows)=>{
            console.log("Wesh, affiche toi ")
            console.log(rows);
            res.render('index',{page:'user_pf.ejs',username:req.session.user,data:rows,dis:req.query.section,search:req.query.user_searched})
        })
        .catch((err)=>{
            console.log(err)
            res.redirect("/error")
        })
    }
})

router.get("/setup",function(req,res){
    console.log("c'est parti !")
    if(!req.session.user || !req.session.firstVisit) res.redirect("/")
    else{
        user.setup(req,res).
        then((rows)=>{
            console.log(rows)
            res.render('index',{page:'setup.ejs',username:req.session.user,data:rows,dis:null,search:null})
        })
        .catch((err)=>{
            console.log(err)
            res.redirect("/error");
        })
    }

})


router.get('/:uri',function(req,res){
   sess=req.session;
   console.log("User: "+req.session.user);
   var authorized=authorized_pages(sess.user)
    if(authorized.indexOf(req.params.uri)!=-1){
        console.log("je suis ici")
        res.render('index',{page: req.params.uri,username: sess.user,data:null,dis:null,search:null});
    }
    else res.redirect('/')//for now
});

router.post("/visit",function(req,res){
    req.session.firstVisit=false;
    res.json({status:"success"})
})

router.post('/subscribe',form.subscription);

router.post('/login',form.login)

router.post('/modify',form.modify)

router.post('/criteria',form.criteria)

router.post('/upload',action.get_url);

router.post('/store',action.add_picture)

router.post('/change_pp',action.change_pp)

router.post('/change_cp',action.change_cp)

router.post('/caption',action.change_caption);

router.post('/remove_p',action.remove_picture)

router.post('/remove_f',action.remove_friend)

router.post('/remove_i',action.remove_interest)

router.post('/request',action.handle_request)

router.post('/reject/requests',action.reject_request)

router.post('/reject/matches',action.reject_suggestion)

router.post('/interested',action.add_interest)

router.post('/search',action.search);

router.post('/searchi',action.search_i)

//router.post("/load_conv",chat.select)

module.exports=router;

