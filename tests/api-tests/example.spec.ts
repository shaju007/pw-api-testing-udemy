import { config } from '../../api-test.config'
import { expect, test } from '@playwright/test';

import { randomInt } from 'node:crypto';

let authToken:string

test.beforeAll('run before all', async({request})=>{
  const tokenRes = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      "user": { "email": config.email, "password": config.password }
    }
  })

  const tokenResJson = await tokenRes.json()
  authToken = `Token ${tokenResJson.user.token}`
  console.log('Auth token created')
})

// test.afterAll('run after all', async({})=>{
//   console.log('This is executed after all tests')
// })




test('Get Tags', async ({ request }) => {
  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
  const tagsResponseJSON = await tagsResponse.json()

  expect(tagsResponse.status()).toEqual(200)
  expect(tagsResponseJSON.tags[0]).toEqual('Test')
  expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10)
});

test('Get articles', async ({ request }) => {
  const articlesRes = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
  const articlesResJson = await articlesRes.json()

  expect(articlesRes.status()).toEqual(200)
  expect(articlesResJson.articles.length).toBeLessThanOrEqual(10)
  expect(articlesResJson.articlesCount).toEqual(10)
})

test('Create and delete article', async ({ request }) => {
  
  const title = `${randomInt(11)} ${randomInt(11)} Test ${randomInt(11)} article ${randomInt(11)}`

  const newArticleRes = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    headers: {
      Authorization: authToken
    },
    data: {
      "article": {
        "title": `${title}`,
        "description": "test",
        "body": "test test",
        "tagList": [
          "testapi"
        ]
      }
    }
  })

  const newArticleResJson = await newArticleRes.json()
  expect(newArticleRes.status()).toBe(201)
  expect(newArticleResJson.article.title).toEqual(`${title}`)

  const slugId = newArticleResJson.article.slug

  // console.log(newArticleResJson)

  const articlesRes = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',{
    headers:{
      Authorization: authToken
    }
  })
  const articlesResJson = await articlesRes.json()
  expect(articlesRes.status()).toEqual(200)
  expect(articlesResJson.articles[0].title).toEqual(title)





  // DEL article endpoint https://conduit-api.bondaracademy.com/api/articles/${slugId}

  const deleteArticleRes = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`,{
    headers:{
      Authorization: authToken
    }
  })

  expect(deleteArticleRes.status()).toEqual(204)

})

test('Create, update and delete article', async ({ request }) => {
  // const tokenRes = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
  //   data: {
  //     "user": { "email": config.email, "password": config.password }
  //   }
  // })

  // const tokenResJson = await tokenRes.json()
  // const authToken = `Token ${tokenResJson.user.token}`
  // console.log(authToken)
  const title = `${randomInt(11)} ${randomInt(11)} Test ${randomInt(11)} article ${randomInt(11)}`

  const newArticleRes = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    headers: {
      Authorization: authToken
    },
    data: {
      "article": {
        "title": `${title}`,
        "description": "test",
        "body": "test test",
        "tagList": [
          "testapi"
        ]
      }
    }
  })

  const newArticleResJson = await newArticleRes.json()
  expect(newArticleRes.status()).toBe(201)
  expect(newArticleResJson.article.title).toEqual(`${title}`)

  const slugId = newArticleResJson.article.slug

  // console.log(newArticleResJson)

  const articlesRes = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',{
    headers:{
      Authorization: authToken
    }
  })
  const articlesResJson = await articlesRes.json()
  expect(articlesRes.status()).toEqual(200)
  expect(articlesResJson.articles[0].title).toEqual(title)

  // UPDATE article using PUT
  const modifiedArticleRes = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    headers: {
      Authorization: authToken
    },
    data: {
      "article": {
        "title": `modified ${title}`,
        "description": "test",
        "body": "test test",
        "tagList": [
          "testapi"
        ]
      }
    }
  })

  const modifiedArticleResJson = await modifiedArticleRes.json()
  expect(modifiedArticleRes.status()).toBe(200)
  expect(modifiedArticleResJson.article.title).toEqual(`modified ${title}`)

  const modifiedSlugId = modifiedArticleResJson.article.slug






  // DEL article endpoint https://conduit-api.bondaracademy.com/api/articles/${slugId}

  const deleteArticleRes = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${modifiedSlugId}`,{
    headers:{
      Authorization: authToken
    }
  })

  expect(deleteArticleRes.status()).toEqual(204)

})