const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const Repository = require("./repository");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
  async comparePasswords(saved, supplied) {
    // Saved -> pw saved in our database 'hashed.salt'
    // Supplied -> pw given to us by a user trying to sign in
    const [hashed, salt] = saved.split(".");
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64); //returns buffer

    return hashed === hashedSuppliedBuf.toString("hex");
  }

  async create(attrs) {
    attrs.id = this.randomID();

    // Salt and hash password
    const salt = crypto.randomBytes(8).toString("hex");
    const buf = await scrypt(attrs.password, salt, 64); //returns a buffer

    // Get a list of all the records (array)
    const records = await this.getAll();
    const record = {
      ...attrs,
      password: `${buf.toString("hex")}.${salt}`,
    };

    // Push new data
    records.push(record);

    // Write to this.filename
    await this.writeAll(records);

    return attrs;
  }
}

module.exports = new UsersRepository("users.json");
