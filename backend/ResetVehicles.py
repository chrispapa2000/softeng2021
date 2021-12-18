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

    #vehicle
    #this is the path from the api folder, where the js program that runs this script resides
    file = open("../backend/initial_data/vehicles.csv")
    csvreader = csv.reader(file)
    for row in csvreader:
        statement = "INSERT INTO vehicle (Vehicle_ref) VALUES (%s)"
        cur.execute(statement, row)
        conn.commit()
    file.close()

    conn.close()

main()