
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
    
  const register = document.getElementById("register");
  register.addEventListener("click", () => { 
    let modalRegister = document.getElementById("modalRegister");
      if(modalRegister.classList.contains('modalRegisterOff')) {
        
        modalRegister.classList.remove("modalRegisterOff");
        modalRegister.classList.add("modalRegisterOn");
      }
  })

  const cancelRegister = document.getElementById("cancelRegister");
  cancelRegister.addEventListener("click", () => {
    let modalRegister = document.getElementById("modalRegister");
    if(modalRegister.classList.contains('modalRegisterOn')) {
      
      modalRegister.classList.remove("modalRegisterOn");
      modalRegister.classList.add("modalRegisterOff");
    }
  })

  const newEmplo = document.getElementById("newEmplo");
  newEmplo.addEventListener("click", () => location = '../pages/register/cadEmployee/cadEmployee.html')

  const newAdmin = document.getElementById("newAdmin");
  newAdmin.addEventListener("click", () => location = '../pages/register/cadEmployee/cadAdmin/cadAdmin.html')
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