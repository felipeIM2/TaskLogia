
import setdata from '../../middlewares/setNewItemOrder.js'

const secretKey = "12345678901";

function showItemList(itemsOrderCompanie, list, getUser) {

  let encryptedOrder = sessionStorage.getItem('order');
  let bytes = CryptoJS.AES.decrypt(encryptedOrder, secretKey);
  let dataItemsLocal = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  let itemsCompanie = dataItemsLocal.filter((v) => v.idcompanies === getUser.idcompanies);
  
  let numberOrder = itemsCompanie.map((v) => v.numberorder);

   let lastOrder = Number(sessionStorage.getItem("lastOrder"))
  //  let lastOrder = (numberOrder[numberOrder.length - 1] === 0 || !numberOrder[numberOrder.length - 1]) ? 1001 : (numberOrder[numberOrder.length - 1] || 0) + 1;
    //sessionStorage.getItem("lastOrder", lastOrder)
   
  if (!itemsOrderCompanie || itemsOrderCompanie.length === 0) return;
  //console.log(lastOrder)
  let filteredItems = itemsOrderCompanie.filter(v => v.numberorder === lastOrder);
      //console.log(filteredItems)
  if (filteredItems.length === 0) return;

  let totalCost = 0;

  // Limpa a lista antes de adicionar novamente os itens
  list.innerHTML = '';

  filteredItems.forEach(item => {
    let tr = document.createElement("tr");
    tr.setAttribute("class", "line");

    let td = document.createElement("td");

    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    let p3 = document.createElement("p");
    let button = document.createElement("button");
    //button.style.width = "40px";
    button.style.cssText = "width: 40px; background-color: transparent; border:none; font-size:14px;";
    button.innerText = "DEL"; 

    let itemCost = item.amountorder * item.unitycost;

    p1.innerText = item.nameitem;
    p2.innerText = `QT: ${item.amountorder}`;
    p3.innerText = `VL: ${itemCost.toFixed(2)}`;

    td.appendChild(button);
    td.appendChild(p1);
    td.appendChild(p2);
    td.appendChild(p3);
    tr.appendChild(td);

    list.appendChild(tr);

    totalCost += itemCost;

    // Adicionando o evento de deletar o item
    button.addEventListener("click", () => {
      // Remover o item da lista 'filteredItems' com base no id do item
      const index = filteredItems.findIndex(v => v.id === item.id);
      if (index !== -1) {
        // Remove o item da lista 'filteredItems'
        filteredItems.splice(index, 1);

        // Atualizando os itens no sessionStorage
        let encryptedItems = sessionStorage.getItem('itemsOrder');
        let bytes = CryptoJS.AES.decrypt(encryptedItems, secretKey);
        let dataItemsOrder = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        
        // Remover o item de 'dataItemsOrder'
        const itemIndex = dataItemsOrder.findIndex(v => v.id === item.id);
        if (itemIndex !== -1) {
          dataItemsOrder.splice(itemIndex, 1); // Remove o item pelo id
        }

        // Atualizando sessionStorage com a lista modificada
        sessionStorage.setItem('itemsOrder', CryptoJS.AES.encrypt(JSON.stringify(dataItemsOrder), secretKey).toString());
        


      }
    });
  });

  sessionStorage.setItem("totalCost", totalCost);
  document.getElementById("itemsCost").innerText = `R$: ${totalCost.toFixed(2)}`;
}

export default showItemList;
