import React, { useState } from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { supabase } from '@/config/supabase'; // Ensure this points to your Supabase client

const FileUploader = ({ onUploadSuccess, bucketName = 'avatars' }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file) => {
    // Basic file validation
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    
    setLoading(true);
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (error) throw error;

      // Get the public URL to save in your Firestore database
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      onUploadSuccess(publicUrlData.publicUrl);
      message.success("File uploaded successfully!");
    } catch (error) {
      message.error("Upload failed: " + error.message);
      console.error("Upload Error:", error);
    } finally {
      setLoading(false);
    }
    
    // Return false to stop AntD's default upload request
    return false;
  };

  return (
    <Upload 
      beforeUpload={handleUpload} 
      showUploadList={false} 
      accept="image/*"
    >
      <Button icon={<UploadOutlined />} loading={loading}>
        Upload Image
      </Button>
    </Upload>
  );
};

export default FileUploader;