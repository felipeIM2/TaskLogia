  

  import statusInit from '../../functions/modifyStatus/statusInit.js';
  import statusClose from '../../functions/modifyStatus/statusClose.js';
  import showDataCompanie from '../../functions/showDataCompanie.js'
  import roundOrderCost from '../../functions/roundOrderCost.js'
  import statusReOpen from '../../functions/modifyStatus/statusReOpen.js';
  import statusCancel from '../../functions/modifyStatus/statusCancel.js';
  import statusDelet from '../../functions/modifyStatus/statusDelet.js';
  import statusEdit from '../../functions/modifyStatus/statusEdit.js'
  import updatePagination from '../../functions/pagination.js';
  import apiGet from '../../api/apiGet.js';

  const secretKey = "12345678901";


  fetch('http://localhost:3000/orderStatus')
  .then(res => {
    if (!res.ok) {
      throw new Error('Rede falhou: ' + res.status);
    }
    return res.json();
  })
  .then(dataOrderStatus => {
     
    let status = JSON.stringify(dataOrderStatus)
    localStorage.setItem("orderStatus", status)
    
  })
  .catch(error => {
    console.error('Erro ao carregar o JSON:', error);
  });

  
  let currentPage = 1;
  let itemsPerPage = 0;       
  let totalItems = 0;           
  let totalPages = 0;           
  let newWords = [];    

  setTimeout(() => {

    let state = localStorage.getItem("checkOrderState");
    if(state === null){
      localStorage.setItem("checkOrderState", false);
     location.reload()
    }
    
  }, 100);

  let userCheck = sessionStorage.getItem("user")
  if(!userCheck){

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("i");
    localStorage.removeItem("order");
    localStorage.removeItem("stock");
    localStorage.removeItem("checkOrderState")
    
    window.location.href = '../login.html'

  }
 

  sessionStorage.removeItem('itemSelect');
  sessionStorage.removeItem('totalCost');
  sessionStorage.removeItem('activeTabIndex');
  sessionStorage.removeItem("nameClient");
  sessionStorage.removeItem("orderCost");
  sessionStorage.removeItem("textArea");
  

  function adjustItemsPerPage(getUser) {

    

    const larguraTela = window.innerHeight;
  
    if (larguraTela >= 1200) {  
      itemsPerPage = 15; 
    } else if (larguraTela >= 768) { 
      itemsPerPage = 12; 
    } else { 
      itemsPerPage = 5;  
    }
  
    totalPages = Math.ceil(totalItems / itemsPerPage);
    displayPage(currentPage, getUser);
    updatePagination(getUser, currentPage, totalPages, displayPage);
  }

  window.addEventListener('resize', adjustItemsPerPage);
  adjustItemsPerPage();

  apiGet(nameCompanie, showDataCompanie, loadPage, nameEmployee, () => {
    loadPage(getUser)
  });


  function nameCompanie(dataCompanies) {

    setTimeout(() => {

      // let documentNameCompanie = document.getElementById("companieName");
      // let getUser = JSON.parse(sessionStorage.getItem("user"));
      // let userNameCompanie = dataCompanies.filter((v) => v.idcompanies === getUser.idcompanies);
      // documentNameCompanie.innerText = userNameCompanie[0].nomeFantasia;

    }, 100);

  }

  window.addEventListener('load', () => {
    const checkBox = document.getElementById("checkOrderValue");
    // Verifica se há um valor armazenado no localStorage
    const isChecked = localStorage.getItem("checkOrderState") === 'true';
  
    // Define o estado do checkbox conforme o valor armazenado
    checkBox.checked = isChecked;
  });





 function loadPage(getUser) {


  sessionStorage.setItem("i", 1)
  
  let encryptedOrder = localStorage.getItem("order");

  const savedPage = sessionStorage.getItem("currentPage");
  currentPage = savedPage ? parseInt(savedPage) : 1;

  if (encryptedOrder != null) {
    let bytes = CryptoJS.AES.decrypt(encryptedOrder, secretKey);
    let localOrder = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    let numberOrder = localOrder.map((v) => v.numberorder);
    let lastOrder = (numberOrder[numberOrder.length - 1] === 0 || !numberOrder[numberOrder.length - 1]) ? 1001 : (numberOrder[numberOrder.length - 1] || 0) + 1;
    sessionStorage.setItem("lastOrder", lastOrder)

    newWords = localOrder.map((v) => ({
      id: v.id,
      idcompanie: v.idcompanies,
      name: v.name,
      numberOrder: v.numberorder,
      idstatus: v.idstatus,
      orderDetail: v.descript,
      orderCost: v.ordercost
    }));

    totalItems = newWords.length;
    adjustItemsPerPage();  

    displayPage(currentPage, getUser);
    updatePagination(getUser, currentPage, totalPages, displayPage);
  
  }
}


  function getItemsOrder() {
   
    let phase = sessionStorage.getItem("i");

    if(phase === "2") { return; }

    let getUser = JSON.parse(sessionStorage.getItem("user"));
    
    // Decrypt the order from sessionStorage
    let encryptedOrder = sessionStorage.getItem('order');
    let bytes = CryptoJS.AES.decrypt(encryptedOrder, secretKey);
    let dataItems = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    
    // Filter the items for the user's company
    let itemsCompanie = dataItems.filter(v => v.idcompanies === getUser.idcompanies);
    
    // Get the numberOrder values
    let numberOrder = itemsCompanie.map(v => v.numberorder);
    
    // Decrypt the itemsOrder from sessionStorage
    let encryptedItems = sessionStorage.getItem("itemsOrder");
    let bytesItems = CryptoJS.AES.decrypt(encryptedItems, secretKey);
    let dataItemsLocal = JSON.parse(bytesItems.toString(CryptoJS.enc.Utf8));
    
    // Filter the itemsOrder for the user's company
    let itemsOrderCompanie = dataItemsLocal.filter(v => v.idcompanies === getUser.idcompanies);
    
    // Initialize an object to hold the total cost for each numberOrder
    let totalCosts = {};
    
    // Iterate over each numberOrder to sum the cost per order
    numberOrder.forEach(orderNumber => {
      // Filter items for the current order number
      let filteredItems = itemsOrderCompanie.filter(v => v.numberorder === orderNumber);
      
      // Sum up the cost for the filtered items
      let totalCost = filteredItems.reduce((sum, item) => {
        return sum + (item.amountorder * item.unitycost);
      }, 0);
      
      // Store the total cost for the current order number
      totalCosts[orderNumber] = totalCost;
    });

    // Now, update each order in newWords with its orderCost and totalCosts
    newWords.forEach(order => {
      const orderNumber = order.numberOrder;
      
      // If there is a total cost for this order number, add it to the order cost
      if (totalCosts[orderNumber] !== undefined) {
        sessionStorage.setItem("i", 2);
        order.orderCost = (order.orderCost || 0) + totalCosts[orderNumber]; // Update orderCost directly
      }
    });
  
    
    // After updating the costs, re-render the page to show the updated values
    displayPage(currentPage, getUser);
  }


  function displayPage( page, getUser) {

    let status = JSON.parse(localStorage.getItem("orderStatus"))
    
   
    const tableBody = document.getElementById("localTable");
    tableBody.innerHTML = '';  

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

        
    for (let i = startIndex; i < endIndex; i++) {
      const order = newWords[i];
   
    
      const statusName = status.filter((v) => v.idstatus === order.idstatus);

      const row = document.createElement("tr");

      row.addEventListener("mouseenter", () => { row.style.backgroundColor = "#e6e6e6" });
      row.addEventListener("mouseleave", () => { row.style.backgroundColor = "#f6f6f9" });

      const clientCell = document.createElement("td");
      const numberOrderCell = document.createElement("td");
      const orderDetail = document.createElement("td");
      const orderCost = document.createElement("td");
      const statusCell = document.createElement("td");
      const statusBackground = document.createElement("p");

      const icon = document.createElement("td");
      icon.classList = "icon";
      icon.style.marginRight = "25px";

      const dropdown = document.createElement("div");
      dropdown.classList = "dropdownContent";
      dropdown.style.position = "absolute"

      
      const initOrder = document.createElement("a");
      initOrder.innerText = 'Iniciar Ordem';
      initOrder.addEventListener("click", () => {statusInit(order, getUser); });

      
      const closeOrder = document.createElement("a");
      closeOrder.innerText = 'Finalizar Ordem';
      closeOrder.addEventListener("click", () => { 
        let dataSession = sessionStorage.getItem("order");
        let bytes = CryptoJS.AES.decrypt(dataSession, secretKey);
        let sessionOrder = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        statusClose(order, getUser, sessionOrder);
      });


      const cancelOrder = document.createElement("a");
      cancelOrder.innerText = 'Cancelar Ordem';
      cancelOrder.addEventListener("click", () => { statusCancel(order, getUser); });


      const editOrder = document.createElement("a");
      editOrder.innerText = 'Editar Ordem';
      editOrder.addEventListener("click", () => {statusEdit(order,newWords, getUser); });
        //console.log(order)
      const reOpenOrder = document.createElement("a");
      reOpenOrder.innerText = 'Reabrir Ordem';
      reOpenOrder.addEventListener("click", () => {statusReOpen(order, getUser); });
      
      const deletOrder = document.createElement("a");
      deletOrder.innerText = 'Excluir Ordem';
      deletOrder.addEventListener("click", () => { statusDelet(order); });



      dropdown.appendChild(initOrder);
      dropdown.appendChild(closeOrder);
      dropdown.appendChild(cancelOrder);
      dropdown.appendChild(editOrder);
      dropdown.appendChild(reOpenOrder);
      dropdown.appendChild(deletOrder);
      icon.appendChild(dropdown);

    
      orderDetail.style.maxWidth = "310px";
      orderDetail.style.minWidth = "100px";
      orderDetail.style.paddingRight = "20px";
      statusCell.style.width = "155px";

      if (statusName.length > 0) {
        const statusColor = getStatusColor(statusName[0].idstatus);
        statusBackground.style.backgroundColor = statusColor.bgColor;
        statusBackground.style.color = statusColor.textColor; 
        statusBackground.style.margin = "0px";
        statusBackground.style.borderRadius = "5px";
        statusBackground.style.textAlign = "center";
        statusBackground.textContent = statusName[0].status;
        statusBackground.style.fontWeight = "600";
      } else {
        statusBackground.textContent = `Status não encontrado!`;
        statusBackground.style.backgroundColor = "darkgray";  
        statusBackground.style.color = "black";
        statusBackground.style.fontSize = "17px";
        statusBackground.style.width = "200px";
        statusBackground.style.fontWeight = "600";
      }

      statusCell.appendChild(statusBackground);

      clientCell.textContent = order.name;
      numberOrderCell.textContent = order.numberOrder;
      orderDetail.textContent = order.orderDetail;


      // Atualiza o valor na interface
      orderCost.textContent = `R$: ${roundOrderCost(order.orderCost, 2)}`;


      row.appendChild(numberOrderCell);
      row.appendChild(clientCell);
      row.appendChild(orderDetail);
      row.appendChild(orderCost);
      row.appendChild(statusCell);
      row.appendChild(icon);

      tableBody.appendChild(row);
      
      
    }

    let checkOrder = localStorage.getItem("checkOrderState")
    if(checkOrder){showCheck(checkOrder)}
  }



  function showCheck(checkOrder){
   // console.log(checkOrder)
    if (checkOrder && checkOrder === false || checkOrder === "false" ) {  
      let checkState = 1
      if (checkState === 1) {  
       
        setTimeout(() => { getItemsOrder() }, 500)
       

      }
    }

  }
 

  document.getElementById("checkOrderValue").addEventListener("click", () => {
    let check = document.getElementById("checkOrderValue").checked;
    localStorage.setItem("checkOrderState", check);
    window.location.reload()
  });


//  cleanOrder()

  function getStatusColor(statusId) {
    switch (statusId) {
      case 1:
        return { bgColor: "DarkCyan", textColor: "white" }; 
      case 2:
        return { bgColor: "darkorange", textColor: "white" }; 
      case 3:
        return { bgColor: "darkgreen", textColor: "white" }; 
      case 5:
        return { bgColor: "darkred", textColor: "white" };  
      default:
        return { bgColor: "darkgray", textColor: "black" }; 
    }
  }

  document.getElementById("exitButton").addEventListener("click", () => {
    let btn = document.getElementById("exitButton");
    btn.blur();
  
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("i");
    localStorage.removeItem("order");
    localStorage.removeItem("stock");
    localStorage.removeItem("checkOrderState")

    
    window.location.href = '../login.html'
  });

  function nameEmployee(getUser) {
    // let name = document.getElementById("nameEmployee");
    // let usrName = getUser.user.toUpperCase();
    // name.innerText = `${usrName} ${getUser.userID}`;
  }



// Abrir o dropdown quando clicar no botão
document.getElementById("dropdown").addEventListener("click", (event) => {
  event.stopPropagation(); // Impede o evento de propagação para o documento
  let dropdownMenu = document.querySelector(".dropdown-menu");
  
  // Alterna a classe que exibe o dropdown
  dropdownMenu.classList.toggle("dropdown-menuON");
});

// Fechar o dropdown se clicar fora do menu
document.addEventListener("click", (event) => {
  let dropdownMenu = document.querySelector(".dropdown-menu");
  let dropdown = document.getElementById("dropdown");

  // Verifica se o clique foi fora do dropdown e do botão
  if (!dropdown.contains(event.target)) {
    dropdownMenu.classList.remove("dropdown-menuON");
  }
});




