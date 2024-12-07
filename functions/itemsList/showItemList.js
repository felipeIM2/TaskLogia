
import removeItem from '../../middlewares/removeItem.js'


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

    button.style.cssText = "width: 40px; background-color: transparent; border:none; font-size:14px;";
    i.classList = "fa-regular fa-trash-can"
    button.style.cursor = "pointer";

    let itemCost = item.amountorder * item.unitycost;

    p1.innerText = item.nameitem;
    p2.innerText = `QT: ${item.amountorder}`;
    p3.innerText = `VL: ${itemCost}`;

    button.appendChild(i)
    td.appendChild(button);
    td.appendChild(p1);
    td.appendChild(p2);
    td.appendChild(p3);
    tr.appendChild(td);

    list.appendChild(tr);

    totalCost += itemCost;

    i.setAttribute("data-id", item.id);
    i.setAttribute("data-amountorder", item.amountorder);
    i.setAttribute("data-number", item.numberorder); 
    
    button.addEventListener("click", (event) => {

      const itemId = event.target.getAttribute("data-id");
      const itemAmount = event.target.getAttribute("data-amountorder");
      const itemNumber = event.target.getAttribute("data-number");

      let item = {iditem: itemId, amountorder: itemAmount, numberorder:itemNumber }
        
       removeItem(item)

        setTimeout(() => {
          location.reload()
        }, 800);

    });
  });

  sessionStorage.setItem("totalCost", totalCost);
  document.getElementById("itemsCost").innerText = `R$: ${totalCost.toFixed(2)}`;
}

export default showItemList;
