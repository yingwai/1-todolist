// import { TasksStateType } from '../App'
// import { v1 } from 'uuid'
// import { addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer } from './tasks-reducer';
// import { addTodolistAC } from './todolists-reducer';

// let todolistID1: string
// let todolistID2: string
// let startState: TasksStateType

// beforeEach(() => {
//     todolistID1 = v1();
//     todolistID2 = v1();

//     startState = {
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
// })

// test('correct task should be deleted from correct array', () => {
//     const endState = tasksReducer(startState, removeTaskAC(todolistID2, startState[todolistID2].data[1].id));

//     expect(endState[todolistID2].data.length).toBe(1);
// })

// test('correct task should be added to correct array', () => {
//     const endState = tasksReducer(startState, addTaskAC(todolistID2, "Juce"));

//     expect(endState[todolistID1].data.length).toBe(3)
//     expect(endState[todolistID2].data.length).toBe(3)
//     expect(endState[todolistID2].data[0].id).toBeDefined()
//     expect(endState[todolistID2].data[0].title).toBe("Juce")
//     expect(endState[todolistID2].data[0].isDone).toBe(false)
// })

// test('correct task should be change status to correct array', () => {
//     const endState = tasksReducer(startState, changeTaskStatusAC(todolistID2, startState[todolistID2].data[1].id, !startState[todolistID2].data[1].isDone));

//     expect(endState[todolistID2].data[0].isDone).toBe(true)
//     expect(endState[todolistID2].data[1].isDone).toBe(true)
// })

// test('title task should be change to correct array', () => {
//     const endState = tasksReducer(startState, changeTaskTitleAC(todolistID2, startState[todolistID2].data[1].id, "Reducer"));

//     expect(endState[todolistID2].data[0].title).toBe("Rest API")
//     expect(endState[todolistID2].data[1].title).toBe("Reducer")
// })

// test('new array should be added when new todolist is added', () => {
//     const action = addTodolistAC('new todolist')

//     const endState = tasksReducer(startState, action)

//     const keys = Object.keys(endState)
//     const newKey = keys.find(k => k !== todolistID1 && k !== todolistID2)
//     if (!newKey) {
//         throw Error('new key should be added')
//     }

//     expect(keys.length).toBe(3)
//     expect(endState[newKey]).toEqual({ data: [], filter: 'all' })
// })
