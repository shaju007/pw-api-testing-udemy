import articleRequestPayload from '../../request-objects/POST-article.json'
import { createToken } from '../../helpers/createToken'
import{expect} from '../../utils/custom-expect'
import { faker } from '@faker-js/faker';
import { getNewRandomArticle } from '../../utils/data-generator';
import { randomInt } from 'node:crypto'
import {test} from '../../utils/fixtures'
import { validateSchema } from '../../utils/schema-validator'

let authToken: string

test.beforeAll('run before all', async({api, config})=>{

    // const tokenResponse = await api
    // .path('/users/login')
    // .body({
    //   "user": { "email": config.email, "password": config.password }
    // })
    // .postRequest(200)
  
  // authToken = await createToken(config.email, config.password)
})

test('Get articles', async({api})=>{

    const response = await api
    .path('/articles')
    .params({limit:10, offset:0})
    .clearAuth()
    .getRequest(200)

    await expect(response).shouldMatchSchema('articles', 'GET_articles', false)

    expect(response.articles.length).shouldBeLessThanOrEqual(10)
      expect(response.articlesCount).shouldEqual(10)

    // console.log(response)
    const response2 = await api
    .path('/tags')
    .getRequest(200)
    expect(response2.tags[0]).shouldEqual('Test')
  expect(response2.tags.length).shouldBeLessThanOrEqual(10)
})

test('Get Tags', async({api})=>{
    const response = await api
    .path('/tags')
    .getRequest(200)
    await expect(response).shouldMatchSchema('tags', 'GET_tags', false)
    expect(response.tags[0]).shouldEqual('Test')
  expect(response.tags.length).toBeLessThanOrEqual(10)
})

test('create and delete article', async({api})=>{
  const articleTitle = faker.lorem.sentence(5)
  const articleRequest = getNewRandomArticle()
  
    const title = `${randomInt(11)} ${randomInt(11)} Test ${randomInt(11)} article ${randomInt(11)}`
    // const title = 'Test Two'
    articleRequest.article.title = articleTitle
    const createArticleResponse = await api
    .path('/articles')
    .body({ article: { ...articleRequestPayload.article, title } })
    .postRequest(201)

    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles')

    expect(createArticleResponse.article.title).shouldEqual(`${title}`)
    const slugId = createArticleResponse.article.slug

    const getArticleResponse = await api
    .path('/articles')
    
    .params({limit:10, offset:0})
    .getRequest(200)

    expect(getArticleResponse.articles[0].title).shouldEqual(title)

    // delete
    await api
    .path(`/articles/${slugId}`)
    
    .deleteRequest(204)

    // assert if really deleted
    const getArticleResponseAfterDel = await api
    .path('/articles')
    
    .params({limit:10, offset:0})
    .getRequest(200)

    expect(getArticleResponseAfterDel.articles[0].title).not.shouldEqual(title)
    
})

test('create, update and delete article', async({api})=>{
    const title = `${randomInt(11)} ${randomInt(11)} Test ${randomInt(11)} article ${randomInt(11)}`

    const createArticleResponse = await api
    .path('/articles')
    
    .body({
      "article": {
        "title": title,
        "description": "test",
        "body": "test test",
        "tagList": [
          "testapi"
        ]
      }
    })
    .postRequest(201)

    expect(createArticleResponse.article.title).shouldEqual(title)
    const slugId = createArticleResponse.article.slug

    const getArticleResponse = await api
    .path(`/articles`)
    
    .params({limit:10, offset:0})
    .getRequest(200)

    // console.log(getArticleResponse)

    expect(getArticleResponse.articles[0].title).shouldEqual(title)

    // Update
    const updateArticleResponse = await api
    .path(`/articles/${slugId}`)
    
    .body({
      "article": {
        "title": `Modified ${title}`,
        "description": "test",
        "body": "test test",
        "tagList": [
          "testapi"
        ]
      }
    })
    .putRequest(200)

    expect(updateArticleResponse.article.title).shouldEqual(`Modified ${title}`)
    const modifiedSlugId = updateArticleResponse.article.slug

    // get updated article assertion
    const getArticleResponseAfterUpdate = await api
    .path(`/articles`)
    
    .params({limit:10, offset:0})
    .getRequest(200)
    expect(getArticleResponseAfterUpdate.articles[0].title).shouldEqual('Modified ' + title)



    // delete
    await api
    .path(`/articles/${modifiedSlugId}`)
    
    .deleteRequest(204)

    // assert if really deleted
    const getArticleResponseAfterDel = await api
    .path('/articles')
    
    .params({limit:10, offset:0})
    .getRequest(200)

    expect(getArticleResponseAfterDel.articles[0].title).not.shouldEqual(`Modified ${title}`)
    
})