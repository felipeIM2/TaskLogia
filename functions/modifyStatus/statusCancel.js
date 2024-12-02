import setData from "../../middlewares/setNewStatusdb.js";

const secretKey = "12345678901";


function statusCancel(newWords, getUser){

 let dataSession = sessionStorage.getItem("order")
 let bytes = CryptoJS.AES.decrypt(dataSession, secretKey);
 let sessionOrder = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
 


 let newOrderStatus = sessionOrder.filter((v) => v.id === newWords.id)[0]
  if(newOrderStatus.idstatus === 1){
      let transform = {
        "id": newWords.id,
        "idemployee": getUser.userID,
        "idstatus": 5,
        "idcompanies": newWords.idcompanie,
        "name": newWords.name,
        "numberorder":newWords.numberOrder,
        "descript": newWords.orderDetail,
        "ordercost":newWords.orderCost
    };


   setData(transform)
   location.reload()

  }else if(newOrderStatus.idstatus === 2){
    alert("Sua ordem ainda está em processamento, favor encerrar!")
  }else {
    alert("Sua ordem ja foi finalizada, favor reabrir!")
  }
  
}

export default statusCancel;