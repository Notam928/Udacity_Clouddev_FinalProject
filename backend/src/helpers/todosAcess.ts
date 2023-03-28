import * as AWS from 'aws-sdk'

const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
// // import { TodoItem } from '../models/TodoItem'
// // import { TodoUpdate } from '../models/TodoUpdate';''
const logger = createLogger('todos')

import { TodoItem } from "../models/TodoItem";

const XAWS = AWSXRay.captureAWS(AWS)
console.log(XAWS)

// const logger = createLogger('TodosAccess')
// console.log(logger)

const todosTable = process.env.TODOS_TABLE
const index = process.env.TODOS_CREATED_AT_INDEX
const docClient: DocumentClient = createDynamoDBClient()

// // TODO: Implement the dataLayer logic
export async function createTodo(todo: TodoItem): Promise<TodoItem> {
   await docClient.put({
   TableName: todosTable,
   Item: todo

   }).promise()

   return todo as TodoItem


}







export async function getAllTodosByUserId(userId: string): Promise<TodoItem[]> {

  const result = await docClient.query({
    TableName : todosTable,
    KeyConditionExpression: '#userId = :userId',
    ExpressionAttributeNames: {
      '#userId': 'userId'
  },
    ExpressionAttributeValues: {
        ':userId': userId
    }
}).promise()

    return result.Items as TodoItem[]
}



export async function getTodoById(todoId: string): Promise<TodoItem> {

  const result = await docClient.query({
    TableName : todosTable,
    IndexName : index,
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues: {
      ':todoId': todoId
    }
}).promise()
  const items = result.Items
  if(items.length != 0) return result.Items[0] as TodoItem

  return  result.Items[0] as TodoItem
}


export async function updateTodo(todo: TodoItem): Promise<TodoItem> {

  const result = await docClient.update({
    TableName : todosTable,
    Key: {
      userId: todo.userId,
      todoId: todo.todoId
    },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
        ':attachmentUrl': todo.attachmentUrl
    }
}).promise()
   
    return result.Attributes as TodoItem
}



// export async function deleteTodo(todoId: string): Promise<void> {
//   await docClient.delete({
//     TableName: todosTable,
//     Key: {
//       todoId: todoId
//     }
//   }).promise();
// }







// export async function deleteTodoById(todoId: string) {
//   const param = {
//       TableName: this.todosTable,
//       Key: {
//           "todoId": todoId
//       }
//   }

//   await this.docClient.delete(param).promise()
// }



export async function  deleteTodo(todoId: string,userId: string): Promise<string> {
  logger.info("Deleting todo item function called");
  await docClient.delete({
      TableName: todosTable,
      Key: {
           todoId,
           userId}
  }).promise()
  logger.info("TodoItem deleted");
  return todoId as string
}


function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }
  

