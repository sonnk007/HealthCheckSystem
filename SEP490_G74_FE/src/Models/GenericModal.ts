import { ModalProps } from "antd";

export interface GenericModalProps extends ModalProps {
    isOpen: boolean;
    onClose: () => void;
    childComponent?: React.ReactNode;
    title: string;
    footer: React.ReactNode;
  }