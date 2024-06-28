// import { v1 } from "uuid"
// import { TasksStateType, TodolistType } from "../App"
// import { tasksReducer } from "./tasks-reducer"
// import { addTodolistAC, removeTodolistAC, todolistsReducer } from "./todolists-reducer"

// test('ids should be equals', () => {
//     const startTasksState: TasksStateType = {}
//     const startTodolistsState: Array<TodolistType> = []

//     const action = addTodolistAC('new todolist')

//     const endTasksState = tasksReducer(startTasksState, action)
//     const endTodolistsState = todolistsReducer(startTodolistsState, action)

//     const keys = Object.keys(endTasksState)
//     const idFromTasks = keys[0]
//     const idFromTodolists = endTodolistsState[0].id

//     expect(idFromTasks).toBe(action.payload.id)
//     expect(idFromTodolists).toBe(action.payload.id)
// })

// test('property with todolistId should be deleted', () => {
//     const todolistID1 = v1();
//     const todolistID2 = v1();

//     const startState: TasksStateType = {
//         [todolistID1]: {
//             data: [
//                 { id: v1(), title: 'HTML&CSS', isDone: true },
//                 { id: v1(), title: 'JS', isDone: true },
//                 { id: v1(), title: 'ReactJS', isDone: false },
//             ],
//             filter: 'all'
//         },
//         [todolistID2]: {
//             data: [
//                 { id: v1(), title: 'Rest API', isDone: true },
//                 { id: v1(), title: 'GraphQL', isDone: false },
//             ],
//             filter: 'all'
//         },
//     }

//     const action = removeTodolistAC(todolistID2)

//     const endState = tasksReducer(startState, action)

//     const keys = Object.keys(endState)

//     expect(keys.length).toBe(1)
//     expect(endState[todolistID2]).not.toBeDefined()
// })
