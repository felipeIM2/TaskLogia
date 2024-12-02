import setNullItems from '../../functions/itemsList/setNewItemOrder.js'

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


    if (lastOrder === newLastOrder && seq === 1) {

 
     let deletDataItem = dataItemsLocal.filter(v => v.numberorder !== lastOrder);
      sessionStorage.setItem('newItemsOrder', CryptoJS.AES.encrypt(JSON.stringify(deletDataItem), secretKey).toString());
      sessionStorage.removeItem("seq")
     const itemsNewdata = deletDataItem.filter(item => item.id > 0).length;
     const itemsOldData = dataItemsLocal.filter(item => item.id > 0).length;

        //console.log(itemsNewdata, itemsOldData)
      if(itemsNewdata != itemsOldData){
        //console.log("aqui")
        setNewItems();
      }
    }
  } else {
    console.error("No encrypted items found in sessionStorage.");
  }

  // Função para definir novos itens após 5 segundos
  function setNewItems() {





    setTimeout(() => {
      // Recuperar os novos itens do sessionStorage
      let newDocumentItems = sessionStorage.getItem("newItemsOrder");
      let bytes = CryptoJS.AES.decrypt(newDocumentItems, secretKey);
      let newDatadb = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      
      if (newDocumentItems) {
        // Decriptografar os novos itens

        
        sessionStorage.removeItem("seq")
        sessionStorage.removeItem("newLastOrder")
        sessionStorage.removeItem("lastOrder")
        setNullItems(newDatadb)
   
      } else {
        console.error("No updated 'itemsOrder' found in sessionStorage.");
      }
    }, 100); // Atraso de 5 segundos
  }
}


export default cleanOrder;