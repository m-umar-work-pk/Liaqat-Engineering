import { message } from "antd";

// 1. Centralized Config
export const APP_NAME = import.meta.env.VITE_APP_NAME || "Liaqat Engineering";

// 2. Standardized Toast Notifications
export const notify = (msg, type = "info", duration = 3) => {
    const allowedTypes = ['success', 'error', 'info', 'warning', 'loading'];
    const finalType = allowedTypes.includes(type) ? type : 'info';
    message[finalType]({ content: msg, duration });
};

// 3. ID Generation (Improved for uniqueness)
export const getRandomId = () => 
    Date.now().toString(36) + Math.random().toString(36).substring(2);

// 4. Validation Utilities
export const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

// 5. Date Formatting Utility (Useful for your Firebase timestamps)
export const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// 6. Currency Formatting (Useful for your engineering quotes/billing)
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
    }).format(amount);
};