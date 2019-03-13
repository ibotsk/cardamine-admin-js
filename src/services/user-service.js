
import fakeAuth from './fake-auth';

const login = async (username, password, cb) => {
    
    console.log(username, password);
    
    fakeAuth.authenticate(cb);
}

export default { login };