import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "../App.css";
import Navbar from "../components/Navbar";

const commonIssues = [
  "I can't upload bike images",
  "My listing is not visible to buyers",
  "Filters are not working properly",
  "Unable to login / signup",
  "Problem with price or details shown",
];

const faqs = [
  {
    q: "How do I post my bike for sale?",
    a: "Go to the Sell Bike page, fill in the bike details, upload clear images, and submit the form. Your bike will be stored in the database and shown on the buyer pages.",
  },
  {
    q: "Why is my bike not visible to buyers?",
    a: "Sometimes it can take a short time to refresh data. Please make sure all required fields were filled correctly and images were uploaded successfully.",
  },
  {
    q: "Can I edit or delete my listing?",
    a: "In this version of the project, listings are created once. Editing/deleting can be added as a future enhancement with authentication.",
  },
  {
    q: "What should I do if I find a bug?",
    a: "Use the feedback form on this page, choose the 'Bug / Technical issue' category, and describe the problem in detail. Screenshots are also very helpful.",
  },
];

const Support: React.FC = () => {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [formMessage, setFormMessage] = useState("");
  // Chatbot state
  type Message = { id: number; sender: "user" | "bot"; text: string };
  const [messages, setMessages] = useState<Message[]>([
    { id: Date.now(), sender: "bot", text: "Hi! I can help with renting, selling, and payment issues. Ask me anything." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage("Thank you! Your issue has been recorded. We will look into it.");
    setMessage("");
    setSelectedIssue(null);
  };

  // Simple keyword-based bot response generator
  function generateBotResponse(userText: string) {
    const t = userText.toLowerCase();
    if (t.includes("rent") || t.includes("renting") || t.includes("hire")) {
      return (
        "To rent a vehicle: browse listings on the Home page, choose a vehicle,\n" +
        "click 'Rent' or 'Checkout', provide your rental dates and contact details, and complete payment.\n" +
        "If you need help with dates or documents, I can guide you further."
      );
    }
    if (t.includes("sell") || t.includes("listing") || t.includes("post")) {
      return (
        "To sell: go to the Seller page, click 'Create Listing', fill in accurate details and clear photos,\n" +
        "set a fair price, then submit. Your listing will appear for buyers. Need tips for good photos?"
      );
    }
    if (t.includes("payment") || t.includes("pay") || t.includes("checkout")) {
      return (
        "Payment issues: ensure your card details are correct and you have sufficient balance.\n" +
        "If a transaction failed, please check your bank/UPI app, then try again. If you still face problems, I can raise a ticket for support."
      );
    }
    // fallback
    return (
      "I can connect you to a human agent for more help. Would you like me to create a support ticket?"
    );
  }

  // Send message handler
  const sendMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    const userMsg: Message = { id: Date.now(), sender: "user", text };
    setMessages((m) => [...m, userMsg]);
    setChatInput("");

    // Mock async bot reply
    setTimeout(() => {
      const botText = generateBotResponse(text);
      const botMsg: Message = { id: Date.now() + 1, sender: "bot", text: botText };
      setMessages((m) => [...m, botMsg]);
    }, 600);
  };

  // Auto-scroll when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Navbar />

      <div ref={containerRef} style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: '#000000' }}>
        {/* Animated Background Orbs */}
        <motion.div
          style={{
            position: 'absolute',
            top: '12%',
            left: '6%',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0) 70%)',
            filter: 'blur(65px)',
            y: y1,
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            top: '38%',
            right: '8%',
            width: '520px',
            height: '520px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(192,192,192,0.12) 0%, rgba(192,192,192,0) 70%)',
            filter: 'blur(85px)',
            y: y2,
          }}
        />

        {/* Support Section */}
        <motion.section
          style={{
            padding: '120px clamp(1.5rem, 5vw, 4rem) 80px',
            position: 'relative',
            zIndex: 1
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 900,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #d4af37 0%, #c0c0c0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '24px',
              letterSpacing: '-0.03em'
            }}
          >
            Support & Help
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'rgba(241, 245, 249, 0.7)',
              textAlign: 'center',
              maxWidth: '700px',
              margin: '0 auto 60px',
              lineHeight: 1.6
            }}
          >
            Facing any issues with Vahan Bazar? We're here to help.
          </motion.p>

          {/* Common Issues */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              maxWidth: '900px',
              margin: '0 auto 60px',
              padding: '32px',
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(20, 184, 166, 0.2)',
              borderRadius: '20px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
          >
            <h3 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #d4af37 0%, #c0c0c0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Common Issues
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {commonIssues.map((issue) => (
                <motion.button
                  key={issue}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedIssue(issue)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: selectedIssue === issue ? 'none' : '1px solid rgba(20, 184, 166, 0.2)',
                    background: selectedIssue === issue 
                      ? 'linear-gradient(135deg, #d4af37, #c9a22e)' 
                      : 'rgba(20, 184, 166, 0.05)',
                    color: selectedIssue === issue ? '#fff' : 'rgba(241, 245, 249, 0.9)',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedIssue === issue ? '0 8px 24px rgba(20, 184, 166, 0.4)' : 'none'
                  }}
                >
                  {issue}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{
              maxWidth: '900px',
              margin: '0 auto 60px',
              padding: '40px',
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(20, 184, 166, 0.2)',
              borderRadius: '20px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
          >
            <h3 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #d4af37 0%, #c0c0c0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Submit Feedback
            </h3>
            <form onSubmit={handleSubmit}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or feedback..."
                required
                style={{
                  width: '100%',
                  minHeight: '150px',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  color: '#f1f5f9',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  marginBottom: '24px'
                }}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                style={{
                  padding: '14px 36px',
                  borderRadius: '999px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #d4af37, #c9a22e)',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 12px 32px rgba(20, 184, 166, 0.4)',
                  transition: 'all 0.3s ease'
                }}
              >
                Submit
              </motion.button>
            </form>
            {formMessage && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  marginTop: '20px',
                  color: '#d4af37',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                {formMessage}
              </motion.p>
            )}
          </motion.div>

          {/* AI Chatbot */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            style={{ maxWidth: '900px', margin: '0 auto 40px' }}
          >
            <div className="bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80 p-6 rounded-2xl shadow-lg border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-100">AI Assistant</h3>
                <p className="text-sm text-slate-400">Ask about renting, selling, or payments</p>
              </div>

              <div className="h-64 md:h-80 overflow-y-auto rounded-lg p-4 bg-slate-900/60 border border-slate-700" id="chat-window">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}> 
                    <div className={`${m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-100'} max-w-[80%] px-4 py-2 rounded-xl shadow-sm whitespace-pre-wrap`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="mt-4 flex gap-3">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Type a question, e.g. 'How to rent?'"
                  className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={sendMessage} className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow">Send</button>
              </div>
            </div>
          </motion.div>

          {/* FAQs */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              padding: '40px',
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(20, 184, 166, 0.2)',
              borderRadius: '20px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
          >
            <h3 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #d4af37 0%, #c0c0c0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Frequently Asked Questions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid rgba(20, 184, 166, 0.2)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setActiveFaqIndex(activeFaqIndex === index ? null : index)}
                >
                  <h4 style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#d4af37',
                    marginBottom: activeFaqIndex === index ? '12px' : '0'
                  }}>
                    {faq.q}
                  </h4>
                  {activeFaqIndex === index && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{
                        color: 'rgba(241, 245, 249, 0.8)',
                        fontSize: '0.95rem',
                        lineHeight: 1.6
                      }}
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>
      </div>
    </>
  );
};

export default Support;

