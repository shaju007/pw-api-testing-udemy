import {test as base, expect} from '@playwright/test'

import { APILogger } from './logger'
import { RequestHandler } from './request-handler'
import {config} from '../api-test.config'
import { createToken } from '../helpers/createToken'
import { setCustomExpectLogger } from './custom-expect'

export type TestOptions = {
    api: RequestHandler,
    config: typeof config


}

export type WorkerFixture ={
    authToken: string
}

export const test = base.extend<TestOptions, WorkerFixture>({
    authToken: [async ({}, use)=>{
        const authToken = await createToken(config.email, config.password)
        await use(authToken)

    },{scope: 'worker'}],

    api: async({request, authToken}, use)=>{
        const logger = new APILogger()
        setCustomExpectLogger(logger)
        const requestHandler = new RequestHandler(request, config.apiUrl, logger, authToken)

        await use(requestHandler)
    },

    config: async({}, use)=>{
        await use(config)
    }
})