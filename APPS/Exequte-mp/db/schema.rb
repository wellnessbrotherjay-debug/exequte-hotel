# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2023_12_13_085607) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "banners", force: :cascade do |t|
    t.boolean "current", default: true, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "destroyed_at"
    t.string "activity_name"
    t.string "activity_time"
  end

  create_table "bookings", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "training_session_id", null: false
    t.integer "price_cents", default: 0, null: false
    t.string "price_currency", default: "CNY", null: false
    t.boolean "cancelled", default: false, null: false
    t.datetime "cancelled_at"
    t.boolean "attended"
    t.string "booked_with"
    t.bigint "membership_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "coupon"
    t.string "payment_status"
    t.jsonb "payment"
    t.datetime "destroyed_at"
    t.bigint "hrm_id"
    t.bigint "hrm_assignment_id"
    t.index ["hrm_assignment_id"], name: "index_bookings_on_hrm_assignment_id"
    t.index ["hrm_id"], name: "index_bookings_on_hrm_id"
    t.index ["membership_id"], name: "index_bookings_on_membership_id"
    t.index ["training_session_id"], name: "index_bookings_on_training_session_id"
    t.index ["user_id"], name: "index_bookings_on_user_id"
  end

  create_table "class_types", force: :cascade do |t|
    t.integer "price_1_cents", default: 0, null: false
    t.string "price_1_currency", default: "CNY", null: false
    t.integer "price_2_cents", default: 0, null: false
    t.string "price_2_currency", default: "CNY", null: false
    t.integer "price_3_cents", default: 0, null: false
    t.string "price_3_currency", default: "CNY", null: false
    t.integer "price_4_cents", default: 0, null: false
    t.string "price_4_currency", default: "CNY", null: false
    t.integer "price_5_cents", default: 0, null: false
    t.string "price_5_currency", default: "CNY", null: false
    t.integer "price_6_cents", default: 0, null: false
    t.string "price_6_currency", default: "CNY", null: false
    t.integer "price_7_cents", default: 0, null: false
    t.string "price_7_currency", default: "CNY", null: false
    t.string "name", null: false
    t.integer "kind", null: false
    t.integer "cancel_before", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "destroyed_at"
  end

  create_table "coupons", force: :cascade do |t|
    t.string "relation"
    t.string "coupon_code"
    t.float "discount"
    t.text "note"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "destroyed_at"
    t.boolean "active", default: true
  end

  create_table "exercises", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "cn_name"
    t.string "cn_description"
    t.datetime "destroyed_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "exercises_workouts", force: :cascade do |t|
    t.bigint "workout_id"
    t.bigint "exercise_id"
    t.integer "sets"
    t.integer "time_limit"
    t.datetime "destroyed_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "format"
    t.string "block"
    t.string "reps_gold"
    t.string "reps_silver"
    t.string "reps_bronze"
    t.integer "batch_index"
    t.integer "order"
    t.string "reps"
    t.index ["exercise_id"], name: "index_exercises_workouts_on_exercise_id"
    t.index ["workout_id"], name: "index_exercises_workouts_on_workout_id"
  end

  create_table "heart_rate_data", force: :cascade do |t|
    t.bigint "booking_id"
    t.jsonb "hrm_data_raw", default: [], null: false
    t.jsonb "hrm_data", default: {}, null: false
    t.jsonb "hrm_graph", default: {}, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.jsonb "hrm_zone_graph", default: {}, null: false
    t.jsonb "hrm_combined_graph", default: {}, null: false
    t.index ["booking_id"], name: "index_heart_rate_data_on_booking_id"
  end

  create_table "hrm_assignments", force: :cascade do |t|
    t.bigint "hrm_id", null: false
    t.bigint "training_session_id", null: false
    t.boolean "assigned", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["hrm_id"], name: "index_hrm_assignments_on_hrm_id"
    t.index ["training_session_id"], name: "index_hrm_assignments_on_training_session_id"
  end

  create_table "hrms", force: :cascade do |t|
    t.string "name", null: false
    t.string "hub", null: false
    t.string "display_name", null: false
    t.boolean "is_used", default: false, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "info_item_patterns", force: :cascade do |t|
    t.integer "margin_bottom"
    t.integer "font_size"
    t.string "placement"
    t.integer "position"
    t.text "note"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "title"
    t.integer "margin_top"
    t.integer "margin_left"
    t.string "text_align"
    t.string "text_transform"
    t.boolean "italic"
  end

  create_table "info_items", force: :cascade do |t|
    t.text "item_text"
    t.text "cn_item_text"
    t.integer "margin_bottom"
    t.integer "font_size"
    t.string "placement"
    t.integer "position"
    t.bigint "info_id", null: false
    t.bigint "info_item_pattern_id"
    t.text "note"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "title"
    t.integer "margin_top"
    t.integer "margin_left"
    t.string "text_align"
    t.string "text_transform"
    t.boolean "italic"
    t.index ["info_id"], name: "index_info_items_on_info_id"
    t.index ["info_item_pattern_id"], name: "index_info_items_on_info_item_pattern_id"
  end

  create_table "infos", force: :cascade do |t|
    t.text "paragraph_one"
    t.text "paragraph_two"
    t.text "paragraph_three"
    t.text "paragraph_four"
    t.string "title_one"
    t.string "title_two"
    t.string "title_three"
    t.string "title_four"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "cn_paragraph_one"
    t.text "cn_paragraph_two"
    t.text "cn_paragraph_three"
    t.text "cn_paragraph_four"
    t.string "cn_title_one"
    t.string "cn_title_two"
    t.string "cn_title_three"
    t.string "cn_title_four"
    t.datetime "destroyed_at"
    t.boolean "terms", default: false
  end

  create_table "logs", force: :cascade do |t|
    t.string "log_type", null: false
    t.string "value", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "membership_trainings", force: :cascade do |t|
    t.bigint "membership_type_id"
    t.bigint "training_id"
    t.index ["membership_type_id"], name: "index_membership_trainings_on_membership_type_id"
    t.index ["training_id"], name: "index_membership_trainings_on_training_id"
  end

  create_table "membership_types", force: :cascade do |t|
    t.string "name", null: false
    t.integer "duration", null: false
    t.string "cn_name", null: false
    t.integer "price_cents", default: 0, null: false
    t.string "price_currency", default: "CNY", null: false
    t.boolean "smoothie", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "destroyed_at"
    t.boolean "active", default: true
    t.integer "vouchers"
    t.boolean "is_class_pack", default: false
    t.integer "bookings_per_day"
    t.boolean "is_trial", default: false
    t.boolean "is_limited", default: false
  end

  create_table "memberships", force: :cascade do |t|
    t.bigint "membership_type_id", null: false
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.string "cn_name", null: false
    t.integer "price_cents", default: 0, null: false
    t.string "price_currency", default: "CNY", null: false
    t.datetime "start_date"
    t.datetime "end_date"
    t.boolean "smoothie", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "coupon"
    t.string "payment_status"
    t.jsonb "payment"
    t.datetime "destroyed_at"
    t.integer "vouchers"
    t.boolean "is_class_pack", default: false
    t.integer "bookings_per_day"
    t.boolean "is_trial", default: false
    t.boolean "is_limited", default: false
    t.index ["membership_type_id"], name: "index_memberships_on_membership_type_id"
    t.index ["user_id"], name: "index_memberships_on_user_id"
  end

  create_table "settings", force: :cascade do |t|
    t.string "key", null: false
    t.string "value", null: false
  end

  create_table "training_sessions", force: :cascade do |t|
    t.string "name", null: false
    t.string "cn_name", null: false
    t.datetime "begins_at", null: false
    t.integer "duration", null: false
    t.integer "capacity", null: false
    t.integer "calories"
    t.string "description", null: false
    t.string "cn_description", null: false
    t.bigint "training_id", null: false
    t.bigint "user_id", null: false
    t.string "queue"
    t.integer "price_1_cents", default: 0, null: false
    t.string "price_1_currency", default: "CNY", null: false
    t.integer "price_2_cents", default: 0, null: false
    t.string "price_2_currency", default: "CNY", null: false
    t.integer "price_3_cents", default: 0, null: false
    t.string "price_3_currency", default: "CNY", null: false
    t.integer "price_4_cents", default: 0, null: false
    t.string "price_4_currency", default: "CNY", null: false
    t.integer "price_5_cents", default: 0, null: false
    t.string "price_5_currency", default: "CNY", null: false
    t.integer "price_6_cents", default: 0, null: false
    t.string "price_6_currency", default: "CNY", null: false
    t.integer "price_7_cents", default: 0, null: false
    t.string "price_7_currency", default: "CNY", null: false
    t.integer "class_kind", null: false
    t.integer "cancel_before", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "destroyed_at"
    t.string "subtitle"
    t.string "cn_subtitle"
    t.boolean "enforce_cancellation_policy", default: true
    t.string "note"
    t.boolean "cancelled", default: false
    t.datetime "cancelled_at"
    t.integer "late_booking_minutes"
    t.boolean "is_limited", default: false
    t.string "location"
    t.string "current_block"
    t.index ["training_id"], name: "index_training_sessions_on_training_id"
    t.index ["user_id"], name: "index_training_sessions_on_user_id"
  end

  create_table "training_sessions_workouts", id: false, force: :cascade do |t|
    t.bigint "training_session_id", null: false
    t.bigint "workout_id", null: false
  end

  create_table "trainings", force: :cascade do |t|
    t.string "name", null: false
    t.integer "calories"
    t.integer "duration", null: false
    t.integer "capacity", null: false
    t.bigint "class_type_id", null: false
    t.text "description", null: false
    t.string "cn_name", null: false
    t.text "cn_description", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "destroyed_at"
    t.string "subtitle"
    t.string "cn_subtitle"
    t.integer "late_booking_minutes"
    t.boolean "is_limited", default: false
    t.index ["class_type_id"], name: "index_trainings_on_class_type_id"
  end

  create_table "trainings_workouts", id: false, force: :cascade do |t|
    t.bigint "training_id"
    t.bigint "workout_id"
    t.index ["training_id", "workout_id"], name: "index_trainings_workouts_on_training_id_and_workout_id", unique: true
    t.index ["training_id"], name: "index_trainings_workouts_on_training_id"
    t.index ["workout_id"], name: "index_trainings_workouts_on_workout_id"
  end

  create_table "user_coupons", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "coupon_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "destroyed_at"
    t.index ["coupon_id"], name: "index_user_coupons_on_coupon_id"
    t.index ["user_id"], name: "index_user_coupons_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "name"
    t.string "city"
    t.string "wechat"
    t.string "phone"
    t.string "mp_email"
    t.string "gender"
    t.boolean "admin", default: false
    t.string "wx_open_id"
    t.string "wx_session_key"
    t.string "workout_name"
    t.string "emergency_name"
    t.string "emergency_phone"
    t.date "birthday"
    t.string "nationality"
    t.string "profession"
    t.string "profession_activity_level"
    t.string "favorite_song"
    t.string "music_styles"
    t.string "sports"
    t.text "favorite_food"
    t.integer "voucher_count", default: 1, null: false
    t.boolean "instructor", default: false, null: false
    t.string "instructor_bio"
    t.string "cn_instructor_bio"
    t.integer "height"
    t.integer "current_weight"
    t.integer "current_body_fat"
    t.string "current_shapes"
    t.string "target"
    t.integer "target_weight"
    t.integer "target_body_fat"
    t.string "target_shapes"
    t.datetime "destroyed_at"
    t.text "wx_info"
    t.string "union_id"
    t.string "oa_open_id"
    t.text "oa_info"
    t.integer "oa_subscribed_at"
    t.boolean "waiver_signed"
    t.datetime "waiver_signed_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "workouts", force: :cascade do |t|
    t.bigint "training_id"
    t.bigint "training_session_id"
    t.string "name"
    t.string "workout_type"
    t.string "cn_name"
    t.string "cn_description"
    t.datetime "destroyed_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "description"
    t.string "quote"
    t.string "cn_quote"
    t.string "title"
    t.string "cn_title"
    t.string "level"
    t.integer "total_duration", default: 60
    t.integer "warmup_duration", default: 12
    t.integer "warmup_exercise_duration", default: 1
    t.integer "blocks_duration", default: 35
    t.integer "blocks_rounds", default: 5
    t.string "blocks_duration_text"
    t.integer "blocks_exercise_duration", default: 1
    t.integer "cooldown_duration", default: 5
    t.integer "breathing_duration", default: 2
    t.string "block_a_format"
    t.string "block_b_format"
    t.string "block_c_format"
    t.string "block_a_title"
    t.string "block_b_title"
    t.string "block_c_title"
    t.string "block_a_duration_format"
    t.string "block_b_duration_format"
    t.string "block_c_duration_format"
    t.string "block_a_reps_text"
    t.string "block_b_reps_text"
    t.string "block_c_reps_text"
    t.string "warmup_duration_format"
    t.string "title_footer"
    t.string "cn_title_footer"
    t.string "finisher_title"
    t.string "finisher_format"
    t.string "finisher_duration_format"
    t.string "finisher_reps_text"
    t.index ["training_id"], name: "index_workouts_on_training_id"
    t.index ["training_session_id"], name: "index_workouts_on_training_session_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "bookings", "hrm_assignments"
  add_foreign_key "bookings", "hrms"
  add_foreign_key "bookings", "memberships"
  add_foreign_key "bookings", "training_sessions"
  add_foreign_key "bookings", "users"
  add_foreign_key "heart_rate_data", "bookings"
  add_foreign_key "hrm_assignments", "hrms"
  add_foreign_key "hrm_assignments", "training_sessions"
  add_foreign_key "info_items", "info_item_patterns"
  add_foreign_key "info_items", "infos"
  add_foreign_key "memberships", "membership_types"
  add_foreign_key "memberships", "users"
  add_foreign_key "training_sessions", "trainings"
  add_foreign_key "training_sessions", "users"
  add_foreign_key "trainings", "class_types"
  add_foreign_key "user_coupons", "coupons"
  add_foreign_key "user_coupons", "users"
end
