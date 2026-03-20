--
-- PostgreSQL database dump
--
-- Dumped from database version 17.6 (Debian 17.6-2.pgdg12+1)
-- Dumped by pg_dump version 17.7 (Ubuntu 17.7-3.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: titulos_db; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE titulos_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF8';

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: titulos_db; Type: DATABASE PROPERTIES; Schema: -; Owner: -
--

ALTER DATABASE titulos_db SET "TimeZone" TO 'utc';

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: classif_votos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.classif_votos (
    voto_id integer NOT NULL,
    obra_id integer NOT NULL,
    classif_escolhida character varying(20) NOT NULL,
    data_votacao timestamp with time zone
);


--
-- Name: classif_votos_voto_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.classif_votos_voto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: classif_votos_voto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.classif_votos_voto_id_seq OWNED BY public.classif_votos.voto_id;


--
-- Name: filmes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.filmes (
    id integer NOT NULL,
    nome character varying(255) NOT NULL,
    ano integer,
    classificacao character varying(20),
    descritores text,
    sinopse text,
    capa_link text
);


--
-- Name: filmes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.filmes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: filmes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.filmes_id_seq OWNED BY public.filmes.id;


--
-- Name: imagem_classificacao; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.imagem_classificacao (
    valor character varying(20) NOT NULL,
    imagem_url text NOT NULL
);


--
-- Name: classif_votos voto_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classif_votos ALTER COLUMN voto_id SET DEFAULT nextval('public.classif_votos_voto_id_seq'::regclass);


--
-- Name: filmes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.filmes ALTER COLUMN id SET DEFAULT nextval('public.filmes_id_seq'::regclass);


--
-- Data for Name: classif_votos; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.classif_votos VALUES (1, 2, '0', NULL);
INSERT INTO public.classif_votos VALUES (2, 2, '0', NULL);
INSERT INTO public.classif_votos VALUES (3, 7, '12', NULL);
INSERT INTO public.classif_votos VALUES (4, 1, '0', NULL);
INSERT INTO public.classif_votos VALUES (5, 1, '0', NULL);


--
-- Data for Name: filmes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.filmes VALUES (3, 'Coraline e o Mundo Secreto', 2009, '10', 'linguagem imprópria, violência', 'Coraline descobre uma porta para um mundo alternativo onde tudo parece perfeito, pais afetuosos e desejos realizados. Porém todos têm botões nos olhos, e logo percebe que essa realidade paralela esconde intenções sombrias para mantê-la presa.', 'https://res.cloudinary.com/dhje6cjw0/image/upload/v1763331049/Coraline_e_o_Mundo_Secreto_iol8ao.png');
INSERT INTO public.filmes VALUES (4, 'Harry Potter e o Cálice de Fogo', 2005, '12', 'violência', 'Harry retorna para seu quarto ano na Escola de Magia e Bruxaria de Hogwarts, junto com os seus amigos Ron e Hermione. Desta vez, acontece um torneio entre as três maiores escola de magia, com um participante selecionado de cada escola, pelo Cálice de Fogo. O nome de Harry aparece, mesmo não tendo se inscrito, e ele precisa competir.', 'https://res.cloudinary.com/dhje6cjw0/image/upload/v1763331046/Harry_Potter_e_o_C%C3%A1lice_de_Fogo_avegny.png');
INSERT INTO public.filmes VALUES (5, 'Jogos Vorazes - A Cantiga dos Pássaros e das Serpentes', 2023, '14', 'drogas, violência', 'Anos antes de se tornar o presidente tirânico de Panem, Coriolanus Snow, de 18 anos, vê uma chance de mudar sua sorte quando se torna o mentor de Lucy Gray Baird, o tributo feminino do Distrito 12. ', 'https://res.cloudinary.com/dhje6cjw0/image/upload/v1763331047/Jogos_Vorazes__A_Cantiga_dos_P%C3%A1ssaros_e_das_Serpentes_r8fgqd.png');
INSERT INTO public.filmes VALUES (6, 'Invocação do Mal - O Último Ritual', 2025, '16', 'drogas lícitas, medo, violência', 'Os investigadores paranormais Ed e Lorraine Warren tentam banir um demônio da casa de uma família', 'https://res.cloudinary.com/dhje6cjw0/image/upload/v1763330889/Invoca%C3%A7%C3%A3o_Do_Mal_4__O_%C3%9Altimo_Ritual_hly8v7.png');
INSERT INTO public.filmes VALUES (2, 'Zootopia: Essa Cidade é o Bicho', 2016, '0', 'Não há.', 'Em uma cidade de animais, uma raposa falante se torna uma fugitiva ao ser acusada de um crime que não cometeu. O principal policial do local, o incontestável coelho, sai em sua busca.', 'https://res.cloudinary.com/dhje6cjw0/image/upload/v1763331039/Zootopia_essa_cidade_%C3%A9_o_bicho_i9ze3g.png');
INSERT INTO public.filmes VALUES (1, 'Monster High Scaris - A Cidade Sem Luz', 2013, '0', 'Não há.', 'Quando Clawdeen Wolf tem a chance de ser aprendiz da lendária estilista Madame Ghostier, ela e suas melhores amigas monstrinhas imediatamente fazem as malas e voam para a bela Scaris, na França.', 'https://res.cloudinary.com/dhje6cjw0/image/upload/v1763330759/Prime_Video__Monster_High__Scaris_a_Cidade_Sem_Luz_bc847u.jpg');
INSERT INTO public.filmes VALUES (7, 'Naruto Shippuden: O Filme - Herdeiros da Vontade do Fogo', 2009, '12', 'violência', 'É o sexto filme geral de Narutoe o terceiro filme de Naruto Shippuden, foi lançado em 01 de agosto de 2009. Foi revelado no site de Anniversary 10 de Naruto e foi exibido pela primeira vez ao longo da pré-visualização da saga filler aparição da 3 caldas o anime. Este filme se passa após o ep 89 de Naruto Shippūden.', 'https://res.cloudinary.com/dhje6cjw0/image/upload/v1763585708/naruto_shippuden_g223zb.png');
INSERT INTO public.filmes VALUES (8, 'A Noiva Cadáver', 2005, '10', 'medo, violência', 'As famílias de Victor e Victoria estão arranjando seu casamento. Nervoso com a cerimônia, Victor vai sozinho à floresta para ensaiar seus votos. No entanto, o que ele pensava ser um tronco de árvore na verdade é o braço esquelético de Emily, uma noiva que foi assassinada depois de fugir com seu amor. Convencida que Victor acabara de lhe pedir a mão em casamento, Emily o leva para o mundo dos mortos, mas ele precisa retornar rapidamente antes que Victoria se case com o malvado Lorde Barkis.', 'https://res.cloudinary.com/dhje6cjw0/image/upload/v1763586034/noiva_cadaver_cghmzb.png');
INSERT INTO public.filmes VALUES (9, 'Mononoke - O Filme: Capítulo 2 - As Cinzas da Ira', 2025, '14', 'conteúdo sexual, violência', 'O Boticário está de volta, e o harém de Edo enfrenta mais uma crise, com brigas familiares, tumultos internos e muita inveja, que dão origem a um espírito raivoso.', 'https://res.cloudinary.com/dhje6cjw0/image/upload/v1763586034/monoke_2_tjl5bi.png');
INSERT INTO public.filmes VALUES (10, 'Garota, Interrompida', 1998, '16', 'temas sensíveis', 'Em 1967, após uma sessão com um psicanalista que nunca havia visto antes, Susanna Kaysen foi diagnosticada como vítima de Transtorno de Personalidade Limítrofe ou "borderline". Enviada para um hospital psiquiátrico, onde viveu nos dois anos seguintes, ela conhece um novo mundo, de jovens garotas sedutoras e transtornadas. Entre elas está Lisa Rowe, uma charmosa sociopata que organiza uma fuga com Susanna, Georgina e Polly, com o intuito de retomarem suas vidas.', 'https://res.cloudinary.com/dhje6cjw0/image/upload/v1763586034/garota_interrompida_xdooho.png');
INSERT INTO public.filmes VALUES (11, 'Frankenstein', 2025, '18', 'drogas lícitas, nudez, violência extrema ', 'Um cientista brilhante, mas egoísta, traz uma criatura monstruosa à vida em um experimento ousado que, em última análise, leva à ruína tanto do criador quanto de sua trágica criação.', 'https://res.cloudinary.com/dhje6cjw0/image/upload/v1763586033/frankenstein_2025_yfjtal.png');


--
-- Data for Name: imagem_classificacao; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.imagem_classificacao VALUES ('0', 'https://res.cloudinary.com/dhje6cjw0/image/upload/v1763393846/L_Borda_vzzbng.png');
INSERT INTO public.imagem_classificacao VALUES ('10', 'https://res.cloudinary.com/dhje6cjw0/image/upload/v1763393846/10_Borda_lcolun.png');
INSERT INTO public.imagem_classificacao VALUES ('12', 'https://res.cloudinary.com/dhje6cjw0/image/upload/v1763393845/12_Borda_ghrake.png');
INSERT INTO public.imagem_classificacao VALUES ('14', 'https://res.cloudinary.com/dhje6cjw0/image/upload/v1763393845/14_Borda_jrsqxd.png');
INSERT INTO public.imagem_classificacao VALUES ('16', 'https://res.cloudinary.com/dhje6cjw0/image/upload/v1763393846/16_Borda_vwzvk9.png');
INSERT INTO public.imagem_classificacao VALUES ('18', 'https://res.cloudinary.com/dhje6cjw0/image/upload/v1763393845/18_Borda_nhixnq.png');


--
-- Name: classif_votos_voto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.classif_votos_voto_id_seq', 5, true);


--
-- Name: filmes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.filmes_id_seq', 11, true);


--
-- Name: classif_votos classif_votos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classif_votos
    ADD CONSTRAINT classif_votos_pkey PRIMARY KEY (voto_id);


--
-- Name: filmes filmes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.filmes
    ADD CONSTRAINT filmes_pkey PRIMARY KEY (id);


--
-- Name: imagem_classificacao imagem_classificacao_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.imagem_classificacao
    ADD CONSTRAINT imagem_classificacao_pkey PRIMARY KEY (valor);


--
-- Name: classif_votos classif_votos_obra_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classif_votos
    ADD CONSTRAINT classif_votos_obra_id_fkey FOREIGN KEY (obra_id) REFERENCES public.filmes(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

