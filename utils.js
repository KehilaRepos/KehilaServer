import dbController from "./controllers/dbController";

export const postgres_boot = () => {
    const db_config_read = {
        user: "postgres",
        host: "kehiladatabase.cluster-ro-cdek00iay0ff.us-east-1.rds.amazonaws.com",
        database: "kehiladatabase",
        password: "Saadiabeans1954!",
        port: 5432,
    };

    const db_config_write = {
        user: "postgres",
        host: "kehiladatabase.cluster-cdek00iay0ff.us-east-1.rds.amazonaws.com",
        database: "kehiladatabase",
        password: "Saadiabeans1954!",
        port: 5432,
    };

    new dbController(db_config_read, db_config_write);
}