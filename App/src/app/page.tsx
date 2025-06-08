//import "./App.css";
//import { gzip } from "zlib";
import { LangflowClient } from "@datastax/langflow-client";

function App() {
  const flowID = "3c79f16f-713f-465f-bdf4-ed80f46e0f30";
  const apiKey = process.env.LANGFLOW_API_KEY;
  const client = new LangflowClient({ flowID, apiKey });
  const flow = client.flow(flowID);

  async function runFlow() {
    const result = await flow.run("Hello");
    console.log(result.chatOutputText());
  }
  const payload = {
    input_value: "hello world!",
    output_type: "chat",
    input_type: "chat",
    // Optional: Use session tracking if needed
    session_id: "user_1",
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  fetch(
    "http://127.0.0.1:7860/api/v1/run/216049c0-47a8-44c3-8829-b7a65c61a78c",
    options,
  )
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
  return (
    <div>
      <head>
        <title>Street Fighter 6 Q&A</title>
      </head>

      <h1>Ask me anything about Street Fighter 6!</h1>
      <input type="text" runFlow={runFlow} />
    </div>
  );
}

export default App;
