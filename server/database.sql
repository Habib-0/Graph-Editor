
CREATE DATABASE graphs;




CREATE TABLE nodes (
    id SERIAL PRIMARY KEY,
    name TEXT,
    x FLOAT DEFAULT 0,
    y FLOAT DEFAULT 0
);

CREATE TABLE edges (
    edge_id SERIAL PRIMARY KEY,
    from_node INT NOT NULL,
    to_node INT NOT NULL,
    weight INT DEFAULT 1,
    directed BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_from_node FOREIGN KEY(from_node) REFERENCES nodes(id) ON DELETE CASCADE,
    CONSTRAINT fk_to_node FOREIGN KEY(to_node) REFERENCES nodes(id) ON DELETE CASCADE
);


CREATE TABLE log(
    id SERIAL PRIMARY KEY,
    name TEXT,
    table_name TEXT NOT NULL,
    data JSONB NOT NULL ,
    undone BOOLEAN  DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);