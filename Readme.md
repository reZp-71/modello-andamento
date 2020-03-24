# Lab24 Basekit

Questa repository contiene il setup iniziale per i progetti 24 Labs

## Funzionalità

- Conversione con Babel, pacchettizzazione, e compressione del file js
- Compila scss estrazione immagini e font da css e posizionamento nelle rispettive sottocartelle assets
- Estrazione immagini da html
- Compressione immagini
- Upload ftp

## Installazione

Per l'installazione di questa applicazione è necessario scaricare tutte le dipendenza.
Lo si può fare lanciando il comando

    npm install

In alcune versioni di Mac Os potrebbero verificarsi errori in fase di esecuzione dovuti alla mancanza della libreria libpng
usata dallo script per comprimere le immagini png.

Se dovessi avere l'errore: `Module build failed: Error: dyld: Library not loaded: /usr/local/opt/libpng/lib/libpng16.16.dylib`
installa con [brew](https://brew.sh/index_it) la librerie libpng lanciando questo comando.

    brew install libpng

## Fase di sviluppo

Durante la fase di sviluppo la cartella di riferimento è la cartella src. Questa contiene:

1. index.html
2. index.js
3. style.scss
4. fonts
5. images

### 1. index.html

E' il template html della vostra pagina. Non è necessario includere nessun javascript o css, i file di stile e di scripting verranno iniettati in fase di building in modo automatico.
Sarà però possibile modificare a piacimento il vostro template html

### 2. index.js

Questo file è l'entry point dell'applicazione.
Qui è possibile includere altri moduli javascript, file scss o css che verranno automaticamente esportati,
compressi e verrà inserito il loro *link* nella pagina html.

### 3. style.scss

File di stile che per funzionare deve essere incluso
nel file index.js

    import './style.scss';

### 4. fonts/

Inserisci qui i font

### 5. images/

Inserisci qui le immagini

## Preview in fase di sviluppo

Lanciando il comando che segue è possibile avviare la versione dev dell'app che stai sviluppando con l'autorefresh quando si aggiorna il file js, html o scss

    npm run dev

## Building del progetto

Lanciando il comando npm run build la cartella `dist` verrà creata e al suo interno
verranno posizionati i file js, css, i font e le immagini

    npm run build

## Uploading del progetto

Una volta configurate le variabili di ambiente è possibile fare l'upload ftp del progetto direttamente
lanciando il comando di `upload`.

### Configurazione delle variabili d'ambiente

1. *Meno sicuro* Le variabili d'ambiente possono essere passate direttamente su un file .env. Se vuoi usare questa tecnica rinomina
il file da `.env.dist` a `.env` e modifica i parametri di connessione

2. *Più sicuro* Esporta una per una le variabili d'ambiente lanciando il comando

    - `export FTP_USER=ftp@testftp1`
    - `export FTP_PASSWORD=changeme`
    - `export FTP_HOST=ftp.host.org`
    - `export FTP_PORT=21`
    - `export FTP_REMOTE_DIR=/test`
    - `export FTP_CLEAN_BEFORE=false`
    - `export FTP_FORCE_PASV=true`

### Uploading via ftp

Una volta configurate le variabili d'ambiente puoi caricare con ftp la tua cartella dist direttamente lanciando il comando

    npm run deploy

