import setdata from "../../middlewares/removeOrderdb.js"
import setDataStock from "../../middlewares/setNewStockdb.js";

const secretKey = "12345678901";

function statusDelet(newWords) {


  // Verifica o status da ordem e impede a exclusão se o status for 2 ou 3
  if (newWords.idstatus === 2) {
    alert('Sua ordem está sendo processada e não pode ser excluída!');
  } else if (newWords.idstatus === 3) {
    alert('Sua ordem foi finalizada e não pode ser excluída!');
  } else {
 

    if (newWords) {
      //console.log(newWords)
    
       fetch('http://localhost:3000/itemsOrder')
       .then(res => {
         if (!res.ok) {
           throw new Error('Rede falhou: ' + res.status);
         }
         return res.json();
       })
       .then(data => {
          
        let findItems = data.filter((v) => v.numberorder === newWords.numberOrder)
            
        fetch('http://localhost:3000/stock')
        .then(res => {
          if (!res.ok) {
            throw new Error('Rede falhou: ' + res.status);
          }
          return res.json();
        })
        .then(data => {

          findItems.forEach(item => {
              
              //console.log(item)
              //console.log(data)
            let stockItem = data.find((v) => v.idproduct === item.idproduct);
              //console.log(stockItem)

            if (stockItem) {
                //console.log(stockItem.amount, item.amountorder)
              stockItem.amount += item.amountorder;

              setDataStock(stockItem)

              setdata(newWords)
      
              setTimeout(() => {
                location.reload()
              }, 500);

            }
          })

        })
         
       })
       .catch(error => {
         console.error('Erro ao carregar o JSON:', error);
       });

    } else {
      console.log("Ordem não encontrada para deletar.");
    }
  }
}

export default statusDelet;
