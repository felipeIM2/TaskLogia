
import setdata from '../../middlewares/setNewItemOrder.js'

function addItemList(itemSelected, quantity, numberOrder) {


  let item = JSON.parse(itemSelected)

    
    function start(){
    
        let transform = {
          "id": item.id,
          "idproduct": item.idproduct,
          "idcompanies": item.idcompanies,
          "numberorder": numberOrder,//(numberOrder[numberOrder.length - 1] === 0 || !numberOrder[numberOrder.length - 1]) ? 1001 : (numberOrder[numberOrder.length - 1] || 0) + 1,
          "amountorder": Number(quantity),
          "amountstock": item.amount,
          "nameitem": item.nameitem,
          "unitycost": item.unitycost
        };
          // console.log(transform)
         
        setdata(transform)

        setTimeout(() => {
          location.reload()
        }, 600);
               
  }
      start()
}

export default addItemList;
