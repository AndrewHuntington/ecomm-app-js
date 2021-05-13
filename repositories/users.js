const fs = require("fs");
const crypto = require("crypto");
const util = require("util");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a repository requires a filename");
    }

    this.filename = filename;
    try {
      fs.accessSync(this.filename); // See if file exists on HDD
    } catch (err) {
      fs.writeFileSync(this.filename, "[]"); // Create if file doesn't exist
    }
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );
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

  async comparePasswords(saved, supplied) {
    // Saved -> pw saved in our database 'hashed.salt'
    // Supplied -> pw given to us by a user trying to sign in
    const [hashed, salt] = saved.split(".");
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64); //returns buffer

    return hashed === hashedSuppliedBuf.toString("hex");
  }

  async writeAll(records) {
    // JSON.stringify() converts a JavaScript object or value to a JSON string
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2) // 2 represents level of indentation
    ); // makes JSON file easier to read
  }

  randomID() {
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) {
      throw new Error(`Record with id ${id} was not found.`);
    }

    // Takes all k,v pairs of attrs and copies them over to record
    Object.assign(record, attrs);
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }

      if (found) {
        return record;
      }
    }
  }
}

module.exports = new UsersRepository("users.json");
