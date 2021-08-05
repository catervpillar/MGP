const db = require('./database');
const utente = require('./utente');
const controller = require('./controller');

/**
 * Ritorna la lista degli Utenti che hanno tipo diverso da "ADMIN".
 * @param {*} username L'username del admin che fa la richiesta
 * @param {*} cb Callback
 * @returns il risultato della query
 */
exports.getUtenti = (username, cb) => {
    return db.pool.query('select username, nome, cognome, tipo from public.utenti where username <> $1',
        [username], (error, results) => {
            cb(error, results)
        });
}

//TODO: capire perché vuole per forza String()
exports.eliminaUtenti = (utenti, response) => {
    const users_to_delete = utenti.split(",");

    users_to_delete.forEach(username => {
        db.pool.query('delete from public.utenti where username = $1',
            [String(username)], (error, results) => {
                if (error) return response.status(400).send('Errore nella query');
            });
    });
    return response.status(200).send({ 'esito': "1" });
}

//TODO: fare commento
exports.modificaUtente = (request, response) => {
    controller.controllaString(request.params.username, "L'username non è valido");
    controller.controllaDatiAccount(request.body);

    utente.cercaUtenteByUsername(request.params.username, (err, results) => {
        if (err) return response.status(500).send('Server Error!');
        if (controller.controllaRisultatoQuery(results)) return response.status(404).send('Utente non trovato!');

        utente.cercaUtenteByUsername(request.body.new_username, (err, results) => {
            if (err) return response.status(500).send('Server Error!');
            if (!controller.controllaRisultatoQuery(results)) return response.status(404).send("L'username inserito è già stato usato!");

            db.pool.query('UPDATE public.utenti SET username = $1, nome = $2, cognome = $3, tipo = $4 WHERE username = $5',
                [request.body.new_username, request.body.new_nome, request.body.new_cognome, request.body.new_tipo, request.params.username], (error, results) => {
                    if (error) return response.status(400).send('Errore dati query');
                    return response.status(200).send({ 'esito': "1" });
                })
        });
    });
}