import { useEffect, useState } from 'react';
import { Col, Row, Typography, Spin } from 'antd';
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "../../config/firebase"; // Ensure this path is correct

const { Paragraph } = Typography;

const Copyright = () => {
    const [year, setYear] = useState(new Date().getFullYear()); // Fallback to local
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServerYear = async () => {
            try {
                // We use a "meta" document to get the server time
                const docRef = doc(firestore, "settings", "timeConfig");
                await setDoc(docRef, { lastChecked: serverTimestamp() });
                
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
    const data = docSnap.data();
    
    // 1. Check if 'lastChecked' exists and is a valid Firestore Timestamp
    if (data.lastChecked && typeof data.lastChecked.toDate === 'function') {
        const dateObj = data.lastChecked.toDate();
        setYear(dateObj.getFullYear());
    } else {
        // 2. Fallback: If no timestamp exists, default to current year
        setYear(new Date().getFullYear());
        console.warn("lastChecked field missing or invalid in document:", docSnap.id);
    }
}
            } catch (error) {
                console.error("Error fetching server time:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServerYear();
    }, []);

    return (
        <footer  style={{ backgroundColor: '#001529', padding: '14px 0', marginTop: 'auto', textAlign: 'center' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <Row justify="center" align="middle">
                    <Col span={24}>
                        {loading ? <Spin size="small" /> : (
                            <Paragraph style={{ color: '#ffffff', margin: 0 }}>
                                &copy; {year} <strong>Liaqat Engineering Workshop</strong>. All Rights Reserved.
                            </Paragraph>
                        )}
                    </Col>
                </Row>
            </div>
        </footer>
    );
};

export default Copyright;