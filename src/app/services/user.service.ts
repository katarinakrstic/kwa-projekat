import { UserModel } from "../models/user.model";

export class UserService {
    static retrieveUsers(): UserModel[] {
        if(!localStorage.getItem('users')) {
            const arr: UserModel[] = [
                {
                    firstName: 'User',
                    lastName: 'Example',
                    email: 'user@example.com',
                    password: 'user',
                    phone: '+38163123456',
                    address: 'Adresa 1, Beograd'
                }
            ];

            localStorage.setItem('users', JSON.stringify(arr));
        }

        return JSON.parse(localStorage.getItem('users')!);
    }

    static getActiveUser(): UserModel | null {
        if(!localStorage.getItem('active')) {
            return null;
        }
            
        for(let user of this.retrieveUsers()) {
            if(user.email == localStorage.getItem('active')) {
                return user;
            }
        }

        return null;
    }

    static createUser(model: UserModel) {
        const users = this.retrieveUsers();

        for(let u of users) {
            if(u.email === model.email)
                return false;
        }

        users.push(model);
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }

    static updateUser(model: UserModel) {
        const users = this.retrieveUsers();
        for(let u of users) {
            if(u.email === model.email) {
                u.firstName = model.firstName;
                u.lastName = model.lastName;
                u.phone = model.phone;
                u.address = model.address;
            }
        }

        localStorage.setItem('users', JSON.stringify(users));
    }

    static login(email: string, password: string): boolean {
        for(let user of this.retrieveUsers()) {
            if(user.email === email && user.password === password) {
                localStorage.setItem('active', user.email);
                return true;
            }
        }

        return false;
    }

    static changePassword(newPassword: string): boolean {
        const arr = this.retrieveUsers();
        for(let user of arr) {
            if(user.email == localStorage.getItem('active')) {
                user.password = newPassword;
                localStorage.setItem('users', JSON.stringify(arr));
                return true;
            }
        }

        return false;
    }
}