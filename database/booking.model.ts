import { Schema, model, models, Document, Types } from 'mongoose';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          // RFC 5322 simplified email validation regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Pre-save hook to validate that the referenced event exists
BookingSchema.pre('save', async function (next) {
  // Only validate eventId if it's new or has been modified
  if (this.isNew || this.isModified('eventId')) {
    try {
      // Dynamically import Event model to avoid circular dependency
      const Event = models.Event || (await import('./event.model')).default;
      
      // Check if the event exists in the database
      const eventExists = await Event.exists({ _id: this.eventId });
      
      if (!eventExists) {
        return next(new Error('Referenced event does not exist'));
      }
    } catch (error) {
      return next(
        error instanceof Error ? error : new Error('Failed to validate event reference')
      );
    }
  }

  next();
});

// Create index on eventId for faster queries when fetching bookings by event
BookingSchema.index({ eventId: 1 });

// Composite index for finding bookings by event and email (useful for duplicate prevention)
BookingSchema.index({ eventId: 1, email: 1 });

// Export model, reusing existing model in development to prevent recompilation errors
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
