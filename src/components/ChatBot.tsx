import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send } from "lucide-react";
import { Card } from "@/components/ui/card";

const ChatBot = () => {
  useEffect(() => {
    const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "hpGj-8tjCpldUTzB56dJy";
        document.body.appendChild(script)
  }, []);

  if (!open) return null;

  return (
    <div>
    </div>
  );
};

export default ChatBot;
