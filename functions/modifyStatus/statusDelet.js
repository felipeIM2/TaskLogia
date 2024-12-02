import setdata from '../../functions/removeOrderdb.js'

const secretKey = "12345678901";

function statusDelet(newWords) {


  // Verifica o status da ordem e impede a exclusão se o status for 2 ou 3
  if (newWords.idstatus === 2) {
    alert('Sua ordem está sendo processada e não pode ser excluída!');
  } else if (newWords.idstatus === 3) {
    alert('Sua ordem foi finalizada e não pode ser excluída!');
  } else {
 

    if (newWords) {

      setdata(newWords)
       location.reload()

    } else {
      console.log("Ordem não encontrada para deletar.");
    }
  }
}

export default statusDelet;
