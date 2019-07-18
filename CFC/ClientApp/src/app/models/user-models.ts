export class LoginUser {
    email: string;
    password: string;
}


export class UserInfo {
    email: string;    
    role: string;
}

export class UserLoginInfo {
    email: string;
    token: string;
    role: string;    
}

export class UserPasswordReset {
    token: string;
    email: string;
    password1: string;
    password2: string;
}

export class PasswordResetModel {
    token: string;
    link: string;
    password: string;
}

export class PasswordChangeModel {
    oldPassword: string;
    newPassword: string;
    newPassword2: string;
}

export class RegisterUser {
    name: string;
    surname: string;
    email: string;
    phone: string;    
}

export class UserDetail {
    name: string;
    surname: string;
    email: string;
    phone: string;    
}