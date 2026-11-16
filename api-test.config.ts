import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });


const processEnv = process.env.TEST_ENV
const env = processEnv || 'prod'
console.log('Test env is: ', env)



const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    email: process.env.DEFAULT_USERNAME!,
    password: process.env.DEFAULT_PASSWORD!
}

if(env == 'qa1'){
    config.email = process.env.QA1_USERNAME!,
    config.password = process.env.QA1_PASSWORD!
}

if(env=='prod') {
    config.email = process.env.PROD_USERNAME,
    config.password = process.env.PROD_PASSWORD
}

export {config}