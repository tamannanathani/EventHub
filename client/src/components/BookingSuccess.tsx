import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Download, Ticket, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const BookingSuccess = ({ data }) => {
  const navigate = useNavigate();
  const qrRef = useRef(null);
  const { booking, event } = data;

  useEffect(() => {
    // Fire confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f97316'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f97316'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const downloadTicket = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    canvas.width = 400;
    canvas.height = 600;

    img.onload = () => {
      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 100);
      gradient.addColorStop(0, '#6366f1');
      gradient.addColorStop(1, '#8b5cf6');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, 100);

      // Header text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('EventHub Ticket', canvas.width / 2, 60);

      // Event name
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(event.title, canvas.width / 2, 140);

      // Event details
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px Arial';
      ctx.fillText(format(new Date(event.date), 'MMM dd, yyyy • h:mm a'), canvas.width / 2, 170);
      ctx.fillText(event.location, canvas.width / 2, 195);

      // QR Code
      ctx.drawImage(img, 100, 220, 200, 200);

      // Booking details
      ctx.fillStyle = '#1f2937';
      ctx.font = '14px Arial';
      ctx.fillText(`Name: ${booking.name}`, canvas.width / 2, 460);
      ctx.fillText(`Qty: ${booking.quantity} ticket(s)`, canvas.width / 2, 485);
      ctx.fillText(`Total: $${booking.totalAmount}`, canvas.width / 2, 510);
      ctx.fillText(`Booking ID: ${booking._id.slice(-8).toUpperCase()}`, canvas.width / 2, 550);

      // Download
      const link = document.createElement('a');
      link.download = `ticket-${booking._id.slice(-8)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const qrData = JSON.stringify({
    bookingId: booking._id,
    eventId: event._id,
    name: booking.name,
    quantity: booking.quantity,
  });

  const formattedDate = event?.date ? format(new Date(event.date), 'EEEE, MMMM dd, yyyy') : 'TBD';
  const formattedTime = event?.date ? format(new Date(event.date), 'h:mm a') : '';

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-2xl">
          {/* Success Header */}
          <div className="gradient-primary p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary-foreground/20 flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <h1 className="text-2xl font-bold text-primary-foreground mb-2">Booking Confirmed!</h1>
            <p className="text-primary-foreground/80">Your tickets are ready</p>
          </div>

          {/* Ticket Details */}
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">{event.title}</h2>
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formattedDate} • {formattedTime}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{event.location}</span>
              </div>
            </div>

            {/* QR Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              ref={qrRef}
              className="flex justify-center mb-6"
            >
              <div className="p-4 bg-white rounded-2xl">
                <QRCodeSVG
                  value={qrData}
                  size={180}
                  level="H"
                  includeMargin
                />
              </div>
            </motion.div>

            {/* Booking Info */}
            <div className="space-y-3 p-4 rounded-xl bg-secondary mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{booking.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-medium">{booking.quantity} ticket(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="font-bold text-primary">${booking.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-mono text-sm">{booking._id.slice(-8).toUpperCase()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={downloadTicket}
                className="w-full gradient-primary text-primary-foreground py-6"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Ticket
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/events')}
                className="w-full py-6"
              >
                <Ticket className="w-4 h-4 mr-2" />
                Browse More Events
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingSuccess;
