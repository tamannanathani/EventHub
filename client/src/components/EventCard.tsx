import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface EventCardProps {
  event: any;
  showActions?: boolean;
  onEdit?: (event: any) => void;
  onDelete?: (id: string) => void;
}

const EventCard = ({ event, showActions = false, onEdit, onDelete }: EventCardProps) => {
  const formattedDate = event.date ? format(new Date(event.date), 'MMM dd, yyyy') : 'TBD';
  const formattedTime = event.date ? format(new Date(event.date), 'h:mm a') : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.img || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-sm font-semibold">
          ${event.price}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">{event.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{formattedDate} • {formattedTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span>{event.availableSeats} / {event.totalSeats} seats available</span>
          </div>
        </div>

        {showActions ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(event)}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" className="flex-1" onClick={() => onDelete(event._id)}>
              Delete
            </Button>
          </div>
        ) : (
          <Link to={`/events/${event._id}`}>
            <Button className="w-full gradient-primary text-primary-foreground">
              View Details
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;
