import React from "react";
import { Fingerprint } from "lucide-react";
import { Button } from "../../../shared/components/ui/button";

export function SocialAuthButtons() {
  const handlePlaceholder = (provider: string) => {
    alert(`${provider} authentication is a placeholder for future backend integration.`);
  };

  return (
    <div className="space-y-3">
      <div className="relative flex items-center justify-center my-4">
        <div className="w-full border-t border-slate-800" />
        <span className="absolute bg-slate-900 px-3 text-[10px] uppercase font-semibold tracking-wider text-slate-500">
          Or continue with
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handlePlaceholder("Google")}
          className="w-full text-xs font-normal"
        >
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handlePlaceholder("Apple")}
          className="w-full text-xs font-normal"
        >
          Apple
        </Button>
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => handlePlaceholder("Passkey")}
        leftIcon={<Fingerprint className="h-4 w-4 text-emerald-400" />}
        className="w-full text-xs"
      >
        Sign in with Biometric Passkey
      </Button>
    </div>
  );
}
