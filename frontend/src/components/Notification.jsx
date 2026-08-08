const styles = {
    created: {
        backgroundColor: "#d4edda",
        color: "#155724",
        border: "1px solid #c3e6cb"
    },
    edited: {
        backgroundColor: "#fff3cd",
        color: "#856404",
        border: "1px solid #ffeeba"
    },
    deleted: {
        backgroundColor: "#f8d7da",
        color: "#721c24",
        border: "1px solid #f5c6cb"
    }
};

function Notification({ notification }) {
    if (!notification) return null;

    return (
        <div
            style={{
                padding: "12px 16px",
                borderRadius: "6px",
                marginBottom: "20px",
                ...styles[notification.type]
            }}
        >
            {notification.message}
        </div>
    );
}

export default Notification;