import setDataStock from '../../middlewares/setNewStockdb.js';

function addItemList(itemSelected, quantity, numberOrder) {

  let item = JSON.parse(itemSelected)


    function start(){
        let transform = {
          "id": item.id,
          "idproduct": item.idproduct,
          "idcompanies": item.idcompanies,
          "amountorder": Number(quantity),
          "amountstock": item.amount,
          "nameitem": item.nameitem,
          "unitycost": item.unitycost
        };

    let itemsOrder = sessionStorage.getItem("itemsOrderEdit")
      if(itemsOrder === ''){
        itemsOrder = []
        itemsOrder.push(transform)
        sessionStorage.setItem("itemsOrderEdit", JSON.stringify(itemsOrder))
      }else {
        let itemsOrderJson = JSON.parse(sessionStorage.getItem("itemsOrderEdit"))
        itemsOrderJson.push(transform)
        sessionStorage.setItem("itemsOrderEdit", JSON.stringify(itemsOrderJson))
      }
     // console.log(JSON.parse(itemsOrder))

         
      fetch('http://localhost:3000/stock')
        .then(res => {
          if (!res.ok) {
            throw new Error('Rede falhou: ' + res.status);
          }
          
          return res.json();
        })
        .then(data => {
          
          let findItem = data.find((v) => v.id === transform.id)

          function reduceStock(){

            let reduceStockItem = findItem.amount - transform.amountorder
              if(reduceStockItem < 0){ 
               alert(`Ação negada, o produto: ${transform.nameitem} ficara negativo em: ${reduceStockItem}`)
               document.getElementById("quantity").value = ''
              } else {
                findItem.amount = reduceStockItem

                setDataStock(findItem)

                setTimeout(() => {
                   location.reload()
                }, 500);
              }
            }
        reduceStock()
      })
  }
      start()
}

export default addItemList;
