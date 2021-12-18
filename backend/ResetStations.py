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

    statement = "TRUNCATE TABLE station"
    cur.execute(statement)
    conn.commit()

    statement = "SET FOREIGN_KEY_CHECKS = 1"
    cur.execute(statement)
    conn.commit()

    try:
        #station
        #this path is the path from the api folder, where the js file that runs this script resides
        file = open("../backend/initial_data/stations.csv", "r")

    except OSError as e:
        print(e)
        sys.exit(1)

    csvreader = csv.reader(file)
    for row in csvreader:
        statement = "INSERT INTO station (Station_id, Station_name) VALUES (%s, %s)"
        cur.execute(statement, row)
        conn.commit()

    file.close()




    conn.close()

main()
