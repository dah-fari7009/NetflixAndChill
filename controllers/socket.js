class Service{
    constructor(){
        this.socket=null;
    }

    connect(user){

    }

    scrollToBottom(){
        const messageThread=document.querySelector(".message-thread")
        setTimeout(()=>{
            messageThread.scrollTop=messageThread.scrollHeight+500;
        },10)
    }

    getMessages(userId,friendId){
        return new Promise((resolve,reject)=>{
        
        })
    }
}

