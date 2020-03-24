var FtpDeploy = require('ftp-deploy');
var ftpDeploy = new FtpDeploy();

require('dotenv').config();

console.log('\x1b[5m\x1b[33m ⬆️ Avvio upload via ftp al server remoto');
console.log('-----------------------------------------');

let config = {
    user: process.env.FTP_USER,                   // NOTE that this was username in 1.x
    password: process.env.FTP_PASSWORD,           // optional, prompted if none given
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    localRoot: __dirname + '/../dist',
    remoteRoot: process.env.FTP_REMOTE_DIR,
    include: ['*', '**/*'],      // this would upload everything except dot files
    deleteRemote: process.env.FTP_CLEAN_BEFORE,              // delete ALL existing files at destination before uploading, if true
    forcePasv: process.env.FTP_FORCE_PASV                 // Passive mode is forced (EPSV command is not sent)
};

let envars = [
    'FTP_USER',
    'FTP_PASSWORD',
    'FTP_HOST',
    'FTP_PORT',
    'FTP_CLEAN_BEFORE',
    'FTP_FORCE_PASV'
];

process.on('exit', function(code) {
    console.log('\x1b[37m -----------------------------------------');
    console.log('\x1b[37m 👾 Hai usato le funzionalità di upload di @brainrepo (Mauro Murru) - murru7@gmail.com');
    console.log('\x1b[37m -----------------------------------------');
});

envars.forEach((v) => {
    if(!process.env[v]) {
        console.log('\x1b[31m 🚨 Errore: non hai correttamente impostato le variabili d\'ambiente '+ v +'. Leggi la documentazione');
        process.exit();
    }
});


ftpDeploy.deploy(config)
    .then(res => {
        res.flat().map(i => console.log('\x1b[32m ✅ ', i))
    })
    .catch(err => console.log('\x1b[31m 🚨 Errore:', err.message));
