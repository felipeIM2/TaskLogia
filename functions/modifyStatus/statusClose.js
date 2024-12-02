import setData from "../../middlewares/setNewStatusdb.js";

const secretKey = "12345678901";

function statusClose(newWords, getUser,  sessionOrder){


    let newOrderStatus = sessionOrder.filter((v) => v.id === newWords.id)[0];

    if (newOrderStatus.idstatus === 1) {
    let confirmation = confirm("Deseja finalizar a ordem sem processar?");
    if (confirmation) {
        let detail = prompt("Descreva o motivo da finalização");
        
        let transform1 = {
        "id": newWords.id,
        "idemployee": getUser.userID,
        "idstatus": 3,
        "idcompanies": newWords.idcompanie,
        "name": newWords.name,
        "numberorder": newWords.numberOrder,
        "descript": newWords.orderDetail,
        "ordercost": newWords.orderCost,
        "closeorderdetail": "motivo:|"+detail.trim() + "| autorização:" + getUser.userID
        };
        
            
      setData(transform1)
       location.reload()
    }
    }else if (newOrderStatus.idstatus === 2) {
   
    let transform = {
        "id": newWords.id,
        "idemployee": getUser.userID,
        "idstatus": 3, 
        "idcompanies": newWords.idcompanie,
        "name": newWords.name,
        "numberorder": newWords.numberOrder,
        "descript": newWords.orderDetail,
        "ordercost": newWords.orderCost,
    };

    setData(transform)
      location.reload()

    } else {
    alert("Sua ordem já está finalizada. Não é possível encerrar novamente.");
    }

}

export default statusClose;
