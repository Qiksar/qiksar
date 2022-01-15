export default class User {
    auth_id = '';
    realm = '';
    username = '';
    firstname = '';
    lastname = '';
    email = '';
    emailVerified = false;
    roles:string[] = [];
    lastLogin = '';
    locale = process.env.DEFAULT_LOCALE ?? 'en-AU';
}