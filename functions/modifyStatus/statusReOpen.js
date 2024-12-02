import setData from "../../middlewares/setNewStatusdb.js";

const secretKey = "12345678901";


function statusReOpen(newWords, getUser){

 let dataSession = sessionStorage.getItem("order")
 let bytes = CryptoJS.AES.decrypt(dataSession, secretKey);
 let sessionOrder = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

 let newOrderStatus = sessionOrder.filter((v) => v.id === newWords.id)[0]
  if(newOrderStatus.idstatus === 3 || newOrderStatus.idstatus === 5){
      let transform = {
        "id": newWords.id,
        "idemployee": getUser.userID,
        "idstatus": 1,
        "idcompanies": newWords.idcompanie,
        "name": newWords.name,
        "numberorder":newWords.numberOrder,
        "descript": newWords.orderDetail,
        "ordercost":newWords.orderCost
    };


    setData(transform)
    location.reload()
  }else if(newOrderStatus.idstatus === 1){
    alert("Sua ordem ja esta aberta!")
  }else {
    alert("Sua ordem já esta sendo processada, favor finalizar!")
  }
  
}

export default statusReOpen;