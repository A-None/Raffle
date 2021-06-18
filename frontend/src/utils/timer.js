export const timeTillDraw = () => {
  let d = new Date();
  let localTime = d.getTime();
  let localOffset = d.getTimezoneOffset() * 60000;

  let utc = localTime + localOffset;

  let offset = 8;   
  let singapore = utc + (3600000*offset);

  let currTime = new Date(singapore).getTime(); 

  let drawDate = new Date(singapore);
  drawDate.setHours(22, 0, 0, 0);
  let drawTime = drawDate.getTime();
  let distance = drawTime - currTime;
  let hours = Math.floor((distance % (1000 * 60 * 3600)) / (1000 * 3600));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString();
  let seconds = Math.floor((distance % (1000 * 60)) / 1000).toString();
  seconds = seconds.length === 1 ? `0${seconds}` : seconds;
  minutes = minutes.length === 1 ? `0${minutes}` : minutes;
  return hours + ":" + minutes + ":" + seconds;
}

export const formatDate = (date) => {
  const year = date.getFullYear();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  let hours = date.getHours();
  var minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  hours = hours < 10 ? '0'+hours : hours;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  seconds = seconds < 10 ? '0'+seconds : seconds;
  let strTime = hours + ':' + minutes + ':' + seconds + " " + ampm;
  return year + "-" + month + "-" + day + " " + strTime;
}

export const formatDate2 = (date) => {
  const year = date.getFullYear();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return year + "-" + month + "-" + day;
}