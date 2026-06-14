--
-- PostgreSQL database dump
--


-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."TransactionReceipt" DROP CONSTRAINT IF EXISTS "TransactionReceipt_transactionId_fkey";
ALTER TABLE IF EXISTS ONLY public."SlackIntegration" DROP CONSTRAINT IF EXISTS "SlackIntegration_clubId_fkey";
ALTER TABLE IF EXISTS ONLY public."Report" DROP CONSTRAINT IF EXISTS "Report_clubId_fkey";
ALTER TABLE IF EXISTS ONLY public."Membership" DROP CONSTRAINT IF EXISTS "Membership_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Membership" DROP CONSTRAINT IF EXISTS "Membership_clubId_fkey";
ALTER TABLE IF EXISTS ONLY public."MemberSnapshot" DROP CONSTRAINT IF EXISTS "MemberSnapshot_clubId_fkey";
ALTER TABLE IF EXISTS ONLY public."Meeting" DROP CONSTRAINT IF EXISTS "Meeting_clubId_fkey";
ALTER TABLE IF EXISTS ONLY public."InviteCode" DROP CONSTRAINT IF EXISTS "InviteCode_clubId_fkey";
ALTER TABLE IF EXISTS ONLY public."Faq" DROP CONSTRAINT IF EXISTS "Faq_clubId_fkey";
ALTER TABLE IF EXISTS ONLY public."CorporateCard" DROP CONSTRAINT IF EXISTS "CorporateCard_clubId_fkey";
ALTER TABLE IF EXISTS ONLY public."CheckinSession" DROP CONSTRAINT IF EXISTS "CheckinSession_meetingId_fkey";
ALTER TABLE IF EXISTS ONLY public."BudgetTransaction" DROP CONSTRAINT IF EXISTS "BudgetTransaction_periodId_fkey";
ALTER TABLE IF EXISTS ONLY public."BudgetTransaction" DROP CONSTRAINT IF EXISTS "BudgetTransaction_clubId_fkey";
ALTER TABLE IF EXISTS ONLY public."BudgetTransaction" DROP CONSTRAINT IF EXISTS "BudgetTransaction_cardId_fkey";
ALTER TABLE IF EXISTS ONLY public."BudgetTransaction" DROP CONSTRAINT IF EXISTS "BudgetTransaction_activityId_fkey";
ALTER TABLE IF EXISTS ONLY public."BudgetPeriod" DROP CONSTRAINT IF EXISTS "BudgetPeriod_clubId_fkey";
ALTER TABLE IF EXISTS ONLY public."BudgetGrant" DROP CONSTRAINT IF EXISTS "BudgetGrant_snapshotId_fkey";
ALTER TABLE IF EXISTS ONLY public."BudgetGrant" DROP CONSTRAINT IF EXISTS "BudgetGrant_periodId_fkey";
ALTER TABLE IF EXISTS ONLY public."BudgetGrant" DROP CONSTRAINT IF EXISTS "BudgetGrant_clubId_fkey";
ALTER TABLE IF EXISTS ONLY public."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_clubId_fkey";
ALTER TABLE IF EXISTS ONLY public."Attendance" DROP CONSTRAINT IF EXISTS "Attendance_membershipId_fkey";
ALTER TABLE IF EXISTS ONLY public."Attendance" DROP CONSTRAINT IF EXISTS "Attendance_meetingId_fkey";
ALTER TABLE IF EXISTS ONLY public."Announcement" DROP CONSTRAINT IF EXISTS "Announcement_clubId_fkey";
ALTER TABLE IF EXISTS ONLY public."Activity" DROP CONSTRAINT IF EXISTS "Activity_meetingId_fkey";
ALTER TABLE IF EXISTS ONLY public."Activity" DROP CONSTRAINT IF EXISTS "Activity_clubId_fkey";
ALTER TABLE IF EXISTS ONLY public."ActivityPhoto" DROP CONSTRAINT IF EXISTS "ActivityPhoto_activityId_fkey";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."TransactionReceipt_transactionId_idx";
DROP INDEX IF EXISTS public."SlackIntegration_clubId_key";
DROP INDEX IF EXISTS public."Report_clubId_idx";
DROP INDEX IF EXISTS public."Membership_userId_clubId_key";
DROP INDEX IF EXISTS public."Membership_status_idx";
DROP INDEX IF EXISTS public."Membership_clubId_idx";
DROP INDEX IF EXISTS public."MemberSnapshot_clubId_year_month_key";
DROP INDEX IF EXISTS public."MemberSnapshot_clubId_idx";
DROP INDEX IF EXISTS public."Meeting_clubId_idx";
DROP INDEX IF EXISTS public."InviteCode_code_key";
DROP INDEX IF EXISTS public."InviteCode_clubId_idx";
DROP INDEX IF EXISTS public."Faq_clubId_idx";
DROP INDEX IF EXISTS public."CorporateCard_clubId_idx";
DROP INDEX IF EXISTS public."Club_code_key";
DROP INDEX IF EXISTS public."CheckinSession_token_key";
DROP INDEX IF EXISTS public."CheckinSession_meetingId_idx";
DROP INDEX IF EXISTS public."BudgetTransaction_transactionDate_idx";
DROP INDEX IF EXISTS public."BudgetTransaction_clubId_idx";
DROP INDEX IF EXISTS public."BudgetTransaction_cardId_idx";
DROP INDEX IF EXISTS public."BudgetTransaction_activityId_idx";
DROP INDEX IF EXISTS public."BudgetPeriod_clubId_year_half_key";
DROP INDEX IF EXISTS public."BudgetPeriod_clubId_idx";
DROP INDEX IF EXISTS public."BudgetGrant_snapshotId_key";
DROP INDEX IF EXISTS public."BudgetGrant_periodId_idx";
DROP INDEX IF EXISTS public."BudgetGrant_clubId_year_month_key";
DROP INDEX IF EXISTS public."BudgetGrant_clubId_idx";
DROP INDEX IF EXISTS public."AuditLog_clubId_idx";
DROP INDEX IF EXISTS public."AuditLog_action_idx";
DROP INDEX IF EXISTS public."Attendance_meetingId_membershipId_key";
DROP INDEX IF EXISTS public."Attendance_meetingId_idx";
DROP INDEX IF EXISTS public."Announcement_clubId_idx";
DROP INDEX IF EXISTS public."Activity_meetingId_key";
DROP INDEX IF EXISTS public."Activity_clubId_idx";
DROP INDEX IF EXISTS public."ActivityPhoto_activityId_idx";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."TransactionReceipt" DROP CONSTRAINT IF EXISTS "TransactionReceipt_pkey";
ALTER TABLE IF EXISTS ONLY public."SlackIntegration" DROP CONSTRAINT IF EXISTS "SlackIntegration_pkey";
ALTER TABLE IF EXISTS ONLY public."Report" DROP CONSTRAINT IF EXISTS "Report_pkey";
ALTER TABLE IF EXISTS ONLY public."Membership" DROP CONSTRAINT IF EXISTS "Membership_pkey";
ALTER TABLE IF EXISTS ONLY public."MemberSnapshot" DROP CONSTRAINT IF EXISTS "MemberSnapshot_pkey";
ALTER TABLE IF EXISTS ONLY public."Meeting" DROP CONSTRAINT IF EXISTS "Meeting_pkey";
ALTER TABLE IF EXISTS ONLY public."InviteCode" DROP CONSTRAINT IF EXISTS "InviteCode_pkey";
ALTER TABLE IF EXISTS ONLY public."Faq" DROP CONSTRAINT IF EXISTS "Faq_pkey";
ALTER TABLE IF EXISTS ONLY public."CorporateCard" DROP CONSTRAINT IF EXISTS "CorporateCard_pkey";
ALTER TABLE IF EXISTS ONLY public."Club" DROP CONSTRAINT IF EXISTS "Club_pkey";
ALTER TABLE IF EXISTS ONLY public."CheckinSession" DROP CONSTRAINT IF EXISTS "CheckinSession_pkey";
ALTER TABLE IF EXISTS ONLY public."BudgetTransaction" DROP CONSTRAINT IF EXISTS "BudgetTransaction_pkey";
ALTER TABLE IF EXISTS ONLY public."BudgetPeriod" DROP CONSTRAINT IF EXISTS "BudgetPeriod_pkey";
ALTER TABLE IF EXISTS ONLY public."BudgetGrant" DROP CONSTRAINT IF EXISTS "BudgetGrant_pkey";
ALTER TABLE IF EXISTS ONLY public."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_pkey";
ALTER TABLE IF EXISTS ONLY public."Attendance" DROP CONSTRAINT IF EXISTS "Attendance_pkey";
ALTER TABLE IF EXISTS ONLY public."Announcement" DROP CONSTRAINT IF EXISTS "Announcement_pkey";
ALTER TABLE IF EXISTS ONLY public."Activity" DROP CONSTRAINT IF EXISTS "Activity_pkey";
ALTER TABLE IF EXISTS ONLY public."ActivityPhoto" DROP CONSTRAINT IF EXISTS "ActivityPhoto_pkey";
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."TransactionReceipt";
DROP TABLE IF EXISTS public."SlackIntegration";
DROP TABLE IF EXISTS public."Report";
DROP TABLE IF EXISTS public."Membership";
DROP TABLE IF EXISTS public."MemberSnapshot";
DROP TABLE IF EXISTS public."Meeting";
DROP TABLE IF EXISTS public."InviteCode";
DROP TABLE IF EXISTS public."Faq";
DROP TABLE IF EXISTS public."CorporateCard";
DROP TABLE IF EXISTS public."Club";
DROP TABLE IF EXISTS public."CheckinSession";
DROP TABLE IF EXISTS public."BudgetTransaction";
DROP TABLE IF EXISTS public."BudgetPeriod";
DROP TABLE IF EXISTS public."BudgetGrant";
DROP TABLE IF EXISTS public."AuditLog";
DROP TABLE IF EXISTS public."Attendance";
DROP TABLE IF EXISTS public."Announcement";
DROP TABLE IF EXISTS public."ActivityPhoto";
DROP TABLE IF EXISTS public."Activity";
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Activity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Activity" (
    id text NOT NULL,
    "clubId" text NOT NULL,
    "meetingId" text,
    title text NOT NULL,
    "activityDate" timestamp(3) without time zone NOT NULL,
    location text,
    content text,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ActivityPhoto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ActivityPhoto" (
    id text NOT NULL,
    "activityId" text NOT NULL,
    "uploadedById" text,
    "fileUrl" text NOT NULL,
    status text DEFAULT 'UPLOADED'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Announcement; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Announcement" (
    id text NOT NULL,
    "clubId" text NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    pinned boolean DEFAULT false NOT NULL,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Attendance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Attendance" (
    id text NOT NULL,
    "meetingId" text NOT NULL,
    "membershipId" text NOT NULL,
    response text,
    "checkedInAt" timestamp(3) without time zone,
    method text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "clubId" text,
    "actorUserId" text,
    action text NOT NULL,
    "entityType" text NOT NULL,
    "entityId" text,
    summary text,
    metadata text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: BudgetGrant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BudgetGrant" (
    id text NOT NULL,
    "clubId" text NOT NULL,
    "periodId" text NOT NULL,
    "snapshotId" text,
    year integer NOT NULL,
    month integer NOT NULL,
    "memberCount" integer NOT NULL,
    amount integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: BudgetPeriod; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BudgetPeriod" (
    id text NOT NULL,
    "clubId" text NOT NULL,
    year integer NOT NULL,
    half text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: BudgetTransaction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BudgetTransaction" (
    id text NOT NULL,
    "clubId" text NOT NULL,
    "cardId" text NOT NULL,
    "periodId" text,
    "activityId" text,
    "enteredById" text,
    "transactionDate" timestamp(3) without time zone NOT NULL,
    amount integer NOT NULL,
    "merchantName" text NOT NULL,
    category text,
    "approvalNoMasked" text,
    memo text,
    "isPublic" boolean DEFAULT true NOT NULL,
    "includedInReport" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: CheckinSession; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CheckinSession" (
    id text NOT NULL,
    "meetingId" text NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Club; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Club" (
    id text NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: CorporateCard; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CorporateCard" (
    id text NOT NULL,
    "clubId" text NOT NULL,
    label text NOT NULL,
    "holderName" text NOT NULL,
    last4 text,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Faq; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Faq" (
    id text NOT NULL,
    "clubId" text NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: InviteCode; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."InviteCode" (
    id text NOT NULL,
    "clubId" text NOT NULL,
    code text NOT NULL,
    role text DEFAULT 'MEMBER'::text NOT NULL,
    "maxUses" integer,
    "usedCount" integer DEFAULT 0 NOT NULL,
    "expiresAt" timestamp(3) without time zone,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Meeting; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Meeting" (
    id text NOT NULL,
    "clubId" text NOT NULL,
    title text NOT NULL,
    description text,
    location text,
    "startsAt" timestamp(3) without time zone NOT NULL,
    "endsAt" timestamp(3) without time zone,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: MemberSnapshot; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MemberSnapshot" (
    id text NOT NULL,
    "clubId" text NOT NULL,
    "snapshotDate" timestamp(3) without time zone NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    half text NOT NULL,
    "activeMemberCount" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Membership; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Membership" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "clubId" text NOT NULL,
    nickname text NOT NULL,
    role text DEFAULT 'MEMBER'::text NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Report; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Report" (
    id text NOT NULL,
    "clubId" text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    "periodLabel" text,
    year integer,
    month integer,
    half text,
    format text,
    "fileUrl" text,
    "generatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: SlackIntegration; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SlackIntegration" (
    id text NOT NULL,
    "clubId" text NOT NULL,
    configured boolean DEFAULT false NOT NULL,
    "channelLabel" text,
    "lastSuccessAt" timestamp(3) without time zone,
    "lastFailureAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: TransactionReceipt; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TransactionReceipt" (
    id text NOT NULL,
    "transactionId" text NOT NULL,
    "fileUrl" text NOT NULL,
    "uploadedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text,
    name text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Data for Name: Activity; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Activity" VALUES ('cmqdp02b9003q7doh2p22fvdc', 'cmqdp026r00007doh1gjw7j3j', 'cmqdp02ai00307dohbdh4mhzs', '6월 정기 러닝 모임', '2026-06-10 00:00:00', '한강공원', '6월 정기 모임 겸 회식. 함께 달리고 저녁 식사를 했습니다.', NULL, '2026-06-14 11:20:04.534', '2026-06-14 11:20:04.534');


--
-- Data for Name: ActivityPhoto; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: Announcement; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: Attendance; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Attendance" VALUES ('cmqdp02am00327doh5zphmw2v', 'cmqdp02ai00307dohbdh4mhzs', 'cmqdp027k000g7doh6osu8ag8', 'GOING', '2026-06-10 00:00:00', 'QR', '2026-06-14 11:20:04.51', '2026-06-14 11:20:04.51');
INSERT INTO public."Attendance" VALUES ('cmqdp02ao00347dohpinrf6bz', 'cmqdp02ai00307dohbdh4mhzs', 'cmqdp027o000j7doh9bzdifea', 'GOING', '2026-06-10 00:00:00', 'QR', '2026-06-14 11:20:04.513', '2026-06-14 11:20:04.513');
INSERT INTO public."Attendance" VALUES ('cmqdp02aq00367doh85isabri', 'cmqdp02ai00307dohbdh4mhzs', 'cmqdp027s000m7dohqtn5zfd7', 'GOING', '2026-06-10 00:00:00', 'QR', '2026-06-14 11:20:04.514', '2026-06-14 11:20:04.514');
INSERT INTO public."Attendance" VALUES ('cmqdp02as00387dohv4izsral', 'cmqdp02ai00307dohbdh4mhzs', 'cmqdp027w000p7doh23svtex6', 'GOING', '2026-06-10 00:00:00', 'QR', '2026-06-14 11:20:04.516', '2026-06-14 11:20:04.516');
INSERT INTO public."Attendance" VALUES ('cmqdp02at003a7doh2krhwzn0', 'cmqdp02ai00307dohbdh4mhzs', 'cmqdp0280000s7dohl6lwxxk3', 'GOING', '2026-06-10 00:00:00', 'QR', '2026-06-14 11:20:04.518', '2026-06-14 11:20:04.518');
INSERT INTO public."Attendance" VALUES ('cmqdp02av003c7dohdgb0uihr', 'cmqdp02ai00307dohbdh4mhzs', 'cmqdp0284000v7doh97fxi20c', 'GOING', '2026-06-10 00:00:00', 'QR', '2026-06-14 11:20:04.519', '2026-06-14 11:20:04.519');
INSERT INTO public."Attendance" VALUES ('cmqdp02az003e7dohu4eh5lrh', 'cmqdp02ai00307dohbdh4mhzs', 'cmqdp0287000y7dohwvtay859', 'GOING', '2026-06-10 00:00:00', 'QR', '2026-06-14 11:20:04.523', '2026-06-14 11:20:04.523');
INSERT INTO public."Attendance" VALUES ('cmqdp02b0003g7dohwrr4aro1', 'cmqdp02ai00307dohbdh4mhzs', 'cmqdp028b00117doh961vi0ge', 'GOING', '2026-06-10 00:00:00', 'QR', '2026-06-14 11:20:04.525', '2026-06-14 11:20:04.525');
INSERT INTO public."Attendance" VALUES ('cmqdp02b2003i7dohgzpgl4ee', 'cmqdp02ai00307dohbdh4mhzs', 'cmqdp028e00147dohi3kv90qe', 'GOING', '2026-06-10 00:00:00', 'QR', '2026-06-14 11:20:04.526', '2026-06-14 11:20:04.526');
INSERT INTO public."Attendance" VALUES ('cmqdp02b4003k7dohjbi6o7su', 'cmqdp02ai00307dohbdh4mhzs', 'cmqdp028i00177dohscqgja2i', 'GOING', '2026-06-10 00:00:00', 'QR', '2026-06-14 11:20:04.528', '2026-06-14 11:20:04.528');
INSERT INTO public."Attendance" VALUES ('cmqdp02b6003m7doh8jke2qwa', 'cmqdp02ai00307dohbdh4mhzs', 'cmqdp028l001a7doha3kuyex9', 'GOING', '2026-06-10 00:00:00', 'QR', '2026-06-14 11:20:04.53', '2026-06-14 11:20:04.53');
INSERT INTO public."Attendance" VALUES ('cmqdp02b8003o7dohbod2stg1', 'cmqdp02ai00307dohbdh4mhzs', 'cmqdp028o001d7dohd3hj8m81', 'GOING', '2026-06-10 00:00:00', 'QR', '2026-06-14 11:20:04.532', '2026-06-14 11:20:04.532');


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: BudgetGrant; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."BudgetGrant" VALUES ('cmqdp029s002a7dohnhpowe75', 'cmqdp026r00007doh1gjw7j3j', 'cmqdp029n00267doho3ac35xt', 'cmqdp029p00287dohcdc8n00w', 2026, 1, 20, 1000000, '2026-06-14 11:20:04.48', '2026-06-14 11:20:04.48');
INSERT INTO public."BudgetGrant" VALUES ('cmqdp029w002e7dohc6mjgtfe', 'cmqdp026r00007doh1gjw7j3j', 'cmqdp029n00267doho3ac35xt', 'cmqdp029u002c7doheuab6rhl', 2026, 2, 22, 1100000, '2026-06-14 11:20:04.484', '2026-06-14 11:20:04.484');
INSERT INTO public."BudgetGrant" VALUES ('cmqdp02a0002i7dohhef6dvwd', 'cmqdp026r00007doh1gjw7j3j', 'cmqdp029n00267doho3ac35xt', 'cmqdp029y002g7dohc9rvj9wv', 2026, 3, 21, 1050000, '2026-06-14 11:20:04.488', '2026-06-14 11:20:04.488');
INSERT INTO public."BudgetGrant" VALUES ('cmqdp02a3002m7dohai7gn1m9', 'cmqdp026r00007doh1gjw7j3j', 'cmqdp029n00267doho3ac35xt', 'cmqdp02a1002k7doh9vslofxj', 2026, 4, 21, 1050000, '2026-06-14 11:20:04.492', '2026-06-14 11:20:04.492');
INSERT INTO public."BudgetGrant" VALUES ('cmqdp02a8002q7dohbi2osd62', 'cmqdp026r00007doh1gjw7j3j', 'cmqdp029n00267doho3ac35xt', 'cmqdp02a5002o7doh3shl1l0s', 2026, 5, 23, 1150000, '2026-06-14 11:20:04.497', '2026-06-14 11:20:04.497');
INSERT INTO public."BudgetGrant" VALUES ('cmqdp02ac002u7doh6nr9nl8m', 'cmqdp026r00007doh1gjw7j3j', 'cmqdp029n00267doho3ac35xt', 'cmqdp02aa002s7dohayzoja3h', 2026, 6, 24, 1200000, '2026-06-14 11:20:04.5', '2026-06-14 11:20:04.5');


--
-- Data for Name: BudgetPeriod; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."BudgetPeriod" VALUES ('cmqdp029n00267doho3ac35xt', 'cmqdp026r00007doh1gjw7j3j', 2026, 'FIRST_HALF', '2026-01-01 00:00:00', '2026-06-30 23:59:59.999', '2026-06-14 11:20:04.475', '2026-06-14 11:20:04.475');


--
-- Data for Name: BudgetTransaction; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."BudgetTransaction" VALUES ('cmqdp02bc003s7dohdu9bwj2p', 'cmqdp026r00007doh1gjw7j3j', 'cmqdp02ae002w7dohma5h0ljq', 'cmqdp029n00267doho3ac35xt', 'cmqdp02b9003q7doh2p22fvdc', 'cmqdp027e000b7dohchu7u117', '2026-06-03 00:00:00', 180000, 'OO식당', '식비', '****2345', NULL, true, false, '2026-06-14 11:20:04.537', '2026-06-14 11:20:04.537');
INSERT INTO public."BudgetTransaction" VALUES ('cmqdp02bh003w7dohd1mj17lg', 'cmqdp026r00007doh1gjw7j3j', 'cmqdp02ag002y7dohiobs5i4l', 'cmqdp029n00267doho3ac35xt', 'cmqdp02b9003q7doh2p22fvdc', 'cmqdp027e000b7dohchu7u117', '2026-06-10 00:00:00', 320000, 'OO체육관', '대관', '****7890', NULL, true, false, '2026-06-14 11:20:04.542', '2026-06-14 11:20:04.542');
INSERT INTO public."BudgetTransaction" VALUES ('cmqdp02bm00407dohw9my53qa', 'cmqdp026r00007doh1gjw7j3j', 'cmqdp02ae002w7dohma5h0ljq', 'cmqdp029n00267doho3ac35xt', 'cmqdp02b9003q7doh2p22fvdc', 'cmqdp027e000b7dohchu7u117', '2026-06-14 00:00:00', 74000, 'OO마트', '간식', '****1111', NULL, true, false, '2026-06-14 11:20:04.546', '2026-06-14 11:20:04.546');
INSERT INTO public."BudgetTransaction" VALUES ('cmqdp02bo00427dohqeppdm44', 'cmqdp026r00007doh1gjw7j3j', 'cmqdp02ag002y7dohiobs5i4l', 'cmqdp029n00267doho3ac35xt', NULL, 'cmqdp027e000b7dohchu7u117', '2026-06-17 00:00:00', 250000, 'OO스포츠', '장비', '****2222', NULL, true, false, '2026-06-14 11:20:04.548', '2026-06-14 11:20:04.548');
INSERT INTO public."BudgetTransaction" VALUES ('cmqdp02bs00467doh1607w6j0', 'cmqdp026r00007doh1gjw7j3j', 'cmqdp02ae002w7dohma5h0ljq', 'cmqdp029n00267doho3ac35xt', 'cmqdp02b9003q7doh2p22fvdc', 'cmqdp027e000b7dohchu7u117', '2026-06-21 00:00:00', 68000, 'OO카페', '간식', '****3333', NULL, true, false, '2026-06-14 11:20:04.552', '2026-06-14 11:20:04.552');


--
-- Data for Name: CheckinSession; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: Club; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Club" VALUES ('cmqdp026r00007doh1gjw7j3j', '러닝 동호회', 'RUNNING-2026', '2026-06-14 11:20:04.371', '2026-06-14 11:20:04.371');


--
-- Data for Name: CorporateCard; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."CorporateCard" VALUES ('cmqdp02ae002w7dohma5h0ljq', 'cmqdp026r00007doh1gjw7j3j', '회장 카드', 'celia', '1234', true, '2026-06-14 11:20:04.502', '2026-06-14 11:20:04.502');
INSERT INTO public."CorporateCard" VALUES ('cmqdp02ag002y7dohiobs5i4l', 'cmqdp026r00007doh1gjw7j3j', '총무 카드', 'min', '5678', true, '2026-06-14 11:20:04.504', '2026-06-14 11:20:04.504');


--
-- Data for Name: Faq; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: InviteCode; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."InviteCode" VALUES ('cmqdp026u00027dohhbss87iu', 'cmqdp026r00007doh1gjw7j3j', 'RUN-2026-INTERNAL', 'MEMBER', NULL, 0, NULL, true, '2026-06-14 11:20:04.375');


--
-- Data for Name: Meeting; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Meeting" VALUES ('cmqdp02ai00307dohbdh4mhzs', 'cmqdp026r00007doh1gjw7j3j', '6월 정기 러닝 모임', '한강 5km 러닝 후 저녁 회식', '한강공원', '2026-06-10 00:00:00', NULL, NULL, '2026-06-14 11:20:04.506', '2026-06-14 11:20:04.506');


--
-- Data for Name: MemberSnapshot; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."MemberSnapshot" VALUES ('cmqdp029p00287dohcdc8n00w', 'cmqdp026r00007doh1gjw7j3j', '2026-01-15 00:00:00', 2026, 1, 'FIRST_HALF', 20, '2026-06-14 11:20:04.478', '2026-06-14 11:20:04.478');
INSERT INTO public."MemberSnapshot" VALUES ('cmqdp029u002c7doheuab6rhl', 'cmqdp026r00007doh1gjw7j3j', '2026-02-15 00:00:00', 2026, 2, 'FIRST_HALF', 22, '2026-06-14 11:20:04.483', '2026-06-14 11:20:04.483');
INSERT INTO public."MemberSnapshot" VALUES ('cmqdp029y002g7dohc9rvj9wv', 'cmqdp026r00007doh1gjw7j3j', '2026-03-15 00:00:00', 2026, 3, 'FIRST_HALF', 21, '2026-06-14 11:20:04.486', '2026-06-14 11:20:04.486');
INSERT INTO public."MemberSnapshot" VALUES ('cmqdp02a1002k7doh9vslofxj', 'cmqdp026r00007doh1gjw7j3j', '2026-04-15 00:00:00', 2026, 4, 'FIRST_HALF', 21, '2026-06-14 11:20:04.49', '2026-06-14 11:20:04.49');
INSERT INTO public."MemberSnapshot" VALUES ('cmqdp02a5002o7doh3shl1l0s', 'cmqdp026r00007doh1gjw7j3j', '2026-05-15 00:00:00', 2026, 5, 'FIRST_HALF', 23, '2026-06-14 11:20:04.494', '2026-06-14 11:20:04.494');
INSERT INTO public."MemberSnapshot" VALUES ('cmqdp02aa002s7dohayzoja3h', 'cmqdp026r00007doh1gjw7j3j', '2026-06-15 00:00:00', 2026, 6, 'FIRST_HALF', 24, '2026-06-14 11:20:04.499', '2026-06-14 11:20:04.499');


--
-- Data for Name: Membership; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Membership" VALUES ('cmqdp027700077dohjz9ubguh', 'cmqdp027500057doh77igd2a7', 'cmqdp026r00007doh1gjw7j3j', 'alex', 'OWNER', 'ACTIVE', '2026-06-14 11:20:04.388', '2026-06-14 11:20:04.388', '2026-06-14 11:20:04.388');
INSERT INTO public."Membership" VALUES ('cmqdp027c000a7dohehtgx2uo', 'cmqdp027a00087doh3x84yhsm', 'cmqdp026r00007doh1gjw7j3j', 'celia', 'PRESIDENT', 'ACTIVE', '2026-06-14 11:20:04.392', '2026-06-14 11:20:04.392', '2026-06-14 11:20:04.392');
INSERT INTO public."Membership" VALUES ('cmqdp027g000d7dohpf6sol2y', 'cmqdp027e000b7dohchu7u117', 'cmqdp026r00007doh1gjw7j3j', 'min', 'TREASURER', 'ACTIVE', '2026-06-14 11:20:04.397', '2026-06-14 11:20:04.397', '2026-06-14 11:20:04.397');
INSERT INTO public."Membership" VALUES ('cmqdp027k000g7doh6osu8ag8', 'cmqdp027j000e7dohm1nn60vx', 'cmqdp026r00007doh1gjw7j3j', 'member01', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.401', '2026-06-14 11:20:04.401', '2026-06-14 11:20:04.401');
INSERT INTO public."Membership" VALUES ('cmqdp027o000j7doh9bzdifea', 'cmqdp027m000h7dohh5p510d5', 'cmqdp026r00007doh1gjw7j3j', 'member02', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.404', '2026-06-14 11:20:04.404', '2026-06-14 11:20:04.404');
INSERT INTO public."Membership" VALUES ('cmqdp027s000m7dohqtn5zfd7', 'cmqdp027q000k7dohsrpj8xou', 'cmqdp026r00007doh1gjw7j3j', 'member03', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.409', '2026-06-14 11:20:04.409', '2026-06-14 11:20:04.409');
INSERT INTO public."Membership" VALUES ('cmqdp027w000p7doh23svtex6', 'cmqdp027u000n7dohs0d3j0jg', 'cmqdp026r00007doh1gjw7j3j', 'member04', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.412', '2026-06-14 11:20:04.412', '2026-06-14 11:20:04.412');
INSERT INTO public."Membership" VALUES ('cmqdp0280000s7dohl6lwxxk3', 'cmqdp027x000q7doh8lp1u1yb', 'cmqdp026r00007doh1gjw7j3j', 'member05', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.416', '2026-06-14 11:20:04.416', '2026-06-14 11:20:04.416');
INSERT INTO public."Membership" VALUES ('cmqdp0284000v7doh97fxi20c', 'cmqdp0282000t7dohcuyhxj2v', 'cmqdp026r00007doh1gjw7j3j', 'member06', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.42', '2026-06-14 11:20:04.42', '2026-06-14 11:20:04.42');
INSERT INTO public."Membership" VALUES ('cmqdp0287000y7dohwvtay859', 'cmqdp0286000w7doh6gn6cuyc', 'cmqdp026r00007doh1gjw7j3j', 'member07', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.424', '2026-06-14 11:20:04.424', '2026-06-14 11:20:04.424');
INSERT INTO public."Membership" VALUES ('cmqdp028b00117doh961vi0ge', 'cmqdp0289000z7dohqzc5nj0z', 'cmqdp026r00007doh1gjw7j3j', 'member08', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.427', '2026-06-14 11:20:04.427', '2026-06-14 11:20:04.427');
INSERT INTO public."Membership" VALUES ('cmqdp028e00147dohi3kv90qe', 'cmqdp028d00127doh7q6ev3y7', 'cmqdp026r00007doh1gjw7j3j', 'member09', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.431', '2026-06-14 11:20:04.431', '2026-06-14 11:20:04.431');
INSERT INTO public."Membership" VALUES ('cmqdp028i00177dohscqgja2i', 'cmqdp028g00157doh8cmyxg7o', 'cmqdp026r00007doh1gjw7j3j', 'member10', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.434', '2026-06-14 11:20:04.434', '2026-06-14 11:20:04.434');
INSERT INTO public."Membership" VALUES ('cmqdp028l001a7doha3kuyex9', 'cmqdp028j00187dohc8h2nugc', 'cmqdp026r00007doh1gjw7j3j', 'member11', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.437', '2026-06-14 11:20:04.437', '2026-06-14 11:20:04.437');
INSERT INTO public."Membership" VALUES ('cmqdp028o001d7dohd3hj8m81', 'cmqdp028n001b7dohp6j243fq', 'cmqdp026r00007doh1gjw7j3j', 'member12', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.441', '2026-06-14 11:20:04.441', '2026-06-14 11:20:04.441');
INSERT INTO public."Membership" VALUES ('cmqdp028u001g7dohm6cza0gu', 'cmqdp028q001e7doh3x09g8zh', 'cmqdp026r00007doh1gjw7j3j', 'member13', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.446', '2026-06-14 11:20:04.446', '2026-06-14 11:20:04.446');
INSERT INTO public."Membership" VALUES ('cmqdp028x001j7dohv6yhh1kd', 'cmqdp028w001h7dohjlw0jqmk', 'cmqdp026r00007doh1gjw7j3j', 'member14', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.45', '2026-06-14 11:20:04.45', '2026-06-14 11:20:04.45');
INSERT INTO public."Membership" VALUES ('cmqdp0290001m7dohag4h6u5j', 'cmqdp028z001k7dohc5z73uop', 'cmqdp026r00007doh1gjw7j3j', 'member15', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.453', '2026-06-14 11:20:04.453', '2026-06-14 11:20:04.453');
INSERT INTO public."Membership" VALUES ('cmqdp0293001p7doh1al39wjx', 'cmqdp0292001n7dohklbjn734', 'cmqdp026r00007doh1gjw7j3j', 'member16', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.456', '2026-06-14 11:20:04.456', '2026-06-14 11:20:04.456');
INSERT INTO public."Membership" VALUES ('cmqdp0296001s7doh8kfhlkdh', 'cmqdp0295001q7dohb1ckbfwx', 'cmqdp026r00007doh1gjw7j3j', 'member17', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.459', '2026-06-14 11:20:04.459', '2026-06-14 11:20:04.459');
INSERT INTO public."Membership" VALUES ('cmqdp029a001v7dohup6hupd5', 'cmqdp0298001t7dohm94nksls', 'cmqdp026r00007doh1gjw7j3j', 'member18', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.462', '2026-06-14 11:20:04.462', '2026-06-14 11:20:04.462');
INSERT INTO public."Membership" VALUES ('cmqdp029d001y7dohdo5l169m', 'cmqdp029b001w7dohpsvlr5kl', 'cmqdp026r00007doh1gjw7j3j', 'member19', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.465', '2026-06-14 11:20:04.465', '2026-06-14 11:20:04.465');
INSERT INTO public."Membership" VALUES ('cmqdp029g00217dohe2znchys', 'cmqdp029e001z7doh14i1hjw4', 'cmqdp026r00007doh1gjw7j3j', 'member20', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.468', '2026-06-14 11:20:04.468', '2026-06-14 11:20:04.468');
INSERT INTO public."Membership" VALUES ('cmqdp029l00247doh5iarsfer', 'cmqdp029h00227doh8f44cdy3', 'cmqdp026r00007doh1gjw7j3j', 'member21', 'MEMBER', 'ACTIVE', '2026-06-14 11:20:04.473', '2026-06-14 11:20:04.473', '2026-06-14 11:20:04.473');


--
-- Data for Name: Report; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: SlackIntegration; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."SlackIntegration" VALUES ('cmqdp026x00047dohozxn1u0g', 'cmqdp026r00007doh1gjw7j3j', false, NULL, NULL, NULL, '2026-06-14 11:20:04.378', '2026-06-14 11:20:04.378');


--
-- Data for Name: TransactionReceipt; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."TransactionReceipt" VALUES ('cmqdp02bf003u7doh76u6vzlw', 'cmqdp02bc003s7dohdu9bwj2p', '/uploads/sample-receipt.png', 'cmqdp027e000b7dohchu7u117', '2026-06-14 11:20:04.539');
INSERT INTO public."TransactionReceipt" VALUES ('cmqdp02bj003y7dohyo47zuhk', 'cmqdp02bh003w7dohd1mj17lg', '/uploads/sample-receipt.png', 'cmqdp027e000b7dohchu7u117', '2026-06-14 11:20:04.544');
INSERT INTO public."TransactionReceipt" VALUES ('cmqdp02bq00447dohmxx18k3r', 'cmqdp02bo00427dohqeppdm44', '/uploads/sample-receipt.png', 'cmqdp027e000b7dohchu7u117', '2026-06-14 11:20:04.551');


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."User" VALUES ('cmqdp027500057doh77igd2a7', 'alex@example.com', 'alex', '2026-06-14 11:20:04.385', '2026-06-14 11:20:04.385');
INSERT INTO public."User" VALUES ('cmqdp027a00087doh3x84yhsm', 'celia@example.com', 'celia', '2026-06-14 11:20:04.391', '2026-06-14 11:20:04.391');
INSERT INTO public."User" VALUES ('cmqdp027e000b7dohchu7u117', 'min@example.com', 'min', '2026-06-14 11:20:04.395', '2026-06-14 11:20:04.395');
INSERT INTO public."User" VALUES ('cmqdp027j000e7dohm1nn60vx', 'member01@example.com', 'member01', '2026-06-14 11:20:04.399', '2026-06-14 11:20:04.399');
INSERT INTO public."User" VALUES ('cmqdp027m000h7dohh5p510d5', 'member02@example.com', 'member02', '2026-06-14 11:20:04.403', '2026-06-14 11:20:04.403');
INSERT INTO public."User" VALUES ('cmqdp027q000k7dohsrpj8xou', 'member03@example.com', 'member03', '2026-06-14 11:20:04.407', '2026-06-14 11:20:04.407');
INSERT INTO public."User" VALUES ('cmqdp027u000n7dohs0d3j0jg', 'member04@example.com', 'member04', '2026-06-14 11:20:04.41', '2026-06-14 11:20:04.41');
INSERT INTO public."User" VALUES ('cmqdp027x000q7doh8lp1u1yb', 'member05@example.com', 'member05', '2026-06-14 11:20:04.414', '2026-06-14 11:20:04.414');
INSERT INTO public."User" VALUES ('cmqdp0282000t7dohcuyhxj2v', 'member06@example.com', 'member06', '2026-06-14 11:20:04.418', '2026-06-14 11:20:04.418');
INSERT INTO public."User" VALUES ('cmqdp0286000w7doh6gn6cuyc', 'member07@example.com', 'member07', '2026-06-14 11:20:04.422', '2026-06-14 11:20:04.422');
INSERT INTO public."User" VALUES ('cmqdp0289000z7dohqzc5nj0z', 'member08@example.com', 'member08', '2026-06-14 11:20:04.426', '2026-06-14 11:20:04.426');
INSERT INTO public."User" VALUES ('cmqdp028d00127doh7q6ev3y7', 'member09@example.com', 'member09', '2026-06-14 11:20:04.429', '2026-06-14 11:20:04.429');
INSERT INTO public."User" VALUES ('cmqdp028g00157doh8cmyxg7o', 'member10@example.com', 'member10', '2026-06-14 11:20:04.432', '2026-06-14 11:20:04.432');
INSERT INTO public."User" VALUES ('cmqdp028j00187dohc8h2nugc', 'member11@example.com', 'member11', '2026-06-14 11:20:04.436', '2026-06-14 11:20:04.436');
INSERT INTO public."User" VALUES ('cmqdp028n001b7dohp6j243fq', 'member12@example.com', 'member12', '2026-06-14 11:20:04.439', '2026-06-14 11:20:04.439');
INSERT INTO public."User" VALUES ('cmqdp028q001e7doh3x09g8zh', 'member13@example.com', 'member13', '2026-06-14 11:20:04.443', '2026-06-14 11:20:04.443');
INSERT INTO public."User" VALUES ('cmqdp028w001h7dohjlw0jqmk', 'member14@example.com', 'member14', '2026-06-14 11:20:04.448', '2026-06-14 11:20:04.448');
INSERT INTO public."User" VALUES ('cmqdp028z001k7dohc5z73uop', 'member15@example.com', 'member15', '2026-06-14 11:20:04.451', '2026-06-14 11:20:04.451');
INSERT INTO public."User" VALUES ('cmqdp0292001n7dohklbjn734', 'member16@example.com', 'member16', '2026-06-14 11:20:04.454', '2026-06-14 11:20:04.454');
INSERT INTO public."User" VALUES ('cmqdp0295001q7dohb1ckbfwx', 'member17@example.com', 'member17', '2026-06-14 11:20:04.457', '2026-06-14 11:20:04.457');
INSERT INTO public."User" VALUES ('cmqdp0298001t7dohm94nksls', 'member18@example.com', 'member18', '2026-06-14 11:20:04.461', '2026-06-14 11:20:04.461');
INSERT INTO public."User" VALUES ('cmqdp029b001w7dohpsvlr5kl', 'member19@example.com', 'member19', '2026-06-14 11:20:04.464', '2026-06-14 11:20:04.464');
INSERT INTO public."User" VALUES ('cmqdp029e001z7doh14i1hjw4', 'member20@example.com', 'member20', '2026-06-14 11:20:04.467', '2026-06-14 11:20:04.467');
INSERT INTO public."User" VALUES ('cmqdp029h00227doh8f44cdy3', 'member21@example.com', 'member21', '2026-06-14 11:20:04.47', '2026-06-14 11:20:04.47');


--
-- Name: ActivityPhoto ActivityPhoto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ActivityPhoto"
    ADD CONSTRAINT "ActivityPhoto_pkey" PRIMARY KEY (id);


--
-- Name: Activity Activity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_pkey" PRIMARY KEY (id);


--
-- Name: Announcement Announcement_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_pkey" PRIMARY KEY (id);


--
-- Name: Attendance Attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: BudgetGrant BudgetGrant_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BudgetGrant"
    ADD CONSTRAINT "BudgetGrant_pkey" PRIMARY KEY (id);


--
-- Name: BudgetPeriod BudgetPeriod_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BudgetPeriod"
    ADD CONSTRAINT "BudgetPeriod_pkey" PRIMARY KEY (id);


--
-- Name: BudgetTransaction BudgetTransaction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BudgetTransaction"
    ADD CONSTRAINT "BudgetTransaction_pkey" PRIMARY KEY (id);


--
-- Name: CheckinSession CheckinSession_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CheckinSession"
    ADD CONSTRAINT "CheckinSession_pkey" PRIMARY KEY (id);


--
-- Name: Club Club_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Club"
    ADD CONSTRAINT "Club_pkey" PRIMARY KEY (id);


--
-- Name: CorporateCard CorporateCard_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CorporateCard"
    ADD CONSTRAINT "CorporateCard_pkey" PRIMARY KEY (id);


--
-- Name: Faq Faq_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Faq"
    ADD CONSTRAINT "Faq_pkey" PRIMARY KEY (id);


--
-- Name: InviteCode InviteCode_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InviteCode"
    ADD CONSTRAINT "InviteCode_pkey" PRIMARY KEY (id);


--
-- Name: Meeting Meeting_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Meeting"
    ADD CONSTRAINT "Meeting_pkey" PRIMARY KEY (id);


--
-- Name: MemberSnapshot MemberSnapshot_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MemberSnapshot"
    ADD CONSTRAINT "MemberSnapshot_pkey" PRIMARY KEY (id);


--
-- Name: Membership Membership_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Membership"
    ADD CONSTRAINT "Membership_pkey" PRIMARY KEY (id);


--
-- Name: Report Report_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_pkey" PRIMARY KEY (id);


--
-- Name: SlackIntegration SlackIntegration_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SlackIntegration"
    ADD CONSTRAINT "SlackIntegration_pkey" PRIMARY KEY (id);


--
-- Name: TransactionReceipt TransactionReceipt_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TransactionReceipt"
    ADD CONSTRAINT "TransactionReceipt_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: ActivityPhoto_activityId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ActivityPhoto_activityId_idx" ON public."ActivityPhoto" USING btree ("activityId");


--
-- Name: Activity_clubId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Activity_clubId_idx" ON public."Activity" USING btree ("clubId");


--
-- Name: Activity_meetingId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Activity_meetingId_key" ON public."Activity" USING btree ("meetingId");


--
-- Name: Announcement_clubId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Announcement_clubId_idx" ON public."Announcement" USING btree ("clubId");


--
-- Name: Attendance_meetingId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Attendance_meetingId_idx" ON public."Attendance" USING btree ("meetingId");


--
-- Name: Attendance_meetingId_membershipId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Attendance_meetingId_membershipId_key" ON public."Attendance" USING btree ("meetingId", "membershipId");


--
-- Name: AuditLog_action_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "AuditLog_action_idx" ON public."AuditLog" USING btree (action);


--
-- Name: AuditLog_clubId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "AuditLog_clubId_idx" ON public."AuditLog" USING btree ("clubId");


--
-- Name: BudgetGrant_clubId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "BudgetGrant_clubId_idx" ON public."BudgetGrant" USING btree ("clubId");


--
-- Name: BudgetGrant_clubId_year_month_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "BudgetGrant_clubId_year_month_key" ON public."BudgetGrant" USING btree ("clubId", year, month);


--
-- Name: BudgetGrant_periodId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "BudgetGrant_periodId_idx" ON public."BudgetGrant" USING btree ("periodId");


--
-- Name: BudgetGrant_snapshotId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "BudgetGrant_snapshotId_key" ON public."BudgetGrant" USING btree ("snapshotId");


--
-- Name: BudgetPeriod_clubId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "BudgetPeriod_clubId_idx" ON public."BudgetPeriod" USING btree ("clubId");


--
-- Name: BudgetPeriod_clubId_year_half_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "BudgetPeriod_clubId_year_half_key" ON public."BudgetPeriod" USING btree ("clubId", year, half);


--
-- Name: BudgetTransaction_activityId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "BudgetTransaction_activityId_idx" ON public."BudgetTransaction" USING btree ("activityId");


--
-- Name: BudgetTransaction_cardId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "BudgetTransaction_cardId_idx" ON public."BudgetTransaction" USING btree ("cardId");


--
-- Name: BudgetTransaction_clubId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "BudgetTransaction_clubId_idx" ON public."BudgetTransaction" USING btree ("clubId");


--
-- Name: BudgetTransaction_transactionDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "BudgetTransaction_transactionDate_idx" ON public."BudgetTransaction" USING btree ("transactionDate");


--
-- Name: CheckinSession_meetingId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "CheckinSession_meetingId_idx" ON public."CheckinSession" USING btree ("meetingId");


--
-- Name: CheckinSession_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "CheckinSession_token_key" ON public."CheckinSession" USING btree (token);


--
-- Name: Club_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Club_code_key" ON public."Club" USING btree (code);


--
-- Name: CorporateCard_clubId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "CorporateCard_clubId_idx" ON public."CorporateCard" USING btree ("clubId");


--
-- Name: Faq_clubId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Faq_clubId_idx" ON public."Faq" USING btree ("clubId");


--
-- Name: InviteCode_clubId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "InviteCode_clubId_idx" ON public."InviteCode" USING btree ("clubId");


--
-- Name: InviteCode_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "InviteCode_code_key" ON public."InviteCode" USING btree (code);


--
-- Name: Meeting_clubId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Meeting_clubId_idx" ON public."Meeting" USING btree ("clubId");


--
-- Name: MemberSnapshot_clubId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "MemberSnapshot_clubId_idx" ON public."MemberSnapshot" USING btree ("clubId");


--
-- Name: MemberSnapshot_clubId_year_month_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "MemberSnapshot_clubId_year_month_key" ON public."MemberSnapshot" USING btree ("clubId", year, month);


--
-- Name: Membership_clubId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Membership_clubId_idx" ON public."Membership" USING btree ("clubId");


--
-- Name: Membership_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Membership_status_idx" ON public."Membership" USING btree (status);


--
-- Name: Membership_userId_clubId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Membership_userId_clubId_key" ON public."Membership" USING btree ("userId", "clubId");


--
-- Name: Report_clubId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Report_clubId_idx" ON public."Report" USING btree ("clubId");


--
-- Name: SlackIntegration_clubId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "SlackIntegration_clubId_key" ON public."SlackIntegration" USING btree ("clubId");


--
-- Name: TransactionReceipt_transactionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TransactionReceipt_transactionId_idx" ON public."TransactionReceipt" USING btree ("transactionId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: ActivityPhoto ActivityPhoto_activityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ActivityPhoto"
    ADD CONSTRAINT "ActivityPhoto_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES public."Activity"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Activity Activity_clubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES public."Club"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Activity Activity_meetingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES public."Meeting"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Announcement Announcement_clubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES public."Club"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Attendance Attendance_meetingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES public."Meeting"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Attendance Attendance_membershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES public."Membership"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AuditLog AuditLog_clubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES public."Club"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: BudgetGrant BudgetGrant_clubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BudgetGrant"
    ADD CONSTRAINT "BudgetGrant_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES public."Club"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BudgetGrant BudgetGrant_periodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BudgetGrant"
    ADD CONSTRAINT "BudgetGrant_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES public."BudgetPeriod"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BudgetGrant BudgetGrant_snapshotId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BudgetGrant"
    ADD CONSTRAINT "BudgetGrant_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES public."MemberSnapshot"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: BudgetPeriod BudgetPeriod_clubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BudgetPeriod"
    ADD CONSTRAINT "BudgetPeriod_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES public."Club"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BudgetTransaction BudgetTransaction_activityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BudgetTransaction"
    ADD CONSTRAINT "BudgetTransaction_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES public."Activity"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: BudgetTransaction BudgetTransaction_cardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BudgetTransaction"
    ADD CONSTRAINT "BudgetTransaction_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES public."CorporateCard"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BudgetTransaction BudgetTransaction_clubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BudgetTransaction"
    ADD CONSTRAINT "BudgetTransaction_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES public."Club"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BudgetTransaction BudgetTransaction_periodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BudgetTransaction"
    ADD CONSTRAINT "BudgetTransaction_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES public."BudgetPeriod"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CheckinSession CheckinSession_meetingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CheckinSession"
    ADD CONSTRAINT "CheckinSession_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES public."Meeting"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CorporateCard CorporateCard_clubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CorporateCard"
    ADD CONSTRAINT "CorporateCard_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES public."Club"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Faq Faq_clubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Faq"
    ADD CONSTRAINT "Faq_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES public."Club"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InviteCode InviteCode_clubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InviteCode"
    ADD CONSTRAINT "InviteCode_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES public."Club"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Meeting Meeting_clubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Meeting"
    ADD CONSTRAINT "Meeting_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES public."Club"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MemberSnapshot MemberSnapshot_clubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MemberSnapshot"
    ADD CONSTRAINT "MemberSnapshot_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES public."Club"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Membership Membership_clubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Membership"
    ADD CONSTRAINT "Membership_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES public."Club"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Membership Membership_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Membership"
    ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Report Report_clubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES public."Club"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SlackIntegration SlackIntegration_clubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SlackIntegration"
    ADD CONSTRAINT "SlackIntegration_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES public."Club"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TransactionReceipt TransactionReceipt_transactionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TransactionReceipt"
    ADD CONSTRAINT "TransactionReceipt_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES public."BudgetTransaction"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


