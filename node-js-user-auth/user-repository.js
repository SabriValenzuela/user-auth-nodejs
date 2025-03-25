import DBLocal from "db-local";

import bcrypt from "bcrypt";

const { Schema } = new DBLocal({ path: "./db" });

const User = Schema("User", {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export class UserRepository {
  static async create({ username, password }) {
    //Validaciones
    if (typeof username != "string")
      throw new Error("El username debe ser un string");
    if (username.length < 5)
      throw new Error("El username tener al menos 5 caracteres");
    if (typeof password != "string")
      throw new Error("El username debe ser un string");
    if (password.length < 8)
      throw new Error("El username tener al menos 8 caracteres");

    //Username disponible
    const user = User.findOne({ username });
    if (user) throw new Error("El username ya existe");

    const id = crypto.randomUUID();

    const hashedPassword = await bcrypt.hash(password, 10);

    User.create({
      _id: id,
      username,
      password: hashedPassword,
    }).save();

    return id;
  }
  static login({ username, password }) {}
}
