import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const Billings = sequelize.define("Billings", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  trialPeriod: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  subscriptionStart: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(),
  },
  subscriptionEnd: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});
export default Billings;
