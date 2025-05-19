import React from 'react';
import { Facebook, Linkedin, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white py-12 px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Contact Section */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Contact</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span>123 Road, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center">
                <div className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span>+8801701076700</span>
              </div>
              <div className="flex items-center">
                <div className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>sajiburdemo121@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Quick Links</h2>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-blue-200 transition duration-300">Home</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 transition duration-300">About</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 transition duration-300">Services</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 transition duration-300">Careers</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 transition duration-300">Contact</a>
              </li>
            </ul>
          </div>

          {/* Services Section */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Services</h2>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-blue-200 transition duration-300">Medical</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 transition duration-300">Operation</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 transition duration-300">Laboratory</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 transition duration-300">ICU</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 transition duration-300">Patient Ward</a>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Social Media</h2>
            <div className="flex space-x-4">
              <a href="#" className="bg-white p-2 rounded-full text-blue-800 hover:bg-blue-200 transition duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-white p-2 rounded-full text-blue-800 hover:bg-blue-200 transition duration-300">
                <Linkedin size={20} />
              </a>
              <a href="#" className="bg-white p-2 rounded-full text-blue-800 hover:bg-blue-200 transition duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-white p-2 rounded-full text-blue-800 hover:bg-blue-200 transition duration-300">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-8 border-blue-700" />
      </div>
    </footer>
  );
};

export default Footer;