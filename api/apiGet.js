const secretKey = "12345678901";

function apiGet(nameCompanie, showDataCompanie, loadPage, nameEmployee) {

  let getUser = JSON.parse(sessionStorage.getItem("user"));

  if (getUser === null) {
    window.location.replace("../login.html");
  } else {

    async function fetchData(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Erro na rede: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error(`Erro ao carregar o arquivo ${url}:`, error);
        throw error; 
      }
    }

    function storeEncryptedData(key, data, storageType = 'localStorage') {
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
      window[storageType].setItem(key, encryptedData);
    }

    // Função para carregar os dados de ordem e criptografá-los
    async function loadAndStoreOrderData() {
      try {
        const dataOrder = await fetchData('http://localhost:3000/orders');
        //console.log(dataOrder)

         const getUser = JSON.parse(sessionStorage.getItem("user")); //console.log(getUser)
         const orderCompanie = dataOrder.filter(order => order.idcompanies === getUser.idcompanies); //console.log(orderCompanie)

        storeEncryptedData("order", orderCompanie); // Usando localStorage para armazenar a ordem

      } catch (error) {
        console.error('Erro ao carregar os dados da ordem:', error);
      }
    }

    // Função para carregar os dados de itemsOrder e armazená-los no sessionStorage
    async function loadAndStoreItemsOrderData() {
      try {
        const itemsOrderData = await fetchData('http://localhost:3000/itemsOrder');
        //console.log(itemsOrderData)

        storeEncryptedData("itemsOrder", itemsOrderData, 'sessionStorage'); // Armazenando no sessionStorage

      } catch (error) {
        console.error('Erro ao carregar os dados do itemsOrder:', error);
      }
    }

    async function loadAndProcessCompanies() {
      try {
        const dataCompanies = await fetchData('http://localhost:3000/companies');

        //console.log(dataCompanies)

         nameCompanie(dataCompanies);
         showDataCompanie(dataCompanies, getUser);

      } catch (error) {
        console.error('Erro ao carregar os dados das empresas:', error);
      }
    }

    async function loadModalContent() {
      try {
        const response = await fetch('../../components/modals/modalCompanieInfos/infosCompanie.html');
        const htmlContent = await response.text();
        document.getElementById('modalCompanieInfo').innerHTML = htmlContent;
      } catch (error) {
        console.error('Erro ao carregar o conteúdo do modal:', error);
      }
    }

    async function loadAndStoreSessionOrderData() {
      try {

        const dataOrder = await fetchData('http://localhost:3000/orders');
        //console.log(dataOrder, "dataorder")

        storeEncryptedData("order", dataOrder, 'sessionStorage');

      } catch (error) {
        console.error('Erro ao carregar os dados da ordem (sessionStorage):', error);
      }
    }

    // Adicionando o fetch para carregar os dados do stock e armazenar no localStorage
    async function loadAndStoreStockData() {
      try {

        const dataStock = await fetchData('http://localhost:3000/stock');
       // console.log(dataStock)

        storeEncryptedData("stock", dataStock); // Usando localStorage para armazenar o stock de forma criptografada

      } catch (error) {
        console.error('Erro ao carregar os dados de estoque:', error);
      }
    }

    // Execução das funções
    (async () => {
      await loadAndStoreOrderData();       
      await loadAndStoreSessionOrderData();
      await loadAndStoreItemsOrderData();   // Carregar e armazenar os dados do itemsOrder no sessionStorage
      await loadAndProcessCompanies();      
      await loadAndStoreStockData(); // Carregar e armazenar os dados de estoque
      await nameEmployee(getUser);
                
      // Atrasar a execução da função loadPage em 1 segundo
      setTimeout(() => {
       loadModalContent();   
        loadPage(getUser);  // Agora loadPage será chamada após 1 segundo
      }, 500);
    })();
  }
}

export default apiGet;
