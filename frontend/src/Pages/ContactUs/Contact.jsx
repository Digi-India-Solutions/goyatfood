import React, { useEffect, useState } from "react";
import "./contact.css";
import call from "../../images/call.gif";
import address from "../../images/address.gif";
import email from "../../images/email.gif";
import time from "../../images/time.gif";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import Swal from "sweetalert2";
const Contact = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    number: "",
    subject: "",
    message: "",
  });

  const getInputData = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const postData = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://api.goyattrading.shop/api/send-enquery",
        data
      );
      if (res.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Your enquiry has been sent successfully.",
          icon: "success",
          confirmButtonText: "Ok",
        });
        setData({
          name: "",
          email: "",
          number: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "There was an issue sending your enquiry.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);
  return (
    <>
      <Helmet>
        <title>Contact Us | Goyat Wala</title>
        <meta
          name="description"
          content="Get in touch with us through phone, email, or by filling out the contact form on our website. We are here to assist you with any inquiries."
        />
        <meta
          name="keywords"
          content="contact, support, phone, email, contact form, inquiries, customer service"
        />
        <meta property="og:title" content="Contact Us | Your Company Name" />
        <meta
          property="og:description"
          content="Get in touch with us through phone, email, or by filling out the contact form on our website."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://https://api.goyattrading.shop/" />
        <meta property="og:image" content="https://https://api.goyattrading.shop//" />
        <link rel="canonical" href="https://https://api.goyattrading.shop/" />
      </Helmet>

      <section className="breadcrumb">
        <div className="breadcrumb-overlay">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6 col-6">
                <a
                  href="/"
                  className="back-icon text-decoration-none text-white d-flex align-items-center gap-2"
                >
                  <i className="bi bi-arrow-left"></i> Back to category
                </a>
              </div>
              <div className="col-md-6 col-6 text-end">
                <div className="breadcrumb-nav text-white d-flex align-items-center justify-content-end gap-2">
                  <Link className="text-white" to="/">
                    <i className="bi bi-house"></i>
                  </Link>
                  /
                  <Link className="text-white terms-link" to="/about-us">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
            <h1 className="text-white mt-3">Contact Us</h1>
            <p className="contact-bread-desc">
              We’re here to help! Reach out to us via phone, email, or by
              filling out the form below. Our team will get back to you as soon
              as possible.
            </p>
          </div>
        </div>
      </section>
      <section className="contactUs">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mt-4">
              <h1 className="mb-4 text-center">Contact Information</h1>
              <div className="row">
                {/* Telephone */}
                <div className="col-12 mb-4">
                  <div className="contact-detail-card">
                    <div className="d-flex align-items-center">
                      <img
                        src={call}
                        alt="call icon"
                        className="contact-icon"
                      />
                      <h5 className="mb-0 ml-3">
                        <b>Telephone</b>
                      </h5>
                    </div>
                    <a href="tel:+91 8283863884" className="contact-link">
                      +91 8283863884
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="col-12 mb-4">
                  <div className="contact-detail-card">
                    <div className="d-flex align-items-center">
                      <img
                        src={address}
                        alt="address icon"
                        className="contact-icon"
                      />
                      <h5 className="mb-0 ml-3">
                        <b>Address</b>
                      </h5>
                    </div>
                    <address className="contact-address">
                      GROUND FLOOR, SCO NO. 20, Goyat trading co., VASANT VIHAR
                      PHASE NO. 1, HIMMATGARH DHAKOLI, ZIRAKPUR, SAS NAGAR
                      MOHALI, SAS Nagar, Punjab,
                    </address>
                  </div>
                </div>

                {/* Email */}
                <div className="col-12 mb-4">
                  <div className="contact-detail-card">
                    <div className="d-flex align-items-center">
                      <img
                        src={email}
                        alt="email icon"
                        className="contact-icon"
                      />
                      <h5 className="mb-0 ml-3">
                        <b>Email</b>
                      </h5>
                    </div>
                    <a
                      href="mailto:dryfruit9006@gmail.com"
                      className="contact-link"
                    >
                      dryfruit9006@gmail.com
                    </a>
                  </div>
                </div>

                {/* Order Time */}
                <div className="col-12 mb-4">
                  <div className="contact-detail-card">
                    <div className="d-flex align-items-center">
                      <img
                        src={time}
                        alt="time icon"
                        className="contact-icon"
                      />
                      <h5 className="mb-0 ml-3">
                        <b>Order Time</b>
                      </h5>
                    </div>
                    <p className="mb-0">We're open 7 days a week</p>
                    <p className="mb-0">Enquiries Timing: 8 AM to 8 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="contactForm">
                <h1 className="text-center">Contact Form</h1>
                <p className="text-center">
                  For all enquiries, please email us using the contact form
                  below
                </p>
                <form onSubmit={postData}>
                  <div className="contact-form-field">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={data.name}
                      placeholder="Full Name"
                      required
                      onChange={getInputData}
                    />
                  </div>
                  <div className="contact-form-field">
                    <label htmlFor="name">Your Number</label>
                    <input
                      type="number"
                      name="number"
                      value={data.number}
                      placeholder="Phone Number"
                      required
                      onChange={getInputData}
                    />
                  </div>
                  <div className="contact-form-field">
                    <label htmlFor="email">E-Mail Address</label>
                    <input
                      type="email"
                      name="email"
                      value={data.email}
                      placeholder="Email"
                      required
                      onChange={getInputData}
                    />
                  </div>
                  <div className="contact-form-field">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={data.subject}
                      placeholder="Subject"
                      required
                      onChange={getInputData}
                    />
                  </div>
                  <div className="contact-form-field">
                    <label htmlFor="subject">Message</label>
                    <textarea
                      name="message"
                      id=""
                      value={data.message}
                      placeholder="Message"
                      required
                      onChange={getInputData}
                    ></textarea>
                  </div>
                  <div className="contact-form-field text-center">
                    <button>Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="maps">
        {/* <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2765.9079054964377!2d77.14475329999999!3d28.7035767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03d46919ea3f%3A0xaa6401ab18b40e9b!2sKP-135%2C%20Block%20KP%2C%20Poorvi%20Pitampura%2C%20Pitampura%2C%20Delhi%2C%20110034!5e1!3m2!1sen!2sin!4v1733990640149!5m2!1sen!2sin"
          style={{ border: "0", width: "100%", height: "450px" }}
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe> */}

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1774560.2060359563!2d75.47767964925201!3d29.69257998701897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x390d07440faeeedd%3A0x7fd3b4b030819bdf!2sDigi%20India%20Solutions%2C%20Shop%20No.12%2C%20Sec%2024%2C%20Pocket-%2026%2C%20Rohini%2C%20New%20Delhi%2C%20Delhi%20110085%2C%20India!3m2!1d28.7307669!2d77.0866757!4m5!1s0x390f9500355b46ad%3A0xd23ef8ee58ea8e2c!2sVasant%20Vihar%2C%20Vasant%20Vihar%20Phase%201%2C%20Dhakoli%2C%20Zirakpur%2C%20Punjab!3m2!1d30.656646199999997!2d76.83743129999999!5e0!3m2!1sen!2sin!4v1746874178092!5m2!1sen!2sin"
          style={{ border: "0", width: "100%", height: "450px" }}
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </>
  );
};

export default Contact;
