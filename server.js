// servidor backend do app de estudos com IA
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor do Estudo Inteligente rodando 🚀");
});

app.post("/explain", async (req, res) => {
  try {
    const { text, level = "rapido" } = req.body;
    const prompt = `Explique de forma ${level} o seguinte conteúdo de estudo: ${text}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
      }),
    });

    const data = await response.json();
    const explanation = data.choices?.[0]?.message?.content || "Erro ao gerar explicação.";
    res.json({ explanation });
  } catch (err) {
    res.status(500).json({ error: "Erro interno no servidor", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
