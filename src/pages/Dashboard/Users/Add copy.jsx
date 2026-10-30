// import React, { useState } from 'react';
// import { Layout, Typography, Card, Form, Input, Select, InputNumber, Button, DatePicker, Row, Col, message } from 'antd';
// import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import { auth, firestore } from "@/config/firebase";

// const { Content } = Layout;
// const { Title } = Typography;

// const AddUser = () => {
//   const navigate = useNavigate();
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);

//   // --- Strict Digit Filtering ---
//   const handleDigitChange = (e, fieldName, formatType) => {
//     let value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
    
//     if (formatType === 'phone') {
//       if (value.length > 11) value = value.slice(0, 11);
//       if (value.length > 4) value = `${value.slice(0, 4)}-${value.slice(4)}`;
//     } else if (formatType === 'cnic') {
//       if (value.length > 13) value = value.slice(0, 13);
//       if (value.length > 5 && value.length <= 12) value = `${value.slice(0, 5)}-${value.slice(5)}`;
//       else if (value.length > 12) value = `${value.slice(0, 5)}-${value.slice(5, 12)}-${value.slice(12, 13)}`;
//     }
//     form.setFieldsValue({ [fieldName]: value });
//   };

//   const onFinish = async (values) => {
//     setLoading(true);
//     try {
//       // Create user without keeping the admin signed out
//       const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      
//       const userData = {
//         name: values.name,
//         email: values.email.toLowerCase(),
//         phone: values.phone,
//         cnic: values.cnic,
//         role: values.role,
//         status: values.status,
//         salary: values.salary || 0,
//         startDate: values.startDate?.format('DD-MMM-YYYY') || null,
//         // ... (other fields)
//       };

//       await setDoc(doc(firestore, "users", userCredential.user.uid), userData);
      
//       // Sign out the new user immediately so Admin stays in control
//       await signOut(auth);
      
//       message.success("User added successfully!");
//       navigate('/dashboard/users/all');
//     } catch (error) {
//       message.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout style={{ minHeight: '100vh', padding: '40px' }}>
//       <Content style={{ maxWidth: '800px', margin: '0 auto' }}>
//         <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>Back</Button>
//         <Title level={2}>Add New Personnel</Title>
//         <Card>
//           <Form form={form} layout="vertical" onFinish={onFinish}>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
//                   <Input 
//                     placeholder="0300-1234567" 
//                     onChange={(e) => handleDigitChange(e, 'phone', 'phone')} 
//                     maxLength={12} 
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item label="CNIC" name="cnic" rules={[{ required: true }]}>
//                   <Input 
//                     placeholder="33100-1234567-1" 
//                     onChange={(e) => handleDigitChange(e, 'cnic', 'cnic')} 
//                     maxLength={15} 
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>
//             {/* ... Rest of your form fields */}
//             <Button type="primary" htmlType="submit" loading={loading} block>Save to Database</Button>
//           </Form>
//         </Card>
//       </Content>
//     </Layout>
//   );
// };

// export default AddUser;

import React, { useState } from 'react';
import { Layout, Typography, Card, Form, Input, Select, InputNumber, Button, DatePicker, Row, Col, message, Upload } from 'antd';
import { SaveOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "@/config/firebase"; // Ensure your firebase config is set up
import { supabase } from "@/config/supabase"; // Ensure your supabase config is set up

const { Content } = Layout;
const { Title, TextArea } = Typography;

const AddUser = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  // 1. Upload to Supabase Storage
  const handleImageUpload = async (file) => {
    setUploading(true);
    const fileName = `avatars/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('Profile Images').upload(fileName, file);
    
    if (error) {
      message.error("Upload failed: " + error.message);
    } else {
      const { data } = supabase.storage.from('Profile Images').getPublicUrl(fileName);
      setAvatarUrl(data.publicUrl);
      message.success("Image uploaded!");
    }
    setUploading(false);
  };

  // 2. Submit to Firebase
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Create Authentication Account
      const userCred = await createUserWithEmailAndPassword(auth, values.email, values.password);
      
      // Store Metadata in Firestore
      await setDoc(doc(firestore, "users", userCred.user.uid), {
        ...values,
        avatarUrl,
        uid: userCred.user.uid,
        createdAt: new Date().toISOString(),
        // Format dates
        startDate: values.startDate?.format('YYYY-MM-DD') || null,
        endDate: values.endDate?.format('YYYY-MM-DD') || null,
        leaveStart: values.leaveStart?.format('YYYY-MM-DD') || null,
        leaveEnd: values.leaveEnd?.format('YYYY-MM-DD') || null,
      });

      message.success("User registered successfully.");
      navigate('/dashboard/users/all');
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ padding: '40px', minHeight: '100vh' }}>
      <Content style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card title="Add New Personnel">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="Profile Picture">
              <Upload beforeUpload={(file) => { handleImageUpload(file); return false; }} showUploadList={false}>
                <Button icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}>Upload Photo</Button>
              </Upload>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}><Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="email" label="Email" rules={[{ required: true }]}><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="password" label="Password" rules={[{ required: true }]}><Input.Password /></Form.Item></Col>
              <Col span={12}><Form.Item name="phone" label="Phone"><Input /></Form.Item></Col>
            </Row>

            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Select options={[
                { value: 'Admin', label: 'Admin' },
                { value: 'Worker', label: 'Worker (Manager/Engineer/Technician)' },
                { value: 'Customer', label: 'Customer' }
              ]} />
            </Form.Item>

            {/* Conditional Logic */}
            <Form.Item noStyle dependencies={['role', 'status']}>
              {({ getFieldValue }) => {
                const role = getFieldValue('role');
                const status = getFieldValue('status');
                
                return (
                  <>
                    {role === 'Customer' && (
                      <Form.Item name="custType" label="Type"><Select options={[{value:'Regular',label:'Regular'},{value:'Local',label:'Local'},{value:'Official',label:'Official'}]} /></Form.Item>
                    )}
                    {role === 'Worker' && (
                      <>
                        <Form.Item name="salary" label="Salary"><InputNumber style={{width:'100%'}} /></Form.Item>
                        <Form.Item name="status" label="Status"><Select options={[{value:'Active',label:'Active'},{value:'Leave',label:'Leave'},{value:'Resigned',label:'Resigned'}]} /></Form.Item>
                        {status === 'Active' && <Form.Item name="startDate" label="Start Date"><DatePicker style={{width:'100%'}}/></Form.Item>}
                        {status === 'Leave' && <><Form.Item name="leaveStart" label="Leave Start"><DatePicker style={{width:'100%'}}/></Form.Item><Form.Item name="leaveEnd" label="Leave End"><DatePicker style={{width:'100%'}}/></Form.Item></>}
                        {status === 'Resigned' && <Form.Item name="endDate" label="Last Date"><DatePicker style={{width:'100%'}}/></Form.Item>}
                      </>
                    )}
                  </>
                );
              }}
            </Form.Item>

            <Form.Item name="address" label="Address"><TextArea /></Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block icon={<SaveOutlined />}>Save to Firestore</Button>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};
export default AddUser;


// import React, { useState } from 'react';
// import { Button, Form, Input, Typography, Upload, Progress, Select, message } from 'antd';
// import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth, firestore } from '@/config/firebase';
// import { setDoc, doc, serverTimestamp, query, collection, where, getDocs } from 'firebase/firestore';
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

//     // --- Formatters ---
//     const formatCNIC = (value) => {
//         let v = value.replace(/\D/g, '');
//         if (v.length > 13) v = v.substring(0, 13);
//         if (v.length > 12) return v.substring(0, 5) + '-' + v.substring(5, 12) + '-' + v.substring(12, 13);
//         if (v.length > 5) return v.substring(0, 5) + '-' + v.substring(5, v.length);
//         return v;
//     };

//     const formatPhone = (value) => {
//         let v = value.replace(/\D/g, '');
//         if (v.length > 11) v = v.substring(0, 11);
//         if (v.length > 4) return v.substring(0, 4) + '-' + v.substring(4, 11);
//         return v;
//     };

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
//             message.error(`Upload failed: ${error.message}`);
//         } finally {
//             setUploadingImage(false);
//         }
//     };

//     const handleRegister = async (values) => {
//         const { fullName, email, password, confirmPassword, role, cnic, phone, address } = values;

//         if (password !== confirmPassword) return message.error("Passwords do not match");
//         if (passwordStrength < 100) return message.error("Password is too weak");

//         setIsProcessing(true);
//         try {
//             // Check for uniqueness
//             const q = query(collection(firestore, "users"), where("cnic", "==", cnic));
//             const querySnapshot = await getDocs(q);
            
//             if (!querySnapshot.empty) {
//                 setIsProcessing(false);
//                 return message.error("This CNIC is already registered.");
//             }

//             const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
//             await setDoc(doc(firestore, "users", userCredential.user.uid), {
//                 uid: userCredential.user.uid,
//                 fullName,
//                 email,
//                 role,
//                 cnic,
//                 phone,
//                 address,
//                 avatarUrl: avatarUrl || null,
//                 status: "active",
//                 createdAt: serverTimestamp()
//             });

//             message.success("Registration successful!");
//             navigate("/auth/login");
//         } catch (err) {
//             message.error(err.code === 'auth/email-already-in-use' ? "Email already exists" : err.message);
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
//                             <Button icon={uploadingImage ? <LoadingOutlined /> : <UploadOutlined />}>
//                                 {uploadingImage ? "Uploading..." : "Upload Photo"}
//                             </Button>
//                         </Upload>
//                     </div>

//                     <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}><Input /></Form.Item>
//                     <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
                    
//                     <Form.Item name="cnic" label="CNIC" rules={[{ required: true }]}>
//                         <Input placeholder="33102-8687279-9" maxLength={15} onChange={(e) => form.setFieldsValue({ cnic: formatCNIC(e.target.value) })} />
//                     </Form.Item>

//                     <Form.Item name="phone" label="Phone No" rules={[{ required: true }]}>
//                         <Input placeholder="0329-02505056" maxLength={12} onChange={(e) => form.setFieldsValue({ phone: formatPhone(e.target.value) })} />
//                     </Form.Item>

//                     <Form.Item name="address" label="Full Address" rules={[{ required: true }]}><Input.TextArea /></Form.Item>
                    
//                     {/* <Form.Item name="role" label="Role" rules={[{ required: true }]}>
//                         <Select>
//                             <Select.Option value="Customer">Customer</Select.Option>
//                             <Select.Option value="Worker">Worker</Select.Option>
//                             <Select.Option value="Admin">Admin</Select.Option>
//                         </Select>
//                     </Form.Item> */}
//                     <Form.Item name="role" label="Role" rules={[{ required: true }]}>
//                       <Select
//                         placeholder="Select a role"
//                         options={[
//                           { value: 'Customer', label: 'Customer' },
//                           { value: 'Worker', label: 'Worker' },
//                           { value: 'Admin', label: 'Admin' },
                        // ]}
                    //   />
    //                 </Form.Item>
                    
    //                 <Form.Item name="password" label="Password" rules={[{ required: true }]}><Input.Password onChange={handlePasswordChange} /></Form.Item>
    //                 <Progress percent={passwordStrength} showInfo={false} style={{ marginBottom: "10px" }} />
    //                 <Form.Item name="confirmPassword" label="Confirm Password" rules={[{ required: true }]}><Input.Password /></Form.Item>
                    
    //                 <Button type="primary" block htmlType="submit" loading={isProcessing}>Register</Button>
    //             </Form>
                
    //             <div style={{ marginTop: "15px", textAlign: "center" }}>
    //                 Already have an account? <Link to="/auth/login">Login Here</Link>
    //             </div>
    //         </div>
    //     </main>
    // );
// }