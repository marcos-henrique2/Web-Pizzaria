import axios, {AxiosError} from "axios";
import { parseCookies } from "nookies";
import { AuthTokenErrors } from "./errors/AuthTokenErrors";
import { signOut } from "../contexts/AuthContext";

export function setupAPIClient(ctx = undefined){
    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: 'https://currency-xi.vercel.app/',
        headers: {
            Authorization: `Bearer ${cookies['@nextauth.token']}`
        }
    })

    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError) => {
        if(error.response.status === 401){
            if(typeof window !== undefined){
                signOut();
            }else{
                return Promise.reject(new AuthTokenErrors())
            }
        }

        return Promise.reject(error);
    })

    return api
}