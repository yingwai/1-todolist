type ButtonPropsType = {
    title: string;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
};

export const Button = ({ title, disabled, onClick, className }: ButtonPropsType) => {
    return (
        <button className={className} disabled={disabled} onClick={onClick}>
            {title}
        </button>
    );
};
