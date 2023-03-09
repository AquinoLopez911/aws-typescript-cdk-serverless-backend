import { AuthService } from "./AuthService";
import { config } from "./config";
import * as AWS from 'aws-sdk';

AWS.config.region = config.REGION;

const callStuff = async () => {
    const authService = new AuthService();
    
    
    const user = await authService.login(config.TEST_USER_NAME, config.TEST_USER_PASSWORD)
    console.log(user)
    // await authService.getAWSTemporaryCreds(user);
    // const someCredss = AWS.config.credentials;

    // authService.forgotPasswordSubmit(config.TEST_USER_NAME, '', "P154#av561")
    // .then((data) => console.log(data))
    // .catch((err) => console.log(err));

}


callStuff();