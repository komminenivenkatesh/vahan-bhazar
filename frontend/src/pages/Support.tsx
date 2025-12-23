import React, { useState } from "react";
import "../App.css";
import Navbar from "../components/Navbar";

const commonIssues = [
  "I can’t upload bike images",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now just show message – later you can POST to backend
    setMessage("Thank you! Your issue has been recorded. We will look into it.");
  };

  return (
    <>
      <Navbar />

      <section className="support-section">
        <h2>Support & Feedback</h2>
        <p className="support-intro">
          Facing any problem with BikeZone? Tell us about it.  
          Choose a common issue or describe your problem in detail and we’ll use it
          to improve the system.
        </p>

        <div className="support-grid">
          {/* Left: quick issues + FAQ */}
          <div className="support-left">
            <h3>Common Issues</h3>
            <div className="support-issues">
              {commonIssues.map((issue) => (
                <button
                  key={issue}
                  type="button"
                  className={`issue-chip ${
                    selectedIssue === issue ? "active" : ""
                  }`}
                  onClick={() =>
                    setSelectedIssue((prev) => (prev === issue ? null : issue))
                  }
                >
                  {issue}
                </button>
              ))}
            </div>

            <h3 style={{ marginTop: "25px" }}>FAQ</h3>
            <div className="faq-list">
              {faqs.map((item, index) => (
                <div
                  key={item.q}
                  className={`faq-item ${
                    activeFaqIndex === index ? "open" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() =>
                      setActiveFaqIndex(
                        activeFaqIndex === index ? null : index
                      )
                    }
                  >
                    {item.q}
                    <span>{activeFaqIndex === index ? "-" : "+"}</span>
                  </button>
                  {activeFaqIndex === index && (
                    <p className="faq-answer">{item.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: feedback / complaint form */}
          <div className="support-right">
            <h3>Submit a Complaint / Feedback</h3>
            <form className="support-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  className="support-input"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  className="support-input"
                />
              </div>

              <div className="form-row">
                <select className="support-input" required>
                  <option value="">Select issue type</option>
                  <option value="bug">Bug / Technical issue</option>
                  <option value="listing">Listing / Bike issue</option>
                  <option value="account">Login / Account issue</option>
                  <option value="feedback">General feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Subject"
                className="support-input"
                defaultValue={selectedIssue || ""}
                required
              />

              <textarea
                rows={5}
                className="support-textarea"
                placeholder="Describe the issue in detail..."
                required
              />

              <div className="form-row checkbox-row">
                <label>
                  <input type="checkbox" required /> I confirm that the above
                  information is correct.
                </label>
              </div>

              <button type="submit" className="btn">
                Submit Issue
              </button>

              {message && <p className="support-success">{message}</p>}
            </form>

            <div className="support-contact">
              <h4>Contact</h4>
              <p>Email: VahanBazar045@gmail.com </p>
              <p>Support timings: 9:00 AM – 6:00 PM (Mon–Fri)</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Support;
