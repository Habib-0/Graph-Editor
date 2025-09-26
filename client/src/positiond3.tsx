// import { forceSimulation, forceManyBody, forceLink, forceCenter } from 'd3-force';
// import { useEffect, useState } from 'react';
// import { ReactFlow } from '@xyflow/react';


// function forcelayout(nodes: any[], edges: any[], width = 800, height = 600) {
//   // Gör en deep copy så vi inte ändrar originalen
//   const simNodes = nodes.map(n => ({ ...n }));
//   const simEdges = edges.map(e => ({ ...e, source: e.source, target: e.target }));

//   // Skapa simulering
//   const simulation = forceSimulation(simNodes)
//     .force("charge", forceManyBody().strength(-300)) // repellerande krafter mellan noder
//     .force("link", forceLink(simEdges).id(d => d.id).distance(120)) // edge som fjäder
//     .force("center", forceCenter(width / 2, height / 2));

//   // Kör simuleringen ett antal gånger för att konvergera
//   for (let i = 0; i < 200; i++) {
//     simulation.tick();
//   }

//   // Returnera noder med positioner
//   return simNodes.map(n => ({
//     ...n,
//     position: { x: n.x!, y: n.y! } // D3 sätter x och y
//   }));
// }
