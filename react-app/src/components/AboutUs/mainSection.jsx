import React from "react";
import "../../styles/CombinedComponent.css"


export function CombinedComponent() {
  return (
    <div>
      {/* Main Component */}
      <div className="main_container">
        <div className="one">
          <div className="main_top_part">
            <div className="main_top_part_dot"><img src="/images/dots.PNG" alt="" /></div>
            <div className="top_part_images_part">
              <div className="images image1">
                <img src="/images/ifrah.jpg" alt="" />
              </div>
              <div className="images image2">
                <img src="/images/hassan.jpg" alt="" />
              </div>
              <div className="images image3">
                <img src="/images/haseeb1.jpg" alt="" />
              </div>
            </div>
            <div className="top_part_details">
              <h2>WHO ARE WE</h2>
              <p>
                At Health Navigator, we are committed to making healthcare
                information accessible, simple, and actionable for everyone. We
                understand that medical reports can be confusing, and finding the
                right doctor at the right time can be a challenge. That's why we
                built a smart, AI-powered platform to help you decode medical
                reports, track your health trends, and connect with the right
                healthcare professionals effortlessly.
              </p>
              <a href="#">Contact us</a>
            </div>
          </div>
        </div>
      </div>

      {/* MissionVision Component */}
      <div className="mission_vision_section">
        <div className="mission_vision_container">
          <div className="mission_vision_detail">
            <h3>MISSION AND VISION</h3>
            <p>
             Our mission is to simplify healthcare by making medical information accessible and understandable for everyone. We aim to empower individuals especially those without medical backgrounds—to take control of their health through innovative technology. By generating easy-to-read Smart Reports from complex liver function tests and hepatitis markers, we help users make informed decisions, track their health over time, and collaborate with doctors more effectively
              <br />
              <br />
            To become a leading digital health platform that transforms medical data into meaningful, personalized guidance — bridging the gap between healthcare and technology for a healthier tomorrow.
            </p>
          </div>

          <div className="mission_vision_image">
            <img src="/images/mission.png" alt="Mission" />
          </div>
        </div>

        {/* SVG Shape Divider */}
        <div className="custom-shape-divider-bottom-1742378795">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
        <div className=" mission_vision_heart_image"><img src="/images/heart1.png" alt="" /></div>
      </div>
      
    </div>
  );
}