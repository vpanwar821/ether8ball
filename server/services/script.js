var request = require('request');
for(i=1;i<=30;i++){
    console.log("inside script");
    let number = i.toString(16);
    if(number.length<=1){
        number = "0"+number;
    }
    
    let formdata = {
        family: "handcrafted",
        sequence:"8"+number,
        name:"bumper"+number
      };
    require('request').post({
        uri:"http://localhost:5000/createFamily",
        headers:{'content-type': 'application/x-www-form-urlencoded'},
        body:require('querystring').stringify(formdata)
        },function(err,res,body){
            console.log(body);
            console.log(res);
    });
}

