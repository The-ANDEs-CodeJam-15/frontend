export type IconProps = {
    label: string
    initials?: string;
    value?: number;
    color: string;
    size: number;
    boldText: boolean;
    imagePath?: string;
    selected?: boolean;
    onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({ 
    label, 
    initials, 
    value, 
    color, 
    size, 
    boldText, 
    imagePath, 
    selected, 
    onClick
}) => {
    const content = (<div className="flex flex-col items-center gap-2 relative">
        {/* Icon with initials or image */}
        <div className="relative">
            <div
                className="rounded-full flex items-center justify-center text-black font-bold text-xl shadow-lg"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    boxShadow: `0 0 20px ${color}40`,
                    transform: selected ? 'scale(1.2)' : 'scale(1)',
                }}
            >
                {imagePath ? (
                    <img
                        src={imagePath}
                        alt={label}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    initials
                )}
            </div>
        </div>

        <div className="text-center">
            <div className="${boldText ? 'font-bold' : 'font-normal'} text-neutral-50 font-medium text-sm truncate max-w-[80px]">
                {label}
            </div>
            <div className="text-xs text-neutral-400 font-mono">
                {value}
            </div>
        </div>
    </div>)

    if (onClick) {
        return (
            <button
                onClick={onClick}
                className="cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-neutral-950 rounded-2xl"
            >
                {content}
            </button>
        );
    }

    // Otherwise return content directly
    return content;
}

export default Icon