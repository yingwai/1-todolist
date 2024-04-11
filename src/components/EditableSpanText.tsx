import TextField from '@mui/material/TextField';
import React, { useState, KeyboardEvent, ChangeEvent } from 'react';

type SpanTextPropsType = {
    oldTitle: string
    updateTitleItem: (newTitle: string) => void
}

export const EditableSpanText = ({ oldTitle, updateTitleItem }: SpanTextPropsType) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    let [newTitle, setNewTitle] = useState<string>(oldTitle);

    function onChangeEditText() {
        setIsEdit(!isEdit)

        if (isEdit) updateTitleItem(newTitle)
    }

    function onKeyUpInputHandler(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key !== 'Enter') return;

        onChangeEditText();
    }

    function fChangeTitleValue(e: ChangeEvent<HTMLInputElement>) {
        setNewTitle(e.currentTarget.value)
    }

    return (
        isEdit
            ?
            <TextField
                id="outlined-basic"
                variant="outlined"
                size='small'
                autoFocus
                value={newTitle}
                onBlur={onChangeEditText}
                onKeyUp={onKeyUpInputHandler}
                onChange={fChangeTitleValue}
            />
            : <span onDoubleClick={onChangeEditText}>{oldTitle}</span>
    );
};