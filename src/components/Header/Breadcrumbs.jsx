// import { Breadcrumb } from 'antd';
// import { useLocation, Link } from 'react-router-dom';
// import { HomeOutlined } from '@ant-design/icons';

// const Breadcrumbs = () => {
//     const location = useLocation();
    
//     // Split the path and filter out empty strings
//     const pathSnippets = location.pathname.split('/').filter((i) => i);

//     // Create breadcrumb items dynamically
//     const breadcrumbItems = [
//         {
//             key: 'home',
//             title: <Link to="/"><HomeOutlined /></Link>,
//         },
//         ...pathSnippets.map((snippet, index) => {
//             const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
//             // Capitalize the first letter for display
//             const label = snippet.charAt(0).toUpperCase() + snippet.slice(1);
            
//             return {
//                 key: url,
//                 title: index === pathSnippets.length - 1 
//                     ? label 
//                     : <Link to={url}>{label}</Link>,
//             };
//         }),
//     ];

//     return (
//         <div style={{ padding: '10px 0' }}>
//             <Breadcrumb items={breadcrumbItems} />
//         </div>
//     );
// };

// export default Breadcrumbs;