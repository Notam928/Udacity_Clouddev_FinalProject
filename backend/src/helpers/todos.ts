// import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'
import { getUserId } from '../lambda/utils';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { TodoItem } from '../models/TodoItem';
// import { getTodoById} from '../../helpers/todosAcess'






// TODO: Implement businessLogic



export function todoBuilder(todoRequest: CreateTodoRequest, event:APIGatewayProxyEvent):
TodoItem
{
    const todoId  = uuid.v4()
    const todo = {
      todoId:todoId,
      userId: getUserId(event),
      createdAt: new Date().toISOString(),
      // name: newTodo.name,
      // dueDate: newTodo.dueDate,
      done: false,
      attachmentUrl: '',
      ...todoRequest
    }
         return todo as TodoItem

}