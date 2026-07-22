"use client";

import React, { useState } from "react";
import { HelpCenterComponent } from "@/features/support/components/HelpCenterComponent";
import { SupportPortalComponent } from "@/features/support/components/SupportPortalComponent";
import { HelpCircle, MessageSquare } from "lucide-react";

export default function SupportPage() {
  const [tab, setTab] = useState<"faq" | "contact">("faq");

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-8">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Declutr Support & Help Center</h1>
        <p className="text-muted-foreground mt-1">Search FAQs, developer documentation, or contact technical support</p>
      </div>

      <div className="flex border-b space-x-4">
        <button
          onClick={() => setTab("faq")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            tab === "faq" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <HelpCircle className="w-4 h-4" /> FAQs & Knowledge Base
        </button>
        <button
          onClick={() => setTab("contact")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            tab === "contact" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Submit Support Ticket
        </button>
      </div>

      <div>
        {tab === "faq" && <HelpCenterComponent />}
        {tab === "contact" && <SupportPortalComponent />}
      </div>
    </div>
  );
}
