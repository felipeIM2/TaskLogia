

import showDataCompanie from '../../functions/showDataCompanie.js'

fetch('http://localhost:3000/companies')
.then(res => {
  if (!res.ok) {
    throw new Error('Rede falhou: ' + res.status);
  }
  return res.json();
})
.then(data => {
   
  let getUser = JSON.parse(sessionStorage.getItem("user"));
  showDataCompanie(data, getUser)
  
})
.catch(error => {
  console.error('Erro ao carregar o JSON:', error);
});

 async function getModal(){

  const response = await fetch('../../components/modals/modalCompanieInfos/infosCompanie.html');
  const htmlContent = await response.text();
  document.getElementById('modalCompanieInfo').innerHTML = htmlContent;

}
getModal()



document.getElementById("initOrder").addEventListener("click", () => {

    let itemsOrder = []
    sessionStorage.setItem("itemsOrderEdit", itemsOrder)  
    location.href = "../cadOrder/initOrder.html";

  })


  document.getElementById("exitButton").addEventListener("click", () => {
    let btn = document.getElementById("exitButton");
    btn.blur();
  
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("i");
    localStorage.removeItem("order");
    localStorage.removeItem("stock");
    localStorage.removeItem("checkOrderState")
    localStorage.removeItem("checkOrderDelay")
    localStorage.removeItem("checkAscNumberOrder")
 
    
    window.location.href = '../login.html'
  });
