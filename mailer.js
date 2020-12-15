const nodemailer = require('nodemailer')

const enviar = async(to, subject, html) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nodemailerADL@gmail.com',
            pass: 'desafiolatam',
        },
    })

    let mailOptions = {
        from: 'nodemailerADL@gmail.com',
        to,
        subject,
        html
    }

    const enviarMensaje = await transporter.sendMail(mailOptions);
    return enviarMensaje;


    /* , (err, data) => {
        if (err) console.log(err);
        if (data) console.log(data);
    }) */

    /*if (error){
        console.log(error);
        res.send(500, err.message);
    } else {
        console.log("Email sent");
        res.status(200).jsonp(req.body);
    }*/
}


// Paso 2
module.exports = enviar;