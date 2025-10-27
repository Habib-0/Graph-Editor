--
-- PostgreSQL database dump
--

\restrict y5dyEaKpT3r2Vlqn3B8c8rCTO0vQ3Q3zOfGIzTgSNrR5kBM9YUsS6Iduh6ELXQP

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: edges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.edges (
    edge_id integer NOT NULL,
    from_node integer NOT NULL,
    to_node integer NOT NULL,
    weight integer DEFAULT 1,
    directed boolean DEFAULT true
);


ALTER TABLE public.edges OWNER TO postgres;

--
-- Name: edges_edge_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.edges_edge_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.edges_edge_id_seq OWNER TO postgres;

--
-- Name: edges_edge_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.edges_edge_id_seq OWNED BY public.edges.edge_id;


--
-- Name: log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.log (
    id integer NOT NULL,
    name text,
    table_name text NOT NULL,
    data jsonb NOT NULL,
    undone boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.log OWNER TO postgres;

--
-- Name: log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.log_id_seq OWNER TO postgres;

--
-- Name: log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.log_id_seq OWNED BY public.log.id;


--
-- Name: nodes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nodes (
    id integer NOT NULL,
    name text,
    x double precision DEFAULT 0,
    y double precision DEFAULT 0
);


ALTER TABLE public.nodes OWNER TO postgres;

--
-- Name: nodes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nodes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nodes_id_seq OWNER TO postgres;

--
-- Name: nodes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nodes_id_seq OWNED BY public.nodes.id;


--
-- Name: edges edge_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.edges ALTER COLUMN edge_id SET DEFAULT nextval('public.edges_edge_id_seq'::regclass);


--
-- Name: log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log ALTER COLUMN id SET DEFAULT nextval('public.log_id_seq'::regclass);


--
-- Name: nodes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nodes ALTER COLUMN id SET DEFAULT nextval('public.nodes_id_seq'::regclass);


--
-- Data for Name: edges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.edges (edge_id, from_node, to_node, weight, directed) FROM stdin;
41	4	1	1	t
42	1	2	1	t
43	3	4	1	t
\.


--
-- Data for Name: log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.log (id, name, table_name, data, undone, created_at) FROM stdin;
1	deletenode	nodes	{"x": 0, "y": 0, "id": 1, "name": "Alice"}	f	2025-10-23 13:13:35.932521
2	deletenode	nodes	{"x": 200, "y": 0, "id": 2, "name": "Bob"}	f	2025-10-23 13:13:48.813888
3	deletenode	nodes	{"x": 0, "y": 200, "id": 5, "name": "Emma"}	f	2025-10-23 13:13:50.966332
4	deletenode	nodes	{"x": 200, "y": 200, "id": 6, "name": "Frank"}	f	2025-10-23 13:13:53.265286
5	deletenode	nodes	{"x": 0, "y": 400, "id": 9, "name": "Isabella"}	f	2025-10-23 13:14:01.821815
6	deletenode	nodes	{"x": 200, "y": 400, "id": 10, "name": "Jack"}	f	2025-10-23 13:14:03.999545
7	deletenode	nodes	{"x": 400, "y": 200, "id": 7, "name": "Grace"}	f	2025-10-23 13:14:05.901935
8	deletenode	nodes	{"x": 600, "y": 200, "id": 8, "name": "Henry"}	f	2025-10-23 13:14:08.666979
9	deletenode	nodes	{"x": 351.7535211267606, "y": 198.66197183098592, "id": 3, "name": "Charlie"}	f	2025-10-23 13:14:27.770432
10	deletenode	nodes	{"x": 155.56478873239436, "y": 157.7943661971831, "id": 4, "name": "Diana"}	f	2025-10-23 13:14:41.481479
11	deletenode	nodes	{"x": 100, "y": 200, "id": 1, "name": "Start"}	f	2025-10-24 08:14:46.635624
12	deletenode	nodes	{"x": 300, "y": 100, "id": 2, "name": "Mid A"}	f	2025-10-24 08:14:56.986435
13	deletenode	nodes	{"x": 300, "y": 300, "id": 3, "name": "Mid B"}	f	2025-10-24 08:14:59.663377
14	deletenode	nodes	{"x": 500, "y": 200, "id": 4, "name": "End"}	f	2025-10-24 08:15:02.20163
15	deletenode	nodes	{"x": 557.2949016875158, "y": 676.335575687742, "id": 5, "name": "Emma"}	f	2025-10-24 08:54:42.902872
16	deletenode	nodes	{"x": 707.2949016875158, "y": 785.3169548885461, "id": 4, "name": "Diana"}	f	2025-10-24 08:54:46.814743
17	deletenode	nodes	{"x": 892.7050983124842, "y": 785.316954888546, "id": 3, "name": "Charlie"}	f	2025-10-24 08:54:49.760929
18	deletenode	nodes	{"x": 1042.7050983124843, "y": 676.335575687742, "id": 2, "name": "Bob"}	f	2025-10-24 08:54:52.629674
19	deletenode	nodes	{"x": 1100, "y": 500, "id": 1, "name": "Alice"}	f	2025-10-24 08:54:55.82334
20	deletedges	edges	{"weight": 1, "edge_id": 21, "to_node": 8, "directed": false, "from_node": 7}	f	2025-10-24 09:37:51.205891
21	addedges	edges	{"weight": 5, "edge_id": 25, "to_node": 8, "directed": false, "from_node": 7}	f	2025-10-24 09:38:03.92455
22	addnode	nodes	{"x": 0, "y": 0, "id": 1, "name": ""}	f	2025-10-24 10:15:30.100753
23	addedges	edges	{"weight": 4, "edge_id": 26, "to_node": 1, "directed": false, "from_node": 7}	f	2025-10-24 10:15:52.833101
24	deletenode	nodes	{"x": 892.7050983124842, "y": 214.6830451114539, "id": 9, "name": "Isabella"}	f	2025-10-25 16:26:06.703882
25	deletenode	nodes	{"x": 630.6415890814634, "y": 425.3705062252803, "id": 7, "name": "Grace"}	f	2025-10-25 16:26:08.544916
26	deletenode	nodes	{"x": 819.7050983124841, "y": 333.664424312258, "id": 10, "name": "Jack"}	f	2025-10-25 16:26:13.011
27	deletenode	nodes	{"x": 656.7217291786483, "y": 328.9193450254585, "id": 8, "name": "Henry"}	f	2025-10-25 16:26:15.85289
28	deletenode	nodes	{"x": 519.8986880716519, "y": 416.14901759726223, "id": 1, "name": ""}	f	2025-10-25 16:26:19.837417
29	deletenode	nodes	{"x": 613.696680738138, "y": 340.02943693233425, "id": 6, "name": "Frank"}	f	2025-10-25 16:26:24.645148
30	addnode	nodes	{"x": 0, "y": 0, "id": 2, "name": ""}	f	2025-10-25 16:26:31.677405
31	deletenode	nodes	{"x": -628, "y": -368, "id": 2, "name": ""}	f	2025-10-25 16:26:53.917685
32	addnode	nodes	{"x": 0, "y": 0, "id": 3, "name": "node1"}	f	2025-10-25 16:27:04.094826
33	addnode	nodes	{"x": 0, "y": 0, "id": 4, "name": "node2"}	f	2025-10-25 16:27:10.974624
34	addedges	edges	{"weight": 5, "edge_id": 27, "to_node": 4, "directed": false, "from_node": 3}	f	2025-10-25 16:27:18.466592
35	addnode	nodes	{"x": 0, "y": 0, "id": 5, "name": "node3"}	f	2025-10-25 16:34:45.14454
36	addedges	edges	{"weight": 6, "edge_id": 28, "to_node": 5, "directed": true, "from_node": 4}	f	2025-10-25 16:34:55.700715
37	addedges	edges	{"weight": 5, "edge_id": 29, "to_node": 3, "directed": false, "from_node": 5}	f	2025-10-25 17:08:00.249703
38	deletedges	edges	{"weight": 5, "edge_id": 29, "to_node": 3, "directed": false, "from_node": 5}	f	2025-10-25 17:08:24.842984
39	addedges	edges	{"weight": 1, "edge_id": 30, "to_node": 3, "directed": false, "from_node": 5}	f	2025-10-25 17:08:31.492747
40	deletedges	edges	{"weight": 1, "edge_id": 30, "to_node": 3, "directed": false, "from_node": 5}	f	2025-10-25 17:30:23.781222
41	addedges	edges	{"weight": 5, "edge_id": 31, "to_node": 3, "directed": false, "from_node": 5}	f	2025-10-25 17:47:49.920603
42	deletedges	edges	{"weight": 5, "edge_id": 31, "to_node": 3, "directed": false, "from_node": 5}	f	2025-10-25 18:00:15.344596
43	addedges	edges	{"weight": 1, "edge_id": 32, "to_node": 3, "directed": false, "from_node": 5}	f	2025-10-25 18:00:20.739104
46	deletenode	nodes	{"x": 145.61647461341727, "y": 29.00490754494897, "id": 6, "name": ""}	f	2025-10-26 12:24:48.035374
45	deletenode	nodes	{"x": 701.3095109207312, "y": 426.81736798650127, "id": 6, "name": ""}	f	2025-10-25 18:25:53.264476
44	addnode	nodes	{"x": 0, "y": 0, "id": 6, "name": ""}	f	2025-10-25 18:24:48.507375
47	deletenode	nodes	{"x": 1083.943539009966, "y": 486.8344915189485, "id": 3, "name": "w"}	f	2025-10-26 12:43:51.332011
48	deletenode	nodes	{"x": 1187.7094395882116, "y": 435.32919494338125, "id": 5, "name": "node3"}	f	2025-10-26 12:43:53.862945
49	deletenode	nodes	{"x": 1073.5290768294124, "y": 402.68561197988583, "id": 4, "name": "node2"}	f	2025-10-26 12:43:58.517361
50	addedges	edges	{"weight": 1, "edge_id": 41, "to_node": 1, "directed": true, "from_node": 4}	f	2025-10-26 13:17:43.879623
51	deletedges	edges	{"weight": 2, "edge_id": 38, "to_node": 3, "directed": false, "from_node": 2}	f	2025-10-26 13:18:51.233583
52	deletedges	edges	{"weight": 1, "edge_id": 37, "to_node": 2, "directed": false, "from_node": 1}	f	2025-10-26 13:20:24.875684
53	addedges	edges	{"weight": 1, "edge_id": 42, "to_node": 2, "directed": true, "from_node": 1}	f	2025-10-26 13:20:30.16792
54	deletedges	edges	{"weight": 1, "edge_id": 39, "to_node": 4, "directed": false, "from_node": 3}	f	2025-10-26 13:35:08.201631
55	addedges	edges	{"weight": 1, "edge_id": 43, "to_node": 4, "directed": true, "from_node": 3}	f	2025-10-26 13:35:14.676431
\.


--
-- Data for Name: nodes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nodes (id, name, x, y) FROM stdin;
3	Mid B	1438.6230453015874	578.9617101254368
4	End	1331.4082225023483	642.0736669973946
1	Start	1153.4903131802728	580.037134474011
2	Mid A	1152.1513036610093	726.1953144773213
\.


--
-- Name: edges_edge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.edges_edge_id_seq', 43, true);


--
-- Name: log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.log_id_seq', 55, true);


--
-- Name: nodes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nodes_id_seq', 6, true);


--
-- Name: edges edges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.edges
    ADD CONSTRAINT edges_pkey PRIMARY KEY (edge_id);


--
-- Name: log log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log
    ADD CONSTRAINT log_pkey PRIMARY KEY (id);


--
-- Name: nodes nodes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT nodes_pkey PRIMARY KEY (id);


--
-- Name: edges fk_from_node; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.edges
    ADD CONSTRAINT fk_from_node FOREIGN KEY (from_node) REFERENCES public.nodes(id) ON DELETE CASCADE;


--
-- Name: edges fk_to_node; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.edges
    ADD CONSTRAINT fk_to_node FOREIGN KEY (to_node) REFERENCES public.nodes(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict y5dyEaKpT3r2Vlqn3B8c8rCTO0vQ3Q3zOfGIzTgSNrR5kBM9YUsS6Iduh6ELXQP

