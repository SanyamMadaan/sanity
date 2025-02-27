"use client";

import React, { useRef, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { motion } from "motion/react";

export default function FaqSection() {
  return (
    <>
      <motion.div
        className="container mx-auto px-4 py-20"
        viewport={{ once: true }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "easIn", duration: 0.5, delay: 0.2 }}
      >
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Need help with something? Here are some of the most common questions
            we get.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {faqsList.map((item, idx) => (
            <FaqsCard key={idx} idx={idx} faqsList={item} />
          ))}
        </div>
      </motion.div>
      <div className="flex justify-center items-center">
        <button
          className="px-8 py-2 rounded-full relative bg-black text-white text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600"
          onClick={() => window.scrollTo(0, 0)}
        >
          <span className="absolute inset-x-0 h-px w-1/2 mx-auto -bottom-px shadow-2xl  bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
          <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl  bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
          <span className="relative z-20">Scroll to top</span>
        </button>
      </div>
    </>
  );
}

const FaqsCard = ({ faqsList, idx }) => {
  const [isOpen, setIsOpen] = useState(false);
  const answerElRef = useRef();

  return (
    <div
      className="border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
      onClick={() => setIsOpen(!isOpen)}
    >
      <button
        className="w-full px-6 py-4 flex items-center justify-between text-left"
        arial-label="faq-btn"
      >
        <h3 className="font-semibold text-lg">{faqsList.title}</h3>
        <span className="text-primary">
          {isOpen ? <FaMinus /> : <FaPlus />}
        </span>
      </button>

      <div
        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "py-4" : "py-0 h-0"
        }`}
      >
        <p className="text-muted-foreground">{faqsList.content}</p>
      </div>
    </div>
  );
};

const faqsList = [
  {
    title: "What is Sanity Gaming",
    content:
      "Sanity Gaming is an emerging esports platform that focuses on delivering high-quality content, community engagement, and inclusive experiences for gamers and esports enthusiasts. Our mission is to foster a positive and mentally healthy gaming environment.",
  },
  {
    title: "What services does Sanity Gaming offer",
    content:
      "We provide a range of services, including esports highlights, gaming insights, community updates, game reviews, and live tournament coverage. Our goal is to connect gamers, enthusiasts, and organizers in a vibrant community.",
  },
  {
    title: "How is Sanity Gaming different from other esports platforms",
    content:
      "Sanity Gaming distinguishes itself by prioritizing inclusivity and mental well-being within the gaming community. We aim to create a space where every gamer feels welcome, regardless of their skill level.",
  },
  {
    title: "Is Sanity Gaming limited to a specific region or audience",
    content:
      "While we're an Indian-based company, our vision extends globally. We're dedicated to making a positive impact on the global esports community and welcome enthusiasts from around the world.",
  },
];
