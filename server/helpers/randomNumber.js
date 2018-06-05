var rn = require('random-number');
const logger = require('../utils/logger').logger;
const config = require('config');
var hexToDec = require('hex-to-dec');

function randomNumberHex(minNum,maxNum,value){
    var ranGen = rn.generator({
        min:  minNum,
        max:  maxNum,
        integer: true
    });
    var temp = ranGen();
    var ran = temp.toString(16).toUpperCase();
    if(ran.length < value){
        var diff =  value - ran.length;
        for(var i = 0; i < diff; i++)
        {
            ran = "0" + ran;
        } 
    }
    return ran;
}

function mixGene(num1,num2,num3){
   let number = randomNumber();
   if(number <= 33){
        return num1;
   }
   else if(number > 33 && number <= 66){
        return num2;
   }
   else{
        return num3;
   }
}

function mixGenerationGene(num1,num2,num3,multiple1,multiple2,multiple3){
  num1 = hexToDec(num1);
  num2 = hexToDec(num2);
  num3 = hexToDec(num3);
  multiple1 = hexToDec(multiple1);
  multiple2 = hexToDec(multiple2);
  multiple3 = hexToDec(multiple3);
  let num5 = 50;
  let num6;
  let minNum = Math.min(num1,num2,num3);
  let maxNum = Math.max(num1,num2,num3);
  if(minNum != 0){
    minNum = minNum - 1;
  }
  if(maxNum != 10)
  {
    maxNum = maxNum + 1;
  }
  while(minNum <= maxNum){
    let num4 = randomNumber();
    if(maxNum == num1)
    {
        if(num4 < (num5+(multiple1*4))){
            num6 = maxNum;
            break;
        }
    }
    else if(maxNum == num2){
        if(num4 < (num5+(multiple2*4))){
            num6 = maxNum;
            break;
        }
    }
    else if(maxNum == num3){
        if(num4 < (num5+(multiple3*4))){
            num6 = maxNum;
            break;
        }
    }
    else{
        if(num4 < num5){
            num6 = maxNum;
            break;
        }
    }
    console.log("num5",num5);
    console.log("maxNum",maxNum);
    num5 = num5 - 5; 
    maxNum--;
  }
  if(num6 == undefined){
      num6 = maxNum;
  }
  let num7 = num6.toString(16).toUpperCase();
  return num7;
}

function randomNumber(){
    var ranGen = rn.generator({
        min:  1,
        max:  100,
        integer: true
    });

    return ranGen();
}

const getRandom = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export {
    randomNumberHex,
    mixGene,
    mixGenerationGene,
    randomNumber,
    getRandom
}