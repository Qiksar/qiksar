import TokenStore from '../Translator/TokenStore';

export default class User {
    realm = '';
    username = '';
    firstname = '';
    lastname = '';
    email = '';
    emailVerified = false;
    roles:string[] = [];
    lastLogin = '';
    locale = process.env.DEFAULT_LOCALE ?? 'en-AU';
    TokenStore = new TokenStore();
}