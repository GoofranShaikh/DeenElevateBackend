const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const productValidator = require('../../src/validations/productValidation')
// const dotenv = require('dotenv');
// dotenv.config();
const sectrateKey ='abcd1234'

const createUser = async(req,res) =>{
    try{
        // Create the customer using create method
        const newCustomer = await prisma.customer.create({
         data: req.body,
        });
        res.status(200).json({newCustomer})
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
}

const Login=async(req,res)=>{
    try{      
        let user =await prisma.customer.findFirst({
            where: {
                  email: req.body.email,
                },
            })
            console.log(user,'user')
        if(user){
            console.log(user,'user')
            const payload={
                userId:user.customer_id,
                email:user.email
            }
        // Options for the JWT
            const options = {
                expiresIn: '1h', // Token expiration time
            };

            let token = jwt.sign(payload,sectrateKey,options)
            res.status(200).json({...user,token})

        }
        else{
            console.log('no content')
            res.status(204).json({message:'No Content'})
        }
    }
    catch(error){
        res.status(500).send(error.message)
    }
}

module.exports={createUser,Login}