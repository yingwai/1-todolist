// import { addTodolistAC, changeTitleTodolistAC, removeTodolistAC, todolistsReducer } from './todolists-reducer'
// import { v1 } from 'uuid'
// import { TodolistType } from '../App'

// let todolistId1: string
// let todolistId2: string
// let startState: TodolistType[]

// beforeEach(() => {
//     todolistId1 = v1()
//     todolistId2 = v1()

//     startState = [
//         { id: todolistId1, title: 'What to learn' },
//         { id: todolistId2, title: 'What to buy' },
//     ]
// })

// test('correct todolist should be added', () => {
//     const newTitle = 'New Todolist'
//     const endState = todolistsReducer(startState, addTodolistAC(newTitle))

//     expect(endState.length).toBe(3)
//     expect(endState[2].title).toBe(newTitle)
// })

// test('correct todolist should be removed', () => {
//     // 2. Действие
//     const endState = todolistsReducer(startState, removeTodolistAC(todolistId1))

//     // 3. Проверяем, что наши действия (изменения state) соответствуют ожиданию
//     // в массиве останется один тудулист
//     expect(endState.length).toBe(1)
//     // удалится нужный тудулист, а не любой
//     expect(endState[0].id).toBe(todolistId2)
// })

// test('correct todolist should change its name', () => {
//     const newTitle = 'New Todolist'

//     const endState = todolistsReducer(startState, changeTitleTodolistAC(todolistId2, newTitle))

//     expect(endState[0].title).toBe('What to learn')
//     expect(endState[1].title).toBe(newTitle)
// })