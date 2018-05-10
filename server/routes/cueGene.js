const logger = require('../utils/logger').logger;
// import { cueGene,cueRanGene } from '../services/cueGeneService';
var Gene = require('../services/Gene');
var gene = new Gene();

const createGene = async(req,res,next) => {
    try{
        var userGene = req.body.gen; 
        logger.info("Generation of gene",userGene);
        let result = gene.cueGene(userGene);
        return res.status(200).send({
            status:"success",
            code:"200",
            message:"Success",
            data:result
        });
    }
    catch(err){
        logger.error(err);
        return res.status(500).send({
            status:"error",
            code:"500",
            message:"Failure",
        });
    }
}

const createRandomGene = async(req,res,next) => {
    try{
        logger.info("Generation of random gene");
        let result = gene.cueRandomGene();
        return res.status(200).send({
            status:"success",
            code:"200",
            message:"Success",
            data:result
        });
    }
    catch(err){
        logger.error(err);
        return res.status(500).send({
            status:"error",
            code:"500",
            message:"Failure",
        });
    }
}

const geneRemanufacture = async(req,res,next) => {
    try{
        let gen1 = req.body.gene1;
        let gen2 = req.body.gene2;
        let gen3 = req.body.gene3;
        logger.info("Remanufacturing of genes");
        logger.info("gene1",gen1);
        logger.info("gene2",gen2);
        logger.info("gene3",gen3);
        let result = gene.reManufacture(gen1,gen2,gen3);
        return res.status(200).send({
            status:"success",
            code:"200",
            data:result
        });
    }
    catch(err){
        logger.error("Error in remanufacturing",err);
        return res.status(500).send({
            status:"error",
            code:"500",
            message:"Failure",
        });
    }
}

module.exports = function(router){
    router.post('/createGene',
        (req,res,next) => {
            next();            
        },
        createGene
    );

    router.get('/createRandomGene',
        (req,res,next) => {
            next();            
        },
        createRandomGene
    );

    router.post('/remanufacture',
        (req,res,next) => {
            next();
        },
        geneRemanufacture
    );
}