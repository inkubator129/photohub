class UserHolder{

    user;

    getInstance() {
        return this.user;
    }

    setInstance(user){
        this.user = user;
    }
}

export default new UserHolder();