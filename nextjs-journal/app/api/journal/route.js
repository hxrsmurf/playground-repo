import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createClient } from 'redis'

export async function POST(request) {
  const client = createClient({
    url: 'redis://' + process.env.REDIS_SERVER + ':6379',
    legacyMode: false,
  })

  await client.connect()

  const headersList = headers()

  var user = null
  var data = null

  try {
    user = headersList.get('user')
    const json_response = await request.json()
    data = { [json_response['title']]: JSON.stringify(json_response) }
  } catch (error) {
    console.log('Error with Headers Users: ', error)
    try {
      const authorization = headersList.get('authorization')
      user = await client.get(authorization)
      data = await request.json()
    } catch (error) {}
  }

  try {
    await client.hSet(user, data)
  } catch (error) {
    console.log('Error when hSet', error)
  }

  return NextResponse.json({ body: 'SUCCESS' })
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const headersList = headers()
  const authorization = headersList.get('authorization')
  const api_key_params = searchParams.get('api')
  var api_key = null

  if (authorization) {
    api_key = authorization
  } else {
    api_key = api_key_params
  }

  const client = createClient({
    url: 'redis://' + process.env.REDIS_SERVER + ':6379',
    legacyMode: false,
  })

  await client.connect()

  const user = await client.get(api_key)

  if (!user) return new Response('Not valid API Key')

  const entries = await client.hGetAll(user)

  const list_of_entries = []
  {
    Object.entries(entries).map((entry) =>
      list_of_entries.push({ title: entry[0], content: JSON.parse(entry[1]) })
    )
  }

  return new Response(JSON.stringify(list_of_entries), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
