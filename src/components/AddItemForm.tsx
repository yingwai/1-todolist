import React, { KeyboardEvent, useState } from 'react';
import { Button } from './button/Button';

type ItemProps = {
    addItem: (taskTitle: string) => void,
}

export const AddItemForm = ({addItem}: ItemProps) => {
    let [errorInput, setErrorInput] = useState<string | null>(null);
    
    let [taskTitle, setTaskTitle] = useState<string>('');

    const nMinLimitValueTitle = 5;

    function fItemHandler() {
        if (taskTitle.length < nMinLimitValueTitle) return;

        if (taskTitle.trim() === "") return (setErrorInput("Title is required"), setTaskTitle(""));

        addItem(taskTitle.trim());
        setTaskTitle("");
    }

    function fItemOnKeyUpHandler(e: KeyboardEvent<HTMLInputElement>) {
        setErrorInput(null);

        if (e.key === "Enter") fItemHandler();
    }

    return (
        <div>
            <input
                value={taskTitle}
                className={errorInput ? "errorInput" : ""}
                onChange={e => setTaskTitle(e.currentTarget.value)}
                onKeyUp={e => fItemOnKeyUpHandler(e)}
            />
            <Button
                title={"+"}
                onClick={() => fItemHandler()}
                disabled={taskTitle.length < nMinLimitValueTitle}
            />
            {errorInput && <div className={errorInput ? "errorInputMessage" : ""}>{errorInput}</div>}
        </div>
    );
};