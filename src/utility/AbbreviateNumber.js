export function AbbreviateNumber(num){

  if(num >= 1000000000){
    return (Math.floor(num/100000000)/10) + "b";
  }

  if(num >= 1000000){
    return (Math.floor(num/100000)/10) + "m";
  }

  if(num >= 1000){
    return (Math.floor(num/100)/10) + "k";
  }

  return num;

}
