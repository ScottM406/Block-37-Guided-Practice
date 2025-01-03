const express = require("express");
const prisma = require("./prisma")
const app = express();
const PORT = 3000;

app.use(require("morgan")("dev"));
app.use(express.json());

// TODO: POST /reservations

app.post("/reservations", async (req,res,next) => {
  try {
    const { date, restaurantId, customerIds} = req.body;
    const party = customerIds.map((id) => ( { id: Number(id)} ));

    const reservation = await prisma.reservation.create({
      data: {
        date,
        restaurantId: Number(restaurantId),
        party: { connect: party },
      },
      include: {
        restaurant: true,
        party: true,
      },
    });
    res.status(201).json(reservation);
  } catch (e) {
    next(e);
  }
});

app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint not found." });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something broke :(");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
