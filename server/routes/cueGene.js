const logger = require('../utils/logger').logger;
import { cueGene } from '../services/cueGeneService';

const createGene = async(req,res,next) => {
    try{
        var gene = req.body.gene; 
        let result = await cueGene(gene);
    }
    catch(err){
        logger.error(err);
    }
}

module.exports = function(router){
    router.post('/createGene',
        (req,res,next) => {
            next();            
        },
        createGene
    );
}