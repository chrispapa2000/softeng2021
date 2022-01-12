# adds new passes from a using a received.csv file stored in /received

import sys
import mariadb
import csv

def main():
    print("hello");
    sys.exit(0)
    # proccess given csv file according to database schema

    file = open("received/received.csv")
    csvreader = csv.reader(file)
    header = next(csvreader)

    file2 = open("received/received_charges.csv", 'w', newline="")
    charges = csv.writer(file2)
    #charges.writerow(['Charge_id', 'Charge_amount', 'PassPass_id'])

    file3 = open("received/received_passes.csv", 'w', newline="")
    passes = csv.writer(file3)
    #passes.writerow(['Pass_id', 'Timestamp', 'vehicleVehicle_ref', 'stationStation_id'])

    #print(header)
    rows1 = []
    rows2 = []
    n = 0
    for row in csvreader:
        n+=1

        #rows.append(row)
        temp = row[0].split(";")
        pass_id = temp[0]

        time = extract_time(temp[1])

        station = temp[2]
        station_owner = station[0:2]
        vehicle = temp[3]
        charge = temp[4]
        tag_owner = temp[7]

        rows1.append([n, charge, pass_id])
        rows2.append([pass_id, time, vehicle, station, tag_owner])


    #print(rows)
    charges.writerows(rows1)
    passes.writerows(rows2)
    file.close()
    file2.close()

    # connect to database

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

    """do some work"""

    try:
        #station
        #this path is the path from the api folder, where the js file that runs this script resides
        file = open("../backend/received/received_passes.csv", "r")

    except OSError as e:
        print(e)
        sys.exit(1)

    csvreader = csv.reader(file)
    for row in csvreader:
        statement = "INSERT INTO Pass (Pass_id, Timestamp, vehicleVehicle_ref, stationStation_id, companyCompany_abbr) VALUES (%s, %s, %s, %s, %s)"
        cur.execute(statement, row)
        conn.commit()
    try:
        file = open("../backend/received/received_charges.csv")
    except OSError as e:
        print(e)
        sys.exit(1)

    csvreader = csv.reader(file)
    for row in csvreader:
        statement = "INSERT INTO charge (Charge_id, Charge_amount, PassPass_id) VALUES (%s, %s, %s)"
        cur.execute(statement, row)
        conn.commit()
    file.close()

    """"""

    statement = "SET FOREIGN_KEY_CHECKS = 1"
    cur.execute(statement)
    conn.commit()

    conn.close()

main()
