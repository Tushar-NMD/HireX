import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function TrainAI() {
  const [documents, setDocuments] = useState([{ title: "", text: "" }]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ documentCount: 0, status: 'empty' });
  const [loadingStatus, setLoadingStatus] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jobportal_token");
    if (!token) {
      navigate("/auth");
    }
    fetchStatus();
  }, [navigate]);

  const fetchStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch("http://localhost:5000/api/chat/status");
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.error("Failed to fetch status:", err);
    }
    setLoadingStatus(false);
  };

  const addDocumentField = () => {
    setDocuments([...documents, { title: "", text: "" }]);
  };

  const removeDocumentField = (index) => {
    const newDocs = documents.filter((_, i) => i !== index);
    setDocuments(newDocs.length > 0 ? newDocs : [{ title: "", text: "" }]);
  };

  const updateDocument = (index, field, value) => {
    const newDocs = [...documents];
    newDocs[index][field] = value;
    setDocuments(newDocs);
  };

  const handleTrain = async () => {
    const validDocs = documents.filter(doc => doc.title.trim() && doc.text.trim());
    
    if (validDocs.length === 0) {
      toast.error("Please add at least one document with title and text");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("jobportal_token");

      const res = await fetch("http://localhost:5000/api/train", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ documents: validDocs }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`✅ Successfully trained ${data.count} document(s)`);
        setDocuments([{ title: "", text: "" }]);
        fetchStatus();
      } else {
        toast.error(data.message || "❌ Training failed");
      }
    } catch (err) {
      toast.error("❌ Server error. Make sure ChromaDB is running.");
      console.error(err);
    }

    setLoading(false);
  };

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to clear all trained documents?")) {
      return;
    }

    try {
      const token = localStorage.getItem("jobportal_token");

      const res = await fetch("http://localhost:5000/api/train/clear", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ All documents cleared");
        fetchStatus();
      } else {
        toast.error(data.message || "❌ Failed to clear");
      }
    } catch (err) {
      toast.error("❌ Server error");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Train AI Assistant</h2>
        <p className="text-gray-600 mb-4">
          Add documents to train the AI chatbot. Users can then ask questions about jobs, salaries, requirements, etc.
        </p>

        {/* Status Card */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">RAG Status</p>
              <p className="text-2xl font-bold text-purple-700">
                {loadingStatus ? "Loading..." : `${status.documentCount} Documents`}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {status.status === 'empty' ? 'No documents trained yet' : 'AI is trained and ready'}
              </p>
            </div>
            <button
              onClick={fetchStatus}
              className="px-3 py-1 text-sm bg-white border border-purple-200 rounded hover:bg-purple-50 transition"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Document Input Fields */}
      <div className="space-y-4 mb-4">
        {documents.map((doc, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">Document {index + 1}</h3>
              {documents.length > 1 && (
                <button
                  onClick={() => removeDocumentField(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  ✕ Remove
                </button>
              )}
            </div>
            
            <input
              className="w-full border border-gray-300 rounded p-3 mb-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Document Title (e.g., Software Engineer Job Info)"
              value={doc.title}
              onChange={(e) => updateDocument(index, 'title', e.target.value)}
            />

            <textarea
              className="w-full border border-gray-300 rounded p-3 h-32 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Document Content (e.g., Job requirements, salary range, company info, application process...)"
              value={doc.text}
              onChange={(e) => updateDocument(index, 'text', e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={addDocumentField}
          className="px-4 py-2 border-2 border-purple-500 text-purple-600 rounded hover:bg-purple-50 transition font-medium"
        >
          + Add Another Document
        </button>

        <button
          onClick={handleTrain}
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded hover:from-purple-700 hover:to-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "⏳ Training..." : "🚀 Train AI"}
        </button>

        {status.documentCount > 0 && (
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition font-medium"
          >
            🗑️ Clear All
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for Training:</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Add job descriptions, requirements, salary info, and company details</li>
          <li>Include FAQs about the application process</li>
          <li>Each document should focus on a specific topic or job</li>
          <li>The AI will use these documents to answer user questions</li>
          <li>You can train multiple documents at once</li>
        </ul>
      </div>

      {/* ChromaDB Status */}
     
    </div>
  );
}