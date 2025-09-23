import express from "express";
import cors from "cors";
import pool from "./db.js";

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

        res.json(newNode.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
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



app.post ("/deletenode",async(req,res)=>{
    try{
        const {id}=req.body;
        if(!id){
            return res.status(400).json({message:"Node is not found"});
        }
        const deletNOde="DELETE FROM nodes WHERE id=$1 RETURNING*";
        const result =await pool.query(deletNOde,[id]);

        if(result.rowCount===0){
            return res.status(400).json({message:" Node not found "});
        }

    }catch (err){
        console.log(err);
    }

});


app.post("/addedges",async (req, res)=>{

    try{

        const{ from_node,to_node ,weight ,directed}=req.body;
        const neweEdge=await pool.query ("INSERT INTO edges (from_node,to_node,weight,directed) VALUES ($1,$2,$3,$4)RETURNING*",
            [from_node, to_node, weight,directed]

        );
        res.json(neweEdge.rows[0]);
    }catch (err){
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

app.post("/deletedges",async(req,res)=>{
    try{
        const {id}=req.body;

        const deletEdge="DELETE FROM edges WHERE edge_id=$1 RETURNING*  ";
        const result=await pool.query(deletEdge,[id]);
        if(!id){
            return res.status(400).json({message : "not found id provided"});
        }


    res.json({
    message: "Edge deleted successfully",
    deletedEdge: result.rows[0],
    });
    }catch (err){
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


app.listen(5000, () => {
    console.log("Server has started on port 5000");
});
