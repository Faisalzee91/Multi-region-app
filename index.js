const express = require('express');
const os = require('os');

const app = express();
const port = process.env.PORT || 8080;

// Detect AWS Region from environment variable
const region = process.env.AWS_REGION || "Unknown Region";

// HTML response
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Multi-Region AWS App</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background-color: #f4f6f8; 
          }
          h1 { color: #232f3e; }
          .box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
          }
          .region {
            font-size: 18px;
            font-weight: bold;
            color: #d13212;
          }
        </style>
      </head>
      <body>

        <h1>AWS Multi-Region Disaster Recovery Demo</h1>

        <div class="box">
          <h2>Project Overview</h2>
          <p>
            This application is deployed in multiple AWS Regions using AWS App Runner.
            The goal is to demonstrate high availability, automated deployment,
            and disaster recovery architecture.
          </p>
        </div>

        <div class="box">
          <h2>How It Works</h2>
          <ul>
            <li>Code is pushed to GitHub.</li>
            <li>AWS App Runner automatically builds and deploys the app.</li>
            <li>The application is deployed in two regions (e.g., US-East-1 and US-West-2).</li>
            <li>Each region runs independently.</li>
            <li>Traffic can be routed via Route 53 for failover.</li>
          </ul>
        </div>

        <div class="box">
          <h2>Current Serving Region</h2>
          <p class="region">${region}</p>
        </div>

        <div class="box">
          <h2>Architecture Highlights</h2>
          <ul>
            <li>Fully managed deployment (no server management)</li>
            <li>Auto-scaling enabled</li>
            <li>Stateless design for easy multi-region deployment</li>
            <li>Disaster Recovery Ready</li>
          </ul>
        </div>

      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running on port ${port} in ${region}`);
});
