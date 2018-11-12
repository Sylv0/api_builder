CREATE TABLE IF NOT EXISTS databases ( 
    id INTEGER PRIMARY KEY  AUTOINCREMENT NOT NULL UNIQUE, 
    name VARCHAR NOT NULL UNIQUE,
    type VARCHAR NOT NULL,
    url VARCHAR NOT NULL, 
    username VARCHAR NOT NULL, 
    password VARCHAR NOT NULL,
    CONSTRAINT chk_type CHECK (type IN ("sqlite", "mysql"))
);

CREATE TABLE IF NOT EXISTS routes ( 
    id INTEGER PRIMARY KEY  AUTOINCREMENT NOT NULL UNIQUE,
    database INTEGER NOT NULL,
    route VARCHAR NOT NULL UNIQUE, 
    method VARCHAR NOT NULL, 
    action VARCHAR NOT NULL,
    CONSTRAINT fk_database
        FOREIGN KEY (database)
        REFERENCES databases(id) ON DELETE CASCADE
);