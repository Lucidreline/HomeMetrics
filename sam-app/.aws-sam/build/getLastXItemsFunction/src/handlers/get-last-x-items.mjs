import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { BatchGetItemCommand } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient({});
let ddbDocClient = DynamoDBDocumentClient.from(client);

// redirect dynamodb if this is ran locally
if (process.env.AWS_SAM_LOCAL) {
    ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({
        endpoint: "http://172.20.0.2:8000"
    }));
}

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

const downMinutes = (minute) => {
    if (minute < 15) return 0
    else if (minute < 30) return 15
    else if (minute < 45) return 30
    else return 45
}

const backInTime = (minutes, date) => {
    const currentMSeconds = date.getTime()
    const mSecondsToSub = 60000 * minutes
    return new Date(currentMSeconds - mSecondsToSub)
}

const formatTimestamp = (date, piId) => {

    return `${piId} ${("0" + (date.getMonth() + 1)).slice(-2)}/${("0" + date.getDate()).slice(-2)}/${date.getFullYear()} ${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`
}


const getTimestamps = (x, piId) => {
    let now = new Date()

    // changing timezone
    now = new Date(now.toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles'
    }))

    const last15nthMinute = downMinutes(now.getMinutes())
    const minutesToRemove = now.getMinutes() - last15nthMinute
    const roundedDownDate = backInTime(minutesToRemove, now)

    let timestamps = []
    let iteratedDate = roundedDownDate
    timestamps.push(formatTimestamp(iteratedDate, piId))

    for (let i = 0; i < x - 1; i++) {
        iteratedDate = backInTime(15, iteratedDate)
        timestamps.push(formatTimestamp(iteratedDate, piId))
    }
    return timestamps
}

const formatForQuery = (ids) => {
    const keys = []
    ids.forEach(id => {
        keys.push({ "id": { "S": id } })
    })

    return keys
}

const formatResponse = (response) => {
    const data = []
    response.forEach(item => {
        data.push({
            id: item.id.S,
            temperature: item.temperature.N,
            humidity: item.humidity.N
        })
    })
    return data
}

// console.log(getTimestamps(1, "pi1"))

export const getLastXItemsHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    // console.info('received:', event);

    const x = event.pathParameters.x;

    const idsToFind = [...getTimestamps(x, "pi1"), ...getTimestamps(x, "pi2"), ...getTimestamps(x, "pi3"), ...getTimestamps(x, "pi4")]



    // get all items from the table (only first 1MB data, you can use `LastEvaluatedKey` to get the rest of data)
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
    // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html
    var params = {
        RequestItems: {
            [tableName]: {
                Keys: formatForQuery(idsToFind)
            }
        }
    };

    try {
        //const data = await ddbDocClient.send(new BatchGetItemCommand(params));
        var data = await ddbDocClient.send(new BatchGetItemCommand(params))
        var res = data.Responses[tableName]
        // var items = data.Items;
        // console.log(items)
    } catch (err) {
        console.log("Error", err);
    }

    const formattedRes = formatResponse(res)
    const response = {
        statusCode: 200,
        body: JSON.stringify({ items: formattedRes })
    };

    // All log statements are written to CloudWatch
    return response;
}
