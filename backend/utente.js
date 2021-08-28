const controller = require('./controller');
const db = require('./database');
const bcrypt = require('bcrypt');

//TODO
const SECRET_PWD = "secret";
const SECRET_KEY = "secret_jwt";

//TODO da commentare
exports.cercaUtenteByUsername = (username, cb) => {
    controller.controllaNotNull(username, "L'username non deve essere vuoto!");
    return db.pool.query('SELECT * FROM public.utenti WHERE username = $1', [username], (error, results) => {
        cb(error, results)
    });
}

//TODO da commentare
exports.cercaOspiteByUsername = (username, cb) => {
    controller.controllaNotNull(username, "L'username non deve essere vuoto!");
    return db.pool.query('SELECT * FROM public.ospiti WHERE username = $1', [username], (error, results) => {
        cb(error, results)
    });
}

//TODO
exports.creaUtente = (username, nome, cognome, password, response) => {
    //TODO: metterli tutti in un unico metodo
    controller.controllaString(username, "Il campo 'Username' non deve essere vuoto!");
    controller.controllaString(nome, "Il campo 'Nome' non deve essere vuoto!");
    controller.controllaString(cognome, "Il campo 'Cognome' non deve essere vuoto!");
    controller.controllaPassword(password);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password + SECRET_PWD, salt);

    db.pool.query('INSERT INTO public.utenti (username, nome, cognome, password, salt, tipo) VALUES ($1, $2, $3, $4, $5, $6)',
        [username, nome, cognome, hash, salt, "GIOCATORE"], (error, results) => {
            if (error) return response.status(400).send("NON E' STATO POSSIBILE CREARE L'UTENTE!");
            return response.status(200).send({ 'esito': "1" });
        })
}

//TODO
exports.creaOspite = (username, cb) => {
    controller.controllaNotNull(username, "L'username non deve essere vuoto!");

    db.pool.query('INSERT INTO public.ospiti (username) VALUES ($1)',
        [username], (error, results) => {
            cb(error, results)
        })
}

//TODO
exports.modificaNomeCognome = (username, nome, cognome, response) => {
    controller.controllaString(nome, "Il nome non è valido!");
    controller.controllaString(cognome, "il cognome non è valido!");

    this.cercaUtenteByUsername(username, (err, results) => {
        if (err) return response.status(500).send('Server Error!');
        if (controller.controllaRisultatoQuery(results)) return response.status(404).send('Utente non trovato!');
        db.pool.query('UPDATE public.utenti SET nome = $1, cognome = $2 WHERE username = $3',
            [nome, cognome, username], (error, results) => {
                if (error) {
                    console.log(error);
                    return response.status(400).send('Errore dati query');
                }
                return response.status(200).send({ 'esito': "1" });
            })
    });
}

exports.modificaUsername = (oldUsername, newUsername, response, cb) => {
    controller.controllaString(newUsername, "Il nuovo username non è valido!");

    this.cercaUtenteByUsername(oldUsername, (err, results) => {
        if (err) return response.status(500).send('Server Error!');
        if (controller.controllaRisultatoQuery(results)) return response.status(404).send('Utente non trovato!');

        this.cercaUtenteByUsername(newUsername, (err, results) => {
            if (!controller.controllaRisultatoQuery(results)) return response.status(404).send("Il nuovo username è già utilizzato!");
            db.pool.query('UPDATE public.utenti SET username = $1 WHERE username = $2',
                [newUsername, oldUsername], (error, results) => {
                    cb(error, results);
                })
        })
    });
}

exports.cambiaPassword = (newPassword, oldPassword, response, username) => {
    try {
        controller.controllaPassword(newPassword);
    } catch (error) { return response.status(401).send('La password non è corretta'); }

    this.cercaUtenteByUsername(username, (err, results) => {
        if (err) return response.status(500).send('Server Error!');
        if (controller.controllaRisultatoQuery(results))
            return response.status(404).send('Utente non trovato!');

        const risultati = JSON.parse(JSON.stringify(results.rows));
        if (risultati.length == 0)
            return response.status(404).send('Utente non trovato!');

        const data = risultati[0];
        const hash = bcrypt.hashSync(oldPassword + SECRET_PWD, data.salt);

        if (hash == data.password) {
            const newHash = bcrypt.hashSync(newPassword + SECRET_PWD, data.salt);

            db.pool.query('UPDATE public.utenti SET password = $1 WHERE username = $2',
                [newHash, username], (error, results) => {
                    if (error) return response.status(400).send(db.ERRORE_DATI_QUERY);
                    return response.status(200).send({ 'esito': "1" });
                });
        } else return response.status(401).send('La vecchia password non è corretta');
    });
}

exports.getUserInfo = (username, cb) => {
    return db.pool.query('select username, nome, cognome from public.utenti where username=$1',
        [username], (error, results) => {
            cb(error, results)
        });
}