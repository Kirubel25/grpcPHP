import React, { useState } from 'react';
import { PingServiceClient } from '../generated/service_grpc_web_pb';
import { PingRequest } from '../generated/service_pb';

const client = new PingServiceClient('http://localhost:8080');

const PingForm = () => {
    const [url, setUrl] = useState('');
    const [pingResult, setPingResult] = useState(null);

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };

    const handlePing = async (e) => {
        e.preventDefault();
        const request = new PingRequest();
        request.setUrl(url);
        try {
            const response = await client.pingUrl(request, {});
            setPingResult({
                status: response.getStatus(),
                createdAt: response.getCreatedAt().toDate().toString(),
            });
        } catch (error) {
            console.error('Error pinging:', error);
            setPingResult(null);
        }
    };

    return (
        <div>
            <form onSubmit={handlePing}>
                <label>
                    URL:
                    <input type="text" value={url} onChange={handleUrlChange} />
                </label>
                <button type="submit">Ping</button>
            </form>
            {pingResult && (
                <div>
                    <p>Status: {pingResult.status}</p>
                    <p>Created At: {pingResult.createdAt}</p>
                </div>
            )}
        </div>
    );
};

export default PingForm;
