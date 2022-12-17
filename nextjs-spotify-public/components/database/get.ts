import { dynamodb, redis } from '../../lib/database'

export async function redis_get_tracks(year_month: any) {
  const client = redis()
  client.connect()
  const data = await client.get(year_month)
  if (!data) return data
  return JSON.parse(data)
}

export async function dynamodb_get_tracks(year_month: any) {
  if (year_month.length !== 7) return false

  const database = dynamodb(year_month)
  const client = database.client
  const params = database.params

  let hasNext = true
  let LastEvaluatedKey = undefined
  let tracks: any = []

  while (hasNext) {
    const data = await client.query(params).promise()
    const data_items: any = data['Items']
    data_items.forEach((element: any) => {
      tracks.push(element)
    })
    LastEvaluatedKey = data.LastEvaluatedKey
    if (LastEvaluatedKey) {
      params.ExclusiveStartKey = LastEvaluatedKey
    }
    hasNext = !!LastEvaluatedKey
  }
  return tracks
}
