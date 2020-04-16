function uploadfile(event,whatToDoNext){
        event.preventDefault()
        var data=new FormData()
        console.log($(event.target).get(0))
        console.log(($(event.target).find("input[type=file]"))[0].files[0])
        var file=($(event.target).find("input[type=file]"))[0].files[0];
        /*for(var i=0;i<files.length;i++){
            var file=files[i]*/
            console.log(file);
            data.append('imgUploader',file,file.name)
        //}
        console.log(data)
        $.ajax({
            method:"POST",
            url:$(event.target).attr("action"),
            data:data,
            processData:false,
            contentType:false,
            xhr:function(){
                var xhr=new XMLHttpRequest();
                /* xhr.upload.addEventListener('progress',function(event){
                    var progressBar=$('.progress-bar')
                    if(event.lengthComputable){
                        var percent=(event.loaded/event.total)*100
                        progressBar.width(percent+'%')
                        if(percent==100) 
                            progressBar.removeClass('active')
                    }
                })*/
                return xhr
            }
        }).done(function(data){
            console.log(data);
            if(data){
                if(data.message && data.message=="error"){
                    alert("Oups, looks like there was some kind of issue on our side. Please try again later")
                    //window.location.reload()
                }
                else if(data.message!="no-file"){
                    whatToDoNext(data.message);
                }
            } 
        })
    
    }

 $(document).ready(function(){

    function required(fields){//Checks whether every field was filled
        var correct=true;
        fields.each(function (index){
            var field=$(this);
            console.log(field.val())
            if($.trim(field.val())==""){
                field.css({
                    borderColor:'red',
                    color:'black',
                });
                
                var errfield=$("#err"+field.attr("name"));
                errfield.html("This field is required");
                errfield.css({
                    display:"inline",
                })
                correct=false;
            }
            else{
                field.css({
                    borderColor:'transparent',
                    borderRadius:'12%'
                });
            }
            console.log(field.val())
        });
        return correct;
    }

    $("form").not("[enctype='multipart/form-data']").submit(function (event){
        $(".err").hide();
        event.preventDefault();
        console.log("Je suis dans le formulaire")
        console.log($(event.target).find("input").not(":button,:submit,:reset").length);
        var okay=required($(event.target).find("input").not(":button,:submit,:reset"));
        if(okay){
           var donnees=$(event.target).serialize();
           console.log(donnees);
           $.ajax({
               method:'POST',
               url:$(event.target).attr("action"),
               data:donnees})
               .done(function (data){
                   if(data && data.status=='error'){
                    console.log("There seems to be some kind of issue"+data);
                    $.each(data.message,function (index,value){
                        console.log($(this));
                        var field=$(event.target).find("[name='"+value.param+"']");
                        console.log(field.val());
                        field.css({
                            borderColor:'red',
                            color:'black',
                        })
                        var errfield=$("#err"+value.param);
                        if(errfield){
                            errfield.html(value.msg);
                        //Show puts display block
                        errfield.css({
                            display:"inline",
                        })
                        console.log(errfield.parent());
                    }
                });
                }
                else if(data.message=="error"){
                    alert("Oups, looks like there is some kind of issue on our side. Please, try again later")
                    window.location.reload();
                }
                else window.location.replace(data.message);
            })
        }
    } 
    );

        $("#search-result").on("click","#search-result a",function(req,res){
            console.log($(event.target).attr("href"))
            window.location.replace($(event.target).attr("href"))
        })
        
        $("#search").on({
            keyup:function(event){
            if($("#search").val()){
                console.log("yasss")
                $.ajax({
                    method:"post",
                    url:"/search",
                    data:$(event.target).serialize()
                }).done(function(data){
                    if(data && data.content){
                        console.log("Je suis ici")
                            console.log(data.content)
                            $("#search-result").empty();
                            //here remove all the previous searches
                        $.each(data.content,function(index,value){
                            $("#search-result").append("<a href='/profile?user_searched="+value.pseudo+"' class='link'>"+((value.prenom)?value.prenom:"")+" "+((value.nom)?value.nom:"")+" ("+value.pseudo+")</a>");
                        })
                            $("#search-result").show();
                        
                        console.log($("#search-result").html())
                        //data:table de pseudo ou noms et prénoms, maybe tableau d'objets json resultats de la requete
                    }
                    //add alert here
                    else window.location.reload()
                })
            }
            else{
                console.log("noooo")
                $("#search-result").empty();
            } 
        },
        focusout:function(){
            window.setTimeout(function(){
                $("#search-result").hide();
            },100)  
        },
        focusin:function(){
            $("#search-result").show();
        }
    
        })

    
            
      


    });