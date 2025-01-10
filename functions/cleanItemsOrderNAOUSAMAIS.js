import cleanAllItems from '../../middlewares/removeItemsAll.js'
import setDataStock from '../../middlewares/setNewStockdb.js'

const secretKey = "12345678901";

function cleanOrder(){

  // Recuperar valores do sessionStorage
  let lastOrder = Number(sessionStorage.getItem("lastOrder"));
  let newLastOrder = Number(sessionStorage.getItem("newLastOrder"));
  let seq = Number(sessionStorage.getItem("seq"));
    
  // Recuperar e verificar se os dados de 'itemsOrder' existem no sessionStorage
  let encryptedItems = sessionStorage.getItem("itemsOrder");
   
  if (encryptedItems) {
    // Decriptografar os itens
    let bytesItems = CryptoJS.AES.decrypt(encryptedItems, secretKey);
    let dataItemsLocal = JSON.parse(bytesItems.toString(CryptoJS.enc.Utf8));
    //  console.log(dataItemsLocal)

    if (lastOrder === newLastOrder && seq === 1) {
 
     let deletDataItem = dataItemsLocal.filter(v => v.numberorder === lastOrder);
    
      sessionStorage.removeItem("seq")
     const itemsNewdata = deletDataItem.filter(item => item.idproduct > 0).length;
     const itemsOldData = dataItemsLocal.filter(item => item.idproduct > 0).length;
        // console.log(itemsNewdata)
        //console.log(itemsNewdata, itemsOldData)

  if(lastOrder != 1001 && itemsNewdata < 0){
     
      if(itemsNewdata != itemsOldData){
        
        function setNewItems() {
            // console.log("aqui")
      
          setTimeout(() => {
           
            if (deletDataItem) {
              
              let getUser = JSON.parse(sessionStorage.getItem("user"))
              let lastOrder = Number(sessionStorage.getItem("lastOrder"));
                
              let deletAllItem = {
                  idcompanies: getUser.idcompanies, 
                  lastorder: lastOrder
              };
            
          
              let itemsStock = localStorage.getItem("stock")
              let bytesStock = CryptoJS.AES.decrypt(itemsStock, secretKey);
              let dataItemsStock = JSON.parse(bytesStock.toString(CryptoJS.enc.Utf8));
                //console.log(dataItemsStock)
          
              let stockCompanie = dataItemsStock.filter(v => v.idcompanies === getUser.idcompanies)
                //console.log(stockCompanie)
          
             deletDataItem.forEach(value => {
          
               let res = stockCompanie.find((v) => v.idproduct === value.idproduct)
          
                if(res){
                  res.amount =  (Number(res.amount) + Number(value.amountorder))
                }

                // console.log(value)
                // console.log(res)
                //console.log(deletAllItem)
               
                setDataStock(res)
                cleanAllItems(deletAllItem)
          
              }) 

            } else {
              console.error("No updated 'itemsOrder' found in sessionStorage.");
            }
          }, 100); 
        }
          setNewItems()
      }
     }else {

      function setNewItems() {
        //console.log("aqui")
  
      setTimeout(() => {
       
        if (deletDataItem) {
          
          let getUser = JSON.parse(sessionStorage.getItem("user"))
          let lastOrder = Number(sessionStorage.getItem("lastOrder"));
            
          let deletAllItem = {
              idcompanies: getUser.idcompanies, 
              lastorder: lastOrder
          };
        
      
          let itemsStock = localStorage.getItem("stock")
          let bytesStock = CryptoJS.AES.decrypt(itemsStock, secretKey);
          let dataItemsStock = JSON.parse(bytesStock.toString(CryptoJS.enc.Utf8));
            //console.log(dataItemsStock)
      
          let stockCompanie = dataItemsStock.filter(v => v.idcompanies === getUser.idcompanies)
            //console.log(stockCompanie)
      
         deletDataItem.forEach(value => {
      
           let res = stockCompanie.find((v) => v.idproduct === value.idproduct)
      
            if(res){
              res.amount =  (Number(res.amount) + Number(value.amountorder))
            }

            // console.log(value)
            // console.log(res)
            //console.log(deletAllItem)
           
            setDataStock(res)
            cleanAllItems(deletAllItem)
      
          }) 

        } else {
          console.error("No updated 'itemsOrder' found in sessionStorage.");
        }

       }, 100); 
     }
     setNewItems()
    } 
   }
  } else {
    console.error("No encrypted items found in sessionStorage.");
  }



}


export default cleanOrder;