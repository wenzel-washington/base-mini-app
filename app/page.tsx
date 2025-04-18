"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Name, Identity, Badge } from "@coinbase/onchainkit/identity";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { toast } from "react-hot-toast";

const SCHEMA_UID =
  "0x7889a09fb295b0a0c63a3d7903c4f00f7896cca4fa64d2c1313f8547390b7d39";

export default function App() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const { address } = useAccount();
  const [trackingUrl, setTrackingUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleGenerateLink = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate link");
      }

      setTrackingUrl(data.trackingUrl);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!trackingUrl) return;
    
    try {
      await navigator.clipboard.writeText(trackingUrl);
      toast.success("URL copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div className="flex flex-col min-h-screen sm:min-h-[820px] font-sans bg-black text-white items-center relative">
      <div className="w-screen max-w-[520px] p-0">
        <header className="w-full mb-8 py-4 px-6 border-b border-gray-700">
          <div className="flex justify-between items-center w-full">
            <div className="text-2xl font-bold">C</div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-4">
                <a href="#" className="hover:text-gray-400">ADVANTAGES</a>
                <a href="#" className="hover:text-gray-400">TOKENOMICS</a>
                <a href="#" className="hover:text-gray-400">ROADMAP</a>
                <a href="#" className="hover:text-gray-400">TEAM</a>
                <a href="#" className="hover:text-gray-400">BLOG</a>
                <a href="#" className="hover:text-gray-400">CONTACT</a>
              </nav>
              <ConnectWallet className="bg-[#f0d014] text-black rounded-lg font-semibold hover:bg-yellow-500 px-3 py-1" />
            </div>
          </div>
        </header>

        <main className="flex flex-col items-center space-y-6 px-4">
          <h1 className="text-2xl font-bold text-center text-white">
            Cryptaine Affiliate Link Generator
          </h1>
          
          <div className="w-full max-w-md space-y-4">
            <button
              onClick={handleGenerateLink}
              disabled={!address || isLoading}
              className="w-full py-3 px-4 bg-[#f0d014] text-black rounded-lg font-semibold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Generating..." : "Generate My Tracking Link"}
            </button>

            {trackingUrl && (
              <div className="space-y-2">
                <div className="p-4 bg-gray-800 rounded-lg break-all text-white">
                  {trackingUrl}
                </div>
                <button
                  onClick={handleCopyUrl}
                  className="w-full py-2 px-4 bg-[#f0d014] text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                >
                  Copy URL
                </button>
              </div>
            )}
          </div>
        </main>

        <footer className="absolute bottom-4 flex items-center w-screen max-w-[520px] justify-center">
          <button
            type="button"
            className="px-2 py-1 flex justify-start rounded-2xl font-semibold opacity-40 border border-white text-xs text-white"
            onClick={() => window.open("https://base.org/builders/minikit", "_blank")}
          >
            BUILT ON BASE WITH MINIKIT
          </button>
        </footer>
      </div>
    </div>
  );
}
