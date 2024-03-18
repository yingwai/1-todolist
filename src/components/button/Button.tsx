type ButtonPropsType = {
    title: string,
    disabled?: boolean,
    onClick?: () => void,
}

export const Button = ({title, disabled, onClick}: ButtonPropsType) => {
    return (
        <button disabled={disabled} onClick={onClick}>{title}</button>
    );
};