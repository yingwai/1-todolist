import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import React, { KeyboardEvent, memo, useState } from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox'
import Box from '@mui/material/Box';

type ItemProps = {
    disabled?: boolean,
    addItem: (taskTitle: string) => void,
}

export const AddItemForm = memo(({ addItem, disabled }: ItemProps) => {
    let [errorInput, setErrorInput] = useState<string | null>(null);

    let [taskTitle, setTaskTitle] = useState<string>('');

    const nMinLimitValueTitle = 5;

    function fItemHandler() {
        if (taskTitle.trim() === "" || taskTitle.length < nMinLimitValueTitle) return (setErrorInput("Title is required"));

        addItem(taskTitle.trim());
        setTaskTitle("");
    }

    function fItemOnKeyUpHandler(e: KeyboardEvent<HTMLDivElement>) {
        if (errorInput) setErrorInput(null);

        if (e.key === "Enter") fItemHandler();
    }

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <TextField
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
                    disabled={taskTitle.length < nMinLimitValueTitle || disabled}
                >
                    <AddBoxIcon />
                </IconButton>
            </Box>
        </div>
    );
});