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

type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors: FieldErrorType[]
    data: D
}

type FieldErrorType = {
    error: string
    field: string
}

export const todolistAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>('/todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{item: TodolistType}>>('/todo-lists', {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType<{item: TodolistType}>>(`/todo-lists/${todolistId}`)
    },
    changeTitleTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType<{item: TodolistType}>>(`/todo-lists/${todolistId}`, {title})
    }
}