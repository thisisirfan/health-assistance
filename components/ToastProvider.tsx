"use client";

import React, {
    createContext,
    useContext,
    useState,
    useRef,
    ReactNode,
    FC,
} from "react";
import * as Toast from "@radix-ui/react-toast";
import styles from "../styles/style.module.css";

type ToastState = {
    title: string;
    description: string;
    open: boolean;
};

type ToastContextType = (args: { title: string; description: string }) => void;

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
    const [toastState, setToastState] = useState<ToastState>({
        title: "",
        description: "",
        open: false,
    });
    const timerRef = useRef<number | undefined>();

    const showToast: ToastContextType = ({ title, description }) => {
        setToastState({ title, description, open: true });

        clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            setToastState((prev) => ({ ...prev, open: false }));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <Toast.Provider swipeDirection="right">
                <Toast.Root
                    className={styles.Root}
                    open={toastState.open}
                    onOpenChange={(open: any) => setToastState((prev) => ({ ...prev, open }))}
                >
                    <Toast.Title className={styles.Title}>{toastState.title}</Toast.Title>
                    <Toast.Description className={styles.Description}>
                        {toastState.description}
                    </Toast.Description>
                </Toast.Root>
                <Toast.Viewport className={styles.Viewport} />
            </Toast.Provider>
        </ToastContext.Provider>
    );
};

// Custom hook to use the toast
export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
