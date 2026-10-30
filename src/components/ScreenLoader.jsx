const ScreenLoader = () => {
    return (
        <div 
            style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100vw', 
                height: '100vh', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: "#ffffff", // Changed to white/light for a cleaner look
                zIndex: 9999,
                transition: 'opacity 0.5s ease'
            }}
        >
            {/* You can add your logo here for branding */}
            <img 
                src="/logo.jpg" 
                alt="Loading..." 
                style={{ width: "80px", marginBottom: "20px" }} 
            />
            {/* Ensure your .loader class in your CSS provides the spinning animation */}
            <span className="loader"></span> 
        </div>
    );
}

export default ScreenLoader;