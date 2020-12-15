const enviar = require('./mailer');
const url = require('url');
const http = require('http');
const fs = require('fs');
const axios = require("axios");
const { v4: uuidv4 } = require('uuid');

const getIndicadores = async() => {
    const { data } = await axios.get("https://mindicador.cl/api");
    return data
}

http
    .createServer(function(req, res) {

        if (req.url.startsWith('/')) {
            res.setHeader('content-type', 'text/html')
            fs.readFile('index.html', 'utf8', (err, html) => {
                res.end(html)
            })
        }
        if (req.url.startsWith('/mailing')) {
            let { correos, asunto, contenido } = url.parse(req.url, true).query;
            getIndicadores().then((indicadores) => {
                console.log(indicadores);

                let dolar = indicadores.dolar.valor;
                let euro = indicadores.euro.valor;
                let uf = indicadores.uf.valor;
                let utm = indicadores.utm.valor;

                let template = `    
                    <p>Hola ! Los indicadores económicos de hoy son los siguientes:</p>
                    <br>
                    <p>El valor del dolar el dia de hoy es: ${dolar}</p>
                    <p>El valor del euro el dia de hoy es : ${euro}</p>
                    <p>El valor de la uf el dia de hoy es : ${uf}</p>
                     <p>El valor de la utm el dia de hoy es: ${utm}</p>
                `;

                console.log(template);
                const enviarTo = async() => {
                    try {
                        if (correos !== '' && asunto !== '' && contenido !== '') {
                            console.log('paso por aqui');
                            await enviar(correos.split(','), asunto, contenido + template);
                            res.end();
                        } else {
                            res.write('Faltan campos por llenar')
                        }
                    } catch (error) {
                        console.log(error)
                        res.end("Algo sucedio")
                    }
                }
                enviarTo();

                const uuid = uuidv4();

                fs.writeFile(`./MailingBK/${uuid}.txt`, template, 'utf8', (err) => {
                    err ? console.log("Upss, ha ocurrido un error: ", error) :
                        console.log("Todo salió bien, archivo creado con éxito");

                })
            })
        }
    }).listen(3000, () => console.log('Server on'))