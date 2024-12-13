 
  import addItemList from '../../functions/itemsList/addItemList.js';
  import showItemList from '../../functions/itemsList/showItemList.js';
  import cleanAllItems from '../../middlewares/removeItemsAll.js'
  import setDataStock from '../../middlewares/setNewStockdb.js'
  import setData from '../../middlewares/setNewOrderdb.js';
 
  let getUser = JSON.parse(sessionStorage.getItem("user"));
  
   sessionStorage.setItem("seq", 1)

   
   fetch('http://localhost:3000/stock')
   .then(res => {
     if (!res.ok) {
       throw new Error('Rede falhou: ' + res.status);
     }
     return res.json();
   })
   .then(dataStock => {
     // Criptografar e armazenar no localStorage
     const secretKey = "12345678901";
     
     let encryptedStock = CryptoJS.AES.encrypt(JSON.stringify(dataStock), secretKey).toString();
     localStorage.setItem("stock", encryptedStock);



  if(getUser === null) {
  window.location.replace("../login.html");
  } else {

    
    fetch('http://localhost:3000/orders')
    .then(res => {
      if (!res.ok) {
        throw new Error('Rede falhou: ' + res.status);
      }
      return res.json();
    })
    .then(dataOrder => {
      let encryptedOrderCompanie = CryptoJS.AES.encrypt(JSON.stringify(dataOrder), secretKey).toString();
      localStorage.setItem("order", encryptedOrderCompanie);
    })
    .catch(error => {
      console.error('Erro ao carregar o JSON:', error);
    });


    fetch('http://localhost:3000/itemsOrder')
    .then(res => {
      if (!res.ok) {
        throw new Error('Rede falhou: ' + res.status);
      }
      return res.json();
    })
    .then(data => {
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
      sessionStorage.setItem("itemsOrder", encryptedData);
    })
    .catch(error => {
      console.error('Erro ao carregar o JSON:', error);
    });



    
     let confirmLastOrder = sessionStorage.getItem("lastOrder") 
     let showNumber = document.getElementById("numberOrder")
     showNumber.innerText = `N° ${confirmLastOrder}`
  
    if(confirmLastOrder === null || confirmLastOrder === undefined){
      sessionStorage.setItem("lastOrder", 1001)
    }

    document.getElementById("textArea").value = ''

    let lastOrder = Number(sessionStorage.getItem("lastOrder"))
    sessionStorage.setItem("newLastOrder", lastOrder)
    

  document.getElementById("send").addEventListener("click", () => {

   
    let numberOrder = Number(sessionStorage.getItem("lastOrder"))

  
    let reciveName = document.getElementById("nameClient").value;
    if(reciveName === ''){return alert("Favor preencher o campo Nome")}
    let reciveCost = document.getElementById("orderCost").value;
    let reciveDescript = document.getElementById("textArea").value;
    if(reciveDescript.trim() === ''){return alert("Favor preencher o campo Descrição")} 
    
    let transform = {
        "idemployee": getUser.userID,
        "idstatus": 1,
        "idcompanies": getUser.idcompanies,
        "name": reciveName,
        "numberorder": numberOrder,//(numberOrder[numberOrder.length - 1] === 0 || !numberOrder[numberOrder.length - 1]) ? 1001 : (numberOrder[numberOrder.length - 1] || 0) + 1,
        "descript": reciveDescript.trim(),
        "ordercost": Number(reciveCost.replace(",", "."))
    };
  
        setData(transform)
        setTimeout(() => {

          sessionStorage.removeItem("nameClient");
          sessionStorage.removeItem("orderCost");
          sessionStorage.removeItem("textArea");
          document.getElementById("quantity").value = ''
          let numberOrder = Number(sessionStorage.getItem("lastOrder"))
           sessionStorage.setItem("lastOrder", numberOrder + 1)
         alert("Sua ordem foi salva!")
         location.reload()
        }, 400)

   });


  }


  const stock = localStorage.getItem("stock");
  let bytes = CryptoJS.AES.decrypt(stock, secretKey);
  let stockItems = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));


  const user = sessionStorage.getItem("user");
  let userInfo = JSON.parse(user);
  let verify = stockItems.filter((v) => v.idcompanies === userInfo.idcompanies);
   

  let newWords = verify.map((v) => ({
    id: v.id,
    idproduct: v.idproduct,
    idcompanies: v.idcompanies,
    nameitem: v.nameitem,
    amount: v.amount,
    unitycost:v.unitycost
  }));
 


  newWords.forEach((word) => {
   
    if(word.amount > 0 ){

    let select = document.getElementById("select");
    
    let option = document.createElement("option");
    option.value = word.idproduct; 
    option.innerHTML = word.nameitem
    
    select.appendChild(option);

    }
  
  });

  $('#select').on('select2:select', function(e) {
    let selectedId = e.params.data.id; 
    let selectedItem = newWords.find(word => word.idproduct == selectedId);
    
    if (selectedItem === undefined) {

     document.getElementById("idProduct").innerHTML = 'VALOR: 0';
     document.getElementById("idAmount").innerHTML = 'ESTOQUE: 0';
      

    } else {
      let price = selectedItem.unitycost;
      let verify = price.toString().includes(".");

      let idp = document.getElementById("idProduct")
      let ida = document.getElementById("idAmount")
        
      idp.setAttribute("class", "idProductON")  
      ida.setAttribute("class", "idAmountON")  


      if(verify === true) {
        let roundItem = selectedItem.unitycost.toFixed(2);
        document.getElementById("idProduct").innerHTML = `Preço Unidade: ${roundItem}`;
      } else {
        document.getElementById("idProduct").innerHTML = `Preço Unidade: ${selectedItem.unitycost}`;
      }

      document.getElementById("idAmount").innerHTML = `Quantidade Estoque: ${selectedItem.amount}`;
    }

    sessionStorage.setItem("itemSelect", JSON.stringify(selectedItem));
  });

  $('#select').on('select2:unselect', function(e) {  
    
    document.getElementById("idProduct").innerHTML = '';
    document.getElementById("idAmount").innerHTML = '';

    let idp = document.getElementById("idProduct")
    let ida = document.getElementById("idAmount")
      
    idp.setAttribute("class", "idProductOFF")  
    ida.setAttribute("class", "idAmountOFF")  


    sessionStorage.removeItem("itemSelect");
  });

  document.getElementById("addItemList").addEventListener("click", () => {
    let itemSelected = sessionStorage.getItem("itemSelect");
    let quantity = document.getElementById("quantity").value;
    let numberOrder = Number(sessionStorage.getItem("lastOrder"));
    
    if (itemSelected === "undefined" || itemSelected === null) {
      return alert("Favor selecionar um item no campo Itens");
    }

    if (quantity === null || quantity === '') {
      return alert("Favor preencher o campo quantidade");
    } else if (quantity === 0 || quantity === "0") {
      return alert("Favor preencher com um valor maior que 0");
    }else{
      
    }
    addItemList(itemSelected, quantity, numberOrder);
  
  });




  fetch('http://localhost:3000/itemsOrder')
  .then(res => {
    if (!res.ok) {
      throw new Error('Rede falhou: ' + res.status);
    }
    return res.json();
  })
  .then(dataItemsOrder => {


    let itemsOrderCompanie = dataItemsOrder.filter((v) => v.idcompanies === getUser.idcompanies);
    //console.log(itemsOrderCompanie)
    let list = document.getElementById("table")
    showItemList(itemsOrderCompanie, list, getUser)

  })
  .catch(error => {
    console.error('Erro ao carregar o JSON:', error);
  });


  document.getElementById("cleanList").addEventListener("click", () => {
    


    let lastOrder = Number(sessionStorage.getItem("lastOrder"));

    let deletAllItem = {
        idcompanies: getUser.idcompanies, 
        lastorder: lastOrder
    };
  
    let itemsOrder = sessionStorage.getItem("itemsOrder")
    let bytesItems = CryptoJS.AES.decrypt(itemsOrder, secretKey);
    let dataItemsLocal = JSON.parse(bytesItems.toString(CryptoJS.enc.Utf8));
     //console.log(dataItemsLocal)

    let itemsStock = localStorage.getItem("stock")
    let bytesStock = CryptoJS.AES.decrypt(itemsStock, secretKey);
    let dataItemsStock = JSON.parse(bytesStock.toString(CryptoJS.enc.Utf8));

    let stockCompanie = dataItemsStock.filter(v => v.idcompanies === getUser.idcompanies)
      

   dataItemsLocal.forEach(value => {

     let res = stockCompanie.find((v) => v.idproduct === value.idproduct)

      if(res){
        res.amount =  (Number(res.amount) + Number(value.amountorder))
      }
     
      setDataStock(res)
      cleanAllItems(deletAllItem)

      setTimeout(() => {
        location.reload()
      }, 500);

    }) 

  });
  

})
.catch(error => {
  console.error('Erro ao carregar o JSON:', error);
});


  // Função para salvar os dados no localStorage
function saveFormData() {
  const nameClient = document.getElementById("nameClient").value;
  const orderCost = document.getElementById("orderCost").value;
  const textArea = document.getElementById("textArea").value;

  sessionStorage.setItem("nameClient", nameClient);
  sessionStorage.setItem("orderCost", orderCost);
  sessionStorage.setItem("textArea", textArea);

  let itemSelected = JSON.parse(sessionStorage.getItem("itemSelect"));
  const quantity = document.getElementById("quantity").value;

  if(itemSelected) {

    if(itemSelected.amount >= quantity){
      const quantityColor = document.getElementById("quantity")
        quantityColor.style.color = "black" //"rgb(34, 135, 3)"
    }else {
      const quantityColor = document.getElementById("quantity")
        quantityColor.style.color = "rgb(252, 16, 0)"
    }
  }


}

document.getElementById("nameClient").addEventListener("input", saveFormData);
document.getElementById("orderCost").addEventListener("input", saveFormData);
document.getElementById("textArea").addEventListener("input", saveFormData);
document.getElementById("quantity").addEventListener("input", saveFormData);



// Função para recuperar os dados do localStorage e preencher os campos
function loadFormData() {
  const nameClient = sessionStorage.getItem("nameClient");
  const orderCost = sessionStorage.getItem("orderCost");
  const textArea = sessionStorage.getItem("textArea");

  
  if (nameClient) document.getElementById("nameClient").value = nameClient;
  if (orderCost) document.getElementById("orderCost").value = orderCost;
  if (textArea) document.getElementById("textArea").value = textArea
 


}

// Chame esta função quando a página for carregada
window.addEventListener("load", () => {
  setTimeout(() => {
    loadFormData()
  }, 500);
});


