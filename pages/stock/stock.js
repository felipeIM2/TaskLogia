
import setData from '../../middlewares/setNewStockdb.js';

// Iniciar o fetch para carregar os dados do estoque
fetch('http://localhost:3000/stock')
  .then(res => {
    if (!res.ok) {
      throw new Error('Rede falhou: ' + res.status);
    }
    return res.json();
  })
  .then(dataStock => {
    // Criptografar e armazenar no localStorage
    const secretKey = "12345678901";
    
    let encryptedStock = CryptoJS.AES.encrypt(JSON.stringify(dataStock), secretKey).toString();
    localStorage.setItem("stock", encryptedStock);
   
    const stock = localStorage.getItem("stock");
    const user = sessionStorage.getItem("user");

    if (!stock || !user) {
      console.error("Data not found in localStorage.");
      return;
    }

    let bytes = CryptoJS.AES.decrypt(stock, secretKey);
    let stockItems = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    let userInfo = JSON.parse(user);

    let verify = stockItems.filter((v) => v.idcompanies === userInfo.idcompanies);

    let newWords = verify.map((v) => ({
      idproduct: v.idproduct,
      idcompanies: v.idcompanies,
      nameitem: v.nameitem,
      amount: v.amount,
      orderdetail: v.itemdescript,
    }));

    const tableBody = document.getElementById('tableBody');
    if (!tableBody) {
      console.error("Table body not found!");
      return;
    }

    newWords.forEach((word) => {
      const row = document.createElement("tr");
      row.setAttribute("class", "line");

      const idCell = document.createElement("td");
      const amountCell = document.createElement("td");
      const nameItemCell = document.createElement("td");
      const detailCell = document.createElement("td");
      const btnCell = document.createElement("td");
      const button = document.createElement("button");

      button.setAttribute("id", "editButton");
      button.innerHTML = "Ajustar quantidades";
      actButton(button, word.idproduct, word.amount);  // Pass product ID and amount to the function

      idCell.textContent = word.idproduct;
      amountCell.textContent = word.amount;
      nameItemCell.textContent = word.nameitem;
      detailCell.textContent = word.orderdetail;

      row.appendChild(idCell);
      row.appendChild(amountCell);
      row.appendChild(nameItemCell);
      row.appendChild(detailCell);
      row.appendChild(btnCell);
      btnCell.appendChild(button);

      tableBody.appendChild(row);
    });

    function actButton(button, productId, currentAmount) {
      button.addEventListener("click", () => {
        openModal(productId, currentAmount);
      });
    }

    function openModal(productId, currentAmount) {
      // Criação do modal
      const modal = document.createElement("div");
      modal.setAttribute("id", "modal");
      modal.setAttribute("class", "modal");

      const modalContent = document.createElement("div");
      modalContent.setAttribute("class", "modal-content");

      const closeButton = document.createElement("span");
      closeButton.setAttribute("class", "close");
      closeButton.innerHTML = "&times;";

      const productLabel = document.createElement("p");
      productLabel.innerHTML = `Editar quantidade do produto ID: ${productId}`;

      const inputLabel = document.createElement("label");
      inputLabel.setAttribute("for", "quantity");
      inputLabel.innerHTML = "Quantidade: ";

      const input = document.createElement("input");
      input.setAttribute("type", "number");
      input.setAttribute("id", "quantity");
      input.setAttribute("value", currentAmount);

      const saveButton = document.createElement("button");
      saveButton.innerHTML = "Salvar";
      saveButton.addEventListener("click", () => {

        const newQuantity = input.value;
        let item = stockItems.filter(v => v.idproduct ===  productId)

        let transform = {
          "id": item[0].id,
          "idcompanies": item[0].idcompanies,
          "idproduct": item[0].idproduct,
          "amount": Number(newQuantity),
          "itemdescript": item[0].itemdescript,
          "nameitem": item[0].nameitem
        };

        // Atualizar o estoque no banco de dados ou outro lugar
        setData(transform);

        setTimeout(() => {
          location.reload();
        }, 1000);

        // Fechar o modal (se necessário)
        // modal.remove(); 
      });

      // Adicionando os elementos ao modal
      modalContent.appendChild(closeButton);
      modalContent.appendChild(productLabel);
      modalContent.appendChild(inputLabel);
      modalContent.appendChild(input);
      modalContent.appendChild(saveButton);
      modal.appendChild(modalContent);

      // Adicionando o modal ao body
      document.body.appendChild(modal);

      // Fechar o modal ao clicar no "x"
      closeButton.addEventListener("click", () => {
        modal.remove();
      });

      // Impedir que o modal feche ao clicar no conteúdo
      modalContent.addEventListener("click", (event) => {
        event.stopPropagation();
      });

      // Fechar o modal ao clicar fora dele
      modal.addEventListener("click", () => {
        modal.remove();
      });
    }
  })
  .catch(error => {
    console.error('Erro ao carregar o JSON:', error);
  });
