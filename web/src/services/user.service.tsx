
export interface IRegisterInfo {
    username: string;
    first_name: string;
    last_name: string;
    password: string;
    email: string;
}

export interface ILoginInfo {
    username: string;
    password: string;
}

export default class UserService {
    static register(data: IRegisterInfo): Promise<boolean> {
        return fetch('http://127.0.0.1:8001/api/auth/register/', {
            method: "POST",
            body: JSON.stringify(data)
        })
        .then(res => {
            return res.status === 200 ? true : false; 
        })
        .catch(_ => false);
    }

    static login(data: ILoginInfo): Promise<string | boolean> {
        return fetch('http://127.0.0.1:8001/api/auth/login/', {
            method: "POST",
            body: JSON.stringify(data)
        })
        .then(res => {
            if (res.status === 200) {
                return res.json().then(json => json.token);
            } else {
                return false;
            }
        })
        .catch(_ => false);
    }
};