-- This script was generated by a beta version of the ERD tool in pgAdmin 4.
-- Please log an issue at https://redmine.postgresql.org/projects/pgadmin4/issues/new if you find any bugs, including reproduction steps.
BEGIN;


CREATE TABLE IF NOT EXISTS public.lobby
(
    codice character varying(20) NOT NULL,
	pubblica boolean NOT NULL,
    admin_lobby character varying(30),
    data_creazione date NOT NULL DEFAULT CURRENT_DATE,
    ultima_richiesta date NOT NULL,
    id_gioco serial NOT NULL,
    PRIMARY KEY (codice)
);

CREATE TABLE IF NOT EXISTS public.partite
(
    codice character varying(20) NOT NULL,
    codice_lobby character varying(20) NOT NULL,
    giocatore_corrente character varying(30),
    vincitore character varying(30),
    info_partita json,
    PRIMARY KEY (codice)
);

CREATE TABLE IF NOT EXISTS public.giochi
(
    id serial NOT NULL,
    nome text NOT NULL,
    tipo character varying(20) NOT NULL,
    max_giocatori numeric NOT NULL,
    min_giocatori numeric NOT NULL,
    link text NOT NULL,
    attivo boolean NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.utenti
(
    username character varying(30) NOT NULL,
	nome character varying(35) NOT NULL,
	cognome character varying(35) NOT NULL,
    password text NOT NULL,
    salt text NOT NULL,
    tipo character varying(20) NOT NULL,
    PRIMARY KEY (username)
);

CREATE TABLE IF NOT EXISTS public.giocatori
(
    username character varying(30) NOT NULL,
    codice_lobby character varying(20) NOT NULL,
    ruolo character varying(20),
    PRIMARY KEY (username)
);

CREATE TABLE IF NOT EXISTS public.ospiti
(
    username character varying(30) NOT NULL,
    PRIMARY KEY (username)
);

ALTER TABLE public.partite
    ADD FOREIGN KEY (codice_lobby)
    REFERENCES public.lobby (codice)
    ON DELETE CASCADE
	ON UPDATE CASCADE
    NOT VALID;


ALTER TABLE public.lobby
    ADD FOREIGN KEY (id_gioco)
    REFERENCES public.giochi (id)
    ON DELETE CASCADE
	ON UPDATE CASCADE
    NOT VALID;


ALTER TABLE public.lobby
    ADD FOREIGN KEY (admin_lobby)
    REFERENCES public.giocatori (username)
    ON DELETE CASCADE
	ON UPDATE CASCADE
    NOT VALID;


ALTER TABLE public.giocatori
    ADD FOREIGN KEY (codice_lobby)
    REFERENCES public.lobby (codice)
    ON DELETE CASCADE
	ON UPDATE CASCADE
    NOT VALID;


ALTER TABLE public.partite
    ADD FOREIGN KEY (giocatore_corrente)
    REFERENCES public.giocatori (username)
    ON DELETE CASCADE
	ON UPDATE CASCADE
    NOT VALID;


ALTER TABLE public.partite
    ADD FOREIGN KEY (vincitore)
    REFERENCES public.giocatori (username)
    ON DELETE CASCADE
	ON UPDATE CASCADE
    NOT VALID;

END;