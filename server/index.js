import express from "express";
import cors from "cors";
import pool from "./db.js";
import { Parser } from "json2csv";

const app = express();

app.use(cors());
app.use(express.json());
app.post("/addnode", async (req, res) => {
  try {
    const { name, x, y } = req.body;
    const newNode = await pool.query(
      "INSERT INTO nodes(name,x,y) VALUES ($1,$2,$3) RETURNING *",
      [name, x, y]
    );


    await pool.query(
      "INSERT INTO log (name, table_name, data) VALUES ($1, $2, $3::jsonb)",
      ["addnode", "nodes", JSON.stringify(newNode.rows[0])]
    );

    res.json(newNode.rows[0]);
  } catch (error) {
    console.error(error);
  }
});


app.get("/nodes", async (req, res) => {
    try {

        const result = await pool.query("SELECT * FROM nodes");
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);

    }
});



app.post("/deletenode", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Node is not found" });
    }

    const result = await pool.query(
      "DELETE FROM nodes WHERE id=$1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(400).json({ message: "Node not found" });
    }


    await pool.query(
      "INSERT INTO log (name, table_name, data) VALUES ($1, $2, $3::jsonb)",
      ["deletenode", "nodes", JSON.stringify(result.rows[0])]
    );

    res.json({ message: "Node deleted", deleted: result.rows[0] });
  } catch (err) {
    console.log(err);
  }
});






app.post("/addedges", async (req, res) => {
  try {
    let { from_node, to_node, weight, directed } = req.body;
    if (directed === undefined) directed = true;

    const newEdge = await pool.query(
      "INSERT INTO edges (from_node,to_node,weight,directed) VALUES ($1,$2,$3,$4) RETURNING *",
      [from_node, to_node, weight, directed]
    );

    await pool.query(
      "INSERT INTO log (name, table_name, data) VALUES ($1, $2, $3::jsonb)",
      ["addedges", "edges", JSON.stringify(newEdge.rows[0])]
    );

    res.json(newEdge.rows[0]);
  } catch (err) {
    console.error(err);
  }
});


app.post("/deletedges", async (req, res) => {
  try {
    const { id } = req.body;
    const result = await pool.query(
      "DELETE FROM edges WHERE edge_id=$1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "Edge not found" });
    }

    await pool.query(
      "INSERT INTO log (name, table_name, data) VALUES ($1, $2, $3::jsonb)",
      ["deletedges", "edges", JSON.stringify(result.rows[0])]
    );

    res.json({ message: "Edge deleted ", deleted: result.rows[0] });
  } catch (err) {
    console.log(err);
  }
});


app.get("/edges",async(req,res)=>{
    try{

        const result= await pool.query("SELECT*FROM edges");
        res.json(result.rows);

    } catch{
        console.log(err);

    }
});



app.post("/uppdatenodes", async (req, res) => {
  try {
    const { id, x, y } = req.body;

    await pool.query("UPDATE nodes SET x=$1, y=$2 WHERE id=$3", [x, y, id]);

    res.json({ id, x, y });
  } catch (err) {
    console.error(err);

  }
});



app.post("/importnodes", async (req, res) => {
  try {
    const { nodes } = req.body;
    if (!nodes || !Array.isArray(nodes)) {
      return res.status(400).json({ message: "No nodes provided" });
    }

    for (let n of nodes) {
      if (!n || !n.position) continue;

      await pool.query(
        `INSERT INTO nodes (id, name, x, y)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id)
         DO UPDATE SET name = EXCLUDED.name, x = EXCLUDED.x, y = EXCLUDED.y`,
        [n.id, n.name, n.position.x, n.position.y]
      );
    }

    res.json({ message: "Nodes imported successfully!" });
  } catch (err) {
    console.error(err);

  }
});


app.post("/importedges", async (req, res) => {
  try {
    const { edges } = req.body;
    for (let n of edges) {
      const { from_node, to_node, weight, directed } = n;
      await pool.query(
        `INSERT INTO edges (from_node, to_node, weight, directed)
         VALUES($1,$2,$3,$4)`,
        [from_node, to_node, weight, directed]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.log(err);

  }
});



app.get("/exportall",async(req, res)=>{
  try{
    const nodeResult= await pool.query("SELECT *FROM nodes");
    const edgeResult=await pool.query("SELECT * FROM edges");

    const nodes= nodeResult.rows.map((n)=>({
      type:"node",
      id: n.id,
      name: n.name,
      x:n.x,
      y:n.y

    }));

    const edgdes=edgeResult.rows.map((e)=>({
        type:"edge",
        edge_id:e.edge_id,
        from_node:e.from_node,
        to_node:e.to_node,
        weight:e.weight,
        directed:e.directed

    }));

    const all=[...nodes,...edgdes];

    const fields=[
      "type",
      "id",
      "name",
      "x",
      "y",
      "edge_id",
      "from_node",
      "to_node",
      "weight",
      "directed",

    ];
    const parser=new Parser ({fields});
    const csv= parser.parse(all);

        res.header("Content-Type", "text/csv");
    res.attachment("graph_data.csv");
    res.send(csv);

  }catch(err){
    console.log(err)
  }
});


app.post("/undo", async (req, res) => {
  const lastAction = await pool.query(
    "SELECT * FROM log WHERE undone=false ORDER BY created_at DESC LIMIT 1"
  );
  if (lastAction.rows.length === 0) return res.json({ message: "Nothing to undo" });

  const action = lastAction.rows[0];
  const data = action.data;

  if (action.name === "addnode") {
    await pool.query("DELETE FROM nodes WHERE id=$1", [data.id]);
  } else if (action.name === "deletenode") {
    await pool.query(
      "INSERT INTO nodes (id,name,x,y) VALUES ($1,$2,$3,$4)",
      [data.id, data.name, data.x, data.y]
    );
  } else if (action.name === "addedges") {
    await pool.query("DELETE FROM edges WHERE edge_id=$1", [data.edge_id]);
  } else if (action.name === "deletedges") {
    await pool.query(
      "INSERT INTO edges (edge_id,from_node,to_node,weight,directed) VALUES ($1,$2,$3,$4,$5)",
      [data.edge_id, data.from_node, data.to_node, data.weight, data.directed]
    );
  }

  await pool.query("UPDATE log SET undone=true WHERE id=$1", [action.id]);
  res.json({ message: "Undo successful" });
});



app.post("/redo", async (req, res) => {
  const lastUndone = await pool.query(
    "SELECT * FROM log WHERE undone=true ORDER BY created_at DESC LIMIT 1"
  );
  if (lastUndone.rows.length === 0) return res.json({ message: "Nothing to redo" });

  const action = lastUndone.rows[0];
  const data = action.data;

  if (action.name === "addnode") {
    await pool.query(
      "INSERT INTO nodes (id,name,x,y) VALUES ($1,$2,$3,$4)",
      [data.id, data.name, data.x, data.y]
    );
  } else if (action.name === "deletenode") {

    await pool.query("DELETE FROM nodes WHERE id=$1", [data.id]);
  } else if (action.name === "addedges") {

    await pool.query(
      "INSERT INTO edges (edge_id,from_node,to_node,weight,directed) VALUES ($1,$2,$3,$4,$5)",
      [data.edge_id, data.from_node, data.to_node, data.weight, data.directed]
    );
  } else if (action.name === "deletedges") {

    await pool.query("DELETE FROM edges WHERE edge_id=$1", [data.edge_id]);
  }

  await pool.query("UPDATE log SET undone=false WHERE id=$1", [action.id]);
  res.json({ message: "Redo successful" });
});


app.put("/edges/by-nodes", async (req, res) => {
  const { from, to, weight } = req.body;
  try {
    const result = await pool.query(
      `
      UPDATE edges
      SET weight = $1
      WHERE (from_node = $2 AND to_node = $3)
         OR (from_node = $3 AND to_node = $2)
      RETURNING *;
      `,
      [Number(weight), Number(from), Number(to)]
    );

    if (result.rowCount === 0) {
      console.warn("Ingen edge uppdaterades:", from, to);
      return res.json({ success: false });
    }


    await pool.query(
      "INSERT INTO log (name, table_name, data) VALUES ($1, $2, $3::jsonb)",
      ["updateedge", "edges", JSON.stringify(result.rows[0])]
    );

    res.json({ success: true, edge: result.rows[0] });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false });
  }
});



app.put("/edges/:edge_id/weight", async (req, res) => {
  const { edge_id } = req.params;
  const { weight } = req.body;
  try {
    const r = await pool.query(
      "UPDATE edges SET weight=$1 WHERE edge_id=$2",
      [Number(weight), Number(edge_id)]
    );
    res.json({ success: r.rowCount > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.put("/api/nodes/:id/rename", async (req, res) => {
  const nodeId = req.params.id;
  const { name } = req.body;

  try {



    const result = await pool.query(
      "UPDATE nodes SET name = $1 WHERE id = $2 RETURNING *",
      [name.trim(), nodeId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Node not found" });
    }

    res.json({ success: true, updated: result.rows[0] });
  } catch (err) {
    console.error("Error updating node name:", err);
    
  }
});






app.listen(5000, () => {
    console.log("Server has started on port 5000");
});