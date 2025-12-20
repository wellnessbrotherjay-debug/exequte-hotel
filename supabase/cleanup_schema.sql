-- CLEANUP SCRIPT
-- Drops all tables to ensure a clean slate for the Master Migration
-- USE WITH CAUTION: This deletes all data in these tables.

DROP TABLE IF EXISTS 
  -- HRM System
  hrm_class_recaps, hrm_user_class_recaps, hrm_session_results, hrm_session_participants, 
  hrm_session_participants, hrm_class_sessions, hrm_assignments, hrm_bookings,
  -- Booking System
  class_bookings, class_schedules, studio_classes, coaches,
  -- Core System
  kitchen_queue, brand_settings, hotel_services, facilities, venues, meal_orders, 
  menu_items, recipes, workout_logs, session_events, room_equipment, exercise_equipment, 
  equipment, equipment_categories, exercises, workout_templates, fitness_tests, 
  user_profiles, workout_sessions, workouts, rooms
CASCADE;
