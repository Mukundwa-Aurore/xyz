--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

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

ALTER TABLE ONLY public."ParkingLogs" DROP CONSTRAINT "ParkingLogs_parkingCode_fkey";
ALTER TABLE ONLY public."ParkingLogs" DROP CONSTRAINT "ParkingLogs_attendantId_fkey";
ALTER TABLE ONLY public."CarEntries" DROP CONSTRAINT "CarEntries_parkingCode_fkey";
ALTER TABLE ONLY public."CarEntries" DROP CONSTRAINT "CarEntries_attendantId_fkey";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_pkey";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key";
ALTER TABLE ONLY public."Parkings" DROP CONSTRAINT "Parkings_pkey";
ALTER TABLE ONLY public."ParkingLogs" DROP CONSTRAINT "ParkingLogs_pkey";
ALTER TABLE ONLY public."ParkingLocations" DROP CONSTRAINT "ParkingLocations_pkey";
ALTER TABLE ONLY public."CarEntries" DROP CONSTRAINT "CarEntries_pkey";
DROP TABLE public."Users";
DROP TABLE public."Parkings";
DROP TABLE public."ParkingLogs";
DROP TABLE public."ParkingLocations";
DROP TABLE public."CarEntries";
DROP TYPE public."enum_Users_role";
DROP TYPE public."enum_ParkingLogs_status";
--
-- Name: enum_ParkingLogs_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_ParkingLogs_status" AS ENUM (
    'parked',
    'exited'
);


--
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'admin',
    'parking_attendant',
    'attendant',
    'driver'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: CarEntries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CarEntries" (
    id uuid NOT NULL,
    "plateNumber" character varying(255) NOT NULL,
    "parkingCode" character varying(255) NOT NULL,
    "entryDateTime" timestamp with time zone NOT NULL,
    "exitDateTime" timestamp with time zone,
    "chargedAmount" numeric(10,2) DEFAULT 0 NOT NULL,
    "attendantId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: ParkingLocations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ParkingLocations" (
    code character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    "totalSpaces" integer NOT NULL,
    "availableSpaces" integer NOT NULL,
    location character varying(255) NOT NULL,
    "hourlyFee" numeric(10,2) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: ParkingLogs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ParkingLogs" (
    id uuid NOT NULL,
    "plateNumber" character varying(255) NOT NULL,
    "parkingCode" character varying(255) NOT NULL,
    "entryDateTime" timestamp with time zone NOT NULL,
    "exitDateTime" timestamp with time zone,
    "chargedAmount" numeric(10,2) DEFAULT 0 NOT NULL,
    status public."enum_ParkingLogs_status" DEFAULT 'parked'::public."enum_ParkingLogs_status" NOT NULL,
    "attendantId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Parkings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Parkings" (
    code character varying(255) NOT NULL,
    "parkingName" character varying(255) NOT NULL,
    "numberOfSpaces" integer NOT NULL,
    "availableSpaces" integer NOT NULL,
    location character varying(255) NOT NULL,
    "chargingFeePerHour" numeric(10,2) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Users" (
    id uuid NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public."enum_Users_role" DEFAULT 'parking_attendant'::public."enum_Users_role" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Data for Name: CarEntries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CarEntries" (id, "plateNumber", "parkingCode", "entryDateTime", "exitDateTime", "chargedAmount", "attendantId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ParkingLocations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ParkingLocations" (code, name, "totalSpaces", "availableSpaces", location, "hourlyFee", "createdAt", "updatedAt") FROM stdin;
PARK001	Downtown Kigali	100	100	Kigali, Rwanda	500.00	2026-05-21 09:18:50.112353+02	2026-05-21 09:18:50.112353+02
PARK002	Kigali Heights	50	50	Kigali Heights, Kigali	750.00	2026-05-21 09:18:50.112353+02	2026-05-21 09:18:50.112353+02
PARK003	Nyamirambo	200	200	Nyamirambo, Kigali	300.00	2026-05-21 09:18:50.112353+02	2026-05-21 09:18:50.112353+02
\.


--
-- Data for Name: ParkingLogs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ParkingLogs" (id, "plateNumber", "parkingCode", "entryDateTime", "exitDateTime", "chargedAmount", status, "attendantId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Parkings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Parkings" (code, "parkingName", "numberOfSpaces", "availableSpaces", location, "chargingFeePerHour", "createdAt", "updatedAt") FROM stdin;
3QDHNNYN	wewe	12	12	12	1212.00	2026-05-21 00:44:52.325+02	2026-05-21 00:44:52.325+02
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Users" (id, "firstName", "lastName", email, password, role, "createdAt", "updatedAt") FROM stdin;
a597093a-1396-4787-9d6d-900ee72c7aa8	Alice	Mukamana	alice.admin@xwzparking.com	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhW	admin	2026-05-21 09:18:50.071414+02	2026-05-21 09:18:50.071414+02
43cdd361-a144-4b20-987a-35b2f3906e28	Bob	Nkurunziza	bob.admin@xwzparking.com	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhW	admin	2026-05-21 09:18:50.071414+02	2026-05-21 09:18:50.071414+02
f8559b95-dec5-4912-9e17-2a39c8b2ef06	Claire	Uwimana	claire.attendant@xwzparking.com	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhW	attendant	2026-05-21 09:18:50.088591+02	2026-05-21 09:18:50.088591+02
28eb2448-fde0-4af7-a609-b337f423dc5a	David	Hakizimana	david.attendant@xwzparking.com	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhW	attendant	2026-05-21 09:18:50.088591+02	2026-05-21 09:18:50.088591+02
f411e20c-030c-4003-982e-dc3866adcb91	Eve	Umuhire	eve.attendant@xwzparking.com	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhW	attendant	2026-05-21 09:18:50.088591+02	2026-05-21 09:18:50.088591+02
f262a103-3bfb-4322-8afa-0f1c43578300	Frank	Nsengiyumva	frank.driver@xwzparking.com	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhW	driver	2026-05-21 09:18:50.101892+02	2026-05-21 09:18:50.101892+02
afa676a3-7422-4368-b525-0fb4be6b843e	Grace	Uwiragiye	grace.driver@xwzparking.com	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhW	driver	2026-05-21 09:18:50.101892+02	2026-05-21 09:18:50.101892+02
c998a04d-1b16-431b-9b23-9dc6af2cd5d0	Henry	Mugisha	henry.driver@xwzparking.com	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhW	driver	2026-05-21 09:18:50.101892+02	2026-05-21 09:18:50.101892+02
38f8b25c-de09-47a4-9007-90038286c586	Ivy	Iradukunda	ivy.driver@xwzparking.com	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhW	driver	2026-05-21 09:18:50.101892+02	2026-05-21 09:18:50.101892+02
ec12647e-69e3-4e91-a391-f49a89c54c60	Jack	Niyomugabo	jack.driver@xwzparking.com	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhW	driver	2026-05-21 09:18:50.101892+02	2026-05-21 09:18:50.101892+02
346ea468-5294-4f54-9674-b5ac23136537	Mufasa	Lion 	admin@xwzparking.com	$2b$10$6F8VYHet55Mp1/oxjEVd5.lMl2c6jPvfaZtUQkJd5jtUlM4b80Xp2	driver	2026-05-21 09:28:18.194+02	2026-05-21 09:28:18.194+02
013ccc9a-a22e-4f20-a518-770541371543	Aurore	Mukundwa	mukundwaa35@gmail.com	$2b$10$M4iHMvhhI2vTu0TNVJsYN..mGyBDAo8EJYGhjnn3f0I/uHUv69Aja	driver	2026-05-23 22:32:52.081+02	2026-05-23 22:32:52.081+02
\.


--
-- Name: CarEntries CarEntries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CarEntries"
    ADD CONSTRAINT "CarEntries_pkey" PRIMARY KEY (id);


--
-- Name: ParkingLocations ParkingLocations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ParkingLocations"
    ADD CONSTRAINT "ParkingLocations_pkey" PRIMARY KEY (code);


--
-- Name: ParkingLogs ParkingLogs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ParkingLogs"
    ADD CONSTRAINT "ParkingLogs_pkey" PRIMARY KEY (id);


--
-- Name: Parkings Parkings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Parkings"
    ADD CONSTRAINT "Parkings_pkey" PRIMARY KEY (code);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: CarEntries CarEntries_attendantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CarEntries"
    ADD CONSTRAINT "CarEntries_attendantId_fkey" FOREIGN KEY ("attendantId") REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- Name: CarEntries CarEntries_parkingCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CarEntries"
    ADD CONSTRAINT "CarEntries_parkingCode_fkey" FOREIGN KEY ("parkingCode") REFERENCES public."Parkings"(code) ON UPDATE CASCADE;


--
-- Name: ParkingLogs ParkingLogs_attendantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ParkingLogs"
    ADD CONSTRAINT "ParkingLogs_attendantId_fkey" FOREIGN KEY ("attendantId") REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- Name: ParkingLogs ParkingLogs_parkingCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ParkingLogs"
    ADD CONSTRAINT "ParkingLogs_parkingCode_fkey" FOREIGN KEY ("parkingCode") REFERENCES public."ParkingLocations"(code) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

