const nodemailer = require('nodemailer')

const sendEmail = async (userEmail, productArray) => {
    const transpoter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS

        }
    })
    const productDetail = productArray.map((product, index) => {
        `${index + 1}.Name : ${product.name}.Price: ${product.price}`
    })

    const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: "Your Order Details",
        text: `Thanks for Your purchase! \n\n Here Is Your Product Details ${productDetail}`
    }
    try {
        await transpoter.sendMail(mailOptions)
    }
    catch (e) {
        console.log(e);

    }
}

module.exports = sendEmail