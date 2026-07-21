import React from "react";
import { Check, X } from "lucide-react";

export interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "At least 1 uppercase letter", met: /[A-Z]/.test(password) },
    { label: "At least 1 number", met: /[0-9]/.test(password) },
    { label: "At least 1 special character", met: /[^a-zA-Z0-9]/.test(password) },
  ];

  const metCount = requirements.filter((r) => r.met).length;

  const getStrengthLabel = () => {
    if (!password) return { label: "", color: "bg-slate-700", text: "text-slate-400" };
    if (metCount <= 1) return { label: "Weak Passphrase", color: "bg-rose-500", text: "text-rose-400" };
    if (metCount === 2 || metCount === 3) return { label: "Fair Strength", color: "bg-amber-500", text: "text-amber-400" };
    return { label: "Strong Master Key", color: "bg-emerald-500", text: "text-emerald-400" };
  };

  const strength = getStrengthLabel();

  return (
    <div className="w-full space-y-2 mt-2">
      {/* Strength Bar */}
      {password && (
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Passphrase Security:</span>
            <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-full rounded-full transition-all duration-200 ${
                  step <= metCount ? strength.color : "bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-1.5 pt-1">
        {requirements.map((req, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-[11px]">
            {req.met ? (
              <Check className="h-3 w-3 text-emerald-400 shrink-0" />
            ) : (
              <X className="h-3 w-3 text-slate-500 shrink-0" />
            )}
            <span className={req.met ? "text-slate-300 font-medium" : "text-slate-500"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
