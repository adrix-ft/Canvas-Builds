import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAppContext } from "./AppContext";

export const LegalModal = () => {
  const { legalModal, setLegalModal } = useAppContext();
  
  if (!legalModal) return null;
  
  const content = {
    privacy: {
      title: "Privacy Policy",
      date: "Last updated: August 2026",
      sections: [
        {
          heading: "1. Information We Collect",
          text: "We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.",
        },
        {
          heading: "2. How We Use Information",
          text: "We use the information we collect about you to provide, maintain, and improve our services. This includes using the information to: process and facilitate payments, send receipts, provide products and services you request, develop new features, provide customer support, and authenticate users.",
        },
        {
          heading: "3. Sharing of Information",
          text: "We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows: with vendors, consultants, marketing partners, and other service providers who need access to such information to carry out work on our behalf.",
        },
        {
          heading: "4. Data Security",
          text: "We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.",
        },
        {
          heading: "5. Contact Us",
          text: "If you have any questions about this Privacy Statement, please contact us at privacy@adarshcr8.com.",
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      date: "Last updated: August 2026",
      sections: [
        {
          heading: "1. Acceptance of Terms",
          text: "By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.",
        },
        {
          heading: "2. Description of Service",
          text: "Canvas Builds provides a platform for creators to discover and use premium templates, designs, and digital assets. We reserve the right to modify, suspend, or discontinue the service at any time without notice.",
        },
        {
          heading: "3. User Responsibilities",
          text: "You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password, whether your password is with our service or a third-party service.",
        },
        {
          heading: "4. Intellectual Property",
          text: "The service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Canvas Builds and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Canvas Builds.",
        },
        {
          heading: "5. Termination",
          text: "We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.",
        },
      ],
    },
  };
  
  const currentContent = content[legalModal];
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLegalModal(null)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[var(--color-bg-primary)] rounded-[2rem] border border-[var(--color-text-primary)]/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          <div className="flex items-center justify-between p-6 border-b border-[var(--color-text-primary)]/10">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[var(--color-text-primary)] tracking-tight">
                {currentContent.title}
              </h2>
              <p className="text-[var(--color-text-primary)]/60 text-sm mt-1">
                {currentContent.date}
              </p>
            </div>
            <button
              onClick={() => setLegalModal(null)}
              className="p-2 bg-[var(--color-text-primary)]/5 hover:bg-[var(--color-text-primary)]/10 rounded-full text-[var(--color-text-primary)]/70 hover:text-[var(--color-text-primary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              {currentContent.sections.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                    {section.heading}
                  </h3>
                  <p className="text-[var(--color-text-primary)]/80 text-sm sm:text-base leading-relaxed">
                    {section.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 border-t border-[var(--color-text-primary)]/10 bg-[var(--color-text-primary)]/5 flex justify-end">
            <button
              onClick={() => setLegalModal(null)}
              className="px-6 py-2.5 bg-[var(--color-accent-pink)] hover:bg-[var(--color-accent-purple)] text-white rounded-xl font-medium transition-colors shadow-md"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};