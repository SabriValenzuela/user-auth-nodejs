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
    Validation.username(username);
    Validation.password(password);
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
  static async login({ username, password }) {
    Validation.username(username);
    Validation.password(password);

    const user = User.findOne({ username });
    if (!user) throw new Error("username does not exist");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("password is invalid");

    //Quitar  propiedades a objeto
    const { password: _, ...publicUser } = user;

    return publicUser;
  }
}

class Validation {
  static username(username) {
    if (typeof username != "string")
      throw new Error("El username debe ser un string");
    if (username.length < 5)
      throw new Error("El username tener al menos 5 caracteres");
  }
  static password(password) {
    if (typeof password != "string")
      throw new Error("El username debe ser un string");
    if (password.length < 8)
      throw new Error("El username tener al menos 8 caracteres");
  }
}
