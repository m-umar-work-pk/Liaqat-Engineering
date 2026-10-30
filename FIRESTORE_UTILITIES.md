# Firestore Utilities Documentation

This guide explains the centralized Firestore utilities created to standardize database operations across the application.

## Overview

The `firestore.utils.js` file exports a collection of reusable functions for performing CRUD operations on Firestore collections. This approach:

- **Reduces code duplication** across components
- **Improves error handling** with consistent patterns
- **Centralizes business logic** for easier maintenance
- **Provides consistent response format** { success, data/error, id }

## Installation

The utilities are already integrated into your project at:
```
src/services/firestore.utils.js
```

## Usage Examples

### 1. Fetch User Profile

```javascript
import { fetchUserProfile } from '@/services/firestore.utils';

const result = await fetchUserProfile(userId);

if (result.success) {
    console.log('User data:', result.data);
} else {
    console.error('Error:', result.error);
}
```

### 2. Save User Profile

```javascript
import { saveUserProfile } from '@/services/firestore.utils';

const result = await saveUserProfile(userId, {
    fullName: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    phone: '03001234567'
});

if (result.success) {
    console.log('Profile saved successfully');
} else {
    console.error('Error:', result.error);
}
```

### 3. Update User Profile

```javascript
import { updateUserProfile } from '@/services/firestore.utils';

const result = await updateUserProfile(userId, {
    phone: '03009876543',
    address: 'New Address'
});
```

### 4. Query Users by Role

```javascript
import { getUsersByRole } from '@/services/firestore.utils';

const result = await getUsersByRole('admin');

if (result.success) {
    const admins = result.data; // Array of admin users
}
```

### 5. Get All Documents from Collection

```javascript
import { getCollectionDocuments } from '@/services/firestore.utils';

const result = await getCollectionDocuments('projects');

if (result.success) {
    const projects = result.data;
}
```

### 6. Add Document to Collection

```javascript
import { addDocument } from '@/services/firestore.utils';

const result = await addDocument('projects', {
    name: 'New Project',
    status: 'active',
    budget: 50000
});

if (result.success) {
    console.log('New document ID:', result.id);
}
```

### 7. Update Document

```javascript
import { updateDocument } from '@/services/firestore.utils';

const result = await updateDocument('projects', 'projectId', {
    status: 'completed',
    budget: 55000
});
```

### 8. Delete Document

```javascript
import { deleteDocument } from '@/services/firestore.utils';

const result = await deleteDocument('projects', 'projectId');
```

### 9. Query by Field Value

```javascript
import { queryDocumentsByField } from '@/services/firestore.utils';

const result = await queryDocumentsByField('orders', 'status', 'pending');

if (result.success) {
    const pendingOrders = result.data;
}
```

### 10. Batch Write Operations

```javascript
import { batchWrite } from '@/services/firestore.utils';

const result = await batchWrite([
    {
        type: 'set',
        collection: 'users',
        docId: 'user1',
        data: { name: 'Alice' }
    },
    {
        type: 'update',
        collection: 'projects',
        docId: 'proj1',
        data: { status: 'active' }
    },
    {
        type: 'delete',
        collection: 'logs',
        docId: 'oldLog'
    }
]);
```

## Response Format

All functions return a consistent response object:

**Success Response:**
```javascript
{
    success: true,
    data: /* Fetched data or null */,
    id: /* New document ID for add operations */,
    error: null
}
```

**Error Response:**
```javascript
{
    success: false,
    data: null,
    id: null,
    error: 'Error message describing what went wrong'
}
```

## Best Practices

1. **Always check `result.success`** before accessing data
2. **Handle errors gracefully** with user-friendly messages
3. **Use try-catch** blocks when calling utility functions
4. **Log errors to console** for debugging
5. **Don't store sensitive data** in Firestore (passwords, tokens, etc.)

## Available Functions

| Function | Purpose |
|----------|---------|
| `fetchUserProfile(uid)` | Get user profile by UID |
| `saveUserProfile(uid, data)` | Create new user profile |
| `updateUserProfile(uid, updates)` | Update existing user profile |
| `deleteUserProfile(uid)` | Delete user profile |
| `getUsersByRole(role)` | Query users by role |
| `getAllUsers()` | Get all users |
| `addDocument(collection, data)` | Add document to any collection |
| `updateDocument(collection, docId, updates)` | Update document in any collection |
| `deleteDocument(collection, docId)` | Delete document from any collection |
| `getDocument(collection, docId)` | Get single document |
| `getCollectionDocuments(collection)` | Get all documents in collection |
| `queryDocumentsByField(collection, field, value)` | Query by field value |
| `batchWrite(operations)` | Perform multiple operations atomically |

## Auto-Generated Fields

These fields are automatically added/updated by utility functions:

- `createdAt`: Timestamp when document is created (never updated)
- `updatedAt`: Timestamp when document is created or updated

## Error Handling Example

```javascript
import { updateUserProfile } from '@/services/firestore.utils';
import { message } from 'antd';

const handleUpdate = async () => {
    try {
        const result = await updateUserProfile(userId, {
            email: newEmail
        });

        if (result.success) {
            message.success('Profile updated successfully!');
        } else {
            message.error(`Update failed: ${result.error}`);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        message.error('An unexpected error occurred');
    }
};
```

## Integration with Components

The utilities are designed to work seamlessly with React components:

```javascript
import { useEffect, useState } from 'react';
import { getAllUsers } from '@/services/firestore.utils';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            const result = await getAllUsers();
            if (result.success) {
                setUsers(result.data);
            }
            setLoading(false);
        };

        loadUsers();
    }, []);

    return (
        <div>
            {loading ? <p>Loading...</p> : <p>Found {users.length} users</p>}
        </div>
    );
};

export default UsersList;
```

## Migration Guide

To migrate existing code to use these utilities:

**Before:**
```javascript
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

const userData = await getDoc(doc(db, 'users', userId));
if (userData.exists()) {
    console.log(userData.data());
}
```

**After:**
```javascript
import { fetchUserProfile } from '@/services/firestore.utils';

const result = await fetchUserProfile(userId);
if (result.success) {
    console.log(result.data);
}
```

## Next Steps

- Replace direct Firestore imports in Dashboard components with utility functions
- Clean up commented code in old files
- Add Firestore Security Rules for production
- Set up Firestore indexing for optimal query performance
