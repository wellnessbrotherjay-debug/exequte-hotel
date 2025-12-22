# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'open-uri'
require 'faker'
puts "Destroying Data..."
Booking.unscoped.destroy_all
TrainingSession.destroy_all
Training.destroy_all
ClassType.destroy_all
Membership.destroy_all
User.destroy_all
MembershipType.destroy_all
Banner.destroy_all
Info.destroy_all
puts "=============================================="

# Past and Future ranges
past_range = DateTime.now - 28.days..DateTime.now
future_range = DateTime.now..DateTime.now + 14.days

# used to name files in cloud
def filename
  "#{SecureRandom.hex(10)}.jpeg"
end

# Options hashes for models
def t_options(training)
  h = {
    name: training[:name],
    cn_name: "CHINESE #{training[:name]}",
    calories: (300..700).to_a.map { |x| x / 100 * 100 }.sample,
    duration: (30..90).to_a.map { |x| x / 10 * 10 }.sample,
    capacity: (5..30).to_a.sample,
    class_type: training[:class_type],
    description: training[:description],
    cn_description: "CHINESE #{training[:description]}"
  }
  h[:subtitle] = training[:subtitle] if training[:subtitle]
  h[:cn_subtitle] =  "CHINESE #{training[:subtitle]}" if training[:subtitle]
  h
end

# Add Training Session Attributes here
def ts_options(training)
  h = {
    training: training,
    duration: training.duration,
    capacity: training.capacity,
    calories: training.calories,
    name: training.name,
    cn_name: training.cn_name,
    description: training.description,
    cn_description: training.cn_description,
    class_kind: training.class_type.kind,
    cancel_before: training.class_type.cancel_before,
    price_1: training.class_type.price_1,
    price_2: training.class_type.price_2,
    price_3: training.class_type.price_3,
    price_4: training.class_type.price_4,
    price_5: training.class_type.price_5,
    price_6: training.class_type.price_6,
    price_7: training.class_type.price_7
  }
  h[:subtitle] = training.subtitle if training.subtitle
  h[:cn_subtitle] = training.cn_subtitle if training.cn_subtitle
  h
end

# Test Users
puts "Creating Test Users"

url =
  'https://i.pinimg.com/originals/b1/94/82/b19482a076bc6a51f713c37a54e7b615.jpg'
file = URI.open(url)
photo = { io: file, filename: filename }

# Known login for local/testing
known_user = User.find_or_initialize_by(email: "wellnessbrotherjay@gmail.com")
known_user.assign_attributes(
  name: "Wellness Brother Jay",
  first_name: "Wellness",
  last_name: "Brotherjay",
  password: "123456",
  password_confirmation: "123456",
  admin: true
)
known_user.avatar.attach(photo) unless known_user.avatar.attached?
known_user.save!
puts "Ensured known user: #{known_user.email}"

5.times do |n|
  u = User.create!(
    name: "Test User #{n + 1}",
    first_name: Faker::GreekPhilosophers.name,
    last_name: Faker::Beer.brand,
    email: Faker::Internet.email,
    password: "password", # issue each user the same password
    password_confirmation: "password",
    admin: true
  )
  u.avatar.attach(photo)
end

users = User.where(instructor: false)

puts "Created #{users.count} Users"

# Instructor
puts "Creating Instructor"

url =
  'https://i.pinimg.com/originals/b1/94/82/b19482a076bc6a51f713c37a54e7b615.jpg'
file = URI.open(url)

photo = { io: file, filename: filename }

instructor = User.create!(
  name: "Mr. Instructor",
  instructor: true,
  first_name: "Ekaterina",
  last_name: "Gorbacheva",
  instructor_bio: "This is bio",
  cn_instructor_bio: "Chinese This is bio",
  email: Faker::Internet.email,
  password: "password", # issue each user the same password
  password_confirmation: "password"
)
instructor.instructor_photo.attach(photo)

puts "Created a coach: #{instructor.name}"

# Class Types
puts "Creating Class Types"

premium = ClassType.create!(name: "Premium", kind: 1, price_1: 250, cancel_before: 4)
puts "Created ClassType #{premium.name}"

standard = ClassType.create!(
  name: "Standard", kind: 2,
  price_1: 130,
  price_2: 110,
  price_3: 90,
  price_4: 80,
  price_5: 70,
  price_6: 60,
  price_7: 60,
  cancel_before: 4
)

puts "Created ClassType #{standard.name}"


free = ClassType.create!(name: "Free", kind: 3, price_1: 0, cancel_before: 4)
puts "Created ClassType #{free.name}"

puts "=============================================="

# Traiings and Training Sessions

trainings_arr = [
  { name: "Yoga", description: "Stretch your body and mind with us", class_type: premium, subtitle: "Hot Yoga"},
  { name: "Body Pump", description: "Go crazy with Body Pump", class_type: standard, subtitle: "Light Weight" },
  { name: "Stretching", description: "Same like yoga but without Zen", class_type: standard },
  { name: "Abs workout", description: "Go get that 6-pack", class_type: standard },
  { name: "Weight lifting", description: "Free and powerful workout session", class_type: free }
]

puts "Creating Trainings and Training Sessions"
# require 'open-uri'
url =
  'https://s5o.ru/storage/simple/ru/edt/90/50/f5/37/rue5f231c5949.jpg'
file = URI.open(url)

photo = { io: file, filename: filename }

trainings_arr.each do |t|
  training = Training.create!(t_options(t))
  training.photo.attach(photo)

  puts "Created Training #{training.name}"

  50.times do |n|
    training_session = TrainingSession.new(ts_options(training))
    range = n < 5 ? past_range : future_range
    training_session.update!(instructor: instructor, begins_at: rand(range))
    puts "Created seession for #{training_session.name} at #{training_session.begins_at}"
  end
end
puts "=============================================="

def attended(var, past_bookings_count, cancelled_bookings_count)
  return unless var < 15

  var.between?(cancelled_bookings_count + 1, past_bookings_count)
end

users.each do |u|
  cancelled_bookings_count = rand(0..5)
  past_bookings_count = rand((cancelled_bookings_count + 5)..15)
  bookings_count = rand((past_bookings_count + 10)..40)
  bookings_count.times do |x|
    n = x + 1
    range = n <= past_bookings_count ? past_range : future_range
    ts = TrainingSession.where(begins_at: range).sample
    Booking.create!(
      user: u,
      training_session: ts,
      cancelled: n <= cancelled_bookings_count,
      cancelled_at: n < cancelled_bookings_count ? ts.begins_at - rand(2..6).hours : nil,
      attended: attended(n, past_bookings_count, cancelled_bookings_count),
      payment_status: %w[paid none].sample

    )
  end
  puts "Created #{u.bookings.count} bookings for #{u.name}"
end

puts "=============================================="

# Membership Types
puts "Creating Membership Types"

mt_arr = [
  { name:  "6 weeks unlimited", duration: 42, price: 1600, smoothie: false },
  { name:  "6 weeks unlimited with smoothie", duration: 42, price: 2000, smoothie: true },
  { name:  "12 weeks unlimited", duration: 84, price: 2600, smoothie: false },
  { name:  "12 weeks unlimited with smoothie", duration: 84, price: 4500, smoothie: true }
]

mt_arr.each do |mt|
  membership_type = MembershipType.create!(
    name: mt[:name],
    cn_name: "CHINESE #{mt[:name]}",
    duration: mt[:duration],
    smoothie: mt[:smoothie]
  )
  puts "Created membership: #{membership_type.name}"
end


# Info

Info.create!(
  paragraph_one: "P1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin libero nunc consequat interdum varius sit amet mattis. Viverra nibh cras pulvinar mattis nunc sed blandit libero. At auctor urna nunc id cursus metus aliquam. Elementum nisi quis eleifend quam adipiscing. Dolor magna eget est lorem. Sit amet tellus cras adipiscing enim eu turpis egestas pretium. Erat imperdiet sed euismod nisi porta lorem. Egestas fringilla phasellus faucibus scelerisque eleifend. In egestas erat imperdiet sed. Erat imperdiet sed euismod nisi porta lorem mollis aliquam ut. Arcu dictum varius duis at. Orci nulla pellentesque dignissim enim sit. Tempus imperdiet nulla malesuada pellentesque elit eget gravida. Egestas integer eget aliquet nibh. Aliquet enim tortor at auctor urna nunc id cursus.",
  paragraph_two: "P2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin libero nunc consequat interdum varius sit amet mattis. Viverra nibh cras pulvinar mattis nunc sed blandit libero. At auctor urna nunc id cursus metus aliquam. Elementum nisi quis eleifend quam adipiscing. Dolor magna eget est lorem. Sit amet tellus cras adipiscing enim eu turpis egestas pretium. Erat imperdiet sed euismod nisi porta lorem. Egestas fringilla phasellus faucibus scelerisque eleifend. In egestas erat imperdiet sed. Erat imperdiet sed euismod nisi porta lorem mollis aliquam ut. Arcu dictum varius duis at. Orci nulla pellentesque dignissim enim sit. Tempus imperdiet nulla malesuada pellentesque elit eget gravida. Egestas integer eget aliquet nibh. Aliquet enim tortor at auctor urna nunc id cursus.",
  title_one: "Title One",
  title_two: "Title Two"
)

puts "Created an info"

# Banner

url =
  'https://images.unsplash.com/photo-1607625004976-be5d015ed235?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'

file = URI.open(url)

photo = { io: file, filename: filename }

banner = Banner.create!()
banner.photo.attach(photo)
puts "Created a banner"

puts "=============================================="
puts "Seeding is completed"
puts "Created #{ClassType.count} Class Types"
puts "Created #{Training.count} Trainings"
puts "Created #{TrainingSession.count} Training Sessions"
puts "Created #{MembershipType.count} Membership Types"
puts "Created #{Membership.count} Membership"
puts "Created #{User.count} Users"
puts "Created #{Booking.count} Bookings"
puts "Created #{Banner.count} Banners"
puts "Created #{Info.count} Infos"




# run in rails c to use admin

# User.all.update(city: 'Shanghai', wechat: 'ww', phone: '123', mp_email: 'email@wx.com', gender: 'female', wx_open_id: 'ss', first_name: 'Mary', last_name: 'Poppins', workout_name: 'Monster', emergency_name: 'kk', emergency_phone: '123', birthday: '1991-04-02', nationality: 'Russian', profession: 'Dev', profession_activity_level: 'active', favorite_song: 'Lololo', music_styles: 'Pop', sports: 'gym', favorite_food: 'burger', instructor_bio: 'Cool trainer', cn_instructor_bio: 'hh', height: '174', current_weight: '60', target: '58')
