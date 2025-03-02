function logger(message){
    const logTime =  new Date().toISOString().slice(0, 19).replace("T", " ");
    console.log(`[${logTime}] - ${message}`);
    //TO DO: Saving logs to the TXT file or Elastic
}
module.exports = {logger}