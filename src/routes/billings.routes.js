import express from "express";
import Billing from "../models/Billing.js";
import authMiddleware, { verifyToken } from "../utils/authMiddleware.js";

const router = express.Router();

router.get("/check", async (req, res) => {
  try {
    const subscription = await Billing.findAll();
    if (!subscription || subscription.length <= 0) {
      try {
        await createSubscription();
        res.status(200).json({ msg: true });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    } else {
      res.status(200).json({ msg: verifySubscription(subscription) });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const billing = await Billing.findOne(); // Encuentra el primer registro

    if (!billing) {
      return res
        .status(404)
        .json({ error: "No se encontró ninguna suscripción" });
    }

    const now = new Date();
    const subscriptionEnd = new Date();
    subscriptionEnd.setDate(subscriptionEnd.getDate() + 30); // Sumar 30 días

    await billing.update({
      subscriptionStart: now.toISOString(),
      subscriptionEnd: subscriptionEnd.toISOString(),
    });

    res.status(200).json({ msg: "Suscripción actualizada correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const verifySubscription = (sub) => {
  return !(new Date() > new Date(sub[0].subscriptionEnd));
};

const createSubscription = async () => {
  const subs = await Billing.create({
    trialPeriod: true,
    subscriptionStart: new Date().toISOString(),
    subscriptionEnd: new Date(
      new Date().setDate(new Date().getDate() + 7)
    ).toISOString(),
  });
  return subs;
};
export default router;
