import TextField from '@mui/material/TextField';
import React, { useState, KeyboardEvent, ChangeEvent, memo } from 'react';

type SpanTextPropsType = {
    oldTitle: string
    disabled: boolean
    updateTitleItem: (newTitle: string) => void
}

export const EditableSpanText = memo(({ oldTitle, disabled, updateTitleItem }: SpanTextPropsType) => {    
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
                disabled={disabled}
                onBlur={onChangeEditText}
                onKeyUp={onKeyUpInputHandler}
                onChange={fChangeTitleValue}
            />
            : <span onDoubleClick={onChangeEditText}>{oldTitle}</span>
    );
})