const fs = require("fs");
const crypto = require("crypto");

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

    // Get a list of all the records (array)
    const records = await this.getAll();

    // Push new data
    records.push(attrs);

    // Write to this.filename
    await this.writeAll(records);
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
}

const test = async () => {
  const repo = new UsersRepository("users.json");

  await repo.delete("598c7a2c");
};

test();
