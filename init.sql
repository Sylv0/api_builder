/* Create the contacts table */
CREATE TABLE IF NOT EXISTS 'main'.'databases' ( "id" INTEGER PRIMARY KEY  AUTOINCREMENT NOT NULL UNIQUE, "name" VARCHAR NOT NULL UNIQUE, "url" VARCHAR NOT NULL, "username" VARCHAR NOT NULL, "password" VARCHAR NOT NULL);
CREATE TABLE IF NOT EXISTS 'main'.'routes' ( "id" INTEGER PRIMARY KEY  AUTOINCREMENT NOT NULL UNIQUE, "route" VARCHAR NOT NULL UNIQUE, "method" VARCHAR NOT NULL, "action" VARCHAR NOT NULL);
