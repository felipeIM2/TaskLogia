

function dataCompanie(dataCompanies, getUser){
      
    document.getElementById("dataCompanie").addEventListener("click", () => {
      
      let dataCompanieBtn = document.getElementById("dataCompanie"); dataCompanieBtn.blur()
  
      let table = document.querySelector(".table-container")
      let paginationTable = document.querySelector(".paginationContainer")
      let searchContent = document.querySelector(".searchContent")

      if(paginationTable){
        paginationTable.style.display = "none"
      }
      if(searchContent){
        searchContent.style.display = "none"
      }
      if(table){
        table.style.display = "none"
      }
      
     
  
      let companie = dataCompanies.filter((v) => v.idcompanies === getUser.idcompanies);

        document.getElementById('meuModal').style.display = 'flex';
  
        let td = document.querySelector(".tableContainer"); 
            td.style.width = "500px";
  
          const companieNameTd = document.getElementById("companieNameTd");
          const companieCnpjTd = document.getElementById("companieCnpjTd");
          const companieIeTd = document.getElementById("companieIeTd");
          const companieContactTd = document.getElementById("companieContactTd");
          const companieAdressTd = document.getElementById("companieAdressTd");
          
          
          companieNameTd.innerText = companie[0].razaoSocial;
          companieCnpjTd.innerText = companie[0].cnpj;
          
          if(companie[0].inscricaoEstadual === ""){
            companieIeTd.innerText = "ISENTO";
          }else {
            companieIeTd.innerText = companie[0].inscricaoEstadual;
          }
          companieContactTd.innerText = companie[0].contato.email;
          companieAdressTd.innerText = companie[0].endereco;
        
     document.getElementById("closeModalInfoCompanie").addEventListener("click", () => {
        if(paginationTable){
          paginationTable.style.display = "flex"
        }
        if(table){
          table.style.display = ""
        }
        if(searchContent){
          searchContent.style.display = "flex"
        }
       document.getElementById('meuModal').style.display = 'none';
  
     })
  
    })
  
  }
  
  
  export default dataCompanie;