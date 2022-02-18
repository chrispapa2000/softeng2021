import sys
import mariadb
import csv

def main():

    try:
        conn = mariadb.connect(
            user="tolltrolls",
            password="diakopeskantere",
            host="tolltrolls.tk",
            port=3306, #???
            database="tolltrolls"
        )

    except mariadb.Error as e:
        #print(f"Error connecting to MariaDB Platform: {e}")
        #print("unhealthy")
        sys.exit(1)

    # Get Cursor
    try:
        cur = conn.cursor()
        statement = "SET FOREIGN_KEY_CHECKS = 0"
        cur.execute(statement)
        conn.commit()

        statement = "TRUNCATE TABLE vehicle"
        cur.execute(statement)
        conn.commit()

        statement = "SET FOREIGN_KEY_CHECKS = 1"
        cur.execute(statement)
        conn.commit()
    except Error as e:
        print(e)
        sys.exit(1)

    try:
        file = open("../backend/initial_data/vehicles.csv")
    except OSError as e:
        print(e)
        sys.exit(1)

    try:
        csvreader = csv.reader(file)
        dataset = list(csvreader)
        statement = "INSERT INTO vehicle (Vehicle_ref) VALUES (%s)"
        cur.executemany(statement, dataset)
        conn.commit()
    except Error as e:
        print(e)
        sys.exit(1)

    file.close()
    conn.close()

main()
