import axios from "axios"

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        'API-KEY': '0903b104-ed27-499a-90d5-0022ee79cca6',
    },
})

type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}

export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export type UpdateTaskModelType = {
    title: string,
    startDate: string,
    priority: number,
    description: string,
    deadline: string,
    status: TaskStatuses
}

type TaskResponseType = {
    error: string,
    items: TaskType[]
    totalCount: number
}

export type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors: FieldErrorType[]
    data: D
}

type FieldErrorType = {
    error: string
    field: string
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export const todolistAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>('/todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('/todo-lists', { title })
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType<{ item: TodolistType }>>(`/todo-lists/${todolistId}`)
    },
    changeTitleTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType<{ item: TodolistType }>>(`/todo-lists/${todolistId}`, { title })
    },

    getTasks(todolistId: string) {
        return instance.get<TaskResponseType>(`/todo-lists/${todolistId}/tasks`);
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks`, { title });
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks/${taskId}`);
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model);
    }
}

export type LoginParamsType = {
    email: string,
    password: string,
    rememberMe: boolean
}

export const authAPI = {
    me() {
        return instance.get<ResponseType>('/auth/me')
    },
    login(data: LoginParamsType) {
        return instance.post<ResponseType>('/auth/login', data)
    },
    logout() {
        return instance.delete<ResponseType>('/auth/login');
    }
}