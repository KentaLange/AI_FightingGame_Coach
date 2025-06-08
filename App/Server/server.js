const payload = {
    "input_value": "hello world!",
    "output_type": "chat",
    "input_type": "chat",
    // Optional: Use session tracking if needed
    "session_id": "user_1"
};

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
};

fetch('http://127.0.0.1:7860/api/v1/run/3c79f16f-713f-465f-bdf4-ed80f46e0f30', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
    