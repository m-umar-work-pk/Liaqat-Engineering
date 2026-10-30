import { Typography, Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/Auth'; // Importing your Auth context

const { Title, Paragraph } = Typography;

const PageNotFound = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Dynamically determine the home route based on user status
    const getDashboardPath = () => {
        if (!user) return '/'; // Public home
        if (user.role === 'admin') return '/dashboard/admin';
        if (user.role === 'worker') return '/dashboard/worker';
        return '/dashboard'; // Default dashboard
    };

    return (
        <main 
            className="d-flex align-items-center justify-content-center" 
            style={{ 
                minHeight: '80vh', 
                backgroundColor: '#f9f9f9', // Light background for contrast
                padding: '40px' 
            }}
        >
            <Result
                status="404"
                title={
                    <Title level={1} style={{ color: '#001529', marginBottom: '10px' }}>
                        404
                    </Title>
                }
                subTitle={
                    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                        <Title level={3}>Oops! Page Not Found.</Title>
                        <Paragraph style={{ color: '#666' }}>
                            Sorry, the page you are looking for does not exist or has been moved. 
                            Let's get you back to the main dashboard.
                        </Paragraph>
                    </div>
                }
                extra={
                    <Button 
                        type="primary" 
                        size="large" 
                        icon={<HomeOutlined />} 
                        onClick={() => navigate(getDashboardPath())}
                        style={{ backgroundColor: '#001529', borderColor: '#001529' }}
                    >
                        Return to Dashboard
                    </Button>
                }
            />
        </main>
    );
};

export default PageNotFound;