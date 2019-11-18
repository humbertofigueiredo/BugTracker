const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const { promisify } = require('util')
const sgMail = require('@sendgrid/mail')

const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

// Configuracoes
const docId = '1EDbm9iUKcTS-E-zhMnoHud8e3Qg3IyFOEoSdxRLsjTQ'
const worksheetIndex = 0
const sendGridKey = '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'

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))
//console.log(path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/',(request, response) => {
    response.render('Home')
})


app.post('/', async (request, response) => {
    try{
        const doc = new GoogleSpreadsheet(docId)
        await promisify(doc.useServiceAccountAuth) (credentials)
        const info = await promisify(doc.getInfo) ()
        const worksheet = info.worksheets[worksheetIndex]
        await promisify(worksheet.addRow) ({ 
            name: request.body.name, 
            email: request.body.email, 
            userAgent: request.body.userAgent,
            userDate: request.body.userDate,
            issueType: request.body.issueType,
            source: request.query.source || 'direct'
        }) 

        // se for critico
        if (request.body.issueType === 'CRITICAL') {
            sgMail.setApiKey(sendGridKey)
            const msg = {
            to: 'hunofig@gmail.com',
            from: 'hunofig@gmail.com',
            subject: 'BUG Crítico reportado',
            text: `O usuário ${request.body.name} reportou um problema`,
            html: `O usuário ${request.body.name} reportou um problema`
            }
            await sgMail.send(msg)   
        }
        response.render('sucesso')
    }catch(err){
        response.send('Erro ao enviar formulário.')
        console.log(err)
    }
})

                                                                                                          


app.listen(3000, (err) => {
    if (err) {
        console.log('Ocorreu um ERRO', err)
    } else {
        console.log('BugTracker rodando na porta http://localhost:3000')
    }
})





//app.get('/',(request, response) => {
//    response.send('Olá fullstack lab')
//})
//app.post('/', (request, response) => {
//    response.send(request.body)
//})
