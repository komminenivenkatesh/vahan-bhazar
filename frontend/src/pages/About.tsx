import React from "react";
import "../App.css";
import Navbar from "../components/Navbar";


const About: React.FC = () => {
  return (
    <>
      <Navbar />

      <section className="about-section">
        <h2>About BikeZone</h2>
        <p className="about-intro">
          BikeZone is an online marketplace for buying and selling used
          motorcycles and scooters. It connects individual sellers with
          interested buyers through an easy-to-use web interface, powerful
          filters, and rich vehicle details.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <h3>Project Objectives</h3>
            <ul>
              <li>Provide a user-friendly platform for listing bikes.</li>
              <li>Allow buyers to filter bikes by engine capacity and price.</li>
              <li>Store bike details and images securely in MongoDB.</li>
              <li>Showcase live listings uploaded by real sellers.</li>
            </ul>
          </div>

          <div className="about-card">
            <h3>How It Works</h3>
            <ol>
              <li>Seller registers and uploads bike details with images.</li>
              <li>Data is stored in MongoDB through the Node.js backend.</li>
              <li>Buyers browse all active bikes on the Buyer page.</li>
              <li>Filters help buyers quickly find a suitable vehicle.</li>
            </ol>
          </div>

          <div className="about-card">
            <h3>Tech Stack</h3>
            <ul>
              <li><strong>Frontend:</strong> React, TypeScript, Vite, CSS</li>
              <li><strong>Backend:</strong> Node.js, Express.js</li>
              <li><strong>Database:</strong> MongoDB + Mongoose</li>
              <li><strong>Other:</strong> Multer for image uploads, REST APIs</li>
            </ul>
          </div>
        </div>

        <div className="about-footer">
          <p>
            This project can be extended with features like user
            authentication, booking test rides, chat between buyer and seller,
            and integration with payment gateways for advance booking.
          </p>
        </div>
       <h2 style={{ textAlign: "center", marginTop: "40px",color: "red" }}>Team Members</h2>

<div className="team-container">
  <div className="team-card">
    <div className="team-img">
      <img src="/images/IMG_20250901_154037.jpg" alt="Team Member 1" />

    </div>
    <h4>Technical Lead</h4>
    <h3>K.venkateswalu</h3>
    <ul>
      <li>Handled complete frontend in React + TypeScript</li>
      <li>Developed backend using Node.js & Express</li>
      <li>Integrated MongoDB & Image Uploads</li>
      <li>Designed and structured project architecture</li>
    </ul>
  </div>

  <div className="team-card">
    <div className="team-img">
      <img src="/images/akash.jpg" alt="Team Member 2" />
    </div>
    <h4>Documentation Specialist</h4>
    <h3>Akash</h3>
    <ul>
      <li>Prepared full project documentation</li>
      <li>Created SRS, ERD, UML diagrams</li>
      <li>Formatted final project report</li>
      <li>Ensured academic formatting & structure</li>
    </ul>
  </div>

  <div className="team-card">
    <div className="team-img">
      <img src="/images/maheh.jpg" alt="Team Member 3" />
    </div>
    <h4>Database & Research</h4>
    <h3>Mahesh</h3>
    <ul>
      <li>Collected specifications of bike dataset</li>
      <li>Organized data for MongoDB models</li>
      <li>Verified input data consistency</li>
      <li>Assisted in testing filter logic</li>
    </ul>
  </div>
</div>

      </section>
    </>
  );
};

export default About;
