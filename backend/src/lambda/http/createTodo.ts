import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../helpers/todosAcess'

import { todoBuilder } from '../../helpers/todos'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
};
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    
    // TODO: Implement creating a new TODO item

    
    const todo = todoBuilder(newTodo , event)
  
    await createTodo(todo);
    return {
       statusCode: 201,
       headers,
       body: JSON.stringify({
        todo
       })

    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
