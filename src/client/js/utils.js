//suggested help for testing to move functions to utils.js (https://knowledge.udacity.com/questions/253387)


/* Calcualate the number of days from departure and current day */
function calcNumofDays(ddate){
    let currentd = new Date(); // Today's date
    let departd = new Date(ddate);
    let departingt = departd.getTime();
    let currentt = currentd.getTime();
    let diffintime = departingt - currentt;
    const dayinms = 1000 * 60 * 60 * 24 ;
    const numofdays = Math.round(diffintime/dayinms)+1; 
    return numofdays;
  }
  
  /* For the Historical Forecast change departure date to same day last year */
  function lastYrdepDay(ddate){
    let d = new Date(ddate);
    let depdate = new Date(ddate);
    depdate.setFullYear(d.getFullYear()-1);
    return depdate.toISOString().slice(0,10);
  }
  
  /* For the Historical Forecast calculate end date as departure date plus a day last year */
  function lastYrnextDay(ddate){
    let n = new Date(ddate);
    let ndate = new Date(ddate);
    ndate.setFullYear(ndate.getFullYear()-1);
    ndate.setDate(n.getDate()+1);
    return ndate.toISOString().slice(0,10);
  }

  export{
    calcNumofDays,
    lastYrdepDay,
    lastYrnextDay
  }