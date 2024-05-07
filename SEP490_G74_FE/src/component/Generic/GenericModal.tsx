import { Modal } from "antd";
import { GenericModalProps } from "../../Models/GenericModal";

const GenericModal = ({
  isOpen,
  onClose,
  childComponent,
  footer,
  title
}: GenericModalProps) => {

  return (
    <Modal
      title={title}
      destroyOnClose={true}
      open={isOpen}
      onOk={onClose}
      onCancel={onClose}
      maskClosable={false}
      width="max-content"
      footer={footer}
    >      
        {childComponent}
    </Modal>
  );
};

export default GenericModal;
