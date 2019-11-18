const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const { promisify } = require('util')

const addRowToSheet = async() => {
    const doc = new GoogleSpreadsheet('1EDbm9iUKcTS-E-zhMnoHud8e3Qg3IyFOEoSdxRLsjTQ')
    await promisify(doc.useServiceAccountAuth) (credentials)
    console.log('Planilha aberta')

    const info = await promisify(doc.getInfo) ()
    const worksheet = info.worksheets[0]
    await promisify(worksheet.addRow) ({ name: 'Humberto', email: 'teste' })
}

addRowToSheet()


/*
const doc = new GoogleSpreadsheet('1EDbm9iUKcTS-E-zhMnoHud8e3Qg3IyFOEoSdxRLsjTQ')
doc.useServiceAccountAuth(credentials, (err) => {
    if (err) {
        console.log('Não foi possível abrir a planilha!')
    } else {
        console.log('Planilha aberta')
        doc.getInfo((err, info) => {
            console.log(info)
            const worksheet = info.worksheets[0]
            worksheet.addRow({ name: 'Humberto', email: 'Teste' }, err => {
            console.log('Linha inserida!')
            })
        })
    }
})
*/