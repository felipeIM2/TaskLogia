async function setData(documentItems) {
    let data = documentItems
    try {
      const response = await fetch('http://localhost:3000/reciveOrderEdit', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json' 
        },
        body:JSON.stringify(data)
      });
  
      const resultado = await response.json();
  
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
    }
  };
  
   export default setData;