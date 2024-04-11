import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import React, { KeyboardEvent, useState } from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox'
import Box from '@mui/material/Box';

// import { Button } from './button/Button';

type ItemProps = {
    addItem: (taskTitle: string) => void,
}

export const AddItemForm = ({ addItem }: ItemProps) => {
    let [errorInput, setErrorInput] = useState<string | null>(null);

    let [taskTitle, setTaskTitle] = useState<string>('');

    const nMinLimitValueTitle = 5;

    function fItemHandler() {
        if (taskTitle.trim() === "") return (setErrorInput("Title is required"), setTaskTitle(""));

        if (taskTitle.length < nMinLimitValueTitle) return;

        addItem(taskTitle.trim());
        setTaskTitle("");
    }

    function fItemOnKeyUpHandler(e: KeyboardEvent<HTMLDivElement>) {
        setErrorInput(null);

        if (e.key === "Enter") fItemHandler();
    }


    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size='small'
                    label={!!errorInput ? errorInput : "Write a title"}
                    error={!!errorInput}
                    value={taskTitle}
                    onChange={e => setTaskTitle(e.currentTarget.value)}
                    onKeyUp={e => fItemOnKeyUpHandler(e)}
                    onBlur={() => setErrorInput(null)}
                />
                <IconButton
                    color={'primary'}
                    onClick={() => fItemHandler()}
                    disabled={taskTitle.length < nMinLimitValueTitle}
                >
                    <AddBoxIcon />
                </IconButton>
            </Box>
        </div>
    );
};