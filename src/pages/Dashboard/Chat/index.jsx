import { useState, useEffect, useRef } from 'react';
import { Typography, Row, Col, Input, Button, message, Modal, Tag, Avatar, Grid, Badge, Dropdown, Spin } from 'antd';
import { SendOutlined, MessageOutlined, PlusOutlined, UserOutlined, ArrowLeftOutlined, DeleteOutlined, EllipsisOutlined, CheckOutlined, CheckCircleOutlined, StopOutlined, SearchOutlined, PaperClipOutlined, AudioOutlined, PlayCircleOutlined, PauseCircleOutlined, VideoCameraOutlined, PictureOutlined, TeamOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { collection, onSnapshot, doc, addDoc, updateDoc, arrayUnion, query, where, getDocs, deleteDoc, getDoc } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { supabase, supabaseUrl } from '@/config/supabase';
import { useAuth } from '@/context/Auth';
import ScreenLoader from '@/components/ScreenLoader';

const { Title, Text } = Typography;

const VoiceWaveform = ({ isPlaying, isMine, onClick, duration }) => {
    const bars = 32;
    return (
        <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', minWidth: 200, padding: '4px 0' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: isMine ? 'rgba(255,255,255,0.2)' : '#f0f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: isMine ? '2px solid rgba(255,255,255,0.4)' : '2px solid #1677ff' }}>
                {isPlaying ? <PauseCircleOutlined style={{ fontSize: 18, color: isMine ? '#fff' : '#1677ff' }} /> : <PlayCircleOutlined style={{ fontSize: 18, color: isMine ? '#fff' : '#1677ff' }} />}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 1.5, height: 32, flex: 1 }}>
                {Array.from({ length: bars }).map((_, i) => {
                    const baseHeight = Math.sin(i * 0.5) * 8 + 10;
                    const animHeight = isPlaying ? Math.sin(Date.now() * 0.01 + i * 0.8) * 10 + 14 : baseHeight;
                    return (
                        <div key={i} style={{
                            width: 3,
                            height: isPlaying ? animHeight : baseHeight,
                            borderRadius: 2,
                            background: isMine ? 'rgba(255,255,255,0.6)' : '#1677ff',
                            opacity: isPlaying ? 1 : 0.4 + (i / bars) * 0.4,
                            transition: isPlaying ? 'none' : 'height 0.3s ease',
                            animation: isPlaying ? `waveBar 0.${4 + (i % 5)}s ease-in-out infinite alternate` : 'none',
                            animationDelay: `${i * 0.03}s`,
                        }} />
                    );
                })}
            </div>
            <span style={{ fontSize: 11, color: isMine ? 'rgba(255,255,255,0.7)' : '#999', flexShrink: 0, minWidth: 32, textAlign: 'right' }}>{duration || '0:00'}</span>
        </div>
    );
};

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const sec = Math.floor((now - date) / 1000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  if (sameDay) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (isYesterday) return 'Yesterday ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const roleColors = { Admin: 'red', 'Super Admin': 'purple', Worker: 'cyan', Customer: 'green', Manager: 'orange' };
const adminRoles = ['Admin', 'Super Admin', 'Manager'];

const ChatPage = () => {
    const { userData: currentUser, user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [chatInput, setChatInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [newMsg, setNewMsg] = useState('');
    const [sending, setSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showMobileList, setShowMobileList] = useState(true);
    const [otherUserData, setOtherUserData] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [customerModalOpen, setCustomerModalOpen] = useState(false);
    const [customerSearch, setCustomerSearch] = useState('');
    const [groupModalOpen, setGroupModalOpen] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
    const [groupSearch, setGroupSearch] = useState('');
    const [uploading, setUploading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [playingAudio, setPlayingAudio] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [lastMsgCount, setLastMsgCount] = useState({});
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioRef = useRef(null);
    const isAdmin = adminRoles.includes(currentUser?.role);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        const q = isAdmin
            ? collection(firestore, 'conversations')
            : query(collection(firestore, 'conversations'), where('participants', 'array-contains', user?.uid || ''));
        const unsub = onSnapshot(q, (snap) => {
            const list = snap.docs.map(d => ({ key: d.id, ...d.data() }))
                .sort((a, b) => ((b.lastMessageAt || b.createdAt || '') > (a.lastMessageAt || a.createdAt || '') ? 1 : -1));
            setConversations(list);
            clearTimeout(timer);
            setLoading(false);
        });
        return () => { unsub(); clearTimeout(timer); };
    }, []);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedConv?.messages]);

    useEffect(() => {
        if (!selectedConv) { setOtherUserData(null); return; }
        const otherUid = selectedConv.participants?.find(uid => uid !== user?.uid);
        if (!otherUid) return;
        const fetchUser = async () => {
            try {
                const snap = await getDoc(doc(firestore, 'users', otherUid));
                if (snap.exists()) setOtherUserData({ uid: otherUid, ...snap.data() });
            } catch {}
        };
        fetchUser();
    }, [selectedConv?.key]);

    useEffect(() => {
        if (!isAdmin) return;
        const fetchCustomers = async () => {
            try {
                const snap = await getDocs(query(collection(firestore, 'users'), where('role', '==', 'Customer')));
                const list = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
                setCustomers(list);
            } catch {}
        };
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (!user?.uid || conversations.length === 0) return;
        conversations.forEach(conv => {
            const msgs = conv.messages || [];
            const lastMsg = msgs[msgs.length - 1];
            if (!lastMsg || lastMsg.sender === user?.uid) return;
            const prevCount = lastMsgCount[conv.key] || 0;
            if (prevCount > 0 && msgs.length > prevCount) {
                const other = getOtherParticipant(conv);
                const notif = {
                    id: Date.now() + Math.random(),
                    senderName: conv.isGroup ? conv.groupName : (lastMsg.senderName || other?.name || 'Unknown'),
                    senderAvatar: lastMsg.senderAvatar || other?.avatarUrl || null,
                    message: lastMsg.message?.slice(0, 60) || '[Media]',
                    convKey: conv.key,
                };
                setNotifications(prev => [...prev.slice(-4), notif]);
                setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== notif.id)), 5000);
                try { new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVggoKMfF9OXWB9lZ+MblRfZn2RnYxoUF1lfZKci2hQXmV9kpyLaE9dZX2Sm4toT15mfZKci2hPXmZ9k5uLaE9eZn2Tm4toT15mfZKci2hPXmZ9').play().catch(() => {}); } catch {}
            }
        });
        setLastMsgCount(prev => {
            const next = {};
            conversations.forEach(c => { next[c.key] = (c.messages || []).length; });
            return next;
        });
    }, [conversations]);

    const markAsRead = async (conv) => {
        if (!conv || !user?.uid) return;
        const msgs = conv.messages || [];
        let changed = false;
        const updated = msgs.map(m => {
            if (m.sender !== user?.uid) {
                const readers = m.readBy || [];
                if (!readers.includes(user.uid)) {
                    changed = true;
                    return { ...m, readBy: [...readers, user.uid] };
                }
            }
            return m;
        });
        if (changed) {
            try { await updateDoc(doc(firestore, 'conversations', conv.key), { messages: updated }); } catch {}
        }
    };

    useEffect(() => {
        if (selectedConv) markAsRead(selectedConv);
    }, [selectedConv?.key, selectedConv?.messages?.length]);

    useEffect(() => {
        if (selectedConv && conversations.length > 0) {
            const fresh = conversations.find(c => c.key === selectedConv.key);
            if (fresh) {
                setSelectedConv(fresh);
                markAsRead(fresh);
            }
        }
    }, [conversations]);

    const sendMessage = async () => {
        if (!chatInput.trim() || !selectedConv) return;
        if (selectedConv.blocked && !selectedConv.isGroup && !isAdmin) {
            message.error("You are blocked from this conversation");
            return;
        }
        const msgText = chatInput.trim();
        setChatInput('');
        const urlMatch = msgText.match(/^(https?:\/\/[^\s]+)$/);
        const msgObj = {
            sender: user?.uid,
            senderName: currentUser?.name || 'Unknown',
            senderRole: currentUser?.role || 'customer',
            senderAvatar: currentUser?.avatarUrl || null,
            message: msgText,
            timestamp: new Date().toISOString(),
            readBy: [user?.uid],
        };
        if (urlMatch) {
            msgObj.type = 'link';
            msgObj.url = msgText;
        }
        try {
            await updateDoc(doc(firestore, 'conversations', selectedConv.key), {
                messages: arrayUnion(msgObj),
                lastMessage: urlMatch ? '[Link]' : msgText.length > 40 ? msgText.slice(0, 40) + '...' : msgText,
                lastMessageAt: new Date().toISOString(),
                lastMessageSender: currentUser?.name || 'Unknown',
            });
        } catch {
            message.error("Failed to send message");
            setChatInput(msgText);
        }
    };

    const startConversation = async () => {
        if (!newMsg.trim()) return;
        setSending(true);
        try {
            const adminSnap = await getDocs(query(collection(firestore, 'users'), where('role', 'in', adminRoles)));
            if (adminSnap.empty) { message.error("No admin found"); setSending(false); return; }
            const adminDoc = adminSnap.docs[0];
            const adminData = adminDoc.data();

            const existing = conversations.find(c =>
                c.participants?.includes(user?.uid) && c.participants?.includes(adminDoc.id)
            );
            const msgObj = {
                sender: user?.uid,
                senderName: currentUser?.name || 'Unknown',
                senderRole: currentUser?.role || 'customer',
                senderAvatar: currentUser?.avatarUrl || null,
                message: newMsg.trim(),
                timestamp: new Date().toISOString(),
                readBy: [user?.uid],
            };
            if (existing) {
                setSelectedConv(existing);
                await updateDoc(doc(firestore, 'conversations', existing.key), {
                    messages: arrayUnion(msgObj),
                    lastMessage: newMsg.trim(),
                    lastMessageAt: new Date().toISOString(),
                });
            } else {
                const convRef = await addDoc(collection(firestore, 'conversations'), {
                    participants: [user?.uid, adminDoc.id],
                    participantData: {
                        [user?.uid]: { name: currentUser?.name, role: currentUser?.role, avatarUrl: currentUser?.avatarUrl || null },
                        [adminDoc.id]: { name: adminData?.name || 'Admin', role: adminData?.role || 'Admin', avatarUrl: adminData?.avatarUrl || null },
                    },
                    lastMessage: newMsg.trim(),
                    lastMessageAt: new Date().toISOString(),
                    messages: [msgObj],
                    createdAt: new Date().toISOString(),
                });
                setSelectedConv({ key: convRef.id, messages: [msgObj] });
            }
            setNewMsg('');
            setModalOpen(false);
        } catch {
            message.error("Failed to start conversation");
        } finally {
            setSending(false);
        }
    };

    const selectCustomer = async (customer) => {
        setCustomerModalOpen(false);
        setCustomerSearch('');
        const existing = conversations.find(c =>
            c.participants?.includes(user?.uid) && c.participants?.includes(customer.uid)
        );
        if (existing) {
            setSelectedConv(existing);
            if (isMobile) setShowMobileList(false);
            return;
        }
        try {
            const convRef = await addDoc(collection(firestore, 'conversations'), {
                participants: [user?.uid, customer.uid],
                participantData: {
                    [user?.uid]: { name: currentUser?.name, role: currentUser?.role, avatarUrl: currentUser?.avatarUrl || null },
                    [customer.uid]: { name: customer.name || 'Customer', role: customer.role || 'Customer', avatarUrl: customer.avatarUrl || null },
                },
                lastMessage: '',
                lastMessageAt: new Date().toISOString(),
                messages: [],
                createdAt: new Date().toISOString(),
            });
            const newConv = { key: convRef.id, participants: [user?.uid, customer.uid], participantData: {
                [user?.uid]: { name: currentUser?.name, role: currentUser?.role, avatarUrl: currentUser?.avatarUrl || null },
                [customer.uid]: { name: customer.name || 'Customer', role: customer.role || 'Customer', avatarUrl: customer.avatarUrl || null },
            }, messages: [], createdAt: new Date().toISOString() };
            setSelectedConv(newConv);
            if (isMobile) setShowMobileList(false);
        } catch {
            message.error("Failed to start conversation");
        }
    };

    const filteredCustomers = customers.filter(c => {
        if (!customerSearch) return true;
        return c.name?.toLowerCase().includes(customerSearch.toLowerCase()) || c.email?.toLowerCase().includes(customerSearch.toLowerCase());
    });

    const createGroup = async () => {
        if (!groupName.trim() || selectedGroupMembers.length === 0) return;
        try {
            const participantData = {
                [user.uid]: { name: currentUser?.name, role: currentUser?.role, avatarUrl: currentUser?.avatarUrl || null },
            };
            selectedGroupMembers.forEach(m => {
                participantData[m.uid] = { name: m.name, role: m.role, avatarUrl: m.avatarUrl || null };
            });
            await addDoc(collection(firestore, 'conversations'), {
                isGroup: true,
                groupName: groupName.trim(),
                groupAdmin: user.uid,
                participants: [user.uid, ...selectedGroupMembers.map(m => m.uid)],
                participantData,
                lastMessage: '',
                lastMessageAt: new Date().toISOString(),
                messages: [],
                createdAt: new Date().toISOString(),
            });
            message.success('Group created!');
            setGroupModalOpen(false);
            setGroupName('');
            setSelectedGroupMembers([]);
            setGroupSearch('');
        } catch {
            message.error('Failed to create group');
        }
    };

    const filteredGroupCustomers = customers.filter(c => {
        if (selectedGroupMembers.some(m => m.uid === c.uid)) return false;
        if (!groupSearch) return true;
        return c.name?.toLowerCase().includes(groupSearch.toLowerCase()) || c.email?.toLowerCase().includes(groupSearch.toLowerCase());
    });

    const uploadToSupabase = async (file, folder) => {
        const ext = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from('Profile Images').upload(fileName, file);
        if (error) throw error;
        return `${supabaseUrl}/storage/v1/object/public/Profile%20Images/${fileName}`;
    };

    const sendMediaMessage = async (type, url, name) => {
        if (!selectedConv) return;
        const msgObj = {
            sender: user?.uid,
            senderName: currentUser?.name || 'Unknown',
            senderRole: currentUser?.role || 'customer',
            senderAvatar: currentUser?.avatarUrl || null,
            type,
            message: type === 'text' ? (name || '') : (name || ''),
            url,
            timestamp: new Date().toISOString(),
            readBy: [user?.uid],
        };
        try {
            await updateDoc(doc(firestore, 'conversations', selectedConv.key), {
                messages: arrayUnion(msgObj),
                lastMessage: type === 'text' ? (name || url) : `[${type.charAt(0).toUpperCase() + type.slice(1)}]`,
                lastMessageAt: new Date().toISOString(),
            });
        } catch {
            message.error("Failed to send");
        }
    };

    const handleFileUpload = async (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = '';
        if (file.size > 50 * 1024 * 1024) { message.error("File too large (max 50MB)"); return; }
        setUploading(true);
        try {
            const folder = type === 'image' ? 'chat/images' : 'chat/videos';
            const url = await uploadToSupabase(file, folder);
            await sendMediaMessage(type, url, file.name);
        } catch (err) {
            message.error("Upload failed: " + (err.message || 'Unknown error'));
        } finally {
            setUploading(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
            mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                stream.getTracks().forEach(t => t.stop());
            };
            mediaRecorder.start();
            setIsRecording(true);
        } catch {
            message.error("Microphone access denied");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const sendVoice = async () => {
        if (!audioBlob || !selectedConv) return;
        setUploading(true);
        try {
            const audioDur = await new Promise((resolve) => {
                const a = new Audio(audioUrl);
                a.onloadedmetadata = () => {
                    const mins = Math.floor(a.duration / 60);
                    const secs = Math.floor(a.duration % 60);
                    resolve(`${mins}:${secs.toString().padStart(2, '0')}`);
                };
                a.onerror = () => resolve('0:00');
            });
            const ext = 'webm';
            const fileName = `chat/voice/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
            const { error } = await supabase.storage.from('Profile Images').upload(fileName, audioBlob);
            if (error) throw error;
            const url = `${supabaseUrl}/storage/v1/object/public/Profile%20Images/${fileName}`;
            const msgObj = {
                sender: user?.uid,
                senderName: currentUser?.name || 'Unknown',
                senderRole: currentUser?.role || 'customer',
                senderAvatar: currentUser?.avatarUrl || null,
                type: 'voice',
                message: 'Voice message',
                url,
                audioDuration: audioDur,
                timestamp: new Date().toISOString(),
                readBy: [user?.uid],
            };
            await updateDoc(doc(firestore, 'conversations', selectedConv.key), {
                messages: arrayUnion(msgObj),
                lastMessage: '[Voice]',
                lastMessageAt: new Date().toISOString(),
            });
            setAudioBlob(null);
            setAudioUrl(null);
        } catch {
            message.error("Voice upload failed");
        } finally {
            setUploading(false);
        }
    };

    const playAudio = (url, id) => {
        if (playingAudio === id) {
            audioRef.current?.pause();
            setPlayingAudio(null);
            return;
        }
        if (audioRef.current) audioRef.current.pause();
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.play();
        setPlayingAudio(id);
        audio.onended = () => setPlayingAudio(null);
    };

    const renderMessageContent = (msg, isMine) => {
        if (msg.type === 'image') {
            return (
                <div>
                    <img src={msg.url} alt={msg.message || 'image'} onClick={() => setPreviewImage(msg.url)} style={{ maxWidth: 260, maxHeight: 200, borderRadius: 8, cursor: 'pointer', display: 'block' }} />
                    {msg.message && msg.message !== msg.url && <div style={{ marginTop: 4, fontSize: 12, opacity: 0.8 }}>{msg.message}</div>}
                </div>
            );
        }
        if (msg.type === 'video') {
            return (
                <div>
                    <video src={msg.url} controls style={{ maxWidth: 280, maxHeight: 200, borderRadius: 8, display: 'block' }} />
                    {msg.message && msg.message !== msg.url && <div style={{ marginTop: 4, fontSize: 12, opacity: 0.8 }}>{msg.message}</div>}
                </div>
            );
        }
        if (msg.type === 'voice') {
            const dur = msg.audioDuration || null;
            return <VoiceWaveform isPlaying={playingAudio === msg.url} isMine={isMine} onClick={() => playAudio(msg.url, msg.url)} duration={dur} />;
        }
        if (msg.type === 'link') {
            return <a href={msg.url} target="_blank" rel="noopener noreferrer" style={{ color: isMine ? '#bae7ff' : '#1677ff', textDecoration: 'underline', wordBreak: 'break-all' }}>{msg.message || msg.url}</a>;
        }
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = (msg.message || '').split(urlRegex);
        if (parts.length > 1) {
            return (
                <div>
                    {parts.map((part, idx) => {
                        if (part.match(urlRegex)) {
                            return <a key={idx} href={part} target="_blank" rel="noopener noreferrer" style={{ color: isMine ? '#bae7ff' : '#1677ff', textDecoration: 'underline' }}>{part}</a>;
                        }
                        return <span key={idx}>{part}</span>;
                    })}
                </div>
            );
        }
        return msg.message;
    };

    const handleDeleteConversation = async (conv) => {
        if (!isAdmin) return;
        try {
            await deleteDoc(doc(firestore, 'conversations', conv.key));
            if (selectedConv?.key === conv.key) setSelectedConv(null);
            message.success('Conversation deleted');
        } catch {
            message.error('Failed to delete');
        }
    };

    const handleBlockToggle = async (conv) => {
        if (!isAdmin) return;
        try {
            const isBlocked = conv.blocked === user?.uid;
            await updateDoc(doc(firestore, 'conversations', conv.key), {
                blocked: isBlocked ? null : user?.uid,
                blockedAt: isBlocked ? null : new Date().toISOString(),
            });
            if (selectedConv?.key === conv.key) {
                setSelectedConv(prev => ({ ...prev, blocked: isBlocked ? null : user?.uid }));
            }
            message.success(isBlocked ? 'Conversation unblocked' : 'Conversation blocked');
        } catch {
            message.error('Failed to update block status');
        }
    };

    const getOtherParticipant = (conv) => {
        if (!conv) return null;
        const otherUid = conv.participants?.find(uid => uid !== user?.uid);
        if (conv.participantData && otherUid) {
            const data = conv.participantData[otherUid] || conv.participantData;
            if (data?.name) {
                const live = otherUserData?.uid === otherUid ? otherUserData : null;
                return {
                    name: data.name,
                    role: data.role || '',
                    avatarUrl: live?.avatarUrl || data.avatarUrl || null,
                };
            }
        }
        if (Array.isArray(conv.participantData)) {
            const found = conv.participantData.find(p => p.uid === otherUid);
            if (found) {
                const live = otherUserData?.uid === otherUid ? otherUserData : null;
                return {
                    name: found.name,
                    role: found.role || '',
                    avatarUrl: live?.avatarUrl || found.avatarUrl || null,
                };
            }
        }
        if (otherUserData?.uid === otherUid && otherUserData?.name) {
            return { name: otherUserData.name, role: otherUserData.role || '', avatarUrl: otherUserData.avatarUrl || null };
        }
        if (conv.messages?.length > 0) {
            const otherMsg = conv.messages.find(m => m.sender !== user?.uid);
            if (otherMsg?.senderName) {
                return { name: otherMsg.senderName, role: otherMsg.senderRole || '', avatarUrl: otherMsg.senderAvatar || null };
            }
        }
        return null;
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    };

    const filteredConversations = conversations.filter(conv => {
        if (!searchTerm) return true;
        if (conv.isGroup) {
            return conv.groupName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase());
        }
        const other = getOtherParticipant(conv);
        return other?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const screens = Grid.useBreakpoint();
    const isMobile = screens.xs || !screens.md;

    if (loading) return <ScreenLoader />;

    const renderConversationList = () => (
        <div style={{ background: '#fff', borderRadius: 12, height: '100%', overflow: 'hidden', border: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #f0f0f0' }}>
                <Text strong style={{ fontSize: 15, color: '#001529' }}>Conversations</Text>
                <Text style={{ fontSize: 13, color: '#999', marginLeft: 6 }}>({conversations.length})</Text>
                <Input
                    placeholder="Search conversations..."
                    variant="filled"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginTop: 8, borderRadius: 8, background: '#f5f5f5' }}
                />
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {filteredConversations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 16px', color: '#bbb' }}>
                        <MessageOutlined style={{ fontSize: 28 }} />
                        <div style={{ marginTop: 8, fontSize: 13 }}>No conversations found</div>
                    </div>
                ) : (
                    filteredConversations.map((conv) => {
                        const other = getOtherParticipant(conv);
                        const isActive = selectedConv?.key === conv.key;
                        const isGroup = conv.isGroup;
                        const memberCount = isGroup ? (conv.participants?.length || 0) - 1 : 0;
                        return (
                            <div
                                key={conv.key}
                                onClick={() => { setSelectedConv(conv); if (isMobile) setShowMobileList(false); }}
                                style={{
                                    cursor: 'pointer', padding: '12px 16px',
                                    background: isActive ? '#f0f5ff' : 'transparent',
                                    borderBottom: '1px solid #f5f5f5',
                                    transition: 'all 0.2s',
                                    borderLeft: isActive ? '3px solid #1677ff' : '3px solid transparent',
                                    position: 'relative',
                                }}
                                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#fafafa'; }}
                                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    {isGroup ? (
                                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: isActive ? '#1677ff' : 'linear-gradient(135deg, #1677ff, #722ed1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <TeamOutlined style={{ fontSize: 20, color: '#fff' }} />
                                        </div>
                                    ) : (
                                        <Badge size="default" count={0} style={{ boxShadow: 'none' }}>
                                            <Avatar size={44} src={other?.avatarUrl} style={{ background: isActive ? '#1677ff' : '#d9d9d9', flexShrink: 0, fontWeight: 600 }}>
                                                {getInitials(other?.name)}
                                            </Avatar>
                                        </Badge>
                                    )}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                                            <Text strong style={{ fontSize: 14, flex: 1 }} ellipsis>{isGroup ? conv.groupName : (other?.name || 'User')}</Text>
                                            {isGroup ? (
                                                <Tag color="purple" style={{ fontSize: 10, lineHeight: '16px', padding: '0 6px', borderRadius: 4, marginRight: 0, flexShrink: 0 }}>
                                                    <TeamOutlined style={{ marginRight: 2 }} />{memberCount}
                                                </Tag>
                                            ) : (
                                                <Tag color={roleColors[other?.role] || 'default'} style={{ fontSize: 10, lineHeight: '16px', padding: '0 6px', borderRadius: 4, marginRight: 0, flexShrink: 0 }}>
                                                    {other?.role || 'N/A'}
                                                </Tag>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                                            <Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                                                {conv.lastMessage?.slice(0, 50) || 'No messages'}
                                            </Text>
                                            <Text style={{ fontSize: 10, color: '#bbb', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                                {timeAgo(conv.lastMessageAt || conv.createdAt)}
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );

    const renderChatArea = () => (
        selectedConv ? (
            <div style={{ background: '#fff', borderRadius: 12, height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
                <div style={{ padding: '12px 20px', borderBottom: '1px solid #f0f0f0', background: '#fafafa', display: 'flex', alignItems: 'center', gap: 12 }}>
                    {isMobile && (
                        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => { setSelectedConv(null); setShowMobileList(true); }} />
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                        <Avatar size={40} src={currentUser?.avatarUrl} style={{ background: '#1677ff', flexShrink: 0, fontWeight: 600 }}>
                            {getInitials(currentUser?.name)}
                        </Avatar>
                        <div>
                            <Text strong style={{ fontSize: 14 }}>{currentUser?.name || 'You'}</Text>
                            <div>
                                <Tag color={roleColors[currentUser?.role] || 'default'} style={{ fontSize: 10, lineHeight: '16px', padding: '0 6px', borderRadius: 4, margin: 0 }}>
                                    {currentUser?.role || ''}
                                </Tag>
                            </div>
                        </div>
                    </div>
                    <div style={{ color: '#ccc', fontSize: 20 }}>↔</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {selectedConv.isGroup ? (
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #1677ff, #722ed1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <TeamOutlined style={{ fontSize: 18, color: '#fff' }} />
                            </div>
                        ) : (
                            <Avatar size={40} src={getOtherParticipant(selectedConv)?.avatarUrl} style={{ background: '#52c41a', flexShrink: 0, fontWeight: 600 }}>
                                {getInitials(getOtherParticipant(selectedConv)?.name)}
                            </Avatar>
                        )}
                        <div>
                            <Text strong style={{ fontSize: 14 }}>{selectedConv.isGroup ? selectedConv.groupName : (getOtherParticipant(selectedConv)?.name || 'Unknown')}</Text>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                {selectedConv.isGroup ? (
                                    <Tag color="purple" style={{ fontSize: 10, lineHeight: '16px', padding: '0 6px', borderRadius: 4, margin: 0 }}>
                                        <TeamOutlined style={{ marginRight: 2 }} />{selectedConv.participants?.length - 1} members
                                    </Tag>
                                ) : (
                                    <Tag color={roleColors[getOtherParticipant(selectedConv)?.role] || 'default'} style={{ fontSize: 10, lineHeight: '16px', padding: '0 6px', borderRadius: 4, margin: 0 }}>
                                        {getOtherParticipant(selectedConv)?.role || ''}
                                    </Tag>
                                )}
                                {selectedConv?.blocked && !selectedConv.isGroup && (
                                    <Tag color="red" style={{ fontSize: 10, lineHeight: '16px', padding: '0 6px', borderRadius: 4, margin: 0 }}>
                                        <StopOutlined style={{ marginRight: 2 }} />Blocked
                                    </Tag>
                                )}
                            </div>
                        </div>
                    </div>
                    {isAdmin && !selectedConv.isGroup && (
                        <Dropdown menu={{ items: [
                            { key: 'block', icon: selectedConv?.blocked ? <CheckOutlined /> : <StopOutlined />, label: selectedConv?.blocked ? 'Unblock' : 'Block', danger: !selectedConv?.blocked, onClick: () => handleBlockToggle(selectedConv) },
                            { key: 'delete', icon: <DeleteOutlined />, label: 'Delete conversation', danger: true, onClick: () => handleDeleteConversation(selectedConv) },
                        ] }} trigger={['click']}>
                            <Button type="text" icon={<EllipsisOutlined />} style={{ fontSize: 18 }} />
                        </Dropdown>
                    )}
                    {isAdmin && selectedConv.isGroup && (
                        <Dropdown menu={{ items: [
                            { key: 'delete', icon: <DeleteOutlined />, label: 'Delete group', danger: true, onClick: () => handleDeleteConversation(selectedConv) },
                        ] }} trigger={['click']}>
                            <Button type="text" icon={<EllipsisOutlined />} style={{ fontSize: 18 }} />
                        </Dropdown>
                    )}
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: '#f7f8fa' }}>
                    {(!selectedConv.messages || selectedConv.messages.length === 0) && (
                        <div style={{ textAlign: 'center', color: '#bbb', marginTop: 60 }}>
                            <MessageOutlined style={{ fontSize: 36 }} />
                            <div style={{ marginTop: 8 }}>No messages yet</div>
                            <Text type="secondary" style={{ fontSize: 12 }}>Send a message to start the conversation</Text>
                        </div>
                    )}
                    {selectedConv.messages?.map((msg, i) => {
                        const isMine = msg.sender === user?.uid;
                        const prevMsg = i > 0 ? selectedConv.messages[i - 1] : null;
                        const showAvatar = !prevMsg || prevMsg.sender !== msg.sender;
                        const showDate = !prevMsg || new Date(msg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();
                        return (
                            <div key={i}>
                                {showDate && (
                                    <div style={{ textAlign: 'center', margin: '16px 0' }}>
                                        <Text style={{ fontSize: 11, color: '#bbb', background: '#f7f8fa', padding: '2px 12px', borderRadius: 8 }}>
                                            {formatDate(msg.timestamp)}
                                        </Text>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: showAvatar ? 14 : 4 }}>
                                    <div style={{ maxWidth: isMobile ? '88%' : '72%', display: 'flex', flexDirection: isMine ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: showAvatar ? 8 : 0 }}>
                                        {showAvatar ? (
                                            <Avatar size={28} src={isMine ? currentUser?.avatarUrl : (selectedConv.isGroup ? msg.senderAvatar : getOtherParticipant(selectedConv)?.avatarUrl)} style={{ background: isMine ? '#1677ff' : '#d9d9d9', flexShrink: 0, fontSize: 11, fontWeight: 600 }}>
                                                {isMine ? getInitials(currentUser?.name) : getInitials(selectedConv.isGroup ? msg.senderName : getOtherParticipant(selectedConv)?.name)}
                                            </Avatar>
                                        ) : <div style={{ width: 28, flexShrink: 0 }} />}
                                        <div style={{ maxWidth: isMobile ? 'calc(100% - 36px)' : 'calc(100% - 36px)' }}>
                                            <div style={{
                                                background: isMine ? '#1677ff' : '#fff',
                                                color: isMine ? '#fff' : '#222',
                                                padding: msg.type ? '6px 10px' : '10px 14px',
                                                borderRadius: isMine ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                                fontSize: 14, lineHeight: 1.5,
                                                wordBreak: 'break-word',
                                                overflow: 'hidden',
                                            }}>
                                                {renderMessageContent(msg, isMine)}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', alignItems: 'center', gap: 4, marginTop: 3, padding: '0 4px' }}>
                                                <Text style={{ fontSize: 10, color: '#bbb' }}>{formatDate(msg.timestamp)}</Text>
                                                {isMine && (
                                                    msg.readBy?.length > 1
                                                        ? <CheckCircleOutlined style={{ fontSize: 12, color: '#1677ff' }} />
                                                        : msg.readBy?.length === 1
                                                            ? <span style={{ fontSize: 12, color: '#bbb', display: 'inline-flex', marginLeft: -2, marginRight: 2 }}><CheckOutlined /><CheckOutlined style={{ marginLeft: -6 }} /></span>
                                                            : <span style={{ fontSize: 12, color: '#bbb', display: 'inline-flex', marginLeft: -2, marginRight: 2 }}><CheckOutlined style={{ opacity: 0.5 }} /><CheckOutlined style={{ marginLeft: -6, opacity: 0.5 }} /></span>
                                                )}
                                                <Text style={{ fontSize: 10, color: '#ccc', marginLeft: 2 }}>{selectedConv.isGroup && !isMine ? (msg.senderName || 'Unknown') : (selectedConv.isGroup ? '' : msg.senderName)}</Text>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={chatEndRef} />
                </div>

                <div style={{ padding: '10px 20px', borderTop: '1px solid #f0f0f0', background: (selectedConv?.blocked && !selectedConv.isGroup && !isAdmin) ? '#fff5f5' : '#fff' }}>
                    {selectedConv?.blocked && !selectedConv.isGroup && !isAdmin && (
                        <div style={{ textAlign: 'center', marginBottom: 10, padding: '8px 12px', background: '#fff1f0', borderRadius: 8, border: '1px solid #ffa39e' }}>
                            <StopOutlined style={{ color: '#ff4d4f', marginRight: 6 }} />
                            <Text style={{ color: '#ff4d4f', fontSize: 13 }}>You are blocked by admin. You cannot send messages.</Text>
                        </div>
                    )}
                    {audioUrl && (
                        <div style={{ marginBottom: 10, padding: '8px 12px', background: '#f0f5ff', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Button type="primary" shape="circle" size="small" icon={playingAudio === 'preview' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                                onClick={() => playAudio(audioUrl, 'preview')} />
                            <div style={{ flex: 1, height: 3, background: '#d9d9d9', borderRadius: 2, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: playingAudio === 'preview' ? '100%' : '0%', background: '#1677ff', borderRadius: 2, transition: 'width 0.3s' }} />
                            </div>
                            <Text style={{ fontSize: 11, color: '#666' }}>Voice</Text>
                            <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => { setAudioBlob(null); setAudioUrl(null); }} />
                            <Button size="small" type="primary" icon={<SendOutlined />} onClick={sendVoice} loading={uploading}>Send</Button>
                        </div>
                    )}
                    <Row gutter={8} align="middle">
                        <Col>
                            <Dropdown menu={{ items: [
                                { key: 'image', icon: <PictureOutlined />, label: 'Image', onClick: () => fileInputRef.current?.click() },
                                { key: 'video', icon: <VideoCameraOutlined />, label: 'Video', onClick: () => videoInputRef.current?.click() },
                            ] }} trigger={['click']}>
                                <Button type="text" icon={<PaperClipOutlined />} disabled={selectedConv?.blocked && !selectedConv.isGroup && !isAdmin} style={{ fontSize: 18 }} />
                            </Dropdown>
                            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => handleFileUpload(e, 'image')} />
                            <input ref={videoInputRef} type="file" accept="video/*" hidden onChange={(e) => handleFileUpload(e, 'video')} />
                        </Col>
                        <Col>
                            <Button type="text" icon={isRecording ? <PauseCircleOutlined style={{ color: '#ff4d4f' }} /> : <AudioOutlined />}
                                disabled={selectedConv?.blocked && !selectedConv.isGroup && !isAdmin}
                                onClick={isRecording ? stopRecording : startRecording}
                                style={{ fontSize: 18, color: isRecording ? '#ff4d4f' : undefined }} />
                        </Col>
                        <Col flex="auto">
                            <Input
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onPressEnter={sendMessage}
                                placeholder={selectedConv?.blocked && !selectedConv.isGroup && !isAdmin ? "Blocked" : isRecording ? "Recording..." : selectedConv.isGroup ? "Message group..." : "Type a message..."}
                                size="large"
                                disabled={(selectedConv?.blocked && !selectedConv.isGroup && !isAdmin) || isRecording || uploading}
                                variant="filled"
                                style={{ borderRadius: 24, background: '#f5f5f5' }}
                            />
                        </Col>
                        <Col>
                            {uploading ? <Spin size="small" /> : (
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<SendOutlined />}
                                    onClick={sendMessage}
                                    size="large"
                                    disabled={(!chatInput.trim() && !audioBlob) || uploading || (selectedConv?.blocked && !selectedConv.isGroup && !isAdmin)}
                                    style={{ width: 44, height: 44 }}
                                />
                            )}
                        </Col>
                    </Row>
                </div>
            </div>
        ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', background: '#fff', borderRadius: 12, border: '1px solid #e8e8e8', flexDirection: 'column', gap: 12, padding: 40 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f0f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageOutlined style={{ fontSize: 36, color: '#1677ff' }} />
                </div>
                <Text style={{ fontSize: 16, color: '#333', fontWeight: 600 }}>Select a Conversation</Text>
                <Text type="secondary" style={{ fontSize: 13, textAlign: 'center' }}>Choose a conversation from the left panel to start messaging</Text>
            </div>
        )
    );

    return (
        <div style={{ padding: screens.xs ? 12 : 24, maxWidth: '1400px', margin: '0 auto', minHeight: '100vh' }}>
            <div style={{
                marginBottom: 20,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
                padding: screens.xs ? '16px' : '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
            }}>
                <div>
                    <Title level={4} style={{ margin: 0, color: '#fff' }}><MessageOutlined style={{ marginRight: 8 }} />Messages</Title>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{isAdmin ? 'Chat with customers' : 'Communicate with workshop'}</Text>
                </div>
                {isAdmin ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Button
                            icon={<UsergroupAddOutlined />}
                            onClick={() => setGroupModalOpen(true)}
                            size={screens.xs ? 'middle' : 'large'}
                            style={{ borderRadius: 8, background: '#722ed1', color: '#fff', border: 'none', fontWeight: 600 }}
                        >
                            {screens.xs ? 'Group' : 'Create Group'}
                        </Button>
                        <Button
                            icon={<PlusOutlined />}
                            onClick={() => setCustomerModalOpen(true)}
                            size={screens.xs ? 'middle' : 'large'}
                            style={{ borderRadius: 8, background: '#fff', color: '#001529', border: 'none', fontWeight: 600 }}
                        >
                            {screens.xs ? 'Chat' : 'New Conversation'}
                        </Button>
                    </div>
                ) : (
                    <Button
                        icon={<PlusOutlined />}
                        onClick={() => setModalOpen(true)}
                        size={screens.xs ? 'middle' : 'large'}
                        style={{ borderRadius: 8, background: '#fff', color: '#001529', border: 'none', fontWeight: 600 }}
                    >
                        New Conversation
                    </Button>
                )}
            </div>

            {conversations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: 12, border: '1px solid #e8e8e8' }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <MessageOutlined style={{ fontSize: 32, color: '#1677ff' }} />
                    </div>
                    <Title level={4} type="secondary" style={{ margin: 0 }}>No conversations yet</Title>
                    <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>Start a new conversation by clicking the button above</Text>
                </div>
            ) : (
                <Row gutter={[16, 0]} style={{ minHeight: 'calc(100vh - 200px)' }}>
                    {(!isMobile || showMobileList) && (
                        <Col xs={24} md={8} style={isMobile ? { display: selectedConv && !showMobileList ? 'none' : 'block' } : {}}>
                            {renderConversationList()}
                        </Col>
                    )}
                    {(!isMobile || !showMobileList) && (
                        <Col xs={24} md={16} style={isMobile ? { display: selectedConv && !showMobileList ? 'block' : 'none' } : {}}>
                            {renderChatArea()}
                        </Col>
                    )}
                </Row>
            )}

            <Modal
                title={<span style={{ fontSize: 16 }}><MessageOutlined style={{ marginRight: 8 }} />New Conversation</span>}
                open={modalOpen}
                onOk={startConversation}
                onCancel={() => setModalOpen(false)}
                confirmLoading={sending}
                okText="Send"
                styles={{ body: { paddingTop: 16 } }}
            >
                <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 13 }}>
                    Your message will be sent to the workshop team
                </Text>
                <Input.TextArea rows={4} placeholder="Type your message..." value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)} style={{ borderRadius: 8, resize: 'none' }} />
            </Modal>

            <Modal
                title={<span style={{ fontSize: 16 }}><UserOutlined style={{ marginRight: 8 }} />Select Customer</span>}
                open={customerModalOpen}
                onCancel={() => { setCustomerModalOpen(false); setCustomerSearch(''); }}
                footer={null}
                width={screens.xs ? '95%' : 440}
                styles={{ body: { padding: 0 } }}
            >
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                    <Input
                        prefix={<SearchOutlined style={{ color: '#bbb' }} />}
                        placeholder="Search customers..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        allowClear
                        variant="filled"
                        style={{ borderRadius: 8 }}
                    />
                </div>
                <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                    {filteredCustomers.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 16px', color: '#bbb' }}>
                            <UserOutlined style={{ fontSize: 28 }} />
                            <div style={{ marginTop: 8, fontSize: 13 }}>No customers found</div>
                        </div>
                    ) : (
                        filteredCustomers.map((c) => {
                            const existing = conversations.find(cv =>
                                cv.participants?.includes(user?.uid) && cv.participants?.includes(c.uid)
                            );
                            return (
                                <div
                                    key={c.uid}
                                    onClick={() => selectCustomer(c)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        padding: '12px 16px', cursor: 'pointer',
                                        borderBottom: '1px solid #f5f5f5',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f0f5ff'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Avatar size={40} src={c.avatarUrl} style={{ background: '#52c41a', flexShrink: 0, fontWeight: 600 }}>
                                        {getInitials(c.name)}
                                    </Avatar>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <Text strong style={{ fontSize: 14, display: 'block' }} ellipsis>{c.name || 'Unknown'}</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }} ellipsis>{c.email || ''}</Text>
                                    </div>
                                    {existing && (
                                        <Tag color="blue" style={{ fontSize: 10, flexShrink: 0 }}>Existing</Tag>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </Modal>

            <Modal
                title={<span style={{ fontSize: 16 }}><UsergroupAddOutlined style={{ marginRight: 8 }} />Create Group</span>}
                open={groupModalOpen}
                onOk={createGroup}
                onCancel={() => { setGroupModalOpen(false); setGroupName(''); setSelectedGroupMembers([]); setGroupSearch(''); }}
                okText="Create Group"
                okButtonProps={{ disabled: !groupName.trim() || selectedGroupMembers.length === 0 }}
                width={screens.xs ? '95%' : 500}
                styles={{ body: { padding: 0 } }}
            >
                <div style={{ padding: 16 }}>
                    <Input
                        placeholder="Group name..."
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        size="large"
                        style={{ borderRadius: 8, marginBottom: 16 }}
                    />
                    <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 13 }}>
                        Add customers to this group
                    </Text>
                    {selectedGroupMembers.length > 0 && (
                        <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {selectedGroupMembers.map(m => (
                                <Tag
                                    key={m.uid}
                                    closable
                                    onClose={() => setSelectedGroupMembers(prev => prev.filter(x => x.uid !== m.uid))}
                                    color="purple"
                                    style={{ borderRadius: 12, padding: '2px 10px' }}
                                >
                                    {m.name}
                                </Tag>
                            ))}
                        </div>
                    )}
                    <Input
                        prefix={<SearchOutlined style={{ color: '#bbb' }} />}
                        placeholder="Search customers to add..."
                        value={groupSearch}
                        onChange={(e) => setGroupSearch(e.target.value)}
                        allowClear
                        variant="filled"
                        style={{ borderRadius: 8 }}
                    />
                </div>
                <div style={{ maxHeight: 280, overflowY: 'auto', borderTop: '1px solid #f0f0f0' }}>
                    {filteredGroupCustomers.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '30px 16px', color: '#bbb' }}>
                            <UserOutlined style={{ fontSize: 24 }} />
                            <div style={{ marginTop: 8, fontSize: 13 }}>No customers found</div>
                        </div>
                    ) : (
                        filteredGroupCustomers.map((c) => (
                            <div
                                key={c.uid}
                                onClick={() => setSelectedGroupMembers(prev => [...prev, c])}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '10px 16px', cursor: 'pointer',
                                    borderBottom: '1px solid #f5f5f5',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f0f5ff'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <Avatar size={36} src={c.avatarUrl} style={{ background: '#52c41a', flexShrink: 0, fontWeight: 600 }}>
                                    {getInitials(c.name)}
                                </Avatar>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <Text strong style={{ fontSize: 13, display: 'block' }} ellipsis>{c.name || 'Unknown'}</Text>
                                    <Text type="secondary" style={{ fontSize: 11 }} ellipsis>{c.email || ''}</Text>
                                </div>
                                <PlusOutlined style={{ color: '#1677ff' }} />
                            </div>
                        ))
                    )}
                </div>
            </Modal>

            <Modal open={!!previewImage} onCancel={() => setPreviewImage(null)} footer={null} width="90%" styles={{ body: { padding: 0, textAlign: 'center', background: '#000' } }}>
                <img src={previewImage} alt="preview" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
            </Modal>

            {/* Premium Notifications */}
            <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {notifications.map(n => (
                    <div key={n.id} onClick={() => {
                        const conv = conversations.find(c => c.key === n.convKey);
                        if (conv) { setSelectedConv(conv); if (isMobile) setShowMobileList(false); }
                        setNotifications(prev => prev.filter(x => x.id !== n.id));
                    }} style={{
                        background: '#fff', borderRadius: 12, padding: '12px 16px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 12, minWidth: 280, maxWidth: 380,
                        animation: 'slideInRight 0.4s cubic-bezier(0.68,-0.55,0.27,1.55)',
                        borderLeft: '4px solid #1677ff',
                    }}>
                        <Avatar size={38} src={n.senderAvatar} style={{ background: '#1677ff', flexShrink: 0, fontWeight: 600 }}>
                            {getInitials(n.senderName)}
                        </Avatar>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#001529', marginBottom: 2 }}>{n.senderName}</div>
                            <div style={{ fontSize: 12, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.message}</div>
                        </div>
                        <div style={{ fontSize: 10, color: '#bbb', flexShrink: 0 }}>now</div>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(120%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes waveBar {
                    0% { height: 4px; opacity: 0.4; }
                    100% { height: 28px; opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ChatPage;