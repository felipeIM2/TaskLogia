
import removeItem from '../../middlewares/removeItem.js'
import setDataStock from '../../middlewares/setNewStockdb.js';

function showItemList(itemsOrderCompanie, list, getUser) {

  let lastOrder = Number(sessionStorage.getItem("lastOrder"));
  if (!itemsOrderCompanie || itemsOrderCompanie.length === 0) return;

  let filteredItems = itemsOrderCompanie.filter(v => v.numberorder === lastOrder);
  if (filteredItems.length === 0) return;

  let totalCost = 0;

 
  list.innerHTML = '';
  

  filteredItems.forEach(item => {

   
    
    let tr = document.createElement("tr");
    tr.setAttribute("class", "line");
      
    let td = document.createElement("td");

    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    let p3 = document.createElement("p");
    let button = document.createElement("button");
    let i = document.createElement("i");

    button.style.cssText = "width: 100px; background-color: transparent; border:none; font-size:14px; margin-left:4px; ";
    button.addEventListener("mouseover", () => {button.style.cssText = "color:#f51414; width: 90px; background-color: transparent; border:none; font-size:14px; transition:.4s; cursor:pointer;"})
    button.addEventListener('mouseout', () => {button.style.cssText = "width: 100px; background-color: transparent; border:none; font-size:14px; transition:.4s; margin-left:4px;";});
  
    i.classList = "fa-regular fa-trash-can"
    button.style.cursor = "pointer";

    let addButton = document.getElementById("icon")
    addButton.addEventListener("click", () => {
      
      addButton.classList.remove("fa-plus"); 
      addButton.classList.add("fa-check");   
      
      setTimeout(() => {
        addButton.classList.remove("fa-check"); 
        addButton.classList.add("fa-plus"); 
      }, 2000);
    });

    // addButton.addEventListener("mouseout", () => {
   
    //   addButton.classList.remove("fa-check");  
    //   addButton.classList.add("fa-plus");    
    // });


    let itemCost = item.amountorder * item.unitycost;

    p1.setAttribute("class", "nameItem")
    p2.setAttribute("class", "amountItem")
    p3.setAttribute("class", "costItem")
    p1.innerText = item.nameitem;
    p2.innerText = `QT: ${item.amountorder}`;
    p3.innerText = `VLU: ${item.unitycost}`;

    button.appendChild(i)
    td.appendChild(button);
    td.appendChild(p1);
    td.appendChild(p2);
    td.appendChild(p3);
    tr.appendChild(td);

    list.appendChild(tr);

    totalCost += itemCost;

    i.setAttribute("id", item.id);
    i.setAttribute("idcompanie", item.idcompanies);
    i.setAttribute("idproduct", item.idproduct);
    i.setAttribute("amountorder", item.amountorder);
    i.setAttribute("number", item.numberorder); 
 
    let totalItems = filteredItems.length;
      document.getElementById("totalItems").innerText = `Total de itens adicionados: ${totalItems}`


    button.addEventListener("click", (event) => {

     
      fetch('http://localhost:3000/stock')
      .then(res => {
        if (!res.ok) {
          throw new Error('Rede falhou: ' + res.status);
        }
        return res.json();
      })
      .then(data => {

        const itemId = event.target.getAttribute("id");
        const idcompanie = event.target.getAttribute("idcompanie");
        const idproduct = event.target.getAttribute("idproduct");
        const itemAmount = event.target.getAttribute("amountorder");
        const itemNumber = event.target.getAttribute("number");
        
        let item = {iditem: itemId, amountorder: itemAmount, numberorder:itemNumber, idproduct:idproduct }


        if(item.iditem === null){
          setTimeout(() =>  {
            location.reload()
          }, 600);
        }

        let findItem = data.find((v) => v.idproduct === Number(item.idproduct) && v.idcompanies === Number(idcompanie))
    
        function addStock(){

        let addStockItem = findItem.amount + Number(item.amountorder)
        findItem.amount = addStockItem

        }
       addStock()

        setDataStock(findItem)
        removeItem(item)

      })

        setTimeout(() => {
         location.reload()
        }, 900);

    });
  });

  sessionStorage.setItem("totalCost", totalCost);
  document.getElementById("itemsCost").innerText = `R$: ${totalCost.toFixed(2)}`;
}

export default showItemList;
