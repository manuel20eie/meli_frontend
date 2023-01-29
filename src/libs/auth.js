import axios from "axios";
import { JWT_KEY } from "../secrets";
const jose = require("jose");

export async function encodeQuery(endpoint, data = {}) {
  let alg = "HS256";
  let secret = new TextEncoder().encode(JWT_KEY);
  let token = await new jose.SignJWT(data)
    .setProtectedHeader({ alg })
    .sign(secret);
  let response = await axios
    .get(endpoint, {
      headers: { "x-access-token": token },
    })
    .then(function async(response) {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
  return response;
}
