
import removeItem from '../../middlewares/removeItem.js'
import setDataStock from '../../middlewares/setNewStockdb.js';

function showItemList(itemsOrderCompanie, list) {

  let itemsOrder = JSON.parse(sessionStorage.getItem("itemsOrderEdit"))


  let lastOrder = Number(sessionStorage.getItem("lastOrder"));

  //if (!itemsOrderCompanie || itemsOrderCompanie.length === 0) return;

  let totalCost = 0;

 
  list.innerHTML = '';
  

  itemsOrder.forEach(item => {
   
     
    let tr = document.createElement("tr");
    tr.setAttribute("class", "line");
   
      
    let td = document.createElement("td");

    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    let p3 = document.createElement("p");
    let button = document.createElement("button");
    let i = document.createElement("i");

    button.style.cssText = "width: 100px; background-color: transparent; border:none; font-size:14px; margin-left:4px; "; 

    button.addEventListener("mouseover", () => {
      td.style.cssText = "width:378px; transition:.4s; "
      button.style.cssText = "color:#f51414; width:100px; background-color: transparent; border:none; font-size:14px; transition:.4s; cursor:pointer; margin-left:4px; "
    })

    button.addEventListener('mouseout', () => {
      td.style.cssText = "width:390px; transition:.6s; "
      button.style.cssText = "width: 100px; background-color: transparent; border:none; font-size:14px; transition:.4s; margin-left:4px;";
    });
  
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
     //console.log(item)
    i.setAttribute("id", item.id);
    i.setAttribute("idproduct", item.idproduct);
    i.setAttribute("amountorder", item.amountorder);


    let itemsOrderCount = JSON.parse(sessionStorage.getItem("itemsOrderEdit"))
    let totalItems = itemsOrderCount.length;
      document.getElementById("totalItems").innerText = `Total de itens adicionados: ${totalItems}`


    button.addEventListener("click", (event) => {

     
        const itemId = event.target.getAttribute("id");
        const idproduct = event.target.getAttribute("idproduct");
        const itemAmount = event.target.getAttribute("amountorder");
        
        if(itemId){return}else{alert}
        // if(itemId === null){
        //   location.reload()
        // }
        
        let item = {iditem: itemId, amountorder: itemAmount, idproduct:idproduct}
        let itemsOrder = JSON.parse(sessionStorage.getItem("itemsOrderEdit"))

        let indexToRemove = itemsOrder.findIndex(orderItem => item.iditem === orderItem.id);
        if (indexToRemove !== -1) {
          itemsOrder.splice(indexToRemove, 1);
        }

    
    setTimeout(() => {     

      fetch('http://localhost:3000/stock')
        .then(res => {
          if (!res.ok) {
            throw new Error('Rede falhou: ' + res.status);
          }
          
          return res.json();
        })
        .then(data => {
          console.log(item)
          let findItem = data.find((v) => v.id === item.iditem)
    
          function returnStock(){

            let returnStockItem = findItem.amount + Number(item.amountorder)
              // console.log(findItem.amount, item.amountorder)
              if(returnStockItem < 0){ 
               alert(`Ação negada, o produto: ${transform.nameitem} ficara negativo em: ${returnStockItem}`)
               document.getElementById("quantity").value = ''
              } else {

                findItem.amount = returnStockItem
                  
                  setDataStock(findItem)

                setTimeout(() => {
                   location.reload()
                }, 200);
              }
            }
        returnStock()
        sessionStorage.setItem("itemsOrderEdit", JSON.stringify(itemsOrder))
        
      })

        }, 900);

    });
  });

  sessionStorage.setItem("totalCost", totalCost);
  document.getElementById("itemsCost").innerText = `R$: ${totalCost.toFixed(2)}`;
}

export default showItemList;
