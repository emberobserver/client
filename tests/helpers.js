export function validResponse(body){
  var responseBody = body;
  if(typeof body === "string"){
    responseBody = body;
  }
  else {
    responseBody = JSON.stringify(body);
  }
  return [200, {"Content-Type": "application/json"}, responseBody];
}
