export interface IUser {
    id: number;
    name: string;
    email: string;
    isinvestor: boolean;
    profileimageurl: string;
    location: string;
    bio: string;
    investmentfocus: string;
    averagenoofinvestment: number;
    averageinvestmentsizeperyear: number;
    password: string;
    isactive: boolean;
    activatekey: string;
    createdon: string;
    title: string;
    ismoderator: boolean;

}

export interface Iforgetpassword {
    id: number;
    email: string;
    password: string;
    activatekey: string;
}
