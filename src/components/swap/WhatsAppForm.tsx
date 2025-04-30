import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const WhatsAppForm = () => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate phone number
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number with country code",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent!",
        description: "We'll contact you shortly on WhatsApp to arrange your swap.",
      });

      // Format phone number for WhatsApp
      const formattedPhone = phone.startsWith("+") ? phone.substring(1) : phone;
      const encodedMessage = encodeURIComponent(
        `Hello, my name is ${name}. ${message}`
      );

      // Open WhatsApp with pre-filled message
      window.open(
        `https://wa.me/${formattedPhone}?text=${encodedMessage}`,
        "_blank"
      );

      // Reset form
      setPhone("");
      setName("");
      setMessage("");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">WhatsApp Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">Include country code</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Tell us about the items you want to swap (how many, types, brands, etc.)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />
      </div>

      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md hover:shadow-lg transition-all w-full md:w-auto"
        >
          {isSubmitting ? "Sending..." : "Connect on WhatsApp"}
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground mt-4">
        <p>
          By connecting, you agree to receive WhatsApp messages from our team about your swap request.
        </p>
      </div>
    </form>
  );
};

export default WhatsAppForm;
