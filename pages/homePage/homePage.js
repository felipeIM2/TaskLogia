

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


  
  document.getElementById("profile").addEventListener("click", () => {

     let options = document.querySelector(".optionsProfile")
     let height = window.getComputedStyle(options)
      let h6 = document.querySelectorAll("h6")
      let totalHeight = h6.length * 50 + "px"
        
      
     if(height.height === "0px"){

       options.style.display = 'block'
      
       setTimeout(() => {
        options.style.height = `${totalHeight}`;
        options.style.color = "black"
      }, 100);

     }else {

      options.style.height = '0px';
      
      setTimeout(() => {
        setTimeout(() => {
          options.style.display = 'none'
        }, 400);
        options.style.color = 'transparent'
      }, 100);

     }
  })


  