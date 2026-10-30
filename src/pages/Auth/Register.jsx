// import React, { useState } from 'react';
// import { Button, Col, Form, Input, Row, Typography, Upload, Progress,Select } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth, firestore } from '@/config/firebase';
// import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
// import { useNavigate, Link } from 'react-router-dom'; // Added Link
// import {message} from 'antd';
// const { Title, Text } = Typography; // Added Text

// export default function Register() {
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [fileList, setFileList] = useState([]);
//     const [passwordStrength, setPasswordStrength] = useState(0);
//     const navigate = useNavigate();

//     // --- Digit-Only Dash Formatters ---
//     const formatPhone = (val) => {
//         const cleaned = val.replace(/\D/g, '').slice(0, 11);
//         return cleaned.length > 4 ? `${cleaned.slice(0, 4)}-${cleaned.slice(4)}` : cleaned;
//     };

//     const formatCNIC = (val) => {
//         const cleaned = val.replace(/\D/g, '').slice(0, 13);
//         if (cleaned.length > 12) return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12)}`;
//         if (cleaned.length > 5) return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
//         return cleaned;
//     };

//     const handlePasswordChange = (e) => {
//         const val = e.target.value;
//         let strength = 0;
//         if (val.length >= 8) strength += 33;
//         if (/[0-9]/.test(val)) strength += 33;
//         if (/[!@#$%^&*]/.test(val)) strength += 34;
//         setPasswordStrength(strength);
//     };

//     const handleRegister = async (values) => {
//         const { fullName, email, password, confirmPassword, phone, cnic, address,role } = values;
//         const trimmedName = fullName.trim();

//         if (password !== confirmPassword) {
//           message.error("Passwords do not match");
//         return;
//         }

//         if (passwordStrength < 100) {
//            message.error("Password too weak");
//         return;
//          }

//         setIsProcessing(true);
//         try {
//             const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//             await setDoc(doc(firestore, "users", userCredential.user.uid), {
//                 uid: userCredential.user.uid,
//                 fullName: trimmedName,
//                 email,
//                 phone,
//                 cnic,
//                 address,
//                 role: role,
//                 status: "active",
//                 createdAt: serverTimestamp()
//             });
//             message.success(`Welcome ${trimmedName}`);
//             navigate("/auth/login");
//         } catch (err) {
//             message.error(err.message);
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     return (
//         <div style={{ background: "linear-gradient(to right, #243B55, #141E30)", minHeight: "100vh", padding: "40px 0" }}>
//             <div className="container">
//                 <div className="card border-0 shadow-lg p-4 p-md-3 mx-auto" style={{maxWidth: "450px",maxHeight:"1120px", borderRadius: "12px" }}>
//                     <Title level={2} className="text-center mb-4">Register</Title>
                    
//                     <Form layout="vertical" onFinish={handleRegister} size="large" style={{marginBottom:"2px"}}>
//                         <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px", marginTop: "10px"}}>
//                             <Upload 
//                                 beforeUpload={() => false} 
//                                 fileList={fileList} 
//                                 onChange={({ fileList }) => setFileList(fileList)} 
//                                 maxCount={1}
//                                 listType="picture-circle" 
//                                 style={{boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",backgroundImage:"white"}}>
//                                 {fileList.length < 1 && (
//                                     <button type="button" style={{ 
//                                         height: "8px", 
//                                         width: "500px", 
//                                         borderRadius: "5px",
//                                         border: "1px dashed #c6c6c6", 
//                                         background: "linear-gradient(to right, #243B55, #141E30)", padding: "25px 0 25px 0", 
//                                         color: "white",
//                                         marginTop:"165px",
//                                         cursor: "pointer" 
//                                     }}>
//                                         <UploadOutlined />Upload Image
//                                     </button>
//                                 )}
//                             </Upload>
//                         </div>

//                         <Form.Item label="Full Name" name="fullName" rules={[{ required: true }]} style={{marginBottom:"10px"}}>
//                             <Input placeholder="Enter full name" />
//                         </Form.Item>

//                         <Row gutter={16}>
//                             <Col span={12}>
//                                 <Form.Item label="Phone No" name="phone" rules={[{ required: true }]} style={{marginBottom:"10px"}}>
//                                     <Input maxLength={12} placeholder="0329-0255056" onChange={(e) => e.target.value = formatPhone(e.target.value)} />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={12}>
//                                 <Form.Item label="CNIC Number" name="cnic" rules={[{ required: true }]} style={{marginBottom:"10px"}}>
//                                     <Input maxLength={15} placeholder="33102-5657279-9" onChange={(e) => e.target.value = formatCNIC(e.target.value)} />
//                                 </Form.Item>
//                             </Col>
//                         </Row>

//                         <Form.Item label="Address" name="address" rules={[{ required: true }]} style={{marginBottom:"10px"}}>
//                             <Input.TextArea placeholder="Enter address" />
//                         </Form.Item>

//                         <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}style={{marginBottom:"10px"}}>
//                             <Input placeholder="Enter email" />
//                         </Form.Item>
//                         <Form.Item label="Role" name="role" initialValue="Customer"rules={[{ required: true, message: 'Please select a role' }]}>
//                             <Select placeholder="Select a role">
//                                 <Select.Option value="Customer">Customer</Select.Option>
//                                 <Select.Option value="Admin">Admin</Select.Option>
//                                 <Select.Option value="Worker">Worker</Select.Option>
//                             </Select>
//                         </Form.Item>

//                         <Form.Item label="Password" name="password" rules={[{ required: true }]} style={{marginBottom:"10px"}}>
//                             <Input.Password onChange={handlePasswordChange} placeholder="Password" />
//                         </Form.Item>

//                         <Progress percent={passwordStrength} showInfo={false} size="small" status={passwordStrength < 100 ? "exception" : "success"} />
                        
//                         <Form.Item label="Confirm Password" name="confirmPassword" rules={[{ required: true }]} style={{marginTop: '10px'}}>
//                             <Input.Password placeholder="Confirm password" />
//                         </Form.Item>

//                         <Button type="primary" block htmlType="submit" loading={isProcessing}>
//                             Register
//                         </Button>
                        
//                         <div className="text-center mt-3 mb-4 mt-md-3 mb-md-3">
//                             <Text type="secondary">Already have an account?</Text>{" "}
//                             <Link to="/auth/login" style={{ fontWeight: "500" }}>
//                                 Login Here
//                             </Link>
//                         </div>
//                     </Form>
//                 </div>
//             </div>
//         </div>
//     );
// }


// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// import React, { useState } from 'react';
// import { Button, Form, Input, Typography, Upload, Progress, Select, message } from 'antd';
// import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth, firestore } from '@/config/firebase';
// import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
// import { useNavigate, Link } from 'react-router-dom';
// import { supabase } from '@/config/supabase';

// const { Title, Text } = Typography;

// export default function Register() {
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [uploadingImage, setUploadingImage] = useState(false);
//     const [avatarUrl, setAvatarUrl] = useState('');
//     const [passwordStrength, setPasswordStrength] = useState(0);
//     const [form] = Form.useForm();
//     const navigate = useNavigate();

//     const handlePasswordChange = (e) => {
//         const val = e.target.value;
//         let strength = 0;
//         if (val.length >= 8) strength += 33;
//         if (/[0-9]/.test(val)) strength += 33;
//         if (/[!@#$%^&*]/.test(val)) strength += 34;
//         setPasswordStrength(strength);
//     };

//     const handleSupabaseUpload = async (file) => {
//         try {
//             setUploadingImage(true);
//             const fileName = `profile_${Date.now()}_${file.name}`;
            
//             const { error: uploadError } = await supabase.storage
//                 .from('Profile Images')
//                 .upload(`avatars/${fileName}`, file);

//             if (uploadError) throw uploadError;

//             const { data } = supabase.storage
//                 .from('profile Images')
//                 .getPublicUrl(`avatars/${fileName}`);

//             setAvatarUrl(data.publicUrl);
//             message.success('Profile picture uploaded!');
//         } catch (error) {
//             message.error(`Upload failed: ${error.message}`);
//         } finally {
//             setUploadingImage(false);
//         }
//     };

//     const handleRegister = async (values) => {
//         const { fullName, email, password, confirmPassword, role } = values;

//         if (password !== confirmPassword) return message.error("Passwords do not match");
//         if (passwordStrength < 100) return message.error("Password is too weak");

//         setIsProcessing(true);
//         try {
//             const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
//             await setDoc(doc(firestore, "users", userCredential.user.uid), {
//                 uid: userCredential.user.uid,
//                 fullName,
//                 email,
//                 role,
//                 avatarUrl: avatarUrl || null,
//                 status: "active",
//                 createdAt: serverTimestamp()
//             });

//             message.success("Registration successful!");
//             navigate("/auth/login");
//         } catch (err) {
//             message.error(err.message);
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     return (
//         <main className="auth p-4">
//             <div
//               className="card p-4 mx-auto"
//               style={{ maxWidth: "400px", margin: "50px auto", padding: "20px",borderRadius:"15px" }}
//             >
//             <Title level={2} style={{textAlign:"center"}}>Register</Title>
//             <Form form={form} layout="vertical" onFinish={handleRegister}>
                
//                 {/* Profile Image Circle Preview */}
//                 <div style={{ textAlign: "center", marginBottom: "20px" }}>
//                     <Upload beforeUpload={(file) => { handleSupabaseUpload(file); return false; }} showUploadList={false}>
//                         {avatarUrl ? (
//                             <div style={{ width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden", margin: "0 auto", border: "2px solid #1890ff" }}>
//                                 <img src={avatarUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="profile" />
//                             </div>
//                         ) : (
//                             <Button icon={uploadingImage ? <LoadingOutlined /> : <UploadOutlined />}>
//                                 {uploadingImage ? "Uploading..." : "Upload Photo"}
//                             </Button>
//                         )}
//                     </Upload>
//                 </div>

//                 <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}><Input /></Form.Item>
//                 <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
//                 <Form.Item name="role" label="Role" rules={[{ required: true }]}>
//                     <Select>
//                         <Select.Option value="Customer">Customer</Select.Option>
//                         <Select.Option value="Worker">Worker</Select.Option>
//                         <Select.Option value="Admin">Admin</Select.Option>
//                     </Select>
//                 </Form.Item>
//                 <Form.Item name="password" label="Password" rules={[{ required: true }]}><Input.Password onChange={handlePasswordChange} /></Form.Item>
//                 <Progress percent={passwordStrength} showInfo={false} />
//                 <Form.Item name="confirmPassword" label="Confirm Password" rules={[{ required: true }]}><Input.Password /></Form.Item>
                
//                 <Button type="primary" block htmlType="submit" loading={isProcessing}>Register</Button>
//             </Form>
            
//             <div style={{ marginTop: "15px", textAlign: "center" }}>
//                 Already have an account? <Link to="/auth/login">Login Here</Link>
//             </div>
//         </div>
//     </main>
//     );
// }
// import React, { useState } from 'react';
// import { Button, Form, Input, Typography, Upload, Progress, Select, message } from 'antd';
// import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth, firestore } from '@/config/firebase';
// import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
// import { useNavigate, Link } from 'react-router-dom';
// import { supabase } from '@/config/supabase';

// const { Title } = Typography;

// export default function Register() {
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [uploadingImage, setUploadingImage] = useState(false);
//     const [avatarUrl, setAvatarUrl] = useState('');
//     const [passwordStrength, setPasswordStrength] = useState(0);
//     const [form] = Form.useForm();
//     const navigate = useNavigate();

//     const handlePasswordChange = (e) => {
//         const val = e.target.value;
//         let strength = 0;
//         if (val.length >= 8) strength += 33;
//         if (/[0-9]/.test(val)) strength += 33;
//         if (/[!@#$%^&*]/.test(val)) strength += 34;
//         setPasswordStrength(strength);
//     };

//     const handleSupabaseUpload = async (file) => {
//         try {
//             setUploadingImage(true);
//             const fileExt = file.name.split('.').pop();
//             const fileName = `avatars/${Date.now()}.${fileExt}`;
            
//             // Ensure 'profile-images' matches your Supabase Storage bucket name
//             const { error: uploadError } = await supabase.storage
//                 .from('profile-images') 
//                 .upload(fileName, file);

//             if (uploadError) throw uploadError;

//             const { data } = supabase.storage
//                 .from('profile-images')
//                 .getPublicUrl(fileName);

//             setAvatarUrl(data.publicUrl);
//             message.success('Profile picture uploaded!');
//         } catch (error) {
//             message.error(`Upload failed: ${error.message}`);
//         } finally {
//             setUploadingImage(false);
//         }
//     };

//     const handleRegister = async (values) => {
//         const { fullName, email, password, confirmPassword, role } = values;

//         if (password !== confirmPassword) return message.error("Passwords do not match");
//         if (passwordStrength < 100) return message.error("Password is too weak");

//         setIsProcessing(true);
//         try {
//             const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
//             await setDoc(doc(firestore, "users", userCredential.user.uid), {
//                 uid: userCredential.user.uid,
//                 fullName,
//                 email,
//                 role,
//                 avatarUrl: avatarUrl || null,
//                 status: "active",
//                 createdAt: serverTimestamp()
//             });

//             message.success("Registration successful!");
//             navigate("/auth/login");
//         } catch (err) {
//             message.error(err.message);
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     return (
//         <main className="auth p-4" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//             <div className="card p-4 mx-auto" style={{ maxWidth: "400px", width: "100%", borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
//                 <Title level={2} style={{ textAlign: "center" }}>Register</Title>
                
//                 <Form form={form} layout="vertical" onFinish={handleRegister}>
//                     <div style={{ textAlign: "center", marginBottom: "20px" }}>
//                         <Upload beforeUpload={(file) => { handleSupabaseUpload(file); return false; }} showUploadList={false}>
//                             {avatarUrl ? (
//                                 <div style={{ width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden", margin: "0 auto", border: "2px solid #1890ff" }}>
//                                     <img src={avatarUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="profile" />
//                                 </div>
//                             ) : (
//                                 <Button icon={uploadingImage ? <LoadingOutlined /> : <UploadOutlined />}>
//                                     {uploadingImage ? "Uploading..." : "Upload Photo"}
//                                 </Button>
//                             )}
//                         </Upload>
//                     </div>

//                     <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}><Input /></Form.Item>
//                     <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
                    
//                     <Form.Item name="role" label="Role" rules={[{ required: true }]}>
//                         <Select>
//                             <Select.Option value="Customer">Customer</Select.Option>
//                             <Select.Option value="Worker">Worker</Select.Option>
//                             <Select.Option value="Admin">Admin</Select.Option>
//                         </Select>
//                     </Form.Item>
                    
//                     <Form.Item name="password" label="Password" rules={[{ required: true }]}>
//                         <Input.Password onChange={handlePasswordChange} />
//                     </Form.Item>
//                     <Progress percent={passwordStrength} showInfo={false} style={{ marginBottom: "10px" }} />
                    
//                     <Form.Item name="confirmPassword" label="Confirm Password" rules={[{ required: true }]}>
//                         <Input.Password />
//                     </Form.Item>
                    
//                     <Button type="primary" block htmlType="submit" loading={isProcessing}>Register</Button>
//                 </Form>
                
//                 <div style={{ marginTop: "15px", textAlign: "center" }}>
//                     Already have an account? <Link to="/auth/login">Login Here</Link>
//                 </div>
//             </div>
//         </main>
//     );
// }
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// import React, { useState } from 'react';
// import { Button, Form, Input, Typography, Upload, Progress, Select, message } from 'antd';
// import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth, firestore } from '@/config/firebase';
// import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
// import { useNavigate, Link } from 'react-router-dom';
// import { supabase } from '@/config/supabase';

// const { Title } = Typography;

// export default function Register() {
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [uploadingImage, setUploadingImage] = useState(false);
//     const [avatarUrl, setAvatarUrl] = useState('');
//     const [passwordStrength, setPasswordStrength] = useState(0);
//     const [form] = Form.useForm();
//     const navigate = useNavigate();

//     const handlePasswordChange = (e) => {
//         const val = e.target.value;
//         let strength = 0;
//         if (val.length >= 8) strength += 33;
//         if (/[0-9]/.test(val)) strength += 33;
//         if (/[!@#$%^&*]/.test(val)) strength += 34;
//         setPasswordStrength(strength);
//     };

//     const handleSupabaseUpload = async (file) => {
//         try {
//             setUploadingImage(true);
//             const fileExt = file.name.split('.').pop();
//             // Using a clean path structure
//             const fileName = `avatars/${Date.now()}.${fileExt}`;
            
//             // Ensure '.from()' matches your bucket name EXACTLY
//             const { error: uploadError } = await supabase.storage
//                 .from('Profile Images') 
//                 .upload(fileName, file);

//             if (uploadError) throw uploadError;

//             const { data } = supabase.storage
//                 .from('Profile Images')
//                 .getPublicUrl(fileName);

//             setAvatarUrl(data.publicUrl);
//             message.success('Profile picture uploaded!');
//         } catch (error) {
//             console.error("Upload error:", error);
//             message.error(`Upload failed: ${error.message}`);
//         } finally {
//             setUploadingImage(false);
//         }
//     };

//     const handleRegister = async (values) => {
//         const { fullName, email, password, confirmPassword, role } = values;

//         if (password !== confirmPassword) return message.error("Passwords do not match");
//         if (passwordStrength < 100) return message.error("Password is too weak");

//         setIsProcessing(true);
//         try {
//             const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
//             await setDoc(doc(firestore, "users", userCredential.user.uid), {
//                 uid: userCredential.user.uid,
//                 fullName,
//                 email,
//                 role,
//                 avatarUrl: avatarUrl || null,
//                 status: "active",
//                 createdAt: serverTimestamp()
//             });

//             message.success("Registration successful!");
//             navigate("/auth/login");
//         } catch (err) {
//             message.error(err.message);
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     return (
//         <main className="auth p-4" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//             <div className="card p-4 mx-auto" style={{ maxWidth: "400px", width: "100%", borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
//                 <Title level={2} style={{ textAlign: "center" }}>Register</Title>
                
//                 <Form form={form} layout="vertical" onFinish={handleRegister}>
//                     <div style={{ textAlign: "center", marginBottom: "20px" }}>
//                         <Upload beforeUpload={(file) => { handleSupabaseUpload(file); return false; }} showUploadList={false}>
//                             {avatarUrl ? (
//                                 <div style={{ width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden", margin: "0 auto", border: "2px solid #1890ff" }}>
//                                     <img 
//                                         src={avatarUrl} 
//                                         style={{ width: "100%", height: "100%", objectFit: "cover" }} 
//                                         alt="profile" 
//                                     />
//                                 </div>
//                             ) : (
//                                 <Button icon={uploadingImage ? <LoadingOutlined /> : <UploadOutlined />}>
//                                     {uploadingImage ? "Uploading..." : "Upload Photo"}
//                                 </Button>
//                             )}
//                         </Upload>
//                     </div>

//                     <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}><Input /></Form.Item>
//                     <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
                    
//                     <Form.Item name="role" label="Role" rules={[{ required: true }]}>
//                         <Select>
//                             <Select.Option value="Customer">Customer</Select.Option>
//                             <Select.Option value="Worker">Worker</Select.Option>
//                             <Select.Option value="Admin">Admin</Select.Option>
//                         </Select>
//                     </Form.Item>
                    
//                     <Form.Item name="password" label="Password" rules={[{ required: true }]}>
//                         <Input.Password onChange={handlePasswordChange} />
//                     </Form.Item>
//                     <Progress percent={passwordStrength} showInfo={false} style={{ marginBottom: "10px" }} />
                    
//                     <Form.Item name="confirmPassword" label="Confirm Password" rules={[{ required: true }]}>
//                         <Input.Password />
//                     </Form.Item>
                    
//                     <Button type="primary" block htmlType="submit" loading={isProcessing}>Register</Button>
//                 </Form>
                
//                 <div style={{ marginTop: "15px", textAlign: "center" }}>
//                     Already have an account? <Link to="/auth/login">Login Here</Link>
//                 </div>
//             </div>
//         </main>
//     );
// }

import React, { useState } from 'react';
import { Button, Form, Input, Typography, Upload, Progress, Select, message } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '@/config/firebase';
import { setDoc, doc, serverTimestamp, query, collection, where, getDocs } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/config/supabase';

const { Title } = Typography;

export default function Register() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // --- Formatters ---
    const formatCNIC = (value) => {
        let v = value.replace(/\D/g, '');
        if (v.length > 13) v = v.substring(0, 13);
        if (v.length > 12) return v.substring(0, 5) + '-' + v.substring(5, 12) + '-' + v.substring(12, 13);
        if (v.length > 5) return v.substring(0, 5) + '-' + v.substring(5, v.length);
        return v;
    };

    const formatPhone = (value) => {
        let v = value.replace(/\D/g, '');
        if (v.length > 11) v = v.substring(0, 11);
        if (v.length > 4) return v.substring(0, 4) + '-' + v.substring(4, 11);
        return v;
    };

    const handlePasswordChange = (e) => {
        const val = e.target.value;
        let strength = 0;
        if (val.length >= 8) strength += 33;
        if (/[0-9]/.test(val)) strength += 33;
        if (/[!@#$%^&*]/.test(val)) strength += 34;
        setPasswordStrength(strength);
    };

    const handleSupabaseUpload = async (file) => {
        try {
            setUploadingImage(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `avatars/${Date.now()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
                .from('Profile Images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('Profile Images')
                .getPublicUrl(fileName);

            setAvatarUrl(data.publicUrl);
            message.success('Profile picture uploaded!');
        } catch (error) {
            message.error(`Upload failed: ${error.message}`);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRegister = async (values) => {
        const { fullName, email, password, confirmPassword, role, cnic, phone, address } = values;

        if (password !== confirmPassword) return message.error("Passwords do not match");
        if (passwordStrength < 100) return message.error("Password is too weak");

        setIsProcessing(true);
        try {
            // Check for uniqueness
            const q = query(collection(firestore, "users"), where("cnic", "==", cnic));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                setIsProcessing(false);
                return message.error("This CNIC is already registered.");
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            await setDoc(doc(firestore, "users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                fullName,
                email,
                role,
                cnic,
                phone,
                address,
                avatarUrl: avatarUrl || null,
                status: "active",
                createdAt: serverTimestamp()
            });

            message.success("Registration successful!");
            navigate("/auth/login");
        } catch (err) {
            message.error(err.code === 'auth/email-already-in-use' ? "Email already exists" : err.message);
            navigate("/auth/login");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <main className="auth p-4" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="card p-4 mx-auto" style={{ maxWidth: "400px", width: "100%", borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                <Title level={2} style={{ textAlign: "center" }}>Register</Title>
                
                <Form form={form} layout="vertical" onFinish={handleRegister}>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <Upload beforeUpload={(file) => { handleSupabaseUpload(file); return false; }} showUploadList={false}>
                            <Button icon={uploadingImage ? <LoadingOutlined /> : <UploadOutlined />}>
                                {uploadingImage ? "Uploading..." : "Upload Photo"}
                            </Button>
                        </Upload>
                    </div>

                    <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
                    
                    <Form.Item name="cnic" label="CNIC" rules={[{ required: true }]}>
                        <Input placeholder="33102-8687279-9" maxLength={15} onChange={(e) => form.setFieldsValue({ cnic: formatCNIC(e.target.value) })} />
                    </Form.Item>

                    <Form.Item name="phone" label="Phone No" rules={[{ required: true }]}>
                        <Input placeholder="0329-02505056" maxLength={12} onChange={(e) => form.setFieldsValue({ phone: formatPhone(e.target.value) })} />
                    </Form.Item>

                    <Form.Item name="address" label="Full Address" rules={[{ required: true }]}><Input.TextArea /></Form.Item>
                    
                    {/* <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="Customer">Customer</Select.Option>
                            <Select.Option value="Worker">Worker</Select.Option>
                            <Select.Option value="Admin">Admin</Select.Option>
                        </Select>
                    </Form.Item> */}
                    <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                      <Select
                        placeholder="Select a role"
                        options={[
                          { value: 'Customer', label: 'Customer' },
                          { value: 'Worker', label: 'Worker' },
                          { value: 'Admin', label: 'Admin' },
                        ]}
                      />
                    </Form.Item>
                    
                    <Form.Item name="password" label="Password" rules={[{ required: true }]}><Input.Password onChange={handlePasswordChange} /></Form.Item>
                    <Progress percent={passwordStrength} showInfo={false} style={{ marginBottom: "10px" }} />
                    <Form.Item name="confirmPassword" label="Confirm Password" rules={[{ required: true }]}><Input.Password /></Form.Item>
                    
                    <Button type="primary" block htmlType="submit" loading={isProcessing}>Register</Button>
                </Form>
                
                <div style={{ marginTop: "15px", textAlign: "center" }}>
                    Already have an account? <Link to="/auth/login">Login Here</Link>
                </div>
            </div>
        </main>
    );
}