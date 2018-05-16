class User{

    constructor({id, username, email, name, sex, avatar_url}){
        this.id = id;
        this.username = username;
        this.email = email;
        this.name = name;
        this.gender = sex;
        this.avatar_url = avatar_url;
    }
}

export default User;