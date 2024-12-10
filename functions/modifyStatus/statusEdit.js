
import setData from "../../middlewares/editInfosOrder.js";


const secretKey = "12345678901";

function statusEdit( order, getUser) {

  

  function openEditModal(order) {
 
    
    document.getElementById("orderName").value = order.name;
    document.getElementById("orderDetails").value = order.orderDetail;

    setTimeout(() => {
      document.getElementById("orderCost").value = order.orderCost
    }, 2000);
    
    document.getElementById("editOrderModal").dataset.orderId = order.id;
    document.getElementById("editOrderModal").style.display = "block";
   
  }

 
  function closeModal() {
    document.getElementById("editOrderModal").style.display = "none";
    //location.reload()
  }

  document.getElementById("closeModal").addEventListener("click", closeModal);


  document.getElementById("editOrderForm").addEventListener("submit", function (e) {
    e.preventDefault(); 

    const updatedOrder = {
      id: document.getElementById("editOrderModal").dataset.orderId, 
      name: document.getElementById("orderName").value,
      orderDetail: document.getElementById("orderDetails").value,
      orderCost: document.getElementById("orderCost").value
    };
      

      if (getUser) {
        if(updatedOrder.orderDetail.trim() === ''){return alert("Favor preencher o campo descrição")}

        let transform = {
          "id": updatedOrder.id,
          "idemployee": getUser.userID,
          "idstatus": order.idstatus, 
          "idcompanies": order.idcompanie,
          "name": updatedOrder.name.trim(),
          "numberorder": order.numberOrder,
          "descript": updatedOrder.orderDetail.trim(),
          "ordercost": Number(updatedOrder.orderCost.replace(",", "."))
        };
        
        
          if(transform.ordercost === order.orderCost){
            console.log("não atualizar!")
            location.reload();
          }else {

             setData(transform)     

            setTimeout(() => {
              location.reload();
            }, 800);

          }
      }

  });

 
  if(order.idstatus === 1){
    openEditModal(order);
    
  } else if (order.idstatus === 3) {
    alert("Sua ordem já está finalizada, não é possivel editar!");
  }else if(order.idstatus === 5){
    alert("Sua ordem já está cancelada, não é possivel editar!");
  }else {
    alert("Sua ordem já está sendo processada, não é possivel editar!");
  }

}

export default statusEdit;
