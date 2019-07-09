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