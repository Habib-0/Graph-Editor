Project Overview

Iam building a Graph Editor using TypeScript,React js,and the React flow libary.
The purpose of this tool is to visualize edit,and mange graphs interactively.


I began by adding nodes and edges only in my front-end as an array, and I was able to see my nodes and edges.

However, when I restarted my server, the data disappeared because I didn't have any backend.

Then, I decided to use Neo4j. I tried to set it up but faced many issues. I eventually changed.

my mind and decided to use PostgreSQL because it was easier and similar to MySQL. I already have experience with MySQL.

I connected my backend through a Node.js API, created a database, and set up tables for nodes and edges with their attributes.

I was able to successfully connect my database to my project. To verify the connection, I clicked on "Add Node"

 in the frontend, and then checked my PostgreSQL terminal to see that the new node I added appeared in the database.

 then i added attributes to my nodes where i can write my nodes namne and saving the postition of my nodes on x and y and

i could drag an edge to my nodes and it connected as an edge.
I’ve implemented the import and export functionality using CSV files.

I’m using the PapaParse library, which allows me to open local files.

When I click Import, I can choose either nodes or edges.

First, I import the nodes and save them to my database.

I’ve also created a Save to Database button — when I click it, I can see my nodes displayed on the website. i have to refresh my website efter saving to databse

Then, I click Import again and import the edges.
I save them to the database as well as the frontend, and I can now see all my nodes and edges along with their attributes.

To implement the Undo and Redo functionality in my project, I had to redesign parts of my backend to properly track all changes made to the graph (nodes and edges).

I introduced a new database table called log, which serves as a history tracker for all modifications.

Every time I perform an operation — such as adding, updating, or deleting a node or an edge — I insert a record of that action into the log table.
This ensures that every change to the graph is saved chronologically and can be reversed when needed.

When a node or edge is deleted, its data is stored in the log table before removal, allowing the system to restore it later.

The Undo operation retrieves the most recent log entry and reverses that change (for example, re-adding a deleted node or removing a recently added one).

The Redo operation reapplies the last undone action by re-executing the stored data from the log.

This design allows users to safely step backward and forward through their editing history without losing data or breaking the graph structure.

I have implemented the Force-Directed Layout, Using the d3 libary . which visually arranges the graph with animations and directional arrows so that users can easily understand the connections between nodes.

I have also created a Grid Layout, where users can click the “Grid” button and see all nodes neatly organized in a grid structure.

Additionally, I implemented both the Hierarchical and Circular Layouts, allowing users to click on them and instantly visualize the graph in those styles.