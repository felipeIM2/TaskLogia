const express = require("express");
const cors = require("cors");
const { PrismaClient } = require('@prisma/client');
const app = express();
const PORT = 3000;

// Instância do Prisma Client
const prisma = new PrismaClient();

// Middleware para CORS e JSON
app.use(cors());
app.use(express.json());

// Endpoint para "reciveOrder"
app.post("/reciveOrder", async (req, res) => {
  const dadosRecebidos = req.body;
  console.log(dadosRecebidos)
  try {
    // Criação de um novo pedido no banco de dados
    // const order = await prisma.order.create({
    //   data: {
    //     idemployee: dadosRecebidos.idemployee,
    //     idstatus: dadosRecebidos.idstatus,
    //     idcompanies: dadosRecebidos.idcompanies,
    //     name: dadosRecebidos.name,
    //     numberorder: dadosRecebidos.numberorder,
    //     descript: dadosRecebidos.descript,
    //     ordercost: dadosRecebidos.ordercost,
    //   },
    // });
    return res.json({ mensagem: "Dados recebidos e salvos com sucesso!", order });
  } catch (err) {
    console.error('Erro ao salvar no banco:', err);
    return res.status(500).json({ mensagem: "Erro ao salvar os dados." });
  }
});

// Endpoint para "reciveStock"
app.post("/reciveStock", async (req, res) => {
  const dadosRecebidos = req.body;
  try {
    // Criação de um novo item de estoque no banco de dados
    const stock = await prisma.stock.create({
      data: {
        idcompanies: dadosRecebidos.idcompanies,
        idproduct: dadosRecebidos.idproduct,
        amount: dadosRecebidos.amount,
        nameitem: dadosRecebidos.nameitem,
        itemdescript: dadosRecebidos.itemdescript,
        unitycost: dadosRecebidos.unitycost,
      },
    });
    return res.json({ mensagem: "Dados recebidos e salvos com sucesso!", stock });
  } catch (err) {
    console.error('Erro ao salvar no banco:', err);
    return res.status(500).json({ mensagem: "Erro ao salvar os dados." });
  }
});

// Endpoint para "reciveItemOrder"
app.post("/reciveItemOrder", async (req, res) => {
  const dadosRecebidos = req.body;
  try {
    // Criação de um novo item de pedido no banco de dados
    const itemOrder = await prisma.itemOrder.create({
      data: {
        idproduct: dadosRecebidos.idproduct,
        idcompanies: dadosRecebidos.idcompanies,
        numberorder: dadosRecebidos.numberorder,
        amountorder: dadosRecebidos.amountorder,
        amountstock: dadosRecebidos.amountstock,
        nameitem: dadosRecebidos.nameitem,
        unitycost: dadosRecebidos.unitycost,
      },
    });
    return res.json({ mensagem: "Dados recebidos e salvos com sucesso!", itemOrder });
  } catch (err) {
    console.error('Erro ao salvar no banco:', err);
    return res.status(500).json({ mensagem: "Erro ao salvar os dados." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
