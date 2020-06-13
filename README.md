# MQTT Senor Serializer

Listens to MQTT topics and serializes those objects.
Uses SQL Lite 3 DB for persistent storage.

## Setup

``` cmd

    mkdir db
    cd db

    sqlite3 sensorData.db

    BEGIN;
        CREATE TABLE dhtreadings(id INTEGER PRIMARY KEY AUTOINCREMENT, temperature NUMERIC, humidity NUMERIC, currentdate DATE, currentime TIME, device TEXT);
    COMMIT;

```
