import axios from "axios";

let reg = /token=.*;*/g;
let test;

if (document.cookie !== "" && document.cookie.match(reg)[0]) {
  test = document.cookie.match(reg)[0].substring(6);
  if (test.charAt(test.length - 1) === ";")
    test = test.slice(0, test.length - 1);
  test = test.replace("Bearer%20", "Bearer ");
} else {
  test = "";
}

export default axios.create({
  baseURL: "https://phidbac.fr:4000/",
  headers: { Authorization: test },
  responseType: "json"
});
