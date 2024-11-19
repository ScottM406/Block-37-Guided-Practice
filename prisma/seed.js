const prisma = require("../prisma");
const { faker } = require("@faker-js/faker");

const seed = async (numRestaurants = 3, numCustomers = 5, numReservations = 8) => {
  // TODO: this function
  const restaurants = Array.from({ length: numRestaurants }, (_,i) => ({
    name: faker.location.country() + " grill",
  }));
  const customers = Array.from({ length: numCustomers }, (_,i) => ({
    name: faker.person.prefix() + " " + faker.person.fullName() + " " + faker.person.suffix(),
    email: faker.internet.email(),
  }));
  await prisma.restaurant.createMany({ data: restaurants });
  await prisma.customer.createMany({ data: customers });

  for (let i = 0; i < numReservations; i++) {
    const partySize = 1 + Math.floor(Math.random() * 3);
    const party = Array.from({ length: partySize }, () => ({
      id: 1 + Math.floor(Math.random() * numCustomers),
    }));
  await prisma.reservation.create({
    data: {
      date: new Date().toDateString(),
      restaurantId: 1 + Math.floor(Math.random() * numRestaurants),
      party: { connect: party },
    },
  });
  }
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
