import { useState } from "react";

export default function ManageLinkPage() {
    const [link, setLink] = useState("");
    const [status, setStatus] = useState(null);
    
    const handleCheckLink = async () => {
        // Logic to check and manage the link
        // This is a placeholder for actual implementation
        setStatus("Link checked successfully!");
    };
    return (
        <div>
            <h1>Zarządzaj swoim linkiem</h1>
            <input 
                type="text"
                placeholder="Wprowadź swój skrócony link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
            />
            <button onClick={handleCheckLink}>Sprawdź link</button>
            {status && <p>{status}</p>}
        </div>
    );
}