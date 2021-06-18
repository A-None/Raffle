export const prices = [10, 9, 8];

export const decrement = (arr) => {
  let newArr = [];
  for (let num of arr) {
    newArr.push(num - 1);
  }
  return newArr;
}

export const formatNumber = (number) => {
  const [whole, decimal] = number.toString().split(".");
  const str = whole.split("").reverse().join("");
  let numComma = "";
  for (let i = 0; i < str.length; i++) {
    if (i % 3 === 0 && i !== 0) {
      numComma = "," + numComma;
    }
    numComma = str[i] + numComma;
  }
  return numComma + (decimal ? "." + decimal : "");
};

export const getPerPrice = (tickets) => {
  const totalTickets = getTotalTickets(tickets);
  if (totalTickets < 100) {
    return prices[0].toString();
  } else if (totalTickets < 1000) {
    return prices[1].toString();
  } else {
    return prices[2].toString();
  }
};

export const getTotalPrice = (tickets) => {
  const totalTickets = getTotalTickets(tickets);
  if (totalTickets < 100) {
    return totalTickets * prices[0];
  } else if (totalTickets < 1000) {
    return totalTickets * prices[1];
  } else {
    return totalTickets * prices[2];
  }
};

export const getTotalTickets = (tickets) => {
  return tickets.reduce((count, row) => count + row.length, 0);
};

export const truncate = (formatEther) => {
  if (formatEther.includes('.')) {
      const decimal = formatEther.split('.');
      return decimal[0] + '.' + decimal[1].slice(0, 4);
  }
  return formatEther;
}

export const getMatches = (tickets) => {
  const firstTicket = tickets[0];
  const matches = [0, 0, 0];
  if (firstTicket.matches === null) {
    return null;
  }
  for (let ticket of tickets) {
    switch(ticket.matches) {
      case 4:
        matches[0] += 1;
        break;
      case 3:
        matches[1] += 1;
        break;
      case 2:
        matches[2] += 1;
        break;
      default:
        break;
    }
  }
  return matches;
}