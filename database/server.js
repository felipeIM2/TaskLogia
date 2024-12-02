import express from "express";
import cors from "cors";
import { PrismaClient } from '@prisma/client';

const app = express();
const PORT = 3000;
const prisma = new PrismaClient();


app.use(cors());
app.use(express.json());





  app.post("/updateStatus", async (req, res) => {
    const data = req.body;

    try {
     // Atualizar o pedido com base no id
      const order = await prisma.order.update({
        where: {
          id: data.id,  // Usando o id do pedido para localizar o registro
        },
        data: {
          idemployee: data.idemployee, 
          idstatus: data.idstatus,      
          idcompanies: data.idcompanies,
          name: data.name,      
          numberorder: data.numberorder, 
          descript: data.descript,
          ordercost: data.ordercost,
          closeorderdetail: data.closeorderdetail || null
        },
      });
     console.log({ mensagem: "Dados atualizados com sucesso!", order });
    } catch (err) {
      console.error('Erro ao atualizar no banco:', err);
      return res.status(500).json({ mensagem: "Erro ao atualizar os dados." });
    }
  });


  app.post("/removeOrder", async (req, res) => {
    const data = req.body;
  
    try {
     
      await prisma.itemOrder.deleteMany({
        where: {
          idcompanies: data.idcompanie,
          numberorder: data.numberOrder  
        }
      });
  
      // Agora, remover a ordem
      const order = await prisma.order.delete({
        where: {
          id: data.id, 
        }
      });
      // console.log(data.id)
      console.log(`Ordem e itens removidos com sucesso: ${JSON.stringify(order)}`);
      return res.json({ mensagem: "Ordem e itens removidos com sucesso!", order });
    } catch (err) {
      console.error('Erro ao remover ordem e itens no banco:', err);
      return res.status(500).json({ mensagem: "Erro ao remover a ordem e os itens." });
    }
  });


  app.post("/removeItemsAll", async (req, res) => {
    const data = req.body;
  
    try {
     
      await prisma.itemOrder.deleteMany({
        where: {
          idcompanies: data.idcompanies,
          numberorder: data.lastorder  
        }
  
      });


      return res.json({ mensagem: "Ordem e itens removidos com sucesso!", order });
    } catch (err) {
      console.error('Erro ao remover ordem e itens no banco:', err);
      return res.status(500).json({ mensagem: "Erro ao remover a ordem e os itens." });
    }
  });


  app.post("/removeItem", async (req, res) => {
    const data = req.body;
  
    try {
     
      await prisma.itemOrder.delete({
        where: {
          id: data.iditem,
          amountorder: data.itemAmount,
          numberorder: data.itemNumber
        }
      });
      console.log(data)
      return res.json({ mensagem: "Ordem e itens removidos com sucesso!", order });
    } catch (err) {
      return res.status(500).json({ mensagem: "Erro ao remover a ordem e os itens." });
    }
  });


  app.post("/reciveNewOrder", async (req, res) => {
    const data = req.body;
    try {
      const order = await prisma.order.create({
        data: data
      });
      console.log(data)
      return res.json({ mensagem: "Dados recebidos e salvos com sucesso!", order });
    } catch (err) {
      console.error('Erro ao salvar no banco:', err);
      return res.status(500).json({ mensagem: "Erro ao salvar os dados." });
    }
  });
  

  app.post("/reciveItemOrder", async (req, res) => {
    const data = req.body;
    try {
      const itemOrder = await prisma.itemOrder.create({
        data: {
          idproduct: data.idproduct,
          idcompanies: data.idcompanies,
          numberorder: data.numberorder,
          amountorder: data.amountorder,
          amountstock: data.amountstock,
          nameitem: data.nameitem,
          unitycost: data.unitycost,
        },
      });
      console.log(data)
      return res.json({ mensagem: "Dados recebidos e salvos com sucesso!", itemOrder });
    } catch (err) {
      console.error('Erro ao salvar no banco:', err);
      return res.status(500).json({ mensagem: "Erro ao salvar os dados." });
    }
  });


  // app.post("/reciveStock", async (req, res) => {
  //   const data = req.body;
  //   try {
  //     const stock = await prisma.stock.create({
  //       data: {
  //         idcompanies: data.idcompanies,
  //         idproduct: data.idproduct,
  //         amount: data.amount,
  //         nameitem: data.nameitem,
  //         itemdescript: data.itemdescript,
  //         unitycost: data.unitycost,
  //       },
  //     });
  //     return res.json({ mensagem: "Dados recebidos e salvos com sucesso!", stock });
  //   } catch (err) {
  //     console.error('Erro ao salvar no banco:', err);
  //     return res.status(500).json({ mensagem: "Erro ao salvar os dados." });
  //   }
  // });


// ----------------------------------------------GET DATABASE------------------------------------------------------
 
  app.get("/orders", async (req, res) => {
    try {
      const orders = await prisma.order.findMany();
      return res.json(orders);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      return res.status(500).json({ mensagem: "Erro ao buscar pedidos." });
    }
  });
  

  app.get("/itemsOrder", async (req, res) => {
    try {
      const itemsOrders = await prisma.itemOrder.findMany();
      return res.json(itemsOrders);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      return res.status(500).json({ mensagem: "Erro ao buscar pedidos." });
    }
  });


  app.get("/companies", async (req, res) => {
    try {
      const companies = await prisma.company.findMany();
      return res.json(companies);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      return res.status(500).json({ mensagem: "Erro ao buscar pedidos." });
    }
  });

  app.get("/stock", async (req, res) => {
    try {
      const stock = await prisma.stock.findMany();
      return res.json(stock);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      return res.status(500).json({ mensagem: "Erro ao buscar pedidos." });
    }
  });

  app.get("/access", async (req, res) => {
    try {
      const access = await prisma.access.findMany();
      return res.json(access);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      return res.status(500).json({ mensagem: "Erro ao buscar pedidos." });
    }
  });

  app.get("/orderStatus", async (req, res) => {
    try {
      const orderStatus = await prisma.orderStatus.findMany();
      return res.json(orderStatus);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      return res.status(500).json({ mensagem: "Erro ao buscar pedidos." });
    }
  });



app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
