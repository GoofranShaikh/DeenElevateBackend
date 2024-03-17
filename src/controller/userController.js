const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const productValidator = require('../../src/validations/productValidation')
// const dotenv = require('dotenv');
// dotenv.config();
const sectrateKey = 'abcd1234'

const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email provider (e.g., 'gmail', 'outlook')
    auth: {
        user: 'goofranshaikh98@gmail.com',
        pass: 'zhom cggl qfol mkeo'
    }
});



const createUser = async (req, res) => {
    try {
        // Create the customer using create method
        let user = await prisma.customer.findFirst({
            where: {
                email: req.body.email,
            },
        })
        if (!user) {
            const newCustomer = await prisma.customer.create({
                data: req.body,
            });
            user= newCustomer

        }
        // else{
        const otp = await generateOTP(user, req);
        await sendVerificationEmail(req.body.email, otp,res)
        res.status(200).json({ user ,message: 'OTP Sent Successfully' })
        // }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const Login = async (req, res) => {
    const { customer_id, otp, email } = req.body;
    try {
        let user = await prisma.customer.findFirst({
            where: {
                customer_id,
            },
        })
        if (user && user.otp) {
            if (user.otp != otp) { return res.status(200).json({ message: 'Invalid OTP' }) };
            let validityCheck = timeConversion(user.updated_at)
            console.log(validityCheck, 'validityCheck')
            if (!validityCheck) { return res.status(200).json({ message: 'OTP Expired' }) };
            const payload = {
                userId: user.customer_id,
                email: user.email
            }
            // Options for the JWT
            const options = {
                expiresIn: '1h', // Token expiration time
            };

            let token = jwt.sign(payload, sectrateKey, options)
            res.status(200).json({ ...user, token })



        }
        else {
            res.status(500).send({ "message": "Something went wrong" })
        }
    }
    catch (error) {
        res.status(500).send(error.message)
    }
}


async function generateOTP(user, req) {
    // Generate a random number between 100000 and 999999 (inclusive)
    const randomNum = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    await prisma.customer.update({
        where: {
            customer_id: user?.customer_id
        },
        data: {
            otp: randomNum,
            updated_at: new Date()
        },
    })
    return randomNum

    // Convert the random number to a string
    // return randomNum.toString();

}

async function sendVerificationEmail(email, otp,res) {
    console.log('first')
    const mailOptions = {
        from: 'goofranshaikh98@gmail.com',
        to: email,
        subject: 'Verify Your Email',
        text: `Your OTP for verification is: ${otp}`
    };

    try {
        await transporter.sendMail(mailOptions);
    
        console.log('Email sent successfully');
        console.log('try')
    } catch (error) {
        console.log('err')

        console.error('Error sending email:', error);
    }
}

function timeConversion(time) {
    const utcString = time;
    const utcDateObj = new Date(utcString);
    let currentLocalDateObj = new Date()
    let timeDifference = currentLocalDateObj.getTime() - utcDateObj.getTime();
    // Convert milliseconds to minutes (divide by 1000 * 60)
    const differenceInMinutes = Math.abs(timeDifference) / (1000 * 60);
    return differenceInMinutes < 5;
}

module.exports = { createUser, Login }