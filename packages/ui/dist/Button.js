import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import './tokens.css';
export const Button = React.forwardRef(({ className, variant = 'primary', ...props }, ref) => {
    const baseStyle = {
        padding: '8px 16px',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-ui)',
        fontWeight: 'bold',
        border: 'none',
        cursor: 'pointer',
        outline: 'none',
        transition: 'var(--transition-fast)',
    };
    let variantStyle = {};
    if (variant === 'primary') {
        variantStyle = {
            backgroundColor: 'var(--accent-primary)',
            color: 'var(--bg-base)',
        };
    }
    else if (variant === 'secondary') {
        variantStyle = {
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
        };
    }
    else if (variant === 'danger') {
        variantStyle = {
            backgroundColor: 'var(--accent-danger)',
            color: 'white',
        };
    }
    return (_jsx("button", { ref: ref, style: { ...baseStyle, ...variantStyle }, className: className, ...props }));
});
