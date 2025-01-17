
  fetch('http://localhost:3000/access')
    .then(res => {
      if (!res.ok) {
        throw new Error('Rede falhou: ' + res.status);
      }
      return res.json();
    })
    .then(dataAccess => {
       
     // console.log(dataAccess)
   
let getUser = JSON.parse(sessionStorage.getItem("user"));

if(getUser) {
  window.location.replace("./homePage/homePage.html");
}else {

const login = document.getElementById("login");
  login.addEventListener("click", () => {

    let user = document.getElementById("user").value;
    let pass = document.getElementById("password").value;
    

     let confirmUser = dataAccess.find((v) => v.user === user && v.password === pass);
        
    if(confirmUser != undefined) {
      sessionStorage.setItem("user", JSON.stringify(confirmUser))
       window.location = './homePage/homePage.html'
    }else {
      alert("Usuário ou senha Incorreto!")
    }
  });

  
  let orderlocal = localStorage.getItem("order");
  if(orderlocal){localStorage.removeItem("order")};
    
  }
}

)
.catch(error => {
  alert(`Favor conectar ao banco de dados!!  ${error}`)
  console.error('Erro ao carregar o JSON:', error);
});

sessionStorage.removeItem("order");
sessionStorage.removeItem("currentPage");
sessionStorage.removeItem("itemsOrder");
sessionStorage.removeItem("lastOrder");
sessionStorage.removeItem("newItemsOrder");
sessionStorage.removeItem("newLastOrder");
sessionStorage.removeItem("seq");
sessionStorage.removeItem("i");
localStorage.removeItem("stock");
localStorage.removeItem("checkOrderState");
localStorage.removeItem("checkOrderDelay");
localStorage.removeItem("orderStatus");
localStorage.removeItem("order");
localStorage.removeItem("checkAscNumberOrder");