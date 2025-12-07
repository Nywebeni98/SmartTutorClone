import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertAppointmentSchema, insertAvailabilitySchema, insertTutorProfileSchema, insertBookingPaymentSchema, passwordSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.status(201).json({
        success: true,
        message: "Contact form submitted successfully",
        id: submission.id,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationError.message,
        });
      }
      console.error("Error submitting contact form:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  app.get("/api/contact/submissions", async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  // Appointment booking endpoints
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json({
        success: true,
        message: "Appointment booked successfully",
        id: appointment.id,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationError.message,
        });
      }
      console.error("Error booking appointment:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  app.patch("/api/appointments/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const appointment = await storage.updateAppointmentStatus(id, status);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }
      res.json({
        success: true,
        message: "Appointment status updated",
        appointment,
      });
    } catch (error) {
      console.error("Error updating appointment status:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  // Availability management endpoints
  app.post("/api/availability", async (req, res) => {
    try {
      const validatedData = insertAvailabilitySchema.parse(req.body);
      const availability = await storage.createAvailability(validatedData);
      res.status(201).json({
        success: true,
        message: "Availability added successfully",
        id: availability.id,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationError.message,
        });
      }
      console.error("Error adding availability:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  app.get("/api/availability", async (req, res) => {
    try {
      const availabilities = await storage.getAllAvailabilities();
      res.json(availabilities);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  app.delete("/api/availability/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteAvailability(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Availability not found",
        });
      }
      res.json({
        success: true,
        message: "Availability deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting availability:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  // Get availability by tutor ID
  app.get("/api/availability/tutor/:tutorId", async (req, res) => {
    try {
      const { tutorId } = req.params;
      const availabilities = await storage.getAvailabilitiesByTutor(tutorId);
      res.json(availabilities);
    } catch (error) {
      console.error("Error fetching tutor availabilities:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  // Update availability
  app.patch("/api/availability/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const availability = await storage.updateAvailability(id, req.body);
      if (!availability) {
        return res.status(404).json({
          success: false,
          message: "Availability not found",
        });
      }
      res.json({
        success: true,
        message: "Availability updated successfully",
        availability,
      });
    } catch (error) {
      console.error("Error updating availability:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  // Tutor profile endpoints
  app.post("/api/tutor-profiles", async (req, res) => {
    try {
      const validatedData = insertTutorProfileSchema.parse(req.body);
      const profile = await storage.createTutorProfile(validatedData);
      res.status(201).json(profile);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationError.message,
        });
      }
      console.error("Error creating tutor profile:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  app.get("/api/tutor-profiles", async (req, res) => {
    try {
      const profiles = await storage.getAllTutorProfiles();
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching tutor profiles:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  app.get("/api/tutor-profiles/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const profile = await storage.getTutorProfileByUserId(userId);
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Tutor profile not found",
        });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching tutor profile:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  app.get("/api/tutor-profiles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const profile = await storage.getTutorProfileById(id);
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Tutor profile not found",
        });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching tutor profile:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  app.patch("/api/tutor-profiles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const profile = await storage.updateTutorProfile(id, req.body);
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Tutor profile not found",
        });
      }
      res.json({
        success: true,
        message: "Tutor profile updated successfully",
        profile,
      });
    } catch (error) {
      console.error("Error updating tutor profile:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  // Admin routes for tutor management
  app.patch("/api/tutor-profiles/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      const profile = await storage.approveTutor(id);
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Tutor profile not found",
        });
      }
      res.json({
        success: true,
        message: "Tutor approved successfully",
        profile,
      });
    } catch (error) {
      console.error("Error approving tutor:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  app.patch("/api/tutor-profiles/:id/block", async (req, res) => {
    try {
      const { id } = req.params;
      const { blocked } = req.body;
      const profile = await storage.blockTutor(id, blocked);
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Tutor profile not found",
        });
      }
      res.json({
        success: true,
        message: blocked ? "Tutor blocked successfully" : "Tutor unblocked successfully",
        profile,
      });
    } catch (error) {
      console.error("Error blocking/unblocking tutor:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  // Pricing endpoints
  app.get("/api/pricing", async (req, res) => {
    try {
      const pricing = await storage.getActivePricing();
      res.json(pricing);
    } catch (error) {
      console.error("Error fetching pricing:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  app.patch("/api/pricing/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const pricing = await storage.updatePricing(id, req.body);
      if (!pricing) {
        return res.status(404).json({
          success: false,
          message: "Pricing not found",
        });
      }
      res.json({
        success: true,
        message: "Pricing updated successfully",
        pricing,
      });
    } catch (error) {
      console.error("Error updating pricing:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  // Booking payment endpoints
  app.post("/api/booking-payments", async (req, res) => {
    try {
      const validatedData = insertBookingPaymentSchema.parse(req.body);
      const payment = await storage.createBookingPayment(validatedData);
      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        payment,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationError.message,
        });
      }
      console.error("Error creating booking payment:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  app.get("/api/booking-payments", async (req, res) => {
    try {
      const payments = await storage.getAllBookingPayments();
      res.json(payments);
    } catch (error) {
      console.error("Error fetching booking payments:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  app.get("/api/booking-payments/tutor/:tutorId", async (req, res) => {
    try {
      const { tutorId } = req.params;
      const payments = await storage.getBookingPaymentsByTutor(tutorId);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching tutor booking payments:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  app.get("/api/booking-payments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await storage.getBookingPayment(id);
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Booking payment not found",
        });
      }
      res.json(payment);
    } catch (error) {
      console.error("Error fetching booking payment:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  app.patch("/api/booking-payments/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, meetingLink } = req.body;
      const payment = await storage.updateBookingPaymentStatus(id, status, meetingLink);
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Booking payment not found",
        });
      }
      res.json({
        success: true,
        message: "Booking payment status updated successfully",
        payment,
      });
    } catch (error) {
      console.error("Error updating booking payment status:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  // Password validation endpoint (server-side)
  app.post("/api/validate-password", async (req, res) => {
    try {
      const { password } = req.body;
      const result = passwordSchema.safeParse(password);
      if (!result.success) {
        return res.status(400).json({
          valid: false,
          errors: result.error.errors.map(e => e.message),
        });
      }
      res.json({ valid: true });
    } catch (error) {
      console.error("Error validating password:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
