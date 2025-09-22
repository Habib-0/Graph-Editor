-- Skapa databas
CREATE DATABASE graphs;


\c graphs


CREATE TABLE nodes (
    id SERIAL PRIMARY KEY,
    name TEXT,
    x INT DEFAULT 0,
    y INT DEFAULT 0
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
