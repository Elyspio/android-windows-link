import {default as axios} from "axios"
import {expressPort, name, serverURL} from "../config/const"
import {getIps} from "./hardware";
import {logger} from "../util/logger";

export async function register() {
    logger.info("register " + serverURL)
    return axios.post(`${serverURL}/register`, {name, ips: getIps().map(ip => `${ip}:${expressPort}`)})
}
