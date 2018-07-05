var cron = require('node-cron');
var request = require('request');
var index = 0;

var job = cron.schedule('* * * * *',function(){
    if(index <= 40){
        console.log("inside cron job:",index);
        request.get("http://localhost:5000/createRandomGene");
        index++;
    }
    else{
        console.log("created 40 cues");
        process.exit();
    }
},false); 
job.start();