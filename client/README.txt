Overview

The Graph Editor is an interactive tool built with TypeScript, React.js, and the React Flow library.
Its main purpose is to help users visually create, edit, and manage graphs with nodes, edges, and their attributes in a user-friendly interface.

Project Background

I began this project by creating nodes and edges directly on the frontend using arrays.
Although I was able to visualize them successfully, all data disappeared whenever the server restarted — because I had no backend yet.

Initially, I attempted to use Neo4j for the backend but encountered several setup issues.
I eventually switched to PostgreSQL, which was easier to manage and more familiar to me because of my prior experience with MySQL.

After connecting PostgreSQL to my project using a Node.js (Express) API, I created database tables for nodes and edges along with their attributes.
To confirm the connection, I tested adding a new node from the frontend and verified that it appeared in the PostgreSQL database.

Implemented Features
1. Node and Edge Management

Add, delete, and edit nodes and edges interactively.

Each node stores a name, x- and y-coordinates, and can be repositioned through drag-and-drop.

Edges connect nodes dynamically and store attributes such as weight and direction.

2. Import and Export

Import and export graph data using CSV files via the PapaParse library.

Separate import options for nodes and edges.

A Save to Database button allows syncing the frontend with PostgreSQL.

Export graph data to CSV, PNG, and GraphML formats.

3. Undo and Redo Functionality

To manage change history, a new log table was introduced in the database.
Each add, update, or delete action is recorded for both nodes and edges, allowing:

Undo – revert the most recent change.

Redo – reapply a previously undone change.

This design allows safe navigation through the edit history without data loss.

4. Graph Layouts

Multiple graph layout algorithms were implemented:

Force-Directed Layout using D3.js for dynamic positioning and visual clarity.

Grid Layout to organize nodes in a structured grid.

Hierarchical Layout and Circular Layout, switchable with a single click.

5. Graph Analytics

Shortest Path Finder using Dijkstra’s algorithm.

Degree Centrality and PageRank analysis tools for exploring node importance.

Technology Stack

Frontend: React.js, TypeScript, React Flow

Backend: Node.js (Express)

Database: PostgreSQL

Libraries: D3.js, PapaParse, json2csv

Key Learnings

Through this project, I gained hands-on experience in both frontend and backend development.
I learned how to integrate React with a database-driven API, manage state efficiently, and handle data persistence.
Implementing Undo/Redo and graph layouts strengthened my understanding of algorithms and data structures.
Overall, this project improved my problem-solving, adaptability, and attention to detail as a developer