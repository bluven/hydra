import React, { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';

type User = {
    name: string;
    description?: string;
};

type AddUserProps = {
  onCreateUser: () => void;
};

const AddUser: React.FC<AddUserProps> = ({ onCreateUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const onSubmit = async (user: User) => {
      await window.ipcRenderer.addUser(user);

      closeModal();
      if(onCreateUser) {
        onCreateUser()
      }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal 
        title="Add User" 
        open={isModalOpen} 
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={closeModal} 
        destroyOnClose
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            initialValues={{ modifier: 'public' }}
            clearOnDestroy
            onFinish={(user) => onSubmit(user)}
          >
            {dom}
          </Form>)}
      >
        <Form.Item
            label="Username"
            name="name"
            rules={[{ required: true, message: 'Please input your username!' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            label="Description"
            name="description"
            rules={[{ max: 200, message: 'A maximum of 200 characters is allowed' }]}
        >
            <Input.TextArea />
        </Form.Item>
      </Modal>
    </>
  );
};

export default AddUser;