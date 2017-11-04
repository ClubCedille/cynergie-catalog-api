import * as mongoose from "mongoose";
import * as fs from "mz/fs";

export interface DatabaseConnectionInfo {
    username: string,
    password: string,
    dbName: string,
    hosts: string[],
    options: { [key: string]: any }
};

export class Database {
    protected static DEFAULT_CONFIG_FILE = "./config/db.json";

    static async start(filePath?: string): Promise<mongoose.Connection> {
        const configFile = filePath || Database.DEFAULT_CONFIG_FILE;
        const dbConfig = await Database.getConfig(configFile);

        const connectionString = Database.getConnectionString(dbConfig);
        return Database.createConnection(connectionString, dbConfig);
    }

    private static createConnection(uri: string, cncInfo: DatabaseConnectionInfo): Promise<mongoose.Connection> {
        return new Promise((resolve, reject) => {
            mongoose.connect(uri, {
                useMongoClient: true
            }, (err: any) => err && reject(err));
            const db = mongoose.connection;
            db.on("error", (err: any) => console.error("MongoDB connection error:", err));
            db.once("open", () => {
                console.log(`Connected to the ${cncInfo.dbName} database`);
                resolve(db);
            });
        });
    }

    private static async getConfig(filePath: string): Promise<DatabaseConnectionInfo> {
        if (!await fs.exists(filePath)) {
            throw new Error(`${filePath} isn't set.`);
        }

        const fileContent = await fs.readFile(filePath);
        return JSON.parse(fileContent.toString());
    }

    private static getConnectionString(cncInfo: DatabaseConnectionInfo): string {
        const cluster = cncInfo.hosts.join(",");
        const serializedOptions = Object.getOwnPropertyNames(cncInfo.options)
            .map((n: string) => `${n}=${cncInfo.options[n]}`)
            .join("&");

        const baseString = `mongodb://${cncInfo.username}:${cncInfo.password}@${cluster}/${cncInfo.dbName}`;
        if (serializedOptions) {
            return `${baseString}?${serializedOptions}`;
        }
        return baseString;
    }
}
