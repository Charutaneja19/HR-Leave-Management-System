import { useState } from 'react'
import Login from './components/Login';
import { Button, Typography } from 'antd';

const { Title } = Typography;
function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [loginAction, setLoginAction] = useState('login');
  return (
    <>
      {
        !showLogin ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            gap: '16px'
          }}>
            <Title 
              level={1} 
              style={{ 
                color: 'white', 
                marginBottom: '8px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                fontSize: '48px'
              }}
            >
              Leave Management System
            </Title>
            <br/>

            <Button
              type="primary"
              onClick={() => {
                setLoginAction('login');
                setShowLogin(true);
              }}
              style={{
                minWidth: '120px',
                height: '44px',
                borderRadius: '8px',
                fontWeight: '500'
              }}
            >
              Login
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setLoginAction('signup');
                setShowLogin(true);
              }}
              style={{
                minWidth: '120px',
                height: '44px',
                borderRadius: '8px',
                fontWeight: '500'
              }}
            >
              Sign Up
            </Button>
          </div>
        ) : (
          // <Login action = {loginAction}></Login>
          <Login action={loginAction} />
        )}
    </>
  )
}

export default App
