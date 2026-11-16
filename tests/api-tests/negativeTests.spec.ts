import { expect } from '../../utils/custom-expect'
import { test } from '../../utils/fixtures'

[
        
        {
            username: 'dd', usernameErrorMessage: "is too short (minimum is 3 characters)",   
        },
        {
            username: 'ddd', usernameErrorMessage: "",   
        },
        {
            username: 'ddddddd', usernameErrorMessage: "",   
        },
        {
            username: 'ddddddddddddddddddddddddddddd', usernameErrorMessage: "is too long (maximum is 20 characters)"   
        }
    ].forEach(({username, usernameErrorMessage})=>{
        test(`Error message validatoin for ${username}`, async ({ api }) => {
    

    const newUserResponse = await api
        .body({
            "user": {
                "email": process.env.NEGATIVE_TEST_EMAIL!,
                "password": process.env.NEGATIVE_TEST_PASSWORD!,
                "username": username
            }
        })
        .path('/users')
        .clearAuth()
        .postRequest(422)

        if(username.length >= 3 && username.length<=20){
            expect(newUserResponse.errors).not.toHaveProperty('username')
            
        } else{
            expect(newUserResponse.errors.username[0]).shouldEqual(usernameErrorMessage)
        }
        // console.log(newUserResponse)
})
    })

