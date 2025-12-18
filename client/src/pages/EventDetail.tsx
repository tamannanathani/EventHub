import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { eventsApi, bookingsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import BookingSuccess from '@/components/BookingSuccess';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MapPin, Users, DollarSign, Loader2, Minus, Plus, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    quantity: 1,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventsApi.getById(id);
        setEvent(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load event details',
          variant: 'destructive',
        });
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const isEventCreatorAdmin = (() => {
    if (!user || !event) return false;
    const isAdmin = user.role === 'admin';
    const createdById = typeof event.createdBy === 'object' ? event.createdBy?._id : event.createdBy;
    return isAdmin && createdById && user._id && createdById === user._id;
  })();

  const handleQuantityChange = (delta) => {
    const newQty = formData.quantity + delta;
    if (newQty >= 1 && newQty <= Math.min(10, event?.availableSeats || 1)) {
      setFormData({ ...formData, quantity: newQty });
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to book tickets',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (isEventCreatorAdmin) {
      toast({
        title: 'Not Allowed',
        description: 'Admins cannot book tickets for events they created.',
        variant: 'destructive',
      });
      return;
    }

    setBooking(true);
    try {
      const bookingData = {
        eventId: id,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        quantity: formData.quantity,
      };

      const result = await bookingsApi.create(bookingData);
      setBookingSuccess({
        booking: result.booking,
        event: event,
      });
    } catch (error) {
      toast({
        title: 'Booking Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return <BookingSuccess data={bookingSuccess} />;
  }

  const formattedDate = event?.date ? format(new Date(event.date), 'EEEE, MMMM dd, yyyy') : 'TBD';
  const formattedTime = event?.date ? format(new Date(event.date), 'h:mm a') : '';
  const totalPrice = (event?.price || 0) * formData.quantity;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-28 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/events')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <div className="rounded-3xl overflow-hidden mb-6">
                <img
                  src={event?.img || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                  alt={event?.title}
                  className="w-full h-80 object-cover"
                />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{event?.title}</h1>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm">{formattedDate} • {formattedTime}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">{event?.location}</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-2">About This Event</h3>
                <p className="text-muted-foreground">{event?.description}</p>
              </div>
            </motion.div>

            {/* Booking Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-card rounded-3xl p-6 border border-border sticky top-28">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold">${event?.price}</span>
                    <span className="text-muted-foreground"> / ticket</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{event?.availableSeats} left</span>
                  </div>
                </div>

                {isEventCreatorAdmin && (
                  <div className="mb-4 text-sm text-muted-foreground">
                    You are the admin of this event. Booking is disabled.
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {!showBookingForm ? (
                    <motion.div
                      key="button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Button
                        onClick={() => setShowBookingForm(true)}
                        disabled={event?.availableSeats === 0 || isEventCreatorAdmin}
                        className="w-full gradient-primary text-primary-foreground py-6 text-lg"
                      >
                        {event?.availableSeats === 0
                          ? 'Sold Out'
                          : isEventCreatorAdmin
                          ? 'Booking Disabled'
                          : 'Book Now'}
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleBooking}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="mobile">Mobile</Label>
                        <Input
                          id="mobile"
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>Quantity</Label>
                        <div className="flex items-center gap-4 mt-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={formData.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-xl font-semibold w-8 text-center">
                            {formData.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(1)}
                            disabled={formData.quantity >= Math.min(10, event?.availableSeats)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-muted-foreground">Total</span>
                          <span className="text-2xl font-bold">${totalPrice.toFixed(2)}</span>
                        </div>

                        <Button
                          type="submit"
                          disabled={booking}
                          className="w-full gradient-primary text-primary-foreground py-6"
                        >
                          {booking ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <DollarSign className="w-4 h-4 mr-2" />
                              Complete Booking
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetail;
