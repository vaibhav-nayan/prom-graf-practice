import express from "express";
import { metricsMiddleware } from "./metrics";
import client from "prom-client";

const app = express();

app.use(express.json());
app.use(metricsMiddleware);

app.get("/user", async (req, res) => {
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    res.send({
        name: "John Doe",
        age: 25,
    });
});

app.post("/user", (req, res) => {
    const user = req.body;
    res.send({
        ...user,
        id: 1,
    });
});

app.get('/metrics', async(req, res) =>{
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.send(metrics);
})

app.listen(3000);