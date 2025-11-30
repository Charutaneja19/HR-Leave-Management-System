import { Input, Button, Form, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleUserSignIn, handleUserSignUp } from '../services/leave-service';

function Login({action}) {
  const [login, setLogin] = useState({ username: '', password: '' });
  const [signUp, setSignUp] = useState({ firstName: '', lastName: '', email: '', password: '', role: '' })
  const { Title } = Typography;
  const navigate = useNavigate();


  async function handleSubmit() {
    const response = await handleUserSignIn(login);
    localStorage.setItem('employeeId', response.data.employeeId);
    localStorage.setItem('managerId', response.data.managerId);
    localStorage.setItem('token', response.data.token);
    if (response.data.role === 'Admin') {
      navigate('./Admin');
    } else if (response.data.role === 'User') {
      navigate('./User');
    } else if (response.data.role === 'HR') {
      navigate('./HR');
    }
  }
  async function handleSignUp() {
    const response = await handleUserSignUp(signUp);
    localStorage.setItem('employeeId', response.data.employeeId);
    localStorage.setItem('managerId', response.data.managerId);
    localStorage.setItem('token', response.data.token);
    if (signUp.role === 'Admin') {
      navigate('./Admin');
    } else if (signUp.role === 'User') {
      navigate('./User');
    } else if (signUp.role === 'HR') {
      navigate('./HR');
    }
  }

  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={2} className="login-title">{action === 'login' ? 'Login' : 'Sign Up'}</Title>
        {action === 'login' ? (
          <Form layout="vertical" className="login-form">
            <Form.Item label="Username" required>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
                value={login.username}
                onChange={(e) => setLogin({ ...login, username: e.target.value })}
                size="large"
              />
            </Form.Item>
            <Form.Item label="Password" required>
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
                value={login.password}
                onChange={(e) => setLogin({ ...login, password: e.target.value })}
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                onClick={handleSubmit}
                size="large"
                block
              >
                Login
              </Button>
            </Form.Item>
          </Form>) :
          (<Form layout="vertical" className="login-form">
            <Form.Item label="Firstname" required>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Firstname"
                value={signUp.firstName}
                onChange={(e) => setSignUp({ ...signUp, firstName: e.target.value })}
                size="large"
              />
            </Form.Item>
            <Form.Item label="Lastname" required>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Lastname"
                value={signUp.lastName}
                onChange={(e) => setSignUp({ ...signUp, lastName: e.target.value })}
                size="large"
              />
            </Form.Item>
            <Form.Item label="Email" required>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="email"
                value={signUp.email}
                onChange={(e) => setSignUp({ ...signUp, email: e.target.value })}
                size="large"
              />
            </Form.Item>
            <Form.Item label="Password" required>
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
                value={signUp.password}
                onChange={(e) => setSignUp({ ...signUp, password: e.target.value })}
                size="large"
              />
            </Form.Item>
            <Form.Item label="Role" required>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Role"
                value={signUp.role}
                onChange={(e) => setSignUp({ ...signUp, role: e.target.value })}
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                onClick={handleSignUp}
                size="large"
                block
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>)
        }
      </Card>
    </div>
  );
}

export default Login;