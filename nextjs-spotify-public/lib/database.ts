import { createClient } from 'redis'
import { DynamoDB } from 'aws-sdk'

export function redis() {
  const client = createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
    password: process.env.REDIS_PASSWORD,
  })
  return client
}

export function dynamodb(year_month: any) {
  const client = new DynamoDB({
    credentials: {
      accessKeyId: process.env.ACCESS_KEY!,
      secretAccessKey: process.env.SECRET_KEY!,
    },
    region: process.env.REGION,
  })

  let params: DynamoDB.QueryInput = {
    TableName: process.env.TABLE!,
    IndexName: process.env.TABLE_INDEX,
    KeyConditionExpression: 'year_month = :year_month',
    ExpressionAttributeValues: {
      ':year_month': {
        S: year_month,
      },
    },
  }

  return {client, params}
}
