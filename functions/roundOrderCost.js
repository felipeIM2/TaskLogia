

function roundOrderCost(num, places) {
    
    let factor = Math.pow(10, places);
    let roundAplicated = Math.round(num * factor) / factor;
    
    if(num == 0 || num == null || roundAplicated < 0.05){
      return num = 0, 'Grátis'
    }
    
    return roundAplicated
  }


 export default roundOrderCost; 