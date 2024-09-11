import * as SQLite from "expo-sqlite";
import { Place } from "../models/place";

let database;

async function openDatabase() {
  try {
    if (!database) {
      database = await SQLite.openDatabaseAsync("places.db");
    }
  } catch (error) {
    console.warn(error);
  }
}

// Function to initialize the database and create the table if it doesn't exist
export async function init() {
  try {
    // Open the database connection asynchronously
    if (!database) {
      await openDatabase();
    }
    if (database) {
      // Set the journal mode to WAL and create the table
      await database.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS places (
          id INTEGER PRIMARY KEY NOT NULL, 
          title TEXT NOT NULL, 
          imageUri TEXT NOT NULL,
          address TEXT NOT NULL,
          lat REAL NOT NULL,
          lng REAL NOT NULL
        );
      `);
      //  console.log("Database initialized successfully.");
    } else {
      console.error("Database connection failed.");
    }
  } catch (error) {
    // Handle and log any errors that occur during initialization
    console.error("Error initializing the database:", error);
  }
}

export async function insertPlace(place) {
  if (!database) {
    await openDatabase();
  }
  const result = await database.runAsync(
    `INSERT INTO places (title,imageUri, address, lat, lng) VALUES (?,?,?,?,?)`,
    [
      place.title,
      place.imageUri,
      place.address,
      place.location.lat,
      place.location.lng,
    ]
  );
  // console.log(result);
  return result;
}

export async function fetchPlaces() {
  try {
    if (!database) {
      await openDatabase();
    }
    const result = await database.getAllAsync(`SELECT * FROM places`);
    // console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchPlaceDetails(id) {
  try {
    if (!database) {
      await openDatabase();
    }
    const result = await database.getAllAsync(
      `SELECT * FROM places WHERE id= ?`,
      [id]
    );
    const dbPlace = result[0];
    const place = new Place(
      dbPlace.title,
      dbPlace.imageUri,
      { lat: dbPlace.lat, lng: dbPlace.lng, address: dbPlace.address },
      dbPlace.id
    );
    // console.log(place);
    return place;
  } catch (error) {
    console.error(error);
  }
}
