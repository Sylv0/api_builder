CREATE TABLE 'databases' ( 
    "id" INTEGER PRIMARY KEY  AUTOINCREMENT NOT NULL UNIQUE, 
    "name" VARCHAR NOT NULL UNIQUE, 
    "url" VARCHAR NOT NULL, 
    "username" VARCHAR NOT NULL, 
    "password" VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS 'routes' ( 
    "id" INTEGER PRIMARY KEY  AUTOINCREMENT NOT NULL UNIQUE,
    "database" INTEGER NOT NULL,
    "route" VARCHAR NOT NULL UNIQUE, 
    "method" VARCHAR NOT NULL, 
    "action" VARCHAR NOT NULL,
    FOREIGN KEY (database) REFERENCES databases(id)
);