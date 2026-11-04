const STORAGE_KEY = "car-rental-demo-v1";

const defaultCars = [
  {
    id: 1,
    name: "Maruti Swift",
    brand: "Maruti",
    type: "Hatchback",
    fuel: "Petrol",
    seats: 5,
    transmission: "Manual",
    price: 2000,
    rating: 4.5,
    reviews: 128,
    available: true,
    status: "Available",
    plate: "KL-01-AB-1234",
    year: 2024,
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80",
    description: "Perfect city car for quick daily commutes and smooth city drives.",
    features: ["AC", "Bluetooth", "USB Charging", "Airbags"]
  },
  {
    id: 2,
    name: "Toyota Innova",
    brand: "Toyota",
    type: "MUV",
    fuel: "Diesel",
    seats: 7,
    transmission: "Manual",
    price: 3500,
    rating: 4.8,
    reviews: 214,
    available: true,
    status: "Available",
    plate: "KL-07-CD-4567",
    year: 2023,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
    description: "Spacious and comfortable for family travel and long highway rides.",
    features: ["AC", "7 Seats", "GPS", "Rear Camera", "Airbags"]
  },
  {
    id: 3,
    name: "Hyundai Creta",
    brand: "Hyundai",
    type: "SUV",
    fuel: "Petrol",
    seats: 5,
    transmission: "Automatic",
    price: 3000,
    rating: 4.7,
    reviews: 189,
    available: true,
    status: "Available",
    plate: "KL-05-EF-8901",
    year: 2024,
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
    description: "Premium SUV with powerful style, comfort, and modern smart features.",
    features: ["AC", "Sunroof", "Bluetooth", "Rear Camera", "Cruise Control"]
  },
  {
    id: 4,
    name: "Honda City",
    brand: "Honda",
    type: "Sedan",
    fuel: "Petrol",
    seats: 5,
    transmission: "Automatic",
    price: 2500,
    rating: 4.6,
    reviews: 156,
    available: true,
    status: "Available",
    plate: "KL-03-GH-2234",
    year: 2022,
    image: "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&q=80",
    description: "Elegant sedan with premium interiors and smooth automatic drive.",
    features: ["AC", "Bluetooth", "Lane Assist", "Push Start"]
  },
  {
    id: 5,
    name: "Tata Nexon EV",
    brand: "Tata",
    type: "SUV",
    fuel: "Electric",
    seats: 5,
    transmission: "Automatic",
    price: 2800,
    rating: 4.4,
    reviews: 97,
    available: false,
    status: "Rented",
    plate: "KL-11-IJ-7788",
    year: 2024,
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
    description: "Eco-friendly electric SUV with clean power and long-distance comfort.",
    features: ["AC", "Fast Charging", "Sunroof", "360° Camera"]
  },
  {
    id: 6,
    name: "Kia Seltos",
    brand: "Kia",
    type: "SUV",
    fuel: "Diesel",
    seats: 5,
    transmission: "Automatic",
    price: 3200,
    rating: 4.7,
    reviews: 143,
    available: true,
    status: "Available",
    plate: "KL-08-KL-3322",
    year: 2023,
    image: "https://images.unsplash.com/photo-1616455579100-2ceaa4eb6d37?w=800&q=80",
    description: "Feature-loaded premium SUV built for comfort, tech, and style.",
    features: ["AC", "Bose Sound", "Sunroof", "ADAS", "Ventilated Seats"]
  },
  {
    id: 7,
    name: "Mahindra Scorpio",
    brand: "Mahindra",
    type: "SUV",
    fuel: "Diesel",
    seats: 7,
    transmission: "Manual",
    price: 3400,
    rating: 4.5,
    reviews: 101,
    available: true,
    status: "Available",
    plate: "KL-09-MN-6677",
    year: 2021,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
    description: "Sturdy SUV with commanding presence and dependable performance.",
    features: ["AC", "Bluetooth", "7 Seats", "Cruise Control"]
  },
  {
    id: 8,
    name: "MG Hector",
    brand: "MG",
    type: "SUV",
    fuel: "Petrol",
    seats: 5,
    transmission: "Automatic",
    price: 3100,
    rating: 4.6,
    reviews: 138,
    available: true,
    status: "Available",
    plate: "KL-04-OP-9911",
    year: 2024,
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    description: "Premium cabin experience with intelligent comfort and smart design.",
    features: ["AC", "360° Camera", "AI Assistant", "Sunroof"]
  },
  {
    id: 9,
    name: "Volkswagen Vento",
    brand: "Volkswagen",
    type: "Sedan",
    fuel: "Diesel",
    seats: 5,
    transmission: "Manual",
    price: 2400,
    rating: 4.3,
    reviews: 84,
    available: true,
    status: "Available",
    plate: "KL-02-QR-4412",
    year: 2020,
    image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&q=80",
    description: "Solid, refined and comfortable for both business and leisure usage.",
    features: ["AC", "Bluetooth", "USB Charging", "Rear Camera"]
  },
  {
    id: 10,
    name: "Audi A4",
    brand: "Audi",
    type: "Sedan",
    fuel: "Petrol",
    seats: 5,
    transmission: "Automatic",
    price: 4200,
    rating: 4.9,
    reviews: 205,
    available: true,
    status: "Available",
    plate: "KL-06-ST-7723",
    year: 2024,
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80",
    description: "Luxury sedan built for premium city travel and executive comfort.",
    features: ["AC", "Leather Seats", "Premium Audio", "Sunroof"]
  }
];

const defaultUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "thabeebbilal@gmail.com",
    password: "1",
    phone: "9876543210",
    city: "Kochi",
    role: "admin"
  },
  {
    id: 2,
    name: "Aisha Nair",
    email: "aisha@example.com",
    password: "123456",
    phone: "9123456780",
    city: "Trivandrum",
    role: "user"
  },
  {
    id: 3,
    name: "Rahul Menon",
    email: "rahul@example.com",
    password: "123456",
    phone: "9988776655",
    city: "Bangalore",
    role: "user"
  }
];

const defaultBookings = [
  {
    id: 1,
    userId: 2,
    carId: 2,
    carName: "Toyota Innova",
    carType: "MUV",
    customer: "Aisha Nair",
    phone: "9123456780",
    userEmail: "aisha@example.com",
    days: 3,
    amount: 10500,
    status: "Booked",
    createdAt: "2026-09-05T10:15:00.000Z",
    pickup: "Kochi Airport"
  },
  {
    id: 2,
    userId: 2,
    carId: 5,
    carName: "Tata Nexon EV",
    carType: "SUV",
    customer: "Aisha Nair",
    phone: "9123456780",
    userEmail: "aisha@example.com",
    days: 2,
    amount: 5600,
    status: "Active",
    createdAt: "2026-09-08T08:00:00.000Z",
    pickup: "Kochi City Center"
  },
  {
    id: 3,
    userId: 3,
    carId: 1,
    carName: "Maruti Swift",
    carType: "Hatchback",
    customer: "Rahul Menon",
    phone: "9988776655",
    userEmail: "rahul@example.com",
    days: 1,
    amount: 2000,
    status: "Completed",
    createdAt: "2026-09-01T07:30:00.000Z",
    pickup: "Bangalore Station"
  },
  {
    id: 4,
    userId: 3,
    carId: 6,
    carName: "Kia Seltos",
    carType: "SUV",
    customer: "Rahul Menon",
    phone: "9988776655",
    userEmail: "rahul@example.com",
    days: 4,
    amount: 12800,
    status: "Pending",
    createdAt: "2026-09-11T13:10:00.000Z",
    pickup: "Bangalore Airport"
  }
];

function buildInitialStore() {
  return {
    users: defaultUsers,
    cars: defaultCars,
    bookings: defaultBookings
  };
}

export function ensureDemoData() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buildInitialStore()));
  }
}

export function getStore() {
  ensureDemoData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (
      !parsed ||
      !Array.isArray(parsed.users) ||
      !Array.isArray(parsed.cars) ||
      !Array.isArray(parsed.bookings)
    ) {
      throw new Error("Invalid local data format");
    }
    return parsed;
  } catch (error) {
    console.error("DriveEase storage could not be read:", error);
    const fallback = buildInitialStore();
    saveStore(fallback);
    return fallback;
  }
}

export function saveStore(store) {
  if (
    !store ||
    !Array.isArray(store.users) ||
    !Array.isArray(store.cars) ||
    !Array.isArray(store.bookings)
  ) {
    throw new Error("Invalid DriveEase data. Changes were not saved.");
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.error("DriveEase storage could not be saved:", error);
    throw new Error("Unable to save data. Browser storage may be full or disabled.");
  }
}

export function getCars() {
  return getStore().cars;
}

export function getUsers() {
  return getStore().users;
}

export function getBookings() {
  return getStore().bookings;
}

export function getBookingsByUser(userId) {
  return getBookings().filter((booking) => booking.userId === userId);
}

export function getUserByEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  return getUsers().find((user) =>
    String(user.email || "").trim().toLowerCase() === normalizedEmail
  );
}

export function getCarById(id) {
  return getCars().find((car) => car.id === Number(id));
}

export function addUser(user) {
  const store = getStore();
  const newUser = {
    ...user,
    id: Date.now(),
    role: "user"
  };
  store.users.push(newUser);
  saveStore(store);
  return newUser;
}

export function updateUser(id, updates) {
  const store = getStore();
  store.users = store.users.map((user) =>
    user.id === id ? { ...user, ...updates } : user
  );
  saveStore(store);
  return store.users.find((user) => user.id === id);
}

export function deleteUserFromStore(id) {
  const store = getStore();
  store.users = store.users.filter((user) => user.id !== id);
  store.bookings = store.bookings.filter((booking) => booking.userId !== id);
  saveStore(store);
  return store.users;
}

export function addCar(car) {
  const store = getStore();
  const newCar = {
    ...car,
    id: Date.now(),
    available: car.status === "Available",
    status: car.status || "Available",
    price: Number(car.price || 0),
    seats: Number(car.seats || 5),
    rating: Number(car.rating || 4.5),
    reviews: Number(car.reviews || 0),
    features: Array.isArray(car.features) ? car.features : String(car.features || "").split(",").map((item) => item.trim()).filter(Boolean)
  };
  store.cars.unshift(newCar);
  saveStore(store);
  return newCar;
}

export function updateCar(id, updates) {
  const store = getStore();
  const targetCar = store.cars.find((car) => Number(car.id) === Number(id));
  if (!targetCar) throw new Error("Car not found.");
  const hasOpenBooking = store.bookings.some((booking) =>
    Number(booking.carId) === Number(id) &&
    !["Cancelled", "Completed"].includes(booking.status)
  );
  if (hasOpenBooking && updates.status === "Available") {
    throw new Error("This car has an active booking and cannot be marked available.");
  }
  store.cars = store.cars.map((car) =>
    car.id === id
      ? {
          ...car,
          ...updates,
          available: updates.status === "Available",
          status: updates.status || car.status,
          price: Number(updates.price || car.price || 0),
          seats: Number(updates.seats || car.seats || 5),
          rating: Number(updates.rating || car.rating || 4.5),
          reviews: Number(updates.reviews || car.reviews || 0),
          features: Array.isArray(updates.features)
            ? updates.features
            : String(updates.features || car.features || "")
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
        }
      : car
  );
  saveStore(store);
  return store.cars;
}

export function deleteCar(id) {
  const store = getStore();
  const hasOpenBooking = store.bookings.some((booking) =>
    Number(booking.carId) === Number(id) &&
    !["Cancelled", "Completed"].includes(booking.status)
  );
  if (hasOpenBooking) {
    throw new Error("Cancel or complete this car's active booking before deleting it.");
  }
  store.cars = store.cars.filter((car) => car.id !== id);
  store.bookings = store.bookings.filter((booking) => booking.carId !== id);
  saveStore(store);
  return store.cars;
}

export function addBooking(payload) {
  const store = getStore();
  const carId = Number(payload?.carId);
  const userId = Number(payload?.userId);
  const days = Number(payload?.days);
  const car = store.cars.find((item) => Number(item.id) === carId);
  const user = store.users.find((item) => Number(item.id) === userId);

  if (!user || user.role === "admin") {
    throw new Error("A valid customer account is required to book a car.");
  }
  if (!car) throw new Error("This car could not be found.");
  if (!car.available || car.status !== "Available") {
    throw new Error("This car is currently unavailable.");
  }
  if (!Number.isInteger(days) || days < 1 || days > 30) {
    throw new Error("Booking duration must be between 1 and 30 days.");
  }
  if (store.bookings.some((booking) =>
    Number(booking.carId) === carId &&
    !["Cancelled", "Completed"].includes(booking.status)
  )) {
    throw new Error("This car already has an active booking.");
  }

  const booking = {
    id: Date.now(),
    userId,
    carId,
    carName: car.name,
    carType: car.type || "",
    customer: user.name || "",
    phone: user.phone || "",
    userEmail: user.email || "",
    days,
    amount: Number(car.price || 0) * days,
    status: "Booked",
    createdAt: new Date().toISOString(),
    pickup: String(payload.pickup || "City Center").trim().slice(0, 100)
  };

  store.bookings.unshift(booking);
  store.cars = store.cars.map((item) =>
    Number(item.id) === carId
      ? { ...item, available: false, status: "Rented" }
      : item
  );
  saveStore(store);
  return booking;
}

export function updateBookingStatus(id, status) {
  const allowedStatuses = ["Pending", "Booked", "Active", "Completed", "Cancelled"];
  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid booking status.");
  }

  const store = getStore();
  const target = store.bookings.find((booking) => Number(booking.id) === Number(id));
  if (!target) throw new Error("Booking not found.");
  if (["Cancelled", "Completed"].includes(target.status) && target.status !== status) {
    throw new Error("A closed booking cannot be reopened. Create a new booking instead.");
  }

  store.bookings = store.bookings.map((booking) =>
    Number(booking.id) === Number(id) ? { ...booking, status } : booking
  );

  const car = store.cars.find((item) => Number(item.id) === Number(target.carId));
  if (car) {
    const hasOpenBooking = store.bookings.some((booking) =>
      Number(booking.carId) === Number(car.id) &&
      !["Cancelled", "Completed"].includes(booking.status)
    );
    const isMaintenance = car.status === "Maintenance";
    car.available = !hasOpenBooking && !isMaintenance;
    car.status = isMaintenance ? "Maintenance" : hasOpenBooking ? "Rented" : "Available";
  }

  saveStore(store);
  return store.bookings;
}

export function cancelBooking(id) {
  return updateBookingStatus(id, "Cancelled");
}

export function deleteBooking(id) {
  const store = getStore();
  const target = store.bookings.find((booking) => Number(booking.id) === Number(id));
  store.bookings = store.bookings.filter((booking) => Number(booking.id) !== Number(id));

  if (target) {
    store.cars = store.cars.map((car) => {
      if (Number(car.id) !== Number(target.carId)) return car;
      const hasOpenBooking = store.bookings.some((booking) =>
        Number(booking.carId) === Number(car.id) &&
        !["Cancelled", "Completed"].includes(booking.status)
      );
      const isMaintenance = car.status === "Maintenance";
      return {
        ...car,
        available: !hasOpenBooking && !isMaintenance,
        status: isMaintenance ? "Maintenance" : hasOpenBooking ? "Rented" : "Available"
      };
    });
  }

  saveStore(store);
  return store.bookings;
}

export function updateProfile(userId, updates) {
  const store = getStore();
  store.users = store.users.map((user) =>
    user.id === userId ? { ...user, ...updates } : user
  );
  saveStore(store);
  return store.users.find((user) => user.id === userId);
}
